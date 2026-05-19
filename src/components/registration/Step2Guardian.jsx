import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormField from '../common/FormField';
import { createStep2Schema } from '../../schemas/step2Schema';

export default function Step2Guardian({ data, age, onNext, onBack }) {
  const isMinor = age !== null && age < 18;
  const schema = createStep2Schema(isMinor);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const onSubmit = (values) => onNext(values);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Parent / Guardian Details</h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Provide parent or guardian information.</p>
      </div>

      {isMinor && (
        <div className="mb-5 p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex gap-3">
          <span className="text-blue-500 flex-shrink-0 mt-0.5">ℹ️</span>
          <p className="text-sm text-blue-700">
            Since the athlete is a minor, parent/guardian details are mandatory.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Father's Name" required={isMinor} error={errors.father_name?.message}>
          <input
            {...register('father_name')}
            className={`form-input ${errors.father_name ? 'form-input-error' : ''}`}
            placeholder="Father's full name"
          />
        </FormField>

        <FormField label="Mother's Name" error={errors.mother_name?.message}>
          <input
            {...register('mother_name')}
            className="form-input"
            placeholder="Mother's full name"
          />
        </FormField>

        <FormField label="Guardian Name" error={errors.guardian_name?.message}>
          <input
            {...register('guardian_name')}
            className="form-input"
            placeholder="Guardian's full name (if applicable)"
          />
        </FormField>

        <FormField
          label="Guardian Mobile"
          required={isMinor}
          error={errors.guardian_mobile?.message}
          hint="10-digit Indian mobile number"
        >
          <input
            {...register('guardian_mobile')}
            type="tel"
            maxLength={10}
            className={`form-input ${errors.guardian_mobile ? 'form-input-error' : ''}`}
            placeholder="9876543210"
          />
        </FormField>

        <FormField label="Guardian Email" error={errors.guardian_email?.message} className="sm:col-span-2">
          <input
            {...register('guardian_email')}
            type="email"
            className={`form-input ${errors.guardian_email ? 'form-input-error' : ''}`}
            placeholder="guardian@example.com"
          />
        </FormField>
      </div>

      <div className="mt-6 flex justify-between">
        <button type="button" onClick={onBack} className="btn-secondary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button type="submit" className="btn-primary">
          Next: Address
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}