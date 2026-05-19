import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStep7Schema } from '../../schemas/step7Schema';
import Modal from '../common/Modal';

export default function Step7Declaration({ data, formData, age, onNext, onBack }) {
  const isMinor = age < 18;
  const schema = createStep7Schema(isMinor);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const [termsOpen, setTermsOpen] = useState(false);
  const onSubmit = (values) => onNext(values);

  const step1 = formData.step1 || {};
  const step2 = formData.step2 || {};
  const step5 = formData.step5 || {};

  const SummaryRow = ({ label, value }) => (
    <div className="flex py-2 last:border-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <span className="text-xs w-36 flex-shrink-0 font-medium uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium">{value || '—'}</span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Declaration & Consent</h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Review your details and confirm your declaration before proceeding.</p>
      </div>

      {/* Summary Card */}
      <div className="card p-4 mb-6">
        <h3 className="text-sm font-semibold mb-3">Registration Summary</h3>
        <SummaryRow label="Full Name" value={step1.full_name} />
        <SummaryRow label="Date of Birth" value={step1.date_of_birth} />
        <SummaryRow label="Email" value={step1.email} />
        <SummaryRow label="Mobile" value={step1.mobile_number} />
        <SummaryRow label="Club" value={formData.step4?.club_name} />
        <SummaryRow label="Age Group" value={step5.age_group} />
        <SummaryRow label="Skill Level" value={step5.skill_level} />
        <SummaryRow label="Events" value={(step5.events_applied || []).join(', ')} />
      </div>

      {/* Checkboxes */}
      <div className="space-y-4">
        {/* Declaration */}
        <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors`} style={{ borderColor: errors.declaration_confirmed ? 'rgba(200,16,46,0.4)' : 'rgba(255,255,255,0.12)' }}>
          <input
            {...register('declaration_confirmed')}
            type="checkbox"
            className="w-4 h-4 rounded focus:ring-primary-500 mt-0.5 flex-shrink-0"
          />
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            I confirm that all the information provided in this registration form is accurate, complete, and true to the best of my knowledge.
          </span>
        </label>
        {errors.declaration_confirmed && (
          <p className="form-error">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {errors.declaration_confirmed.message}
          </p>
        )}

        {/* Terms */}
        <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors`} style={{ borderColor: errors.terms_agreed ? 'rgba(200,16,46,0.4)' : 'rgba(255,255,255,0.12)' }}>
          <input
            {...register('terms_agreed')}
            type="checkbox"
            className="w-4 h-4 rounded focus:ring-primary-500 mt-0.5 flex-shrink-0"
          />
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            I agree to the{' '}
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setTermsOpen(true); }}
              className="font-medium underline" style={{ color: 'var(--gold)' }}
            >
              Terms & Conditions
            </button>{' '}
            of SuperClub.
          </span>
        </label>
        {errors.terms_agreed && (
          <p className="form-error">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {errors.terms_agreed.message}
          </p>
        )}

        {/* Guardian consent (minors) */}
        {isMinor && (
          <>
            <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors`} style={{ borderColor: errors.guardian_consent ? 'rgba(200,16,46,0.4)' : 'rgba(249,115,22,0.25)', background: 'rgba(249,115,22,0.06)' }}>
              <input
                {...register('guardian_consent')}
                type="checkbox"
                className="w-4 h-4 rounded focus:ring-primary-500 mt-0.5 flex-shrink-0"
              />
              <span className="text-sm" style={{ color: '#F97316' }}>
                I (parent/guardian) provide my consent for the above-mentioned minor athlete to participate in this competition and confirm the accuracy of all provided information.
              </span>
            </label>
            {errors.guardian_consent && (
              <p className="form-error">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {errors.guardian_consent.message}
              </p>
            )}
          </>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <button type="button" onClick={onBack} className="btn-secondary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button type="submit" className="btn-primary">
          Next: Payment
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Terms Modal */}
      <Modal isOpen={termsOpen} onClose={() => setTermsOpen(false)} title="Terms & Conditions" size="lg">
        <div className="prose prose-sm max-w-none space-y-4">
          <p className="font-medium">SuperClub Registration Terms & Conditions</p>
          <p>By registering with SuperClub, you agree to the following terms:</p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>All information provided is accurate and complete.</li>
            <li>You consent to the collection and processing of your personal data for sports management purposes.</li>
            <li>Documents submitted must be genuine and unaltered.</li>
            <li>The club reserves the right to reject or revoke registration if any information is found to be false.</li>
            <li>Participation is subject to eligibility criteria as determined by the respective sports body.</li>
            <li>Registration fees (once payment is enabled) are non-refundable unless the event is cancelled.</li>
            <li>Athletes must adhere to the code of conduct set by the club and respective governing bodies.</li>
          </ol>
          <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>Phase 2 will include a full legal terms document. This is a placeholder.</p>
        </div>
      </Modal>
    </form>
  );
}