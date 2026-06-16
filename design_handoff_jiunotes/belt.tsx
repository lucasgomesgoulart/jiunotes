# Handoff: JiuNotes — Redesign "Dojo Escuro" (mobile)

## Visão geral
Redesenho visual completo do JiuNotes mantendo **100% dos fluxos e dados do app atual**
(Next.js + Tailwind v4 + shadcn). O objetivo do cliente: app para o **pai (mais velho)**
gerenciar aulas de jiu-jitsu — precisa ser **visual, rápido e direto**, sair do "tudo branco
e quadrado" e ganhar identidade de BJJ (faixas como código de cor).

Direção escolhida: **Dojo Escuro** — fundo escuro azul-petróleo, vermelho da marca,
números grandes, faixas desenhadas de verdade.

## Sobre os arquivos deste pacote
Os arquivos `.html` em `reference/` são **referências de design criadas em HTML** —
protótipos mostrando o visual e o comportamento pretendidos, **não código de produção
para copiar direto**. A tarefa é **recriar esses designs no app Next.js existente**, usando
seus padrões (componentes shadcn, `cn()`, `@/types`, Tailwind).

Os arquivos em `components/` e `theme/` **já são código `.tsx`/CSS de produção** escritos
nas suas convenções — pode usá-los como ponto de partida real (especialmente o seletor de
faixa F1, que o cliente aprovou).

## Fidelidade
**Alta fidelidade (hi-fi).** Cores, tipografia, espaçamento e estados finais definidos.
Recrie pixel a pixel usando os componentes/bibliotecas que o repo já tem.

---

## Como aplicar (passo a passo no Claude Code)

1. **Tema:** mescle `theme/dojo-escuro.css` dentro de `app/globals.css` (substitui o bloco
   `.dark` e ajusta `--primary` / `--neon-glow`). Ative dark fixo: `<html lang="pt-BR" className="dark">`
   em `app/layout.tsx`.
2. **Belt:** adicione `components/belt.tsx` (faixa realista). Opcional: troque o `FaixaBadge`
   por `<Belt>` onde a faixa precisa de destaque (dashboard, lista de alunos, chamada).
3. **Seletor de faixa (F1 — aprovado):** adicione `components/faixa-selector.tsx` e use-o no
   passo 2 de `app/(dashboard)/alunos/novo/page.tsx`, ligado ao `useState` da faixa.
4. **Demais telas:** recrie conforme as specs abaixo, reaproveitando o que já existe
   (`BottomNav`, botões shadcn, layout do dashboard).

---

## Design Tokens

### Cores (hex de referência → token)
| Uso | Hex | Token / equivalente |
|---|---|---|
| Fundo app | gradiente `#232834 → #14171E → #0F1116` | `--background` (oklch 0.17) |
| Texto principal | `#F4F1EA` | `--foreground` |
| Texto secundário | `#F4F1EA @ 52%` | `--muted-foreground` |
| Vermelho marca | `#FF4C3B` | `--primary` (oklch 0.68 0.19 33) |
| CTA gradiente | `#FF5E3A → #E1142A` | `.bg-cta-dojo` |
| Painel/card sutil | `rgba(255,255,255,0.045)` | superfície sobre `--card` |
| Borda | `rgba(255,255,255,0.09)` | `--border` |
| Âmbar (alerta inativar) | `#E8A23D` | — |
| Azul (cabeçalho Kimono) | `#1A5FD0` | — |

### Cores de categoria (fundo escuro) — em `:root` no css do tema
`Passagem #4D8DFF` · `Guarda #8C8CFF` · `Quedas #FF6B5E` · `Meia Guarda #B07BFF` ·
`Costas #4CC474` · `Finalizações #FF6B8E` · `Defesa Pessoal #FFB13D` · `Outro #A8A8B0`.
Cada chip usa a cor a 15% de opacidade no fundo + cor cheia no texto.

### Faixas (cor da barra)
`Branca #E9E4D6` · `Cinza #8E959C` · `Amarela #F5C518` · `Laranja #F2700A` ·
`Verde #2FA84F` · `Azul #1A5FD0` · `Roxa #6A2DAE` · `Marrom #5C3A1E` · `Preta #17171A`.
Ponteira preta `#161616` (`#000` na faixa preta); graus = listras brancas 2.6px.

### Tipografia
- **Display** (títulos de tela, números grandes): `Anton`, uppercase, letter-spacing ~0.5px.
  Ex.: "VISÃO GERAL" 44px, números de estatística 40px.
- **Texto/UI**: `Hanken Grotesk` (cai bem com o `Inter` atual — pode manter Inter se preferir
  não adicionar fonte). Pesos 600–800 para títulos de seção, 600 corpo.
- Escala mínima: nada abaixo de 12px; alvos de toque ≥ 44px (público mais velho).

### Raio / sombra
- Cards: `rounded-[22px]` a `rounded-[24px]`. Botões: `rounded-[15px/16px]`. Faixa: `rounded-[10px]`.
- CTA shadow: `0 18px 40px -12px rgba(225,20,42,0.6)`.
- Nav flutuante shadow: `0 -6px 24px rgba(0,0,0,0.4)`.

---

## Telas / Views

