-- Criação da tabela principal
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(200) NOT NULL,
    role VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índice único case-insensitive para e-mail
-- (combina com seu existsByEmailIgnoreCase e evita duplicados por maiúsculas/minúsculas)
CREATE UNIQUE INDEX IF NOT EXISTS ux_users_email_ci ON users (LOWER(email));

-- Opcional: índice para buscas por role/active/name
CREATE INDEX IF NOT EXISTS ix_users_role ON users(role);
CREATE INDEX IF NOT EXISTS ix_users_active ON users(active);
CREATE INDEX IF NOT EXISTS ix_users_name_ci ON users (LOWER(name));
