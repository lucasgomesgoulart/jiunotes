
Um sistema leve e inteligente de gestão de aulas e presença para professores de Jiu-Jitsu. O projeto foi concebido como um MVP (Produto Mínimo Viável) que utiliza uma arquitetura serverless econômica, performática e sem a necessidade inicial de um banco de dados relacional tradicional.

## 🚀 Conceito & Filosofia do Projeto
O objetivo principal é tirar a caderneta de papel da mão do professor de Jiu-Jitsu. O sistema foca em usabilidade rápida no ecossistema de tatame: cadastrar alunos, registrar a aula do dia e marcar presenças de forma ágil através de checkboxes.

---

## 🛠️ Stack Tecnológica

* **Backend:** Node.js (utilizar melhor framework melhor tecnologia)
* **Front-end:** React / Next.js ou HTML/JS limpo utilizando a biblioteca de componentes **Watermelon UI**.
* **Banco de Dados (Temporário):** Google Sheets (Acessado via Google Apps Script ou Google Sheets API).
* **Inteligência (Sugestões):** Integração com LLM (via API da Anthropic/Claude ou OpenAI) para geração de treinos baseados no histórico.
* **Ferramenta de Desenvolvimento Principal:** Claude Code (CLI).

---

## 📅 Ideias Iniciais (Escopo do MVP)

### 1. Autenticação e Telas (Professor)
* **Página de Login:** Acesso restrito para o professor.
* **Dashboard / Lista de Alunos:** Visualização de todos os alunos ativos, suas respectivas faixas (Branca a Preta) e graus.
* **Cadastro de Alunos:** Formulário simples para inserção de novos praticantes.
* **Cadastro de Aula + Chamada:** Tela onde o professor seleciona a data, o tipo de aula (Kimono ou NoGi) e marca os alunos presentes via checkbox.
* **Lista de Aulas:** Histórico do que já foi passado no tatame.

### 2. Estrutura do "Banco" (Google Sheets)
O Google Sheets será dividido nas seguintes abas:
* `Alunos`: ID, Nome, Faixa, Graus, Data de Nascimento, Status (Ativo/Inativo).
* `Aulas`: ID, Data, Tipo (Kimono/NoGi), Conteúdo Principal, Categoria (Ex: Passagem, Guarda, Quedas).
* `Presencas`: ID, ID_Aula, ID_Aluno.

---

## 🧠 O Diferencial: IA Dentro do Sistema (Sugestão de Aulas)

Em vez de algoritmos rígidos de recomendação, o sistema contará com um módulo de IA no backend. 

### Como vai funcionar:
1. Ao abrir a tela de nova aula, o Node.js busca no Google Sheets as últimas 10 aulas ministradas e a lista de alunos que costumam frequentar aquele horário.
2. O sistema envia um prompt para a API de IA contendo esse histórico e o perfil técnico da turma (predominância de faixas brancas, azuis, etc.).
3. A IA retorna:
   * **Sugestão de Tema:** O foco técnico ideal para o dia (ex: *"Ataques partindo da Meia-Guarda por Baixo"*).
   * **Justificativa:** O motivo pedagógico da escolha (ex: *"Nas últimas 3 aulas o foco foi passagem de guarda, está na hora de trabalhar a retenção e contra-ataque"*).
   * **Estrutura do Treino:** Sugestão de aquecimento específico, técnica do dia e dinâmica de rolas (treino livre).

---

## 🔮 Ideias Futuras (Roadmap de Evolução)

* **Portal do Aluno:** Área logada para o aluno visualizar seu histórico de presença, aulas assistidas e progresso de graus/faixas.
* **Análise de Desempenho por IA:** Relatórios automáticos para o professor indicando quais alunos estão estagnados em frequência ou quais estão prontos para receber o próximo grau.
* **Migração de Banco de Dados:** Quando o volume de dados escalar, migrar do Google Sheets para um banco relacional (PostgreSQL / Supabase) sem alterar a regra de negócio do front-end.
* **Controle de Mensalidades:** Módulo financeiro simples para checar quem está em dia direto na tela de chamada.