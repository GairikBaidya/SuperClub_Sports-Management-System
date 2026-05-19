import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AthleteProfileView from '../../components/admin/AthleteProfileView';
import StatusBadge from '../../components/common/StatusBadge';
import { supabase } from '../../lib/supabaseClient';

export default function AthleteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [athlete, setAthlete] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [insurance, setInsurance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [athleteRes, docsRes, insRes] = await Promise.all([
          supabase.from('athletes').select('*').eq('id', id).single(),
          supabase.from('athlete_documents').select('*').eq('athlete_id', id),
          supabase.from('athlete_insurance').select('*').eq('athlete_id', id).maybeSingle(),
        ]);
        if (athleteRes.error) throw athleteRes.error;
        
        const docs = docsRes.data || [];
        for (const doc of docs) {
          if (!doc.file_url) continue;
          // file_url now stores "bucket/path/to/file.ext"
          const parts = doc.file_url.split('/');
          const bucket = parts.shift();
          const filePath = parts.join('/');
          
          if (bucket && filePath) {
            const { data } = await supabase.storage.from(bucket).createSignedUrl(filePath, 3600);
            if (data) doc.signed_url = data.signedUrl;
          }
        }

        setAthlete(athleteRes.data);
        setDocuments(docs);
        setInsurance(insRes.data || null);
      } catch (err) {
        setError(err.message || 'Failed to load athlete data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="sc-page">
      {/* Header */}
      <header className="sc-header">
        <Link to="/" className="sc-header-logo">
          <div className="sc-header-icon">SC</div>
          <span className="sc-header-text">Super<span>Club</span></span>
        </Link>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="btn-secondary py-1.5 text-xs flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sc-fade-in">
        {loading ? (
          <div className="space-y-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="card p-5">
                <div className="h-4 rounded w-32 mb-3 animate-pulse" style={{ background: 'var(--steel)' }} />
                <div className="space-y-2">
                  {[1,2,3].map((j) => (
                    <div key={j} className="h-3 rounded animate-pulse" style={{ background: 'var(--steel)', width: `${60 + j * 10}%` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="card p-8 text-center">
            <p className="font-medium" style={{ color: '#FF4466' }}>{error}</p>
            <button onClick={() => navigate('/admin/dashboard')} className="btn-secondary mt-4">
              Back to Dashboard
            </button>
          </div>
        ) : (
          <>
            {/* Athlete header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h1
                  className="text-xl font-bold"
                  style={{ color: 'var(--text-primary)', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '1px' }}
                >
                  {athlete?.full_name}
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {athlete?.email} · {athlete?.mobile_number}
                </p>
              </div>
              {athlete && <StatusBadge status={athlete.registration_status} size="md" />}
            </div>

            <AthleteProfileView athlete={athlete} documents={documents} insurance={insurance} />
          </>
        )}
      </main>
    </div>
  );
}
