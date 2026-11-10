import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { describe, it } from "node:test";
import {
  computeBlindIndex,
  createPrismaModelEncryptionHandlers,
  decryptField,
  encryptField,
  isEncryptedField,
  type Keyring,
} from "../skills/lgpd-encryption-keys/assets/field-encryption.ts";

describe("Application-level Field Encryption & Prisma Query Interceptor", () => {
  const keyV1 = randomBytes(32);
  const keyV2 = randomBytes(32);
  const blindKey = randomBytes(32);

  it("supports randomized IVs, AAD context binding, tamper detection, and seamless key rotation", () => {
    const keyringV1: Keyring = { currentVersion: 1, keys: { 1: keyV1 } };
    const c1 = encryptField("123.456.789-00", keyringV1, "Guardian.cpfCiphertext");
    const c2 = encryptField("123.456.789-00", keyringV1, "Guardian.cpfCiphertext");

    assert.notEqual(c1, c2, "Randomized IV must produce distinct ciphertexts");
    assert.ok(c1.startsWith("enc:v1:"));
    assert.equal(isEncryptedField(c1), true);

    // Rotate to v2 while keeping v1 in keyring
    const keyringV2: Keyring = { currentVersion: 2, keys: { 1: keyV1, 2: keyV2 } };
    assert.equal(
      decryptField(c1, keyringV2, "Guardian.cpfCiphertext"),
      "123.456.789-00",
    );

    const rotated = encryptField("123.456.789-00", keyringV2, "Guardian.cpfCiphertext");
    assert.ok(rotated.startsWith("enc:v2:"));

    // Column-swapping attack blocked by AAD mismatch
    assert.throws(() => decryptField(rotated, keyringV2, "User.phone"));

    // Ciphertext bit-flip blocked by GCM auth tag
    const flipped = rotated.slice(0, -4) + (rotated.endsWith("AAAA") ? "BBBB" : "AAAA");
    assert.throws(() => decryptField(flipped, keyringV2, "Guardian.cpfCiphertext"));
  });

  it("encrypts and decrypts across create, createMany, createManyAndReturn, update, updateMany, upsert, and find* Prisma operations", async () => {
    const keyring: Keyring = { currentVersion: 2, keys: { 1: keyV1, 2: keyV2 } };
    const handlers = createPrismaModelEncryptionHandlers({
      keyring,
      blindKey,
      fields: [
        {
          field: "cpfCiphertext",
          aadContext: "Guardian.cpfCiphertext",
          blindIndexField: "cpfBlindIndex",
          normalizeForBlindIndex: (s) => s.replace(/\D/g, ""),
        },
      ],
    });

    const rawTable: Array<Record<string, unknown>> = [];

    // 1. create
    const created = (await handlers.create({
      args: { data: { id: "g1", cpfCiphertext: "111.222.333-44" } },
      query: async (nextArgs) => {
        const row = { ...(nextArgs.data as Record<string, unknown>) };
        rawTable.push(row);
        return row;
      },
    })) as Record<string, unknown>;

    assert.equal(created.cpfCiphertext, "111.222.333-44", "Returned object is decrypted");
    assert.ok(
      isEncryptedField(rawTable[0]?.cpfCiphertext),
      "Stored DB value must be encrypted",
    );
    assert.equal(
      rawTable[0]?.cpfBlindIndex,
      computeBlindIndex(blindKey, "11122233344"),
      "Blind index automatically populated with normalized CPF",
    );

    // 2. createMany & createManyAndReturn
    await handlers.createMany({
      args: {
        data: [
          { id: "g2", cpfCiphertext: "555.666.777-88" },
          { id: "g3", cpfCiphertext: "999.000.111-22" },
        ],
      },
      query: async (nextArgs) => {
        for (const item of nextArgs.data as Array<Record<string, unknown>>) {
          rawTable.push({ ...item });
        }
        return { count: 2 };
      },
    });
    assert.ok(isEncryptedField(rawTable[1]?.cpfCiphertext));
    assert.ok(isEncryptedField(rawTable[2]?.cpfCiphertext));

    const batchReturned = (await handlers.createManyAndReturn({
      args: { data: [{ id: "g4", cpfCiphertext: "333.444.555-66" }] },
      query: async (nextArgs) => {
        const items = (nextArgs.data as Array<Record<string, unknown>>).map((i) => ({ ...i }));
        rawTable.push(...items);
        return items;
      },
    })) as Array<Record<string, unknown>>;
    assert.equal(batchReturned[0]?.cpfCiphertext, "333.444.555-66");

    // 3. update (with Prisma `{ set: "..." }` syntax) & updateMany
    const updated = (await handlers.update({
      args: { where: { id: "g1" }, data: { cpfCiphertext: { set: "000.111.222-33" } } },
      query: async (nextArgs) => {
        const setVal = ((nextArgs.data as Record<string, unknown>).cpfCiphertext as { set: string }).set;
        rawTable[0]!.cpfCiphertext = setVal;
        rawTable[0]!.cpfBlindIndex = (nextArgs.data as Record<string, unknown>).cpfBlindIndex;
        return rawTable[0]!;
      },
    })) as Record<string, unknown>;
    assert.equal(updated.cpfCiphertext, "000.111.222-33");
    assert.ok(isEncryptedField(rawTable[0]?.cpfCiphertext));

    await handlers.updateMany({
      args: { data: { cpfCiphertext: "777.888.999-00" } },
      query: async (nextArgs) => {
        assert.ok(isEncryptedField((nextArgs.data as Record<string, unknown>).cpfCiphertext));
        return { count: 1 };
      },
    });

    // 4. upsert
    const upserted = (await handlers.upsert({
      args: {
        where: { id: "g5" },
        create: { id: "g5", cpfCiphertext: "121.212.121-21" },
        update: { cpfCiphertext: "343.434.343-43" },
      },
      query: async (nextArgs) => {
        assert.ok(isEncryptedField((nextArgs.create as Record<string, unknown>).cpfCiphertext));
        assert.ok(isEncryptedField((nextArgs.update as Record<string, unknown>).cpfCiphertext));
        const row = { ...(nextArgs.create as Record<string, unknown>) };
        rawTable.push(row);
        return row;
      },
    })) as Record<string, unknown>;
    assert.equal(upserted.cpfCiphertext, "121.212.121-21");

    // 5. findUnique, findFirst, findMany
    const foundOne = (await handlers.findUnique({
      args: { where: { id: "g1" } },
      query: async () => rawTable[0]!,
    })) as Record<string, unknown>;
    assert.equal(foundOne.cpfCiphertext, "000.111.222-33");

    const foundFirst = (await handlers.findFirstOrThrow({
      args: { where: { cpfBlindIndex: computeBlindIndex(blindKey, "55566677788") } },
      query: async () => rawTable[1]!,
    })) as Record<string, unknown>;
    assert.equal(foundFirst.cpfCiphertext, "555.666.777-88");

    const foundAll = (await handlers.findMany({
      args: {},
      query: async () => rawTable,
    })) as Array<Record<string, unknown>>;
    assert.equal(foundAll.length, 5);
    assert.ok(foundAll.every((r) => !isEncryptedField(r.cpfCiphertext)));
  });
});
