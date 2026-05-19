import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormField from '../common/FormField';
import UploadZone from '../common/UploadZone';
import { step4Schema } from '../../schemas/step4Schema';

export default function Step4Club({ data, files, onNext, onBack }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(step4Schema),
    defaultValues: data || {},
  });

  const [nocClub, setNocClub] = useState(files?.noc_club || null);
  const [nocState, setNocState] = useState(files?.noc_state || null);

  const onSubmit = (values) => {
    onNext(values, { noc_club: nocClub, noc_state: nocState });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Club / State Representation</h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Provide your club affiliation and upload NOC documents if applicable.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <FormField label="Club Name" error={errors.club_name?.message}>
          <input
            {...register('club_name')}
            className="form-input"
            placeholder="Your sports club name"
          />
        </FormField>

        <FormField label="State Representation" error={errors.state_representation?.message}>
          <input
            {...register('state_representation')}
            className="form-input"
            placeholder="State you represent"
          />
        </FormField>

        <FormField label="District" error={errors.district?.message} className="sm:col-span-2">
          <input
            {...register('district')}
            className="form-input"
            placeholder="District name"
          />
        </FormField>
      </div>

      {/* NOC uploads */}
      <div className="border-t border-gray-100 pt-5">
        <h3 className="text-sm font-semibold mb-4">NOC Documents (Optional)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="NOC — Club">
            <UploadZone
              accept=".pdf"
              maxSizeMB={2}
              label="NOC from Club (PDF)"
              file={nocClub}
              onFile={(f) => setNocClub(f)}
            />
          </FormField>

          <FormField label="NOC — State Association">
            <UploadZone
              accept=".pdf"
              maxSizeMB={2}
              label="NOC from State Association (PDF)"
              file={nocState}
              onFile={(f) => setNocState(f)}
            />
          </FormField>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button type="button" onClick={onBack} className="btn-secondary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button type="submit" className="btn-primary">
          Next: Competition
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}