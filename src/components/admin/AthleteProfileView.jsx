import StatusBadge from '../common/StatusBadge';

const DOC_LABELS = {
  passport_photo: 'Passport Photo',
  aadhaar_card: 'Aadhaar Card / ID Proof',
  birth_certificate: 'Birth Certificate',
  school_bonafide: 'School Bonafide',
  noc_club: 'NOC — Club',
  noc_state: 'NOC — State',
  insurance_document: 'Insurance Document',
  achievement_certificate: 'Achievement Certificate',
  medical_fitness: 'Medical Fitness Certificate',
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const Section = ({ title, children }) => (
  <div className="card p-5 mb-4">
    <h3
      className="section-title mb-4 pb-2"
      style={{ borderBottom: '1px solid var(--border-dim)' }}
    >
      {title}
    </h3>
    {children}
  </div>
);

const Row = ({ label, value }) => (
  <div className="flex py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
    <span
      className="w-40 flex-shrink-0 text-xs font-semibold uppercase tracking-wider pt-0.5"
      style={{ color: 'var(--text-muted)', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '2px' }}
    >
      {label}
    </span>
    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{value || '—'}</span>
  </div>
);

export default function AthleteProfileView({ athlete, documents, insurance }) {
  if (!athlete) return null;

  const isImage = (mime) => mime && mime.startsWith('image/');

  return (
    <div>
      {/* Personal */}
      <Section title="Personal Details">
        <Row label="Full Name" value={athlete.full_name} />
        <Row label="Date of Birth" value={formatDate(athlete.date_of_birth)} />
        <Row label="Age" value={athlete.age ? `${athlete.age} years` : null} />
        <Row label="Gender" value={athlete.gender} />
        <Row label="Blood Group" value={athlete.blood_group} />
        <Row label="Mobile" value={athlete.mobile_number} />
        <Row label="Email" value={athlete.email} />
      </Section>

      {/* Guardian */}
      <Section title="Parent / Guardian Details">
        <Row label="Father's Name" value={athlete.father_name} />
        <Row label="Mother's Name" value={athlete.mother_name} />
        <Row label="Guardian Name" value={athlete.guardian_name} />
        <Row label="Guardian Mobile" value={athlete.guardian_mobile} />
        <Row label="Guardian Email" value={athlete.guardian_email} />
      </Section>

      {/* Address */}
      <Section title="Address">
        <Row label="Address" value={athlete.current_address} />
        <Row label="City" value={athlete.city} />
        <Row label="State" value={athlete.state} />
        <Row label="PIN Code" value={athlete.pin_code} />
        <Row label="Country" value={athlete.country} />
      </Section>

      {/* Club & Competition */}
      <Section title="Club & Competition">
        <Row label="Club Name" value={athlete.club_name} />
        <Row label="State Rep." value={athlete.state_representation} />
        <Row label="District" value={athlete.district} />
        <Row label="Age Group" value={athlete.age_group} />
        <Row label="Skill Level" value={athlete.skill_level} />
        <Row label="Events Applied" value={(athlete.events_applied || []).join(', ')} />
      </Section>

      {/* Documents */}
      <Section title="Documents">
        {documents && documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="rounded-xl p-3 flex gap-3 items-start"
                style={{ border: '1px solid var(--border-dim)', background: 'rgba(255,255,255,0.02)' }}
              >
                {/* Thumbnail or PDF icon */}
                {isImage(doc.mime_type) ? (
                  <img
                    src={doc.signed_url || doc.file_url}
                    alt={doc.file_name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    style={{ border: '1px solid var(--border-dim)' }}
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(200,16,46,0.08)', border: '1px solid rgba(200,16,46,0.2)' }}
                  >
                    <svg className="w-6 h-6" fill="#FF4466" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {DOC_LABELS[doc.doc_type] || doc.doc_type}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{doc.file_name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(doc.uploaded_at)}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <StatusBadge status={doc.doc_status} size="xs" />
                    <a
                      href={doc.signed_url || doc.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium"
                      style={{ color: 'var(--gold)' }}
                    >
                      View / Download ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No documents uploaded.</p>
        )}
      </Section>

      {/* Insurance */}
      {insurance && (
        <Section title="Insurance Details">
          <Row label="Provider" value={insurance.provider_name} />
          <Row label="Policy No." value={insurance.policy_number} />
          <Row label="Valid Till" value={formatDate(insurance.valid_till)} />
        </Section>
      )}

      {/* Status */}
      <Section title="Registration Status">
        <div className="flex items-center gap-3">
          <StatusBadge status={athlete.registration_status} size="md" />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Registered on {formatDate(athlete.created_at)}
          </span>
        </div>
      </Section>
    </div>
  );
}
