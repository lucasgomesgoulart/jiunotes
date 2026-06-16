# Setup do JiuNotes

## 1. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

### Campos obrigatórios

| Variável | Descrição |
|---|---|
| `PROFESSOR_PASSWORD` | Senha de acesso ao sistema |
| `SESSION_SECRET` | String aleatória ≥ 32 chars para assinar a sessão |
| `DATABASE_URL` | Connection string do Postgres (Neon) — use a versão **pooled** |
| `ANTHROPIC_API_KEY` | Chave da API do Claude (Anthropic) |

---

## 2. Banco de dados (Neon / Postgres)

### Passo a passo:

1. Crie uma conta grátis em **[neon.tech](https://neon.tech)** (dá pra entrar com o GitHub).

2. **Create project** — escolha um nome e a região mais próxima (ex.: AWS `sa-east-1` São Paulo, se disponível). Isso cria um banco Postgres pronto.

3. Na tela do projeto, copie a **connection string**. Marque a opção **Pooled connection** (importante para serverless) — fica parecido com:
   ```
   postgresql://usuario:senha@ep-xxxx-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require
   ```

4. Cole no `.env.local`:
   ```
   DATABASE_URL="postgresql://...-pooler...?sslmode=require"
   ```

5. **Crie as tabelas**: no painel do Neon, abra o **SQL Editor**, cole todo o conteúdo de [`schema.sql`](schema.sql) e clique em **Run**. (É idempotente — pode rodar de novo sem problema.)

> As datas são guardadas como texto ISO (`YYYY-MM-DD`). A aba/tabela de graduações já está no schema. Apagar um aluno/aula remove em cascata suas presenças e graduações.

---

## 3. Rodar localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) e entre com a senha definida em `PROFESSOR_PASSWORD`.
