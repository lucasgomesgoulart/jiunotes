// Explorações — novas ideias de UX para Faixa (Novo Aluno) e Nova Aula
// F1: lista de faixas reais · F2: faixa + graus juntos · F3: rack do dojo
// T1: tipo com pictogramas · C1: categorias com cor

// pictogramas locais (desenhados, sem emoji)
const icx = (paths, vb = 24) => ({ size = 24, stroke = 1.8, style } = {}) => (
  <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} fill="none"
    stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"
    strokeLinejoin="round" style={style}>{paths}</svg>
);
// Kimono com gola cruzada + faixa amarrada
const IconGiPro = icx(<>
  <path d="M7 3H5.2L3 8l2.5 1.2V20h13V9.2L21 8l-2.2-5H17"/>
  <path d="M7 3l5 5.5L17 3"/>
  <path d="M5.5 13.5h13"/>
  <rect x="10.6" y="12.1" width="2.8" height="2.8" rx="0.6"/>
  <path d="M11 14.9l-1.4 2.6M13 14.9l1.4 2.6"/>
</>);
// Rashguard (NoGi)
const IconRash = icx(<>
  <path d="M8 3L5 4.8 2.5 8 5 10l1.2-1V20h11.6V9L19 10l2.5-2L19 4.8 16 3c-.9 1.5-2.2 2.3-4 2.3S8.9 4.5 8 3z"/>
  <path d="M6.2 13h11.6"/>
</>);

// faixa horizontal grande (largura livre)
function BeltBarX({ color, h = 46, tip = 0.26, graus = 0, children, style }) {
  const isWhite = color === '#E9E4D6' || color === '#F2EFE6';
  return (
    <div style={{
      position: 'relative', height: h, borderRadius: 8, background: color,
      boxShadow: isWhite
        ? 'inset 0 0 0 1px rgba(0,0,0,0.16), 0 2px 6px rgba(0,0,0,0.3)'
        : 'inset 0 -3px 5px rgba(0,0,0,0.28), 0 2px 6px rgba(0,0,0,0.35)',
      overflow: 'hidden', ...style,
    }}>
      {/* costura central */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: 'rgba(0,0,0,0.12)' }} />
      {/* ponteira */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: `${tip * 100}%`,
        background: '#141414', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 5,
      }}>
        {Array.from({ length: graus }).map((_, i) => (
          <div key={i} style={{ width: 4, height: h - 14, background: '#fff', borderRadius: 1.5, boxShadow: '0 0 0 0.5px rgba(0,0,0,0.3)' }} />
        ))}
      </div>
      {children}
    </div>
  );
}

// faixa vertical (rack)
function BeltVert({ color, h = 150, w = 32, selected, accent }) {
  const isWhite = color === '#E9E4D6';
  return (
    <div style={{
      width: w, height: h, borderRadius: 5, background: color, position: 'relative',
      boxShadow: (selected ? `0 0 0 3px ${accent}, ` : '') + (isWhite
        ? 'inset 0 0 0 1px rgba(0,0,0,0.16), 0 4px 10px rgba(0,0,0,0.4)'
        : 'inset -2px 0 4px rgba(0,0,0,0.25), 0 4px 10px rgba(0,0,0,0.4)'),
      transition: 'height .2s',
    }}>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: h * 0.22, background: '#141414', borderRadius: '0 0 5px 5px' }} />
    </div>
  );
}

const FAIXAS_X = [
  ['Branca', '#E9E4D6', '#26231D'], ['Cinza', '#8E959C', '#fff'], ['Amarela', '#F5C518', '#3D3008'],
  ['Laranja', '#F2700A', '#fff'], ['Verde', '#2FA84F', '#fff'], ['Azul', '#1A5FD0', '#fff'],
  ['Roxa', '#7B2FBF', '#fff'], ['Marrom', '#8A4B16', '#fff'], ['Preta', '#17171A', '#fff'],
];