### 1. Início (`/dashboard`)
- **Propósito:** visão geral + ação principal "cadastrar aula".
- **Layout:** header (logo JIUNOTES + botão sair) · saudação "Boa noite, Professor" +
  título display "Visão Geral" · **CTA card** vermelho com gradiente (botões "Nova aula" e
  "Sugestão IA 3/3") · **faixa de estatísticas** (3 colunas divididas: Alunos ativos / Aulas
  no mês / Presenças) num único painel (NÃO 3 quadrados soltos) · seção "Mais presentes em
  junho" (ranking com posição, nome, `<Belt>`, % e nº de aulas) · seção "Últimas aulas"
  (linha com nome, categoria, data, tag Kimono).
- **Estado extra:** card de **Sugestão IA aberto** (tema + justificativa + estrutura
  aquecimento/técnica/rolas + botão "Começar esta aula"). Dados de `SugestaoIA`.

### 2. Alunos (`/alunos`)
- **Layout:** topo "Alunos" (display) + botão "+ Novo" + sair · contador "N alunos ativos" ·
  lista de cards: nome, `<Belt>` + label "Branca · 4 graus", botão "Inativar".
- **Modal Inativar:** overlay escurecido + ícone de alerta âmbar em círculo, "Inativar aluno?",
  texto com nome em destaque, botões "Sim, inativar" (âmbar) / "Cancelar".

### 3. Novo Aluno — wizard 4 passos (`/alunos/novo`)
Header com voltar + "Novo Aluno" + "N/4" + barra de progresso vermelha.
- **1/4 Nome:** input grande rotulado "Nome completo" com foco vermelho. Botão desabilitado
  até preencher.
- **2/4 Faixa:** **USAR `FaixaSelector` (F1)** — lista de faixas reais, nome gravado, check.
  (Aprovado pelo cliente.)
- **3/4 Graus:** lista de opções "Sem grau / 1 grau / …" com radio + indicadores de pontos.
- **4/4 Nascimento:** select de data (opcional) + "Cadastrar Aluno" + link "Pular".

### 4. Aulas (`/aulas`)
- **Layout:** topo "Aulas" + "+ Nova" · **filtros por categoria** (chips com cor da categoria
  e contagem; categorias sem aula ficam apagadas) · selects Ano / Mês · contador "N aulas em
  Junho 2026" · cards de aula: cabeçalho azul "Kimono" + data, corpo com dia da semana, nome,
  chip de categoria, rodapé com nº de presentes (vermelho) + lixeira.

### 5. Nova Aula — wizard 4 passos (`/aulas/nova`)
- **1/4 Tipo:** **proposta T1** — dois cards horizontais grandes: Kimono (azul) / NoGi
  (laranja) com pictograma desenhado (gola+nó / rashguard) e check. Sem emoji.
- **2/4 Data:** select de data + atalhos "Hoje / Ontem / Anteontem".
- **3/4 Conteúdo:** **proposta C1** — grade de categorias, cada uma com ícone em tile colorido
  na cor da categoria + estado selecionado; campo "Conteúdo Principal" + botão "Falar conteúdo"
  (entrada por voz, borda tracejada vermelha).
- **4/4 Chamada:** lista de alunos com checkbox + nome + `<Belt>`; "Marcar todos / Limpar";
  botão "Registrar Aula".

---

## Propostas de UX novas (além da tela atual)
- **F1 (aprovada):** faixa real como botão de seleção → ver `components/faixa-selector.tsx`.
- **T1:** tipo de aula com pictogramas desenhados (sem emoji 🥋/🩳), cards horizontais.
- **C1:** categorias com a cor do sistema, reaproveitando a mesma cor nos filtros e cards de Aulas.
- (Alternativas exploradas e não escolhidas: F2 "faixa+graus na mesma tela" — reduziria o
  cadastro de 4 p/ 3 passos; F3 "rack do dojo". Descritas no protótipo se quiser retomar.)

## Interações & comportamento
- Wizards: botão "Próximo" desabilitado (opacity 0.38, sem glow) até o passo ser válido.
- CTA primário: usa `--neon-glow` (já no projeto) no tom vermelho novo.
- Nav inferior: item ativo com pílula vermelha; `active:scale-95` ao tocar (já em `BottomNav`).
- Voz ("Falar conteúdo"): integra com a captação de áudio já existente no fluxo de nova aula.

## State management
Sem mudança de modelo. Reaproveita `Aluno`, `Aula`, `AulaComPresencas`, `Presenca`,
`SugestaoIA`, `Faixa`, `TipoAula`, `CategoriaAula` de `@/types`. O `FaixaSelector` é
controlado (`value`/`onChange`) e liga no `useState` já existente do wizard.

## Assets
Nenhum binário externo. Ícones são SVG inline (stroke, currentColor). O gráfico da faixa é
desenhado via CSS no `Belt`. Fontes opcionais: Anton + Hanken Grotesk (Google Fonts) — ou
manter Inter.

## Files (referência neste pacote)
- `reference/JiuNotes Redesign.html` — protótipo navegável (canvas com todas as telas + propostas).
- `reference/*.jsx` — fontes do protótipo (React/Babel) para consulta de medidas e layout.
- `components/belt.tsx` — faixa realista (produção).
- `components/faixa-selector.tsx` — seletor F1 (produção, aprovado).
- `theme/dojo-escuro.css` — overrides de tokens para `app/globals.css`.
