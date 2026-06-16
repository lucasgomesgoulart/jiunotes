// Novo Aluno — wizard de 4 passos (nome, faixa, graus, nascimento)
function NAWrap({ step, children }) {
  const { AScreen, AWizardTop } = window;
  return (
    <AScreen active="Alunos">
      <AWizardTop title="Novo Aluno" step={step} />
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 24px 16px', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </AScreen>
  );
}

// ── 1/4 · Nome ──────────────────────────────────────────────
function NovoAluno1() {
  const { ATheme, AQHead, APrimaryBtn } = window;
  return (
    <NAWrap step={1}>
      <AQHead title="Qual o nome do aluno?" sub="Nome completo como aparecerá no sistema." />
      <div style={{ borderRadius: 16, border: `1.5px solid ${ATheme.red}`, background: ATheme.panel, padding: '11px 16px 14px', boxShadow: '0 0 0 4px rgba(255,76,59,0.08)' }}>
        <div style={{ fontSize: 11.5, fontWeight: 800, color: ATheme.red, letterSpacing: 0.5, textTransform: 'uppercase' }}>Nome completo</div>
        <div style={{ display: 'flex', alignItems: 'center', height: 28, marginTop: 3 }}>
          <div style={{ width: 2, height: 20, background: ATheme.red, borderRadius: 1 }} />
        </div>
      </div>
      <APrimaryBtn disabled style={{ marginTop: 20 }}>Próximo</APrimaryBtn>
    </NAWrap>
  );
}

// ── 2/4 · Faixa ─────────────────────────────────────────────
function NovoAluno2() {
  const { ATheme, AQHead, APrimaryBtn, IconGi } = window;
  const TILES = [
    ['Branca', '#F2EFE6', '#26231D'], ['Cinza', '#8E959C', '#fff'], ['Amarela', '#F5C518', '#3D3008'],
    ['Laranja', '#F2700A', '#fff'], ['Verde', '#2FA84F', '#fff'], ['Azul', '#1A5FD0', '#fff'],
    ['Roxa', '#7B2FBF', '#fff'], ['Marrom', '#8A4B16', '#fff'], ['Preta', '#101013', '#fff'],
  ];
  return (
    <NAWrap step={2}>
      <AQHead title="Qual a faixa atual?" sub="Toque na faixa do aluno." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {TILES.map(([label, bg, fg]) => (
          <div key={label} style={{
            borderRadius: 18, background: bg, padding: '18px 4px 14px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9,
            boxShadow: '0 8px 18px -10px rgba(0,0,0,0.55)',
            border: label === 'Preta' ? `1px solid ${ATheme.line2}` : 'none',
          }}>
            <span style={{ color: fg, display: 'flex' }}><IconGi size={28} /></span>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, color: fg }}>{label.toUpperCase()}</span>
          </div>
        ))}
      </div>
      <APrimaryBtn disabled style={{ marginTop: 22 }}>Próximo</APrimaryBtn>
    </NAWrap>
  );
}

// ── 3/4 · Graus ─────────────────────────────────────────────
function NovoAluno3() {
  const { ATheme, AQHead, APrimaryBtn } = window;
  const GrauRow = ({ g, selected }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '15px 16px',
      borderRadius: 16, border: `1.5px solid ${selected ? ATheme.red : ATheme.line2}`,
      background: selected ? 'rgba(255,76,59,0.08)' : ATheme.panel,
    }}>
      <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${selected ? ATheme.red : ATheme.line2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {selected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: ATheme.red }} />}
      </div>
      <span style={{ flex: 1, fontSize: 15.5, fontWeight: 700 }}>{g === 0 ? 'Sem grau' : `${g} grau${g > 1 ? 's' : ''}`}</span>
      <div style={{ display: 'flex', gap: 5 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: i < g ? ATheme.ink : 'transparent', border: `1.5px solid ${i < g ? ATheme.ink : ATheme.faint}` }} />
        ))}
      </div>
    </div>
  );
  return (
    <NAWrap step={3}>
      <AQHead title="Quantos graus?" sub="Graus na faixa branca." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {[0, 1, 2, 3, 4].map(g => <GrauRow key={g} g={g} selected={g === 0} />)}
      </div>
      <APrimaryBtn style={{ marginTop: 22 }}>Próximo</APrimaryBtn>
    </NAWrap>
  );
}

// ── 4/4 · Data de nascimento ────────────────────────────────
function NovoAluno4() {
  const { ATheme, AQHead, APrimaryBtn, ASelect, IconCalendar } = window;
  return (
    <NAWrap step={4}>
      <AQHead title="Data de nascimento" sub="Opcional — ajuda a identificar o aluno." />
      <ASelect icon={<IconCalendar size={19} />} text="Selecione uma data" placeholder />
      <APrimaryBtn style={{ marginTop: 22 }}>Cadastrar Aluno</APrimaryBtn>
      <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, fontWeight: 600, color: ATheme.muted }}>Pular e cadastrar sem data</div>
    </NAWrap>
  );
}

Object.assign(window, { NovoAluno1, NovoAluno2, NovoAluno3, NovoAluno4 });
