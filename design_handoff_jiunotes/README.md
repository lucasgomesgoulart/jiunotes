# Handoff: JiuNotes — Redesign "Dojo Escuro" (mobile)

## Visão geral
Redesenho visual completo do JiuNotes mantendo **100% dos fluxos e dados do app atual**
(Next.js + Tailwind v4 + shadcn). Foco: professor de jiu-jitsu 50+, uso no tatame,
tudo visual e direto — sem IA no fluxo principal.

Direção: **Dojo Escuro** — fundo azul-petróleo escuro, vermelho da marca, faixas
desenhadas de verdade, números grandes, ações sempre visíveis.

---

## ✅ Decisões finais do cliente

| Tela | Decisão |
|---|---|
| Início | Padrão "v1" — CTA grande, estatísticas em faixa, ranking com Belt, últimas aulas |
| Aulas | **D1 cartões grandes** — cor de categoria, avatares dos presentes, Editar + Apagar explícitos |
| Nova aula | **Uma tela só** (sem wizard) — tipo, quando, categoria, conteúdo + ditado, chamada |
| Alunos | Lista com **"Ver perfil →"** e **"Inativar"** em cada linha |
| Perfil do aluno | Novo — avatar, tempo na faixa, presenças, **linha do tempo de graduações** |
| Graduação | Novo — sheet "Hoje → Depois" com Belt preview, +1 grau ou nova faixa |
| Editar aula | Reutiliza o form da Nova aula em modo edição + botão Apagar |
| Apagar | **Desfazer** em 5s antes da exclusão real (optimistic delete) |
| Ditado por voz | Reusa `MicButton` já existente no repo (Web Speech API, sem IA) |
| Nav inferior | Fundo `#1D2436`, borda `rgba(255,255,255,0.2)`, sombra forte — não camufla mais |
| "Quem sumido" | **Deixado para depois** — fora do escopo desta versão |

---

## 🗂 Arquivos de produção (sob `app/`)

Estes arquivos espelham os caminhos do seu repo. Substituem/adicionam nas pastas correspondentes.

```
app/
├── (dashboard)/
│   ├── dashboard/page.tsx        ← Início (sem IA)
│   ├── alunos/
│   │   ├── page.tsx              ← Lista com Ver perfil + Inativar
│   │   └── [id]/
│   │       ├── page.tsx          ← Perfil do aluno
│   │       └── graduar/page.tsx  ← Promover faixa/grau
│   └── aulas/
│       ├── page.tsx              ← Cartões grandes + Editar + Apagar/Desfazer
│       └── nova/page.tsx         ← Uma tela só + ditado (MicButton)
components/
├── belt.tsx                      ← Faixa realista (cor + ponteira + graus)
├── faixa-selector.tsx            ← Seletor F1 (lista de faixas reais) para Novo Aluno
└── aula-card.tsx                 ← Cartão grande de aula para a listagem
theme/
└── dojo-escuro.css               ← Tokens + utilitários (.bg-cta-dojo, nav pill)
reference/
└── JiuNotes Redesign.html        ← Protótipo navegável completo (canvas)
```

---

## 🔌 APIs novas necessárias

O Claude Code precisará criar estes endpoints (além dos já existentes):

| Endpoint | Método | Descrição |
|---|---|---|
| `/api/alunos/[id]` | GET | Retorna `AlunoPerfil` (ver tipo no `alunos/[id]/page.tsx`) com totalPresencas, tempoNaFaixaLabel, historicoGraduacoes, ultimasPresencas |
| `/api/alunos/[id]/graduar` | POST | Atualiza faixa/graus do aluno + adiciona registro em historicoGraduacoes na planilha |
| `/api/aulas/[id]` | DELETE | Apaga a aula e suas presenças |

---

## 🎨 Design Tokens

### Pré-requisitos (aplicar em `app/globals.css`)
```css
/* 1. Substituir o bloco .dark atual por theme/dojo-escuro.css */
/* 2. Ativar dark fixo em app/layout.tsx: */
<html lang="pt-BR" className="dark">

/* 3. Adicionar utilitários */
@layer utilities {
  .bg-cta-dojo { background-image: linear-gradient(135deg, #FF5E3A 0%, #E1142A 100%); }
  .font-display { font-family: 'Anton', system-ui, sans-serif; }
}
```

### Carregar Anton (em `app/layout.tsx`)
```ts
import { Anton, Hanken_Grotesk } from 'next/font/google'
const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-display' })
```

### Cores principais
| Token | Hex | Uso |
|---|---|---|
| `--background` | `oklch(0.17 0.012 250)` | Fundo app |
| `--primary` | `oklch(0.68 0.19 33)` | Vermelho da marca (#FF4C3B) |
| `.bg-cta-dojo` | `#FF5E3A → #E1142A` | Botões primários com gradiente |
| Nav pill bg | `#1D2436` | Fundo do nav inferior |
| Nav pill border | `rgba(255,255,255,0.2)` | Borda do nav inferior |

### Cores de categoria
```css
:root {
  --cat-passagem: #4D8DFF;  --cat-guarda: #8C8CFF;
  --cat-quedas: #FF6B5E;    --cat-meia: #B07BFF;
  --cat-costas: #4CC474;    --cat-finalizacoes: #FF6B8E;
  --cat-defesa: #FFB13D;    --cat-outro: #A8A8B0;
}
```

### Nav inferior (fix do "se camufla")
```tsx
// Em components/layout/bottom-nav.tsx, trocar o container do nav por:
<div style={{
  background: '#1D2436',
  border: '1.5px solid rgba(255,255,255,0.2)',
  borderRadius: 24,
  boxShadow: '0 -20px 48px rgba(0,0,0,0.85), 0 4px 16px rgba(0,0,0,0.5)',
}}>
```

---

## 🚀 Como implementar (com Claude Code)

Abra o Claude Code na raiz do repo `jiunotes` e peça:

```
"Implemente o redesign descrito em design_handoff_jiunotes/README.md.
Passo a passo:
1. Aplique o tema (theme/dojo-escuro.css → globals.css, dark fixo, fonte Anton)
2. Copie components/belt.tsx, faixa-selector.tsx, aula-card.tsx
3. Substitua os 6 arquivos em app/ pelos equivalentes do pacote
4. Corrija o nav inferior (background #1D2436, border rgba(255,255,255,0.2))
5. Crie os 3 endpoints novos (/api/alunos/[id] GET, /api/alunos/[id]/graduar POST,
   /api/aulas/[id] DELETE) integrando com a planilha via lib/sheets.ts
6. Adicione historicoGraduacoes como nova aba/coluna na planilha"
```

---

## 📋 Notas finais

- **Ditado já existe:** `components/ui/mic-button.tsx` usa Web Speech API. A nova tela de aula reusa diretamente — sem criar nada.
- **Desfazer é optimistic:** a aula some da UI imediatamente; o DELETE real só dispara após 5s. Se o user tocar "Desfazer" antes, a exclusão é cancelada.
- **historicoGraduacoes:** precisa de nova aba na planilha Google Sheets (sugestão: `Graduações` com colunas idAluno, faixa, graus, data, label).
- **tempoNaFaixaLabel:** calcular no servidor a partir da data da última graduação (ou da data de cadastro se não houver histórico).
- **Mensalidade:** fora do escopo por decisão do cliente — retomar se necessário.
