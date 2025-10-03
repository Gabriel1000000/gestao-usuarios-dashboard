CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now()
);

-- dados de exemplo
INSERT INTO users (name, email, role, active)
VALUES
('Gabriel Alves', 'gabriel@example.com', 'admin', true),
('Maria Silva', 'maria@example.com', 'user', true),
('João Pereira', 'joao@example.com', 'user', false);
