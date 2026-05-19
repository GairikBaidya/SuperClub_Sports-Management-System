const STATUS_CONFIG = {
  Draft:          { bg: 'rgba(255,255,255,0.06)', text: 'var(--text-muted)',    dot: 'var(--text-muted)'  },
  Submitted:      { bg: 'rgba(91,143,255,0.1)',   text: '#5B8FFF',             dot: '#5B8FFF'            },
  'Under Review': { bg: 'rgba(249,115,22,0.1)',   text: '#F97316',             dot: '#F97316'            },
  Approved:       { bg: 'rgba(34,211,160,0.1)',   text: '#22D3A0',             dot: '#22D3A0'            },
  Rejected:       { bg: 'rgba(200,16,46,0.1)',    text: '#FF4466',             dot: '#FF4466'            },
  Pending:        { bg: 'rgba(255,255,255,0.06)', text: 'var(--text-muted)',    dot: 'var(--text-muted)'  },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Draft'];
  const sizeStyles = size === 'sm'
    ? { fontSize: '11px', padding: '2px 10px' }
    : { fontSize: '13px', padding: '4px 14px' };

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full font-semibold"
      style={{
        background: config.bg,
        color: config.text,
        border: `1px solid ${config.bg}`,
        fontFamily: "'Barlow Condensed', sans-serif",
        letterSpacing: '1px',
        textTransform: 'uppercase',
        ...sizeStyles,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: config.dot }}
      />
      {status}
    </span>
  );
}
