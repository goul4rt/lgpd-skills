-- Proteção real de append-only no MySQL/MariaDB para o ledger de consentimento.
-- Adicione esta migration após criar a tabela `ConsentEvent` pelo Prisma Migrate.
--
-- Limitação: MySQL não dispara triggers em TRUNCATE TABLE.
-- TRUNCATE exige privilégio DROP; sem DROP efetivo (e sem DELETE), a role não esvazia o ledger.
--
-- Atenção ao escopo dos grants: o MySQL une privilégios de global (*.*), database (db.*)
-- e tabela. Um REVOKE só em `ConsentEvent` NÃO remove DROP herdado de GRANT no banco/global
-- nem de roles herdadas. Remova DROP nesses escopos e preserve SELECT/INSERT de forma estreita.

DROP TRIGGER IF EXISTS trg_consent_event_no_update;
CREATE TRIGGER trg_consent_event_no_update
BEFORE UPDATE ON `ConsentEvent`
FOR EACH ROW
SIGNAL SQLSTATE '45000'
  SET MESSAGE_TEXT = 'Append-only violation: UPDATE is prohibited on table ConsentEvent';

DROP TRIGGER IF EXISTS trg_consent_event_no_delete;
CREATE TRIGGER trg_consent_event_no_delete
BEFORE DELETE ON `ConsentEvent`
FOR EACH ROW
SIGNAL SQLSTATE '45000'
  SET MESSAGE_TEXT = 'Append-only violation: DELETE is prohibited on table ConsentEvent';

-- Hardening recomendado para a role usada pela aplicação web (ajuste o nome da role).
-- O REVOKE abaixo é necessário, mas insuficiente sozinho se existir DROP em escopo maior.
--
-- 1) Remova DROP (e UPDATE/DELETE) em global/database/roles herdadas, por exemplo:
-- REVOKE ALL ON `seu_banco`.* FROM 'app_runtime'@'%';
-- REVOKE DROP ON *.* FROM 'app_runtime'@'%';
--
-- 2) Conceda só o mínimo na tabela do ledger:
-- GRANT SELECT, INSERT ON `ConsentEvent` TO 'app_runtime'@'%';
-- REVOKE UPDATE, DELETE, DROP ON `ConsentEvent` FROM 'app_runtime'@'%';
