// Novas ideias 3 — SEM IA. Foco: visualização das aulas + cadastro em 1 tela.
// Para usuário mais velho: alvos grandes, "gente" na tela (presença visual), pouca digitação.

// avatar de iniciais com anel da cor da faixa
function Avatar({ nome, belt = 'branca', size = 38 }) {
  const { BELT_COLORS } = window;
  const ini = nome.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  const ring = BELT_COLORS[belt] || '#888';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: '#2A2F39', color: '#F4F1EA', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: size * 0.36, fontWeight: 800,
      boxShadow: `inset 0 0 0 2.5px ${ring}`,
    }}>{ini}</div>
  );
}

// ════════════════════════════════════════════════════════════
// D1 · CARTÕES GRANDES (uma aula por bloco, presença visível)
// ════════════════════════════════════════════════════════════
function AulasCartoes() {
  const { AScreen, ATopBar, ATheme, ANewBtn, CAT_COLORS, IconGi } = window;

  const Card = ({ dia, semana, nome, cat, tipo, presentes }) => {
    const c = CAT_COLORS[cat];
    return (
      <div style={{
        borderRadius: 24, overflow: 'hidden', background: ATheme.panel,
        border: `1px solid ${ATheme.line}`, boxShadow: '0 12px 28px -16px rgba(0,0,0,0.7)',
      }}>
        {/* faixa de cor da categoria */}
        <div style={{ height: 7, background: c }} />
        <div style={{ padding: '17px 18px 18px' }}>
          {/* topo: data grande + tipo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 50 }}>
              <div style={{ fontFamily: ATheme.display, fontSize: 36, lineHeight: 0.85, color: ATheme.ink }}>{dia}</div>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: ATheme.muted, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 3 }}>{semana}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999, padding: '5px 11px', fontSize: 12, fontWeight: 800, background: c + '26', color: c, marginBottom: 7, whiteSpace: 'nowrap' }}>{cat}</span>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3 }}>{nome}</div>
            </div>
          </div>

          {/* presença visual */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, paddingTop: 15, borderTop: `1px solid ${ATheme.line}` }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 800, color: '#6FA5FF' }}><IconGi size={15} /> {tipo}</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex' }}>
                {presentes.map((p, i) => (
                  <div key={i} style={{ marginLeft: i === 0 ? 0 : -10 }}><Avatar nome={p.nome} belt={p.belt} size={36} /></div>
                ))}
              </div>
              <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 700, color: ATheme.muted }}>
                {presentes.length} presente{presentes.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AScreen active="Aulas">
      <ATopBar title="Aulas" right={<ANewBtn>+ Nova</ANewBtn>} />
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 20px' }}>
        <div style={{ fontSize: 14, color: ATheme.muted, fontWeight: 600, marginBottom: 16 }}>Junho 2026 · 3 aulas</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card dia="09" semana="Ter" nome="teste teste" cat="Meia Guarda" tipo="Kimono"
            presentes={[{ nome: 'Lucas Goulart', belt: 'branca' }, { nome: 'João Vitor', belt: 'azul' }]} />
          <Card dia="08" semana="Seg" nome="Mata leão" cat="Costas" tipo="Kimono"
            presentes={[{ nome: 'Lucas Goulart', belt: 'branca' }]} />
          <Card dia="08" semana="Seg" nome="Mata leão" cat="Costas" tipo="Kimono"
            presentes={[{ nome: 'João Vitor', belt: 'azul' }]} />
        </div>
      </div>
    </AScreen>
  );
}

