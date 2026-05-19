export default function SummaryCard({ title, value, icon, color = 'gold', loading }) {
  const colors = {
    gold:   { bg: 'rgba(232,184,75,0.08)',  border: 'rgba(232,184,75,0.2)',  text: 'var(--gold)'     },
    green:  { bg: 'rgba(34,211,160,0.08)',   border: 'rgba(34,211,160,0.2)',  text: '#22D3A0'         },
    amber:  { bg: 'rgba(249,115,22,0.08)',   border: 'rgba(249,115,22,0.2)',  text: '#F97316'         },
    muted:  { bg: 'rgba(255,255,255,0.04)',   border: 'var(--border-dim)',     text: 'var(--text-muted)' },
    blue:   { bg: 'rgba(91,143,255,0.08)',    border: 'rgba(91,143,255,0.2)', text: '#5B8FFF'         },
    purple: { bg: 'rgba(167,139,250,0.08)',   border: 'rgba(167,139,250,0.2)', text: '#A78BFA'        },
  };
  const c = colors[color] || colors.gold;

  return (
    <div className="card p-5 flex items-start gap-4">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: c.bg, border: `1px solid ${c.border}` }}
      >
        <span className="text-xl">{icon}</span>
      </div>
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-0.5"
          style={{ color: 'var(--text-muted)', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '2px' }}
        >
          {title}
        </p>
        {loading ? (
          <div className="h-7 w-12 rounded animate-pulse" style={{ background: 'var(--steel)' }} />
        ) : (
          <p
            className="text-3xl font-bold"
            style={{ color: c.text, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}
          >
            {value ?? '—'}
          </p>
        )}
      </div>
    </div>
  );
}
