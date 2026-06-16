// Início (Visão Geral) — Direção A "Dojo Escuro"
// ScreenA = padrão · ScreenASugestao = card de sugestão IA aberto
function ScreenABase({ ia }) {
  const {
    AScreen, ABottomNav, ATheme, AIconSq, APrimaryBtn,
    Belt, IconLogout, IconSparkles, IconPlus, IconFlame, IconX,
  } = window;

  const Stat = ({ n, label }) => (
    <div style={{ flex: 1, padding: '0 4px' }}>
      <div style={{ fontFamily: ATheme.display, fontSize: 40, lineHeight: 0.95, color: ATheme.ink, letterSpacing: 0.5 }}>{n}</div>
      <div style={{ fontSize: 11.5, color: ATheme.muted, marginTop: 7, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>{label}</div>
    </div>
  );

  const Rank = ({ pos, name, belt, graus, aulas, pct }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, background: ATheme.panel, border: `1px solid ${ATheme.line}`, borderRadius: 18, padding: '13px 15px' }}>
      <div style={{ fontFamily: ATheme.display, fontSize: 23, color: pos === 1 ? ATheme.red : 'rgba(244,241,234,0.3)', width: 18, textAlign: 'center' }}>{pos}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16.5, fontWeight: 700, letterSpacing: -0.2 }}>{name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <Belt belt={belt} graus={graus} w={46} />
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: ATheme.display, fontSize: 18 }}>{pct}<span style={{ fontSize: 12 }}>%</span></div>
        <div style={{ fontSize: 12, color: ATheme.muted, marginTop: 2 }}>{aulas} aulas</div>
      </div>
    </div>
  );

  const UltimaAula = ({ nome, cat, data }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: ATheme.panel, border: `1px solid ${ATheme.line}`, borderRadius: 18, padding: '13px 15px' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: -0.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nome}</div>
        <div style={{ fontSize: 12.5, color: ATheme.muted, marginTop: 3, fontWeight: 600 }}>{cat}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700 }}>{data}</div>
        <span style={{ display: 'inline-block', marginTop: 5, borderRadius: 999, padding: '3px 9px', fontSize: 11.5, fontWeight: 800, background: 'rgba(77,141,255,0.16)', color: '#6FA5FF' }}>Kimono</span>
      </div>
    </div>
  );

  const SectionHead = ({ icon, title, action }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 26, marginBottom: 13 }}>
      {icon}
      <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.2, flex: 1 }}>{title}</span>
      {action}
    </div>
  );

  return (
    <AScreen active="Início">
      {/* header */}
      <div style={{ flexShrink: 0, padding: '60px 22px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: ATheme.red, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(255,76,59,0.45)' }}>
            <div style={{ display: 'flex', gap: 2.2 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 2.4, height: 13, background: '#fff', borderRadius: 1 }} />)}
            </div>
          </div>
          <span style={{ fontFamily: ATheme.display, fontSize: 22, letterSpacing: 0.8 }}>JIU<span style={{ color: ATheme.red }}>NOTES</span></span>
        </div>
        <AIconSq><IconLogout size={19} /></AIconSq>
      </div>

      {/* scroll */}
      <div style={{ flex: 1, overflow: 'auto', padding: '6px 22px 20px' }}>
        <div style={{ color: ATheme.red, fontSize: 12.5, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase' }}>Boa noite, Professor</div>
        <div style={{ fontFamily: ATheme.display, fontSize: 44, lineHeight: 1, marginTop: 6, letterSpacing: 0.5 }}>Visão Geral</div>

        {/* CTA principal */}
        <div style={{ marginTop: 20, borderRadius: 24, padding: 20, position: 'relative', overflow: 'hidden', background: ATheme.redGrad, boxShadow: '0 18px 40px -12px rgba(225,20,42,0.6)' }}>
          <div style={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
          <div style={{ fontSize: 21, fontWeight: 800, color: '#fff', letterSpacing: -0.3, position: 'relative' }}>Cadastrar aula de hoje</div>
          <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.85)', marginTop: 4, position: 'relative' }}>Registre o treino ou peça uma sugestão à IA.</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16, position: 'relative' }}>
            <button style={{ flex: 1, height: 52, borderRadius: 15, border: 'none', background: '#fff', color: '#16181E', fontSize: 15.5, fontWeight: 800, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
              <IconPlus size={19} stroke={2.6} /> Nova aula
            </button>
            <button style={{ flex: 1, height: 52, borderRadius: 15, border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.18)', color: '#fff', fontSize: 14.5, fontWeight: 700, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
              <IconSparkles size={18} /> Sugestão IA
              <span style={{ fontSize: 11, opacity: 0.8, fontWeight: 600 }}>3/3</span>
            </button>
          </div>
        </div>

        {/* Card de Sugestão IA (estado aberto) */}
        {ia && (
          <div style={{ marginTop: 16, background: ATheme.panel, border: `1px solid ${ATheme.line2}`, borderRadius: 22, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: ATheme.red, display: 'flex' }}><IconSparkles size={17} /></span>
              <span style={{ fontSize: 15, fontWeight: 800, flex: 1 }}>Sugestão para hoje</span>
              <span style={{ color: ATheme.muted, display: 'flex' }}><IconX size={16} /></span>
            </div>
            <div style={{ color: ATheme.red, fontSize: 17, fontWeight: 800, marginTop: 12, letterSpacing: -0.2 }}>Raspagens de meia guarda</div>
            <div style={{ color: ATheme.muted, fontSize: 13.5, marginTop: 4, lineHeight: 1.5 }}>Vocês trabalharam meia guarda esta semana — fechar com raspagens consolida o jogo por baixo.</div>
            <div style={{ height: 1, background: ATheme.line, margin: '14px 0 12px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: 13.5 }}>
              <div><b style={{ fontWeight: 700 }}>Aquecimento:</b> <span style={{ color: ATheme.muted }}>quebra de postura e ponte (10 min)</span></div>
              <div><b style={{ fontWeight: 700 }}>Técnica:</b> <span style={{ color: ATheme.muted }}>raspagem de gancho partindo da meia guarda</span></div>
              <div><b style={{ fontWeight: 700 }}>Rolas:</b> <span style={{ color: ATheme.muted }}>rounds de 5 min começando na posição</span></div>
            </div>
            <APrimaryBtn style={{ height: 50, marginTop: 16, fontSize: 15.5 }}>Começar esta aula</APrimaryBtn>
          </div>
        )}

        {/* faixa de estatísticas */}
        <div style={{ marginTop: 16, background: ATheme.panel, border: `1px solid ${ATheme.line}`, borderRadius: 22, padding: '18px 14px', display: 'flex', alignItems: 'stretch' }}>
          <Stat n="2" label="Alunos ativos" />
          <div style={{ width: 1, background: ATheme.line }} />
          <Stat n="3" label="Aulas no mês" />
          <div style={{ width: 1, background: ATheme.line }} />
          <Stat n="3" label="Presenças" />
        </div>

        {/* mais presentes */}
        <SectionHead
          icon={<span style={{ color: ATheme.red, display: 'flex' }}><IconFlame size={20} /></span>}
          title="Mais presentes em junho"
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Rank pos={1} name="Lucas Goulart" belt="branca" graus={4} aulas={2} pct={67} />
          <Rank pos={2} name="João Vitor" belt="azul" graus={1} aulas={1} pct={33} />
        </div>

        {/* últimas aulas */}
        <SectionHead
          title="Últimas aulas"
          action={<span style={{ color: ATheme.red, fontSize: 13.5, fontWeight: 700, whiteSpace: 'nowrap' }}>Ver todas</span>}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <UltimaAula nome="teste teste" cat="Meia Guarda" data="09 de jun." />
          <UltimaAula nome="Mata leão" cat="Costas" data="08 de jun." />
          <UltimaAula nome="Mata leão" cat="Costas" data="08 de jun." />
        </div>
      </div>
    </AScreen>
  );
}

function ScreenA() { return <ScreenABase />; }
function ScreenASugestao() { return <ScreenABase ia />; }
window.ScreenA = ScreenA;
window.ScreenASugestao = ScreenASugestao;
