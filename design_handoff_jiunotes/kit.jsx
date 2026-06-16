const { DesignCanvas, DCSection, DCArtboard } = window;

function App() {
  const W = 402, H = 874;
  return (
    <DesignCanvas>
      <DCSection id="inicio" title="Início" subtitle="Visão Geral no padrão Dojo Escuro — agora com Últimas aulas e o estado da Sugestão IA.">
        <DCArtboard id="inicio-padrao" label="Início" width={W} height={H}>
          <ScreenA />
        </DCArtboard>
        <DCArtboard id="inicio-ia" label="Início · Sugestão IA aberta" width={W} height={H}>
          <ScreenASugestao />
        </DCArtboard>
      </DCSection>

      <DCSection id="alunos" title="Alunos" subtitle="Lista de alunos ativos e confirmação de inativação.">
        <DCArtboard id="alunos-lista" label="Alunos · Lista" width={W} height={H}>
          <AlunosList />
        </DCArtboard>
        <DCArtboard id="alunos-inativar" label="Alunos · Inativar" width={W} height={H}>
          <AlunosInativar />
        </DCArtboard>
      </DCSection>

      <DCSection id="novo-aluno" title="Novo Aluno · 4 passos" subtitle="Nome → Faixa → Graus → Data de nascimento.">
        <DCArtboard id="na-1" label="1/4 · Nome" width={W} height={H}>
          <NovoAluno1 />
        </DCArtboard>
        <DCArtboard id="na-2" label="2/4 · Faixa" width={W} height={H}>
          <NovoAluno2 />
        </DCArtboard>
        <DCArtboard id="na-3" label="3/4 · Graus" width={W} height={H}>
          <NovoAluno3 />
        </DCArtboard>
        <DCArtboard id="na-4" label="4/4 · Nascimento" width={W} height={H}>
          <NovoAluno4 />
        </DCArtboard>
      </DCSection>

      <DCSection id="ideias-faixa" title="Novas ideias · Escolha da faixa" subtitle="Três propostas: a própria faixa vira o botão — sem quadrados, sem emoji. F2 ainda junta faixa + graus numa tela só (o cadastro cai de 4 para 3 passos).">
        <DCArtboard id="f1" label="F1 · Faixas reais em lista" width={W} height={H}>
          <FaixaLista />
        </DCArtboard>
        <DCArtboard id="f2" label="F2 · Faixa + graus juntos" width={W} height={H}>
          <FaixaGraus />
        </DCArtboard>
        <DCArtboard id="f3" label="F3 · Rack do dojo" width={W} height={H}>
          <FaixaRack />
        </DCArtboard>
      </DCSection>

      <DCSection id="aulas" title="Aulas" subtitle="Histórico com filtros por categoria e período.">
        <DCArtboard id="aulas-lista" label="Aulas · Lista" width={W} height={H}>
          <AulasList />
        </DCArtboard>
      </DCSection>

      <DCSection id="nova-aula" title="Nova Aula · 4 passos" subtitle="Tipo → Data → Conteúdo → Chamada.">
        <DCArtboard id="nv-1" label="1/4 · Tipo" width={W} height={H}>
          <NovaAula1 />
        </DCArtboard>
        <DCArtboard id="nv-2" label="2/4 · Data" width={W} height={H}>
          <NovaAula2 />
        </DCArtboard>
        <DCArtboard id="nv-3" label="3/4 · Conteúdo" width={W} height={H}>
          <NovaAula3 />
        </DCArtboard>
        <DCArtboard id="nv-4" label="4/4 · Chamada" width={W} height={H}>
          <NovaAula4 />
        </DCArtboard>
      </DCSection>

      <DCSection id="ideias-aula" title="Novas ideias · Nova Aula" subtitle="Pictogramas desenhados no lugar dos emojis (🥋/🩳) e categorias com a cor do sistema — a mesma cor que aparece nos filtros e cards de Aulas.">
        <DCArtboard id="t1" label="T1 · Tipo com pictogramas" width={W} height={H}>
          <TipoPictogramas />
        </DCArtboard>
        <DCArtboard id="c1" label="C1 · Categorias com cor" width={W} height={H}>
          <CategoriasColoridas />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