// ── F1 · Lista de faixas reais ──────────────────────────────
function FaixaLista() {
  const { AScreen, AWizardTop, AQHead, APrimaryBtn, ATheme, IconCheck } = window;
  return (
    <AScreen active="Alunos">
      <AWizardTop title="Novo Aluno" step={2} />
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 24px 16px', display: 'flex', flexDirection: 'column' }}>
        <AQHead title="Qual a faixa atual?" sub="Toque na própria faixa." mb={18} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {FAIXAS_X.map(([label, color, fg]) => {
            const sel = label === 'Azul';
            return (
              <div key={label} style={{ position: 'relative', borderRadius: 10, boxShadow: sel ? `0 0 0 3px ${ATheme.red}` : 'none' }}>
                <BeltBarX color={color} h={48} graus={0}>
                  <span style={{
                    position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 13, fontWeight: 800, letterSpacing: 1.2, color: fg, textTransform: 'uppercase',
                  }}>{label}</span>
                </BeltBarX>
                {sel && (
                  <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 26, height: 26, borderRadius: '50%', background: ATheme.red, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                    <IconCheck size={15} stroke={3} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <APrimaryBtn style={{ marginTop: 20 }}>Próximo</APrimaryBtn>
      </div>
    </AScreen>
  );
}

// ── F2 · Faixa + graus na mesma tela ────────────────────────
function FaixaGraus() {
  const { AScreen, AWizardTop, AQHead, APrimaryBtn, ATheme, IconPlus } = window;
  return (
    <AScreen active="Alunos">
      <AWizardTop title="Novo Aluno" step={2} total={3} />
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 24px 16px', display: 'flex', flexDirection: 'column' }}>
        <AQHead title="Faixa e graus" sub="Escolha a cor e ajuste os graus — a faixa mostra o resultado." mb={18} />

        {/* preview ao vivo */}
        <BeltBarX color="#7B2FBF" h={56} graus={2} style={{ borderRadius: 10 }} />
        <div style={{ textAlign: 'center', fontSize: 14.5, fontWeight: 800, marginTop: 10 }}>
          Roxa · 2 graus
        </div>

        {/* cor */}
        <div style={{ fontSize: 13, fontWeight: 700, color: ATheme.muted, textTransform: 'uppercase', letterSpacing: 0.8, margin: '22px 0 10px' }}>Cor da faixa</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 11 }}>
          {FAIXAS_X.map(([label, color]) => {
            const sel = label === 'Roxa';
            return (
              <div key={label} style={{
                width: 42, height: 42, borderRadius: '50%', background: color,
                boxShadow: (sel ? `0 0 0 3px ${ATheme.red}, ` : '') +
                  (label === 'Branca' ? 'inset 0 0 0 1px rgba(0,0,0,0.2)' : 'inset 0 -3px 5px rgba(0,0,0,0.25)'),
              }} />
            );
          })}
        </div>

        {/* graus */}
        <div style={{ fontSize: 13, fontWeight: 700, color: ATheme.muted, textTransform: 'uppercase', letterSpacing: 0.8, margin: '22px 0 10px' }}>Graus</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, border: `1.5px solid ${ATheme.line2}`, background: ATheme.panel, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: ATheme.ink }}>−</div>
          <div style={{ flex: 1, textAlign: 'center', fontFamily: ATheme.display, fontSize: 44, letterSpacing: 1 }}>2</div>
          <div style={{ width: 56, height: 56, borderRadius: 16, border: `1.5px solid ${ATheme.line2}`, background: ATheme.panel, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ATheme.ink }}><IconPlus size={24} /></div>
        </div>
        <div style={{ fontSize: 12.5, color: ATheme.faint, textAlign: 'center', marginTop: 8 }}>Os graus aparecem na ponteira da faixa.</div>

        <APrimaryBtn style={{ marginTop: 'auto' }}>Próximo</APrimaryBtn>
      </div>
    </AScreen>
  );
}

// ── F3 · Rack do dojo ───────────────────────────────────────
function FaixaRack() {
  const { AScreen, AWizardTop, AQHead, APrimaryBtn, ATheme } = window;
  return (
    <AScreen active="Alunos">
      <AWizardTop title="Novo Aluno" step={2} />
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 24px 16px', display: 'flex', flexDirection: 'column' }}>
        <AQHead title="Qual a faixa atual?" sub="Toque na faixa pendurada no rack." mb={26} />

        {/* barra do rack */}
        <div style={{ height: 10, borderRadius: 5, background: 'linear-gradient(180deg, #6B5236 0%, #46341F 100%)', boxShadow: '0 3px 8px rgba(0,0,0,0.5)' }} />
        {/* faixas penduradas */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0 4px', marginTop: -2 }}>
          {FAIXAS_X.map(([label, color]) => (
            <BeltVert key={label} color={color} h={label === 'Azul' ? 176 : 150} selected={label === 'Azul'} accent={ATheme.red} />
          ))}
        </div>

        {/* seleção */}
        <div style={{ textAlign: 'center', marginTop: 26 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: ATheme.muted, textTransform: 'uppercase', letterSpacing: 0.8 }}>Selecionada</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>Faixa Azul</div>
        </div>

        <APrimaryBtn style={{ marginTop: 'auto' }}>Próximo</APrimaryBtn>
      </div>
    </AScreen>
  );
}

// ── T1 · Tipo de aula com pictogramas ───────────────────────
function TipoPictogramas() {
  const { AScreen, AWizardTop, AQHead, APrimaryBtn, ATheme, IconCheck } = window;
  const Tile = ({ Icon, name, desc, accent, selected }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 18, padding: '22px 20px',
      borderRadius: 22, background: selected ? accent + '14' : ATheme.panel,
      border: `1.5px solid ${selected ? accent : ATheme.line2}`,
    }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: accent + '26', color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={40} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 19, fontWeight: 800 }}>{name}</div>
        <div style={{ fontSize: 13.5, color: ATheme.muted, fontWeight: 600, marginTop: 3 }}>{desc}</div>
      </div>
      {selected && (
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <IconCheck size={16} stroke={3} />
        </div>
      )}
    </div>
  );
  return (
    <AScreen active="Aulas">
      <AWizardTop title="Nova Aula" step={1} />
      <div style={{ flex: 1, overflow: 'auto', padding: '26px 24px 16px', display: 'flex', flexDirection: 'column' }}>
        <AQHead title="Qual o tipo de aula?" sub="Kimono ou sem kimono (NoGi)?" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Tile Icon={IconGiPro} name="Kimono" desc="Treino com kimono (Gi)" accent="#4D8DFF" selected />
          <Tile Icon={IconRash} name="NoGi" desc="Rashguard e shorts, sem kimono" accent="#FF8A3D" />
        </div>
        <APrimaryBtn style={{ marginTop: 'auto' }}>Próximo</APrimaryBtn>
      </div>
    </AScreen>
  );
}

