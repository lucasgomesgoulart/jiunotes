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
| `GOOGLE_SHEETS_ID` | ID da planilha (da URL do Google Sheets) |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | E-mail da Service Account do GCP |
| `GOOGLE_PRIVATE_KEY` | Chave privada da Service Account |
| `ANTHROPIC_API_KEY` | Chave da API do Claude (Anthropic) |

---

## 2. Configuração do Google Sheets

### Passo a passo:

1. **Crie uma planilha** em [Google Sheets](https://sheets.google.com)
2. Copie o **ID** da planilha da URL:
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ID_AQUI]/edit
   ```
3. **Crie 3 abas** com os nomes exatos:
   - `Alunos`
   - `Aulas`
   - `Presencas`

4. **Crie uma Service Account** no [Google Cloud Console](https://console.cloud.google.com):
   - Projeto → IAM & Admin → Service Accounts → Criar
   - Baixe a chave JSON
   - Copie `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - Copie `private_key` → `GOOGLE_PRIVATE_KEY` (mantenha as quebras de linha como `\n`)

5. **Habilite a Google Sheets API** no projeto GCP

6. **Compartilhe a planilha** com o e-mail da Service Account (permissão de Editor)

7. Execute o setup inicial para criar os cabeçalhos:
   ```bash
   npm run setup:sheets
   ```

---

## 3. Rodar localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) e entre com a senha definida em `PROFESSOR_PASSWORD`.
