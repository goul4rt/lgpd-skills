import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import pino from "pino";

import { trackLogin } from "../lib/analytics";

const prisma = new PrismaClient();
const logger = pino();

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return null;
  }

  logger.info({ userId: user.id, cpf: user.cpf, email: user.email }, "login ok");
  trackLogin(user);

  return user;
}
