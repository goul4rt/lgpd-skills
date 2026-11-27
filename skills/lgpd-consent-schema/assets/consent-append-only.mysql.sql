-- Proteção real de append-only no MySQL/MariaDB para o ledger de consentimento.
-- Adicione esta migration após criar a tabela `ConsentEvent` pelo Prisma Migrate.
--
-- Limitação: MySQL não dispara triggers em TRUNCATE TABLE.
-- Cubra esse caso revogando UPDATE, DELETE e DROP da role da aplicação (veja o final deste arquivo).
-- TRUNCATE exige privilégio DROP sobre a tabela; sem DROP (e sem DELETE), a role não consegue esvaziar o ledger.

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

-- Hardening recomendado para a role usada pela aplicação web (ajuste o nome da role):
-- REVOKE UPDATE, DELETE, DROP ON `ConsentEvent` FROM 'app_runtime'@'%';
-- GRANT SELECT, INSERT ON `ConsentEvent` TO 'app_runtime'@'%';
