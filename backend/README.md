# Users Backend

## 📌 Descrição do Projeto

Este projeto implementa o backend de um sistema de gestão de usuários, incluindo funcionalidades de **CRUD (Create, Read, Update, Delete)**, **endpoint de estatísticas** para dashboard e integração com PostgreSQL.
A aplicação foi desenvolvida utilizando **Java 17**, **Spring Boot**, **Spring Data JPA** e **PostgreSQL 15**.
Todos os serviços são executados via **Docker Compose**, garantindo portabilidade e facilidade de execução.

---

## ⚙️ Funcionalidades

* Listar todos os usuários (`GET /api/users`)
* Buscar usuário por ID (`GET /api/users/{id}`)
* Criar usuário (`POST /api/users`)
* Atualizar usuário (`PUT /api/users/{id}`)
* Atualização parcial de usuário (`PATCH /api/users/{id}`)
* Excluir usuário (`DELETE /api/users/{id}`)
* Obter estatísticas de usuários por papel (`GET /api/users/statistics`)
* Documentação de API via **Swagger** (`http://localhost:8080/swagger-ui.html`)

---

## 🏗️ Estrutura do Projeto

```
backend/
├─ src/main/java/com/example/users/
│  ├─ controller/        # Endpoints REST
│  ├─ service/           # Lógica de negócio
│  ├─ repository/        # Acesso ao banco de dados
│  ├─ model/             # Entidades JPA
│  ├─ dto/               # Objetos de transferência de dados
│  ├─ exception/         # Tratamento global de exceções
│  └─ UsersBackendApplication.java  # Classe principal
├─ src/main/resources/
│  ├─ application-docker.properties # Configuração do Spring Boot para Docker
└─ pom.xml
```

---

## 🔹 Pré-requisitos

* **Docker** e **Docker Compose** instalados.
* Não é necessário instalar Java ou PostgreSQL localmente.

1. Querendo rodar no Windows, deve primeiro instalar o WSL.
   - O **WSL (Windows Subsystem for Linux)** é um recurso do Windows que permite rodar um ambiente Linux diretamente dentro do Windows, sem a necessidade de uma máquina virtual completa. Ele fornece acesso ao terminal Linux, permitindo executar comandos, scripts e ferramentas nativas do Linux, como se estivesse em um sistema Linux real.
   - Opções de instalação:
     1.1 Seguindo a documentação do [Docker](https://docs.docker.com/desktop/setup/install/windows-install/).br
     1.2 Podendo baixar o Ubuntu pela **Microsoft Store** e rodar no terminal:
     ```bash
     wsl
     ```


---

## 🚀 Como Executar

1. Clone o repositório:

```bash
git clone https://github.com/Gabriel1000000/gestao-usuarios-dashboard.git
```
```bash
cd gestao-usuarios-dashboard
```

2. Build e inicialização via Docker Compose:

```bash
docker-compose up --build
```

> Isso irá subir os serviços: banco de dados PostgreSQL, backend Spring Boot e frontend React (se houver).

3. Acesse a aplicação backend:

* **API REST:** `http://localhost:8080/api/users`
* **Swagger UI:** `http://localhost:8080/swagger-ui.html`

---

## 🔹 Testes e Validação

* **Postman** ou **curl** podem ser usados para testar os endpoints.
* Todos os endpoints lançam erros adequados via `GlobalExceptionHandler`, incluindo:

  * `400 Bad Request` para dados inválidos
  * `404 Not Found` para usuários inexistentes
  * `500 Internal Server Error` para falhas internas
* Teste parcial de atualização via `PATCH` e teste de criação com email duplicado.

---

## 📊 Tecnologias Utilizadas

* Java 17
* Spring Boot 3.5.6
* Spring Data JPA
* PostgreSQL 15
* Swagger / SpringDoc OpenAPI
* Docker / Docker Compose

---