// ════════════════════════════════════════════════════════════
// D2 · MURAL POR CATEGORIA (organizado por área treinada)
// ════════════════════════════════════════════════════════════
function AulasMural() {
  const { AScreen, ATopBar, ATheme, ANewBtn, CAT_COLORS } = window;

  const Group = ({ cat, count, children }) => {
    const c = CAT_COLORS[cat];
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11 }}>
          <span style={{ width: 12, height: 12, borderRadius: 4, background: c }} />
          <span style={{ fontSize: 16.5, fontWeight: 800, letterSpacing: -0.2, whiteSpace: 'nowrap' }}>{cat}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: ATheme.muted, whiteSpace: 'nowrap' }}>· {count} aula{count > 1 ? 's' : ''}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>{children}</div>
      </div>
    );
  };

  const Row = ({ cat, dia, semana, nome, presentes }) => {
    const c = CAT_COLORS[cat];
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: ATheme.panel, border: `1px solid ${ATheme.line}`, borderLeft: `4px solid ${c}`, borderRadius: 16, padding: '13px 15px' }}>
        <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 38 }}>
          <div style={{ fontFamily: ATheme.display, fontSize: 24, lineHeight: 0.9 }}>{dia}</div>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: ATheme.muted, textTransform: 'uppercase' }}>{semana}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.2 }}>{nome}</div>
          <div style={{ display: 'flex', marginTop: 7 }}>
            {presentes.map((p, i) => (
              <div key={i} style={{ marginLeft: i === 0 ? 0 : -9 }}><Avatar nome={p.nome} belt={p.belt} size={28} /></div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AScreen active="Aulas">
      <ATopBar title="Aulas" right={<ANewBtn>+ Nova</ANewBtn>} />
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 20px' }}>
        <div style={{ fontSize: 14, color: ATheme.muted, fontWeight: 600, marginBottom: 18 }}>Junho 2026 · por categoria</div>
        <Group cat="Meia Guarda" count={1}>
          <Row cat="Meia Guarda" dia="09" semana="Ter" nome="teste teste"
            presentes={[{ nome: 'Lucas Goulart', belt: 'branca' }, { nome: 'João Vitor', belt: 'azul' }]} />
        </Group>
        <Group cat="Costas" count={2}>
          <Row cat="Costas" dia="08" semana="Seg" nome="Mata leão"
            presentes={[{ nome: 'Lucas Goulart', belt: 'branca' }]} />
          <Row cat="Costas" dia="08" semana="Seg" nome="Mata leão"
            presentes={[{ nome: 'João Vitor', belt: 'azul' }]} />
        </Group>
      </div>
    </AScreen>
  );
}

// ════════════════════════════════════════════════════════════
// CADASTRO EM 1 TELA (sem wizard, sem IA, quase tudo de toque)
// Campo "O que foi passado" com DITADO por microfone (Web Speech API,
// transcrição local do navegador — não usa IA/LLM).
// ════════════════════════════════════════════════════════════
function NovaAulaUmaTela() {
  const {
    AScreen, ATheme, AIconSq, Belt, CAT_COLORS,
    IconBack, IconGi, IconShorts, IconCheck, IconMic,
  } = window;

  const [conteudo, setConteudo] = React.useState('');
  const [ouvindo, setOuvindo] = React.useState(false);
  const [suportado, setSuportado] = React.useState(true);
  const recRef = React.useRef(null);
  const baseRef = React.useRef('');

  React.useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSuportado(false); return; }
    const rec = new SR();
    rec.lang = 'pt-BR';
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let txt = '';
      for (let i = 0; i < e.results.length; i++) txt += e.results[i][0].transcript;
      const base = baseRef.current;
      setConteudo((base ? base + ' ' : '') + txt);
    };
    rec.onend = () => setOuvindo(false);
    rec.onerror = () => setOuvindo(false);
    recRef.current = rec;
    return () => { try { rec.stop(); } catch (_) {} };
  }, []);

  const toggleMic = () => {
    const rec = recRef.current;
    if (!rec) return;
    if (ouvindo) { try { rec.stop(); } catch (_) {} setOuvindo(false); return; }
    baseRef.current = conteudo.trim();
    try { rec.start(); setOuvindo(true); } catch (_) {}
  };

  const Label = ({ children, n }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, margin: '22px 0 11px' }}>
      <span style={{ width: 22, height: 22, borderRadius: '50%', background: ATheme.red, color: '#fff', fontSize: 12.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
      <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.2, whiteSpace: 'nowrap' }}>{children}</span>
    </div>
  );

  const TipoBtn = ({ Icon, label, sel }) => (
    <div style={{
      flex: 1, height: 88, borderRadius: 18, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 8,
      border: `1.5px solid ${sel ? ATheme.red : ATheme.line2}`,
      background: sel ? 'rgba(255,76,59,0.1)' : ATheme.panel, color: ATheme.ink,
    }}>
      <Icon size={34} stroke={1.7} />
      <span style={{ fontSize: 14.5, fontWeight: 800 }}>{label}</span>
    </div>
  );

  const DataBtn = ({ label, sel }) => (
    <div style={{
      flex: 1, height: 50, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 14.5, fontWeight: 800, whiteSpace: 'nowrap',
      border: `1.5px solid ${sel ? ATheme.red : ATheme.line2}`,
      background: sel ? 'rgba(255,76,59,0.1)' : ATheme.panel, color: sel ? '#fff' : ATheme.muted,
    }}>{label}</div>
  );

  const CATS = ['Passagem de Guarda', 'Guarda', 'Quedas', 'Meia Guarda', 'Costas', 'Finalizações', 'Defesa Pessoal', 'Outro'];

  const PresRow = ({ nome, belt, graus, on }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 13, padding: '12px 15px', borderRadius: 14,
      border: `1.5px solid ${on ? ATheme.red : ATheme.line2}`,
      background: on ? 'rgba(255,76,59,0.08)' : ATheme.panel,
    }}>
      <div style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? ATheme.red : 'transparent', border: `2px solid ${on ? ATheme.red : ATheme.line2}`, color: '#fff' }}>
        {on && <IconCheck size={15} stroke={3} />}
      </div>
      <span style={{ flex: 1, fontSize: 15.5, fontWeight: 700 }}>{nome}</span>
      <Belt belt={belt} graus={graus} w={44} />
    </div>
  );

  return (
    <AScreen>
      {/* header */}
      <div style={{ flexShrink: 0, padding: '58px 18px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${ATheme.line}` }}>
        <AIconSq><IconBack size={20} /></AIconSq>
        <div style={{ flex: 1, fontSize: 19, fontWeight: 800, letterSpacing: -0.3 }}>Nova aula</div>
      </div>

      {/* corpo: tudo numa rolagem só */}
      <div style={{ flex: 1, overflow: 'auto', padding: '2px 20px 16px' }}>
        <Label n="1">Tipo</Label>
        <div style={{ display: 'flex', gap: 12 }}>
          <TipoBtn Icon={IconGi} label="Kimono" sel />
          <TipoBtn Icon={IconShorts} label="NoGi" />
        </div>

        <Label n="2">Quando</Label>
        <div style={{ display: 'flex', gap: 10 }}>
          <DataBtn label="Hoje" sel />
          <DataBtn label="Ontem" />
          <DataBtn label="Outra data" />
        </div>

        <Label n="3">O que treinou</Label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
          {CATS.map(cat => {
            const c = CAT_COLORS[cat]; const sel = cat === 'Meia Guarda';
            return (
              <span key={cat} style={{
                borderRadius: 999, padding: '10px 15px', fontSize: 13.5, fontWeight: 700, whiteSpace: 'nowrap',
                border: `1.5px solid ${sel ? c : 'transparent'}`,
                background: sel ? c + '26' : ATheme.panel2, color: sel ? c : ATheme.muted,
              }}>{cat}</span>
            );
          })}
        </div>

        <Label n="4">O que foi passado</Label>
        <div style={{
          borderRadius: 16, border: `1.5px solid ${ouvindo ? ATheme.red : ATheme.line2}`,
          background: ATheme.panel, padding: 4,
          boxShadow: ouvindo ? '0 0 0 4px rgba(255,76,59,0.12)' : 'none',
        }}>
          <textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Escreva a técnica trabalhada… ou toque no microfone e fale."
            rows={3}
            style={{
              width: '100%', resize: 'none', border: 'none', outline: 'none', background: 'transparent',
              color: ATheme.ink, fontFamily: 'inherit', fontSize: 15, lineHeight: 1.5,
              padding: '11px 12px 4px', boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px 8px' }}>
            <button
              type="button"
              onClick={toggleMic}
              disabled={!suportado}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px',
                borderRadius: 12, border: 'none', fontFamily: 'inherit', fontSize: 14, fontWeight: 800,
                cursor: suportado ? 'pointer' : 'default', whiteSpace: 'nowrap',
                background: ouvindo ? ATheme.red : 'rgba(255,76,59,0.14)',
                color: ouvindo ? '#fff' : ATheme.red,
                opacity: suportado ? 1 : 0.4,
              }}
            >
              <span style={{ position: 'relative', display: 'flex' }}>
                <IconMic size={18} />
                {ouvindo && <span style={{ position: 'absolute', inset: -5, borderRadius: '50%', border: '2px solid #fff', opacity: 0.6, animation: 'jnPulse 1.1s ease-out infinite' }} />}
              </span>
              {ouvindo ? 'Ouvindo… toque para parar' : 'Ditar por voz'}
            </button>
            {!ouvindo && conteudo && (
              <span style={{ marginLeft: 'auto', fontSize: 12.5, color: ATheme.faint, fontWeight: 600 }}>{conteudo.trim().length} caracteres</span>
            )}
          </div>
        </div>
        {!suportado && (
          <div style={{ fontSize: 12.5, color: ATheme.faint, marginTop: 8, lineHeight: 1.45 }}>
            O ditado usa o reconhecimento de voz do próprio celular (sem IA). Neste navegador ele não está disponível — no celular do dia a dia funciona.
          </div>
        )}

        <Label n="5">Quem veio</Label>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 }}>
          <span style={{ fontSize: 13.5, color: ATheme.muted, fontWeight: 700, whiteSpace: 'nowrap' }}>2 de 3 marcados</span>
          <span style={{ fontSize: 14, color: ATheme.red, fontWeight: 800, whiteSpace: 'nowrap' }}>Marcar todos</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <PresRow nome="Lucas Goulart" belt="branca" graus={4} on />
          <PresRow nome="João Vitor" belt="azul" graus={1} on />
          <PresRow nome="teste" belt="branca" graus={0} />
        </div>
      </div>

      {/* salvar fixo embaixo */}
      <div style={{ flexShrink: 0, padding: '12px 20px 30px', borderTop: `1px solid ${ATheme.line}`, background: 'rgba(15,17,22,0.85)' }}>
        <button style={{ width: '100%', height: 58, borderRadius: 16, border: 'none', background: ATheme.redGrad, color: '#fff', fontFamily: 'inherit', fontSize: 17, fontWeight: 800, boxShadow: '0 12px 26px -10px rgba(225,20,42,0.6)' }}>
          Salvar aula
        </button>
      </div>
    </AScreen>
  );
}

Object.assign(window, { AulasCartoes, AulasMural, NovaAulaUmaTela });
