// kit.jsx — Direção A "Dojo Escuro": tema + chrome compartilhado.
// Carregado depois de lib.jsx, antes das telas. Exporta para window.
const { IOSDevice: KitDevice, IconHome: KIconHome, IconUsers: KIconUsers,
        IconCalendar: KIconCalendar, IconBack: KIconBack, IconChevDown: KIconChevDown } = window;

const ATheme = {
  red: '#FF4C3B',
  redGrad: 'linear-gradient(135deg, #FF5E3A 0%, #E1142A 100%)',
  bg: 'radial-gradient(120% 80% at 50% -10%, #232834 0%, #14171E 55%, #0F1116 100%)',
  ink: '#F4F1EA',
  muted: 'rgba(244,241,234,0.52)',
  faint: 'rgba(244,241,234,0.30)',
  panel: 'rgba(255,255,255,0.045)',
  panel2: 'rgba(255,255,255,0.08)',
  line: 'rgba(255,255,255,0.09)',
  line2: 'rgba(255,255,255,0.17)',
  blue: '#1A5FD0',
  orange: '#F2700A',
  amber: '#E8A23D',
  sans: "'Hanken Grotesk', system-ui, sans-serif",
  display: "'Anton', sans-serif",
};

// Cores de categoria (adaptadas p/ fundo escuro)
const CAT_COLORS = {
  'Passagem de Guarda': '#4D8DFF',
  'Guarda':             '#8C8CFF',
  'Quedas':             '#FF6B5E',
  'Meia Guarda':        '#B07BFF',
  'Costas':             '#4CC474',
  'Finalizações':       '#FF6B8E',
  'Defesa Pessoal':     '#FFB13D',
  'Outro':              '#A8A8B0',
};

function ACatChip({ cat, label, style }) {
  const c = CAT_COLORS[cat] || CAT_COLORS['Outro'];
  return (
    <span style={{
      display: 'inline-block', borderRadius: 999, padding: '5px 12px',
      fontSize: 12.5, fontWeight: 700, background: c + '26', color: c, whiteSpace: 'nowrap', ...style,
    }}>{label || cat}</span>
  );
}

// Tela base: device escuro + fundo + nav opcional
function AScreen({ children, active }) {
  return (
    <KitDevice dark>
      <div style={{
        height: '100%', position: 'relative', display: 'flex', flexDirection: 'column',
        background: ATheme.bg, fontFamily: ATheme.sans, color: ATheme.ink,
      }}>
        {children}
        {active && <ABottomNav active={active} />}
      </div>
    </KitDevice>
  );
}

// Cabeçalho de listas: título Anton + ações à direita
function ATopBar({ title, right }) {
  return (
    <div style={{
      flexShrink: 0, padding: '58px 20px 14px', display: 'flex',
      alignItems: 'flex-end', justifyContent: 'space-between', gap: 10,
    }}>
      <div style={{ fontFamily: ATheme.display, fontSize: 34, lineHeight: 1, letterSpacing: 0.5 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{right}</div>
    </div>
  );
}

// Cabeçalho de wizard: voltar + título + passo + barra de progresso
function AWizardTop({ title, step, total = 4 }) {
  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{ padding: '58px 18px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <AIconSq><KIconBack size={20} /></AIconSq>
        <div style={{ flex: 1, fontSize: 18, fontWeight: 800, letterSpacing: -0.2 }}>{title}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: ATheme.muted }}>{step}/{total}</div>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.08)' }}>
        <div style={{ height: '100%', width: `${(step / total) * 100}%`, background: ATheme.redGrad, borderRadius: 2 }} />
      </div>
    </div>
  );
}

// Nav inferior flutuante
function ABottomNav({ active }) {
  const items = [['Início', KIconHome], ['Alunos', KIconUsers], ['Aulas', KIconCalendar]];
  return (
    <div style={{ flexShrink: 0, padding: '10px 16px 34px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', background: 'rgba(22,24,30,0.92)',
        border: `1px solid ${ATheme.line}`, borderRadius: 24, padding: '12px 8px',
        boxShadow: '0 -6px 24px rgba(0,0,0,0.4)',
      }}>
        {items.map(([label, Icon]) => {
          const act = label === active;
          return (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, color: act ? '#fff' : ATheme.muted, flex: 1 }}>
              <div style={{ width: 46, height: 34, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', background: act ? ATheme.red : 'transparent' }}>
                <Icon size={22} stroke={act ? 2.4 : 2} />
              </div>
              <span style={{ fontSize: 11, fontWeight: act ? 700 : 600, letterSpacing: 0.2 }}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Botão primário vermelho
function APrimaryBtn({ children, disabled, style }) {
  return (
    <button style={{
      width: '100%', height: 56, borderRadius: 16, border: 'none',
      background: ATheme.redGrad, color: '#fff', fontFamily: 'inherit',
      fontSize: 16.5, fontWeight: 800, display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: 8, opacity: disabled ? 0.38 : 1,
      boxShadow: disabled ? 'none' : '0 12px 26px -10px rgba(225,20,42,0.55)', ...style,
    }}>{children}</button>
  );
}

function AGhostBtn({ children, style }) {
  return (
    <button style={{
      width: '100%', height: 54, borderRadius: 16, border: `1.5px solid ${ATheme.line2}`,
      background: 'transparent', color: ATheme.ink, fontFamily: 'inherit',
      fontSize: 15.5, fontWeight: 700, display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: 8, ...style,
    }}>{children}</button>
  );
}

// Botão pequeno "+ Novo"
function ANewBtn({ children }) {
  return (
    <button style={{
      height: 38, padding: '0 14px', borderRadius: 12, border: 'none',
      background: ATheme.redGrad, color: '#fff', fontSize: 13.5, fontWeight: 800,
      fontFamily: 'inherit', boxShadow: '0 8px 18px -8px rgba(225,20,42,0.6)',
    }}>{children}</button>
  );
}

// Quadradinho de ícone (logout, voltar)
function AIconSq({ children }) {
  return (
    <div style={{
      width: 38, height: 38, borderRadius: 12, border: `1px solid ${ATheme.line2}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: ATheme.muted, flexShrink: 0,
    }}>{children}</div>
  );
}

// Título de pergunta (wizards)
function AQHead({ title, sub, mb = 24, size = 24 }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: mb }}>
      <div style={{ fontSize: size, fontWeight: 800, letterSpacing: -0.4 }}>{title}</div>
      {sub && <div style={{ fontSize: 13.5, color: ATheme.muted, marginTop: 6, fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

// "Select" estático (data, mês, ano)
function ASelect({ icon, text, placeholder, style }) {
  return (
    <div style={{
      height: 54, borderRadius: 16, border: `1.5px solid ${ATheme.line2}`,
      background: ATheme.panel, display: 'flex', alignItems: 'center', gap: 11,
      padding: '0 15px', ...style,
    }}>
      {icon && <span style={{ color: ATheme.muted, display: 'flex' }}>{icon}</span>}
      <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: placeholder ? ATheme.muted : ATheme.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</span>
      <span style={{ color: ATheme.muted, display: 'flex' }}><KIconChevDown size={17} /></span>
    </div>
  );
}

Object.assign(window, {
  ATheme, CAT_COLORS, ACatChip, AScreen, ATopBar, AWizardTop, ABottomNav,
  APrimaryBtn, AGhostBtn, ANewBtn, AIconSq, AQHead, ASelect,
});
