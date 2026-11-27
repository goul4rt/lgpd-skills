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
-- Em escopo de banco/global, revogue só DROP: um REVOKE ALL no database tiraria
-- SELECT/INSERT de outras tabelas (ex.: PolicyVersion) que a aplicação ainda precisa.
-- UPDATE/DELETE em ConsentEvent já são barrados pelos triggers; revogue-os na tabela.
--
-- 1) Remova DROP em global/database/roles herdadas, por exemplo:
-- REVOKE DROP ON `seu_banco`.* FROM 'app_runtime'@'%';
-- REVOKE DROP ON *.* FROM 'app_runtime'@'%';
--
-- 2) Na tabela do ledger, preserve SELECT/INSERT e tire UPDATE/DELETE/DROP:
-- GRANT SELECT, INSERT ON `ConsentEvent` TO 'app_runtime'@'%';
-- REVOKE UPDATE, DELETE, DROP ON `ConsentEvent` FROM 'app_runtime'@'%';