// ── C1 · Categorias com a cor do sistema ────────────────────
function CategoriasColoridas() {
  const {
    AScreen, AWizardTop, AQHead, APrimaryBtn, ATheme, CAT_COLORS, IconMic,
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
    <AScreen active="Aulas">
      <AWizardTop title="Nova Aula" step={3} />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px 16px', display: 'flex', flexDirection: 'column' }}>
        <AQHead title="O que foi trabalhado?" sub="A cor da categoria acompanha a aula no app inteiro." size={21} mb={16} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
          {CATS.map(([label, Icon]) => {
            const c = CAT_COLORS[label];
            const sel = label === 'Meia Guarda';
            return (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                borderRadius: 15, minHeight: 56,
                border: `1.5px solid ${sel ? c : ATheme.line2}`,
                background: sel ? c + '14' : ATheme.panel,
              }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: c + '26', color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} />
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.2 }}>{label}</span>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 700, margin: '16px 0 8px' }}>Conteúdo Principal</div>
        <div style={{ borderRadius: 14, border: `1.5px solid ${ATheme.line2}`, background: ATheme.panel, padding: '12px 14px', minHeight: 58 }}>
          <span style={{ fontSize: 14.5, color: ATheme.faint, fontWeight: 500 }}>Ex: Raspagem de gancho…</span>
        </div>
        <div style={{
          marginTop: 10, height: 48, borderRadius: 14, border: '1.5px dashed rgba(255,76,59,0.55)',
          background: 'rgba(255,76,59,0.07)', color: ATheme.red, display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14.5, fontWeight: 700, whiteSpace: 'nowrap',
        }}>
          <IconMic size={18} /> Falar conteúdo
        </div>
        <APrimaryBtn disabled style={{ marginTop: 'auto', height: 52 }}>Próximo</APrimaryBtn>
      </div>
    </AScreen>
  );
}

Object.assign(window, { FaixaLista, FaixaGraus, FaixaRack, TipoPictogramas, CategoriasColoridas });
