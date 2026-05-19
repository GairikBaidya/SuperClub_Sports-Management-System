import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormField from '../common/FormField';
import { step3Schema } from '../../schemas/step3Schema';
import { INDIAN_STATES } from '../../lib/constants';

export default function Step3Address({ data, onNext, onBack }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: { country: 'India', ...data },
  });

  const onSubmit = (values) => onNext(values);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Address Details</h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Provide your current residential address.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Current Address" required error={errors.current_address?.message} className="sm:col-span-2">
          <textarea
            {...register('current_address')}
            rows={3}
            className={`form-input resize-none ${errors.current_address ? 'form-input-error' : ''}`}
            placeholder="House/Flat No., Street, Landmark, Area..."
          />
        </FormField>

        <FormField label="City / District" required error={errors.city?.message}>
          <input
            {...register('city')}
            className={`form-input ${errors.city ? 'form-input-error' : ''}`}
            placeholder="City or District"
          />
        </FormField>

        <FormField label="State" required error={errors.state?.message}>
          <select {...register('state')} className={`form-input ${errors.state ? 'form-input-error' : ''}`}>
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormField>

        <FormField label="PIN Code" required error={errors.pin_code?.message} hint="6-digit postal code">
          <input
            {...register('pin_code')}
            maxLength={6}
            className={`form-input ${errors.pin_code ? 'form-input-error' : ''}`}
            placeholder="400001"
          />
        </FormField>

        <FormField label="Country" required error={errors.country?.message}>
          <input
            {...register('country')}
            className={`form-input ${errors.country ? 'form-input-error' : ''}`}
            placeholder="India"
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
          Next: Club Details
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}