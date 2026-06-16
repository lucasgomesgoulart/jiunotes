// Nova Aula — wizard de 4 passos (tipo, data, conteúdo, chamada)
function NVWrap({ step, children, pad = '26px 24px 16px' }) {
  const { AScreen, AWizardTop } = window;
  return (
    <AScreen active="Aulas">
      <AWizardTop title="Nova Aula" step={step} />
      <div style={{ flex: 1, overflow: 'auto', padding: pad, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </AScreen>
  );
}

// ── 1/4 · Tipo ──────────────────────────────────────────────
function NovaAula1() {
  const { ATheme, AQHead, APrimaryBtn, IconGi, IconShorts } = window;
  const Tile = ({ Icon, name, desc }) => (
    <div style={{
      borderRadius: 22, border: `1.5px solid ${ATheme.line2}`, background: ATheme.panel,
      aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 13,
    }}>
      <span style={{ color: ATheme.ink, display: 'flex' }}><Icon size={56} stroke={1.6} /></span>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 17, fontWeight: 800 }}>{name}</div>
        <div style={{ fontSize: 12.5, color: ATheme.muted, fontWeight: 600, marginTop: 3 }}>{desc}</div>
      </div>
    </div>
  );
  return (
    <NVWrap step={1}>
      <AQHead title="Qual o tipo de aula?" sub="Kimono ou sem kimono (NoGi)?" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Tile Icon={IconGi} name="Kimono" desc="Com kimono" />
        <Tile Icon={IconShorts} name="NoGi" desc="Sem kimono" />
      </div>
      <APrimaryBtn disabled style={{ marginTop: 'auto' }}>Próximo</APrimaryBtn>
    </NVWrap>
  );
}

// ── 2/4 · Data ──────────────────────────────────────────────
function NovaAula2() {
  const { ATheme, AQHead, APrimaryBtn, ASelect, IconCalendar } = window;
  const Quick = ({ label }) => (
    <div style={{
      flex: 1, height: 50, borderRadius: 14, border: `1.5px solid ${ATheme.line2}`,
      background: ATheme.panel, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 14, fontWeight: 700, color: ATheme.muted, whiteSpace: 'nowrap',
    }}>{label}</div>
  );
  return (
    <NVWrap step={2}>
      <AQHead title="Qual a data da aula?" sub="Selecione o dia do treino." />
      <ASelect icon={<IconCalendar size={19} />} text="Selecione uma data" placeholder />
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <Quick label="Hoje" />
        <Quick label="Ontem" />
        <Quick label="Anteontem" />
      </div>
      <APrimaryBtn disabled style={{ marginTop: 'auto' }}>Próximo</APrimaryBtn>
    </NVWrap>
  );
}

// ── 3/4 · Categoria + conteúdo ──────────────────────────────
function NovaAula3() {
  const {
    ATheme, AQHead, APrimaryBtn, IconMic,
    IconShieldHalf, IconLock, IconArrowDown, IconShield,
    IconTarget, IconBolt, IconUserShield, IconEdit,
  } = window;
  const CATS = [
    ['Passagem de Guarda', IconShieldHalf], ['Guarda', IconLock],
    ['Quedas', IconArrowDown], ['Meia Guarda', IconShield],
    ['Costas', IconTarget], ['Finalizações', IconBolt],
    ['Defesa Pessoal', IconUserShield], ['Outro', IconEdit],
  ];
  return (
    <NVWrap step={3} pad="20px 24px 16px">
      <AQHead title="O que foi trabalhado?" sub="Categoria e conteúdo da aula." size={21} mb={16} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
        {CATS.map(([label, Icon]) => (
          <div key={label} style={{
            borderRadius: 15, border: `1.5px solid ${ATheme.line2}`, background: ATheme.panel,
            padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
          }}>
            <span style={{ display: 'flex' }}><Icon size={19} /></span>
            <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.15, textAlign: 'center' }}>{label}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 700, margin: '16px 0 8px' }}>Conteúdo Principal</div>
      <div style={{ borderRadius: 14, border: `1.5px solid ${ATheme.line2}`, background: ATheme.panel, padding: '12px 14px', minHeight: 64 }}>
        <span style={{ fontSize: 14.5, color: ATheme.faint, fontWeight: 500 }}>Ex: Triângulo partindo da guarda fechada…</span>
      </div>
      <div style={{
        marginTop: 10, height: 48, borderRadius: 14, border: '1.5px dashed rgba(255,76,59,0.55)',
        background: 'rgba(255,76,59,0.07)', color: ATheme.red, display: 'flex',
        alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14.5, fontWeight: 700, whiteSpace: 'nowrap',
      }}>
        <IconMic size={18} /> Falar conteúdo
      </div>
      <APrimaryBtn disabled style={{ marginTop: 'auto', height: 52 }}>Próximo</APrimaryBtn>
    </NVWrap>
  );
}

// ── 4/4 · Chamada ───────────────────────────────────────────
function NovaAula4() {
  const { ATheme, AQHead, APrimaryBtn, Belt } = window;
  const Row = ({ nome, belt, graus }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px',
      borderRadius: 16, border: `1.5px solid ${ATheme.line2}`, background: ATheme.panel,
    }}>
      <div style={{ width: 24, height: 24, borderRadius: 7, border: `2px solid ${ATheme.line2}`, flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: 15.5, fontWeight: 700 }}>{nome}</span>
      <Belt belt={belt} graus={graus} w={46} />
    </div>
  );
  return (
    <NVWrap step={4} pad="24px 24px 16px">
      <AQHead title="Quem estava presente?" sub="0/3 marcados" mb={14} size={22} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ color: ATheme.red, fontSize: 14.5, fontWeight: 800, whiteSpace: 'nowrap' }}>Marcar todos</span>
        <span style={{ color: ATheme.faint }}>·</span>
        <span style={{ color: ATheme.muted, fontSize: 14.5, fontWeight: 700 }}>Limpar</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <Row nome="Lucas Goulart" belt="branca" graus={4} />
        <Row nome="João Vitor" belt="azul" graus={1} />
        <Row nome="teste" belt="branca" graus={0} />
      </div>
      <APrimaryBtn style={{ marginTop: 'auto' }}>Registrar Aula</APrimaryBtn>
    </NVWrap>
  );
}

Object.assign(window, { NovaAula1, NovaAula2, NovaAula3, NovaAula4 });
