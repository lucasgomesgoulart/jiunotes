// Aulas — lista com filtros por categoria, ano/mês e cards de aula
function AulasList() {
  const {
    AScreen, ATopBar, ATheme, ANewBtn, ASelect, ACatChip, CAT_COLORS,
    IconGi, IconUsers, IconTrash,
  } = window;

  const Chip = ({ label, count, cat, active, disabled }) => {
    let bg, fg;
    if (active) { bg = ATheme.red; fg = '#fff'; }
    else if (disabled) { bg = 'rgba(255,255,255,0.035)'; fg = 'rgba(244,241,234,0.22)'; }
    else { const c = CAT_COLORS[cat]; bg = c + '26'; fg = c; }
    return (
      <span style={{ borderRadius: 999, padding: '8px 13px', fontSize: 12.5, fontWeight: 700, background: bg, color: fg, whiteSpace: 'nowrap' }}>
        {label}{count != null && <span style={{ opacity: 0.65 }}> ({count})</span>}
      </span>
    );
  };

  const AulaCard = ({ nome, weekday, dateShort, cat, presentes }) => (
    <div style={{ borderRadius: 22, border: `1px solid ${ATheme.line}`, background: ATheme.panel, overflow: 'hidden' }}>
      <div style={{ padding: '11px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: ATheme.blue }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: 14, fontWeight: 800 }}>
          <IconGi size={17} /> Kimono
        </span>
        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{dateShort}</span>
      </div>
      <div style={{ padding: '14px 18px' }}>
        <div style={{ fontSize: 12.5, color: ATheme.muted, fontWeight: 600 }}>{weekday}</div>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.2, marginTop: 6 }}>{nome}</div>
        <div style={{ marginTop: 10 }}><ACatChip cat={cat} /></div>
      </div>
      <div style={{ padding: '12px 18px', borderTop: `1px solid ${ATheme.line}`, display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ color: ATheme.muted, display: 'flex' }}><IconUsers size={16} /></span>
        <span style={{ color: ATheme.red, fontSize: 14, fontWeight: 800 }}>{presentes}</span>
        <span style={{ color: ATheme.muted, fontSize: 13.5, fontWeight: 600, flex: 1 }}>aluno{presentes > 1 ? 's' : ''} presente{presentes > 1 ? 's' : ''}</span>
        <span style={{ color: ATheme.faint, display: 'flex' }}><IconTrash size={17} /></span>
      </div>
    </div>
  );

  return (
    <AScreen active="Aulas">
      <ATopBar title="Aulas" right={<ANewBtn>+ Nova</ANewBtn>} />
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 20px' }}>
        {/* filtros por categoria */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Chip label="Todas" active />
          <Chip label="Passagem" disabled />
          <Chip label="Guarda" disabled />
          <Chip label="Quedas" disabled />
          <Chip label="Meia Guarda" count={1} cat="Meia Guarda" />
          <Chip label="Costas" count={2} cat="Costas" />
          <Chip label="Finalizações" disabled />
          <Chip label="Defesa" disabled />
          <Chip label="Outro" disabled />
        </div>

        {/* ano / mês */}
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <ASelect text="2026" style={{ flex: 1, height: 48 }} />
          <ASelect text="Junho" style={{ flex: 2, height: 48 }} />
        </div>

        <div style={{ fontSize: 13.5, color: ATheme.muted, fontWeight: 600, margin: '14px 0 12px' }}>3 aulas em Junho 2026</div>

        {/* cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <AulaCard nome="teste teste" weekday="Terça-feira, 09 de junho" dateShort="09 de jun." cat="Meia Guarda" presentes={2} />
          <AulaCard nome="Mata leão" weekday="Segunda-feira, 08 de junho" dateShort="08 de jun." cat="Costas" presentes={1} />
          <AulaCard nome="Mata leão" weekday="Segunda-feira, 08 de junho" dateShort="08 de jun." cat="Costas" presentes={1} />
        </div>
      </div>
    </AScreen>
  );
}
window.AulasList = AulasList;
