import { useSearchParams, Link } from 'react-router-dom';

function shortId(uuid) {
  if (!uuid) return 'N/A';
  return uuid.split('-')[0].toUpperCase();
}

export default function SuccessPage() {
  const [params] = useSearchParams();
  const fullId = params.get('id') || '';
  const shortRef = shortId(fullId);

  return (
    <div className="sc-page flex items-center justify-center p-4">
      <div className="sc-glow-top" />
      <div className="max-w-md w-full sc-fade-in">
        {/* Success card */}
        <div className="card p-8 text-center">
          {/* Animated checkmark */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(34,211,160,0.12)', border: '2px solid rgba(34,211,160,0.3)' }}
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="#22D3A0" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px', color: 'var(--text-primary)' }}
          >
            Registration Submitted!
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Your athlete registration has been successfully submitted. You will be contacted once your documents are reviewed.
          </p>

          {/* Reference ID */}
          <div
            className="rounded-xl p-4 mb-6"
            style={{ background: 'var(--steel)', border: '1px solid var(--border-subtle)' }}
          >
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '3px' }}>
              Registration Reference
            </p>
            <p
              className="text-3xl font-bold tracking-widest"
              style={{
                background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: '4px',
              }}
            >
              {shortRef}
            </p>
            <p className="text-xs mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>{fullId}</p>
          </div>

          {/* Next steps */}
          <div className="text-left space-y-3 mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '3px' }}>
              What happens next?
            </p>
            {[
              'Our team will review your submitted documents.',
              'You will receive a confirmation call or email.',
              'Payment gateway will be available in Phase 2.',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'var(--gold-dim)', color: 'var(--gold)', fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {i + 1}
                </span>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{step}</p>
              </div>
            ))}
          </div>

          <Link to="/" className="btn-primary w-full justify-center">
            Register Another Athlete
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--gold)' }}>SuperClub</span> · Sports Club Management Platform
        </p>
      </div>
    </div>
  );
}
