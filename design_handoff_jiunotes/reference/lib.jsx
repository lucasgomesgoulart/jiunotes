// Shared helpers for JiuNotes redesign — exported to window.
// Belt graphic + icon set. Loaded before kit.jsx and the screen files.

const BELT_COLORS = {
  branca: '#E9E4D6',
  cinza:  '#8E959C',
  amarela:'#F5C518',
  laranja:'#F2700A',
  verde:  '#2FA84F',
  azul:   '#1A5FD0',
  roxa:   '#6A2DAE',
  marrom: '#5C3A1E',
  preta:  '#17171A',
};
const BELT_LABEL = {
  branca: 'Branca', cinza: 'Cinza', amarela: 'Amarela', laranja: 'Laranja',
  verde: 'Verde', azul: 'Azul', roxa: 'Roxa', marrom: 'Marrom', preta: 'Preta',
};

// Realistic mini BJJ belt: colored bar + black ponteira holding white "graus" stripes.
function Belt({ belt = 'branca', graus = 0, w = 56 }) {
  const c = BELT_COLORS[belt] || BELT_COLORS.branca;
  const h = Math.max(13, Math.round(w * 0.27));
  const tipW = Math.round(w * 0.42);
  const isWhite = belt === 'branca';
  const stripes = [];
  const n = Math.min(graus, 6);
  for (let i = 0; i < n; i++) {
    stripes.push(
      <div key={i} style={{
        width: 2.6, height: h - 6, background: '#fff', borderRadius: 1,
        boxShadow: '0 0 0 0.5px rgba(0,0,0,0.25)',
      }} />
    );
  }
  return (
    <div style={{
      position: 'relative', width: w, height: h, borderRadius: 3,
      background: c, flexShrink: 0,
      boxShadow: isWhite
        ? 'inset 0 0 0 1px rgba(0,0,0,0.14), 0 1px 2px rgba(0,0,0,0.18)'
        : 'inset 0 -2px 3px rgba(0,0,0,0.28), 0 1px 2px rgba(0,0,0,0.25)',
    }}>
      <div style={{
        position: 'absolute', top: 0, right: 0, height: '100%', width: tipW,
        background: belt === 'preta' ? '#000' : '#161616',
        borderTopRightRadius: 3, borderBottomRightRadius: 3,
        boxShadow: 'inset 1px 0 2px rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 3, padding: '0 4px', boxSizing: 'border-box',
      }}>
        {stripes}
      </div>
    </div>
  );
}

// ── Icon set (stroke, currentColor) ──────────────────────────
const ic = (paths, vb = 24) => ({ size = 24, stroke = 2, style } = {}) => (
  <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} fill="none"
    stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"
    strokeLinejoin="round" style={style}>{paths}</svg>
);

const IconLogout   = ic(<><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/></>);
const IconHome     = ic(<><path d="M3 11l9-8 9 8"/><path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10"/></>);
const IconUsers    = ic(<><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.5a3 3 0 0 1 0 5.5"/><path d="M18 14.2c2 .8 3.4 2.6 3.4 5"/></>);
const IconCalendar = ic(<><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17"/><path d="M8 3v4M16 3v4"/></>);
const IconSparkles = ic(<><path d="M12 3l1.8 4.9L19 9.7l-5.2 1.8L12 16l-1.8-4.5L5 9.7l5.2-1.8L12 3z"/><path d="M18.5 14.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z"/></>);
const IconPlus     = ic(<><path d="M12 5v14M5 12h14"/></>);
const IconFlame    = ic(<><path d="M12 3c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.2.4-2 1-2.8.2 1.3 1 2 1.8 2 .7 0 1.2-.6 1.2-1.5C12 7.5 10.5 6 12 3z"/></>);
const IconChevron  = ic(<><path d="M9 6l6 6-6 6"/></>);
const IconCheck    = ic(<><path d="M5 13l4 4L19 7"/></>);
const IconBack     = ic(<><path d="M15 5l-7 7 7 7"/></>);
const IconChevDown = ic(<><path d="M6 9l6 6 6-6"/></>);
const IconX        = ic(<><path d="M6 6l12 12M18 6L6 18"/></>);
const IconTrash    = ic(<><path d="M4 7h16"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/><path d="M10 11v6M14 11v6"/></>);
const IconMic      = ic(<><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21"/></>);
const IconAlert    = ic(<><path d="M12 3.5L22 20H2L12 3.5z"/><path d="M12 10v4.5"/><path d="M12 17.4h.01"/></>);
// Kimono (gi) jacket
const IconGi       = ic(<><path d="M4.5 4H9l3 3.5L15 4h4.5L21.5 9l-3 1.4V20h-13v-9.6L2.5 9l2-5z"/><path d="M9 4l3 3.5L15 4"/><path d="M5.5 15h13"/></>);
// Fight shorts (NoGi)
const IconShorts   = ic(<><path d="M4 6.5h16v3.5l-1.2 9.5h-5.3L12 14l-1.5 5.5H5.2L4 10V6.5z"/><path d="M4 10h16"/></>);
// Category icons
const IconShield     = ic(<><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z"/></>);
const IconShieldHalf = ic(<><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z"/><path d="M12 3v18"/></>);
const IconLock       = ic(<><rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></>);
const IconArrowDown  = ic(<><path d="M12 4v14"/><path d="M6 13l6 6 6-6"/></>);
const IconTarget     = ic(<><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></>);
const IconBolt       = ic(<><path d="M13 3L5.5 13.5H11L10 21l7.5-10.5H12L13 3z"/></>);
const IconUserShield = ic(<><circle cx="9.5" cy="7.5" r="3"/><path d="M3.5 20c0-3.2 2.7-5.5 6-5.5"/><path d="M17 11.5l3.5 1.4v2.6c0 2.5-1.6 3.9-3.5 4.9-1.9-1-3.5-2.4-3.5-4.9v-2.6L17 11.5z"/></>);
const IconEdit       = ic(<><path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/></>);

Object.assign(window, {
  Belt, BELT_COLORS, BELT_LABEL,
  IconLogout, IconHome, IconUsers, IconCalendar,
  IconSparkles, IconPlus, IconFlame, IconChevron, IconCheck,
  IconBack, IconChevDown, IconX, IconTrash, IconMic, IconAlert,
  IconGi, IconShorts, IconShield, IconShieldHalf, IconLock,
  IconArrowDown, IconTarget, IconBolt, IconUserShield, IconEdit,
});
