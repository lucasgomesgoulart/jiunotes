// Alunos — lista + modal "Inativar aluno?"
function AlunosListBase({ children }) {
  const { AScreen, ATopBar, ATheme, ANewBtn, AIconSq, Belt, BELT_LABEL, IconLogout } = window;

  const AlunoRow = ({ nome, belt, graus }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: ATheme.panel, border: `1px solid ${ATheme.line}`, borderRadius: 18, padding: '15px 16px' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16.5, fontWeight: 700, letterSpacing: -0.2 }}>{nome}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 8 }}>
          <Belt belt={belt} graus={graus} w={48} />
          <span style={{ fontSize: 12.5, color: ATheme.muted, fontWeight: 600 }}>
            {BELT_LABEL[belt]}{graus ? ` · ${graus} grau${graus > 1 ? 's' : ''}` : ''}
          </span>
        </div>
      </div>
      <button style={{ height: 38, padding: '0 14px', borderRadius: 12, background: 'transparent', border: `1px solid ${ATheme.line2}`, color: ATheme.muted, fontSize: 13, fontWeight: 700, fontFamily: 'inherit', flexShrink: 0 }}>Inativar</button>
    </div>
  );

  return (
    <AScreen active="Alunos">
      <ATopBar title="Alunos" right={<>
        <ANewBtn>+ Novo</ANewBtn>
        <AIconSq><IconLogout size={19} /></AIconSq>
      </>} />
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 20px' }}>
        <div style={{ fontSize: 13.5, color: ATheme.muted, fontWeight: 600, marginBottom: 12 }}>2 alunos ativos</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <AlunoRow nome="Lucas Goulart" belt="branca" graus={4} />
          <AlunoRow nome="João Vitor" belt="azul" graus={1} />
        </div>
      </div>
      {children}
    </AScreen>
  );
}

function AlunosList() { return <AlunosListBase />; }

function AlunosInativar() {
  const { ATheme, IconAlert } = window;
  return (
    <AlunosListBase>
      <div style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(8,9,12,0.68)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', background: '#1D212A', border: `1px solid ${ATheme.line2}`, borderRadius: 26, padding: '26px 22px', display: 'flex', flexDirection: 'column', gap: 18, boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(232,162,61,0.16)', color: ATheme.amber, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconAlert size={30} />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: -0.3 }}>Inativar aluno?</div>
            <div style={{ fontSize: 14, color: ATheme.muted, marginTop: 8, lineHeight: 1.55 }}>
              <b style={{ color: ATheme.ink, fontWeight: 700 }}>Lucas Goulart</b> não aparecerá mais nas listas e chamadas. Você pode reativá-lo depois.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button style={{ height: 54, borderRadius: 16, border: 'none', background: ATheme.amber, color: '#241804', fontSize: 16, fontWeight: 800, fontFamily: 'inherit' }}>Sim, inativar</button>
            <button style={{ height: 54, borderRadius: 16, border: `1.5px solid ${ATheme.line2}`, background: 'transparent', color: ATheme.ink, fontSize: 15.5, fontWeight: 700, fontFamily: 'inherit' }}>Cancelar</button>
          </div>
        </div>
      </div>
    </AlunosListBase>
  );
}

window.AlunosList = AlunosList;
window.AlunosInativar = AlunosInativar;
