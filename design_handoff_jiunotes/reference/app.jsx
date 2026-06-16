const { DesignCanvas, DCSection, DCArtboard } = window;

function App() {
  const W = 402, H = 874;
  return (
    <DesignCanvas>
      {/* ═══════════ VERSÃO FINAL — telas aprovadas ═══════════ */}
      <DCSection id="final" title="✅ Versão final — aprovada" subtitle="As telas que você escolheu, no padrão Dojo Escuro: Início (v1), Aulas em cartões grandes (D1) e o cadastro em uma tela só com campo de conteúdo + ditado por voz. É essa direção que vai para o código.">
        <DCArtboard id="f-inicio" label="Início" width={W} height={H}>
          <ScreenA />
        </DCArtboard>
        <DCArtboard id="f-aulas" label="Aulas · Cartões grandes" width={W} height={H}>
          <AulasCartoes />
        </DCArtboard>
        <DCArtboard id="f-cadastro" label="Nova Aula · 1 tela + ditado 🎙" width={W} height={H}>
          <NovaAulaUmaTela />
        </DCArtboard>
      </DCSection>

      {/* ═══════════ Telas de apoio (mesmo padrão) ═══════════ */}
      <DCSection id="apoio" title="Telas de apoio" subtitle="Completam o app no mesmo estilo — já prontas para implementar junto.">
        <DCArtboard id="ap-alunos" label="Alunos · Lista" width={W} height={H}>
          <AlunosList />
        </DCArtboard>
        <DCArtboard id="ap-inativar" label="Alunos · Inativar" width={W} height={H}>
          <AlunosInativar />
        </DCArtboard>
        <DCArtboard id="ap-na1" label="Novo Aluno · Faixa (lista real)" width={W} height={H}>
          <FaixaLista />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
