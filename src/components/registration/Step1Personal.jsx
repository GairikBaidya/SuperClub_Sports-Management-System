import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import FormField from '../common/FormField';
import { step1Schema } from '../../schemas/step1Schema';
import { useDuplicateCheck } from '../../hooks/useDuplicateCheck';
import { GENDERS, BLOOD_GROUPS, calcAge } from '../../lib/constants';

export default function Step1Personal({ data, onNext }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: data || {},
  });

  const { checkMobile, checkEmail, mobileError, emailError } = useDuplicateCheck();
  const dob = watch('date_of_birth');
  const age = calcAge(dob);

  const onSubmit = (values) => {
    if (mobileError || emailError) return;
    onNext({ ...values, _age: age });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Personal Details</h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Enter your personal information as per official documents.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <FormField label="Full Name" required error={errors.full_name?.message} className="sm:col-span-2">
          <input
            {...register('full_name')}
            className={`form-input ${errors.full_name ? 'form-input-error' : ''}`}
            placeholder="As per official documents"
          />
        </FormField>

        {/* DOB */}
        <FormField label="Date of Birth" required error={errors.date_of_birth?.message}>
          <input
            {...register('date_of_birth')}
            type="date"
            className={`form-input ${errors.date_of_birth ? 'form-input-error' : ''}`}
          />
        </FormField>

        {/* Age (read-only) */}
        <FormField label="Age (Auto-calculated)">
          <input
            type="text"
            readOnly
            value={age !== null ? `${age} years` : '—'}
            className="form-input cursor-not-allowed"
          />
        </FormField>

        {/* Gender */}
        <FormField label="Gender" required error={errors.gender?.message}>
          <select {...register('gender')} className={`form-input ${errors.gender ? 'form-input-error' : ''}`}>
            <option value="">Select gender</option>
            {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </FormField>

        {/* Blood Group */}
        <FormField label="Blood Group" required error={errors.blood_group?.message}>
          <select {...register('blood_group')} className={`form-input ${errors.blood_group ? 'form-input-error' : ''}`}>
            <option value="">Select blood group</option>
            {BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </FormField>

        {/* Mobile */}
        <FormField
          label="Mobile Number"
          required
          error={errors.mobile_number?.message || mobileError}
          hint="10-digit Indian mobile number"
        >
          <input
            {...register('mobile_number')}
            type="tel"
            maxLength={10}
            className={`form-input ${errors.mobile_number || mobileError ? 'form-input-error' : ''}`}
            placeholder="9876543210"
            onBlur={(e) => checkMobile(e.target.value)}
          />
        </FormField>

        {/* Email */}
        <FormField label="Email Address" required error={errors.email?.message || emailError}>
          <input
            {...register('email')}
            type="email"
            className={`form-input ${errors.email || emailError ? 'form-input-error' : ''}`}
            placeholder="athlete@example.com"
            onBlur={(e) => checkEmail(e.target.value)}
          />
        </FormField>
      </div>

      <div className="mt-6 flex justify-end">
        <button type="submit" className="btn-primary">
          Next: Guardian Details
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}