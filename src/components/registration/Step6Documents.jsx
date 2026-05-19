import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormField from '../common/FormField';
import UploadZone from '../common/UploadZone';
import { createStep6Schema } from '../../schemas/step6Schema';

const MANDATORY_DOCS = [
  { key: 'passport_photo', label: 'Passport Size Photo', accept: 'image/jpeg,image/png,image/jpg', maxMB: 1, note: 'JPG/PNG only, max 1 MB' },
  { key: 'aadhaar_card',   label: 'Aadhaar Card / ID Proof', accept: 'image/jpeg,image/png,image/jpg,application/pdf', maxMB: 2, note: 'Image or PDF, max 2 MB' },
  { key: 'birth_certificate', label: 'Birth Certificate / DOB Proof', accept: 'image/jpeg,image/png,image/jpg,application/pdf', maxMB: 2, note: 'Image or PDF, max 2 MB' },
  { key: 'school_bonafide', label: 'School Bonafide Certificate', accept: 'image/jpeg,image/png,image/jpg,application/pdf', maxMB: 2, note: 'Image or PDF, max 2 MB' },
];

const OPTIONAL_DOCS = [
  { key: 'achievement_certificate', label: 'Previous Achievement Certificates', accept: 'image/jpeg,image/png,image/jpg,application/pdf', maxMB: 2 },
  { key: 'medical_fitness', label: 'Medical Fitness Certificate', accept: 'image/jpeg,image/png,image/jpg,application/pdf', maxMB: 2 },
];

export default function Step6Documents({ data, files, requiresInsurance, onNext, onBack, toast }) {
  const schema = createStep6Schema(requiresInsurance);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const [docFiles, setDocFiles] = useState(files || {});
  const [docErrors, setDocErrors] = useState({});

  const setFile = (key, file, errMsg) => {
    setDocFiles((prev) => ({ ...prev, [key]: file }));
    setDocErrors((prev) => ({ ...prev, [key]: errMsg }));
  };

  const onSubmit = (values) => {
    // Validate mandatory docs
    const missing = MANDATORY_DOCS.filter((d) => !docFiles[d.key]);
    if (missing.length > 0) {
      const newErrors = {};
      missing.forEach((d) => { newErrors[d.key] = 'This document is required.'; });
      setDocErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }
    // Validate insurance doc if required
    if (requiresInsurance && !docFiles['insurance_document']) {
      setDocErrors((prev) => ({ ...prev, insurance_document: 'Insurance document is required.' }));
      return;
    }
    onNext(values, docFiles);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Document Upload</h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Upload all required documents. Images are auto-compressed.</p>
      </div>

      {/* Mandatory */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-semibold">Mandatory Documents</h3>
        {MANDATORY_DOCS.map((doc) => (
          <FormField key={doc.key} label={doc.label} required error={docErrors[doc.key]} hint={doc.note}>
            <UploadZone
              accept={doc.accept}
              maxSizeMB={doc.maxMB}
              label={`Upload ${doc.label}`}
              file={docFiles[doc.key] || null}
              error={docErrors[doc.key]}
              onFile={(f, err) => setFile(doc.key, f, err)}
            />
          </FormField>
        ))}
      </div>

      {/* Insurance (conditional) */}
      {requiresInsurance && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-4">
          <div className="flex gap-2">
            <span className="flex-shrink-0">⚠️</span>
            <p className="text-sm font-medium text-amber-700">Insurance is required to participate in this competition</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Insurance Provider Name" required error={errors.insurance_provider?.message}>
              <input
                {...register('insurance_provider')}
                className={`form-input ${errors.insurance_provider ? 'form-input-error' : ''}`}
                placeholder="e.g. New India Assurance"
              />
            </FormField>

            <FormField label="Policy Number" required error={errors.policy_number?.message}>
              <input
                {...register('policy_number')}
                className={`form-input ${errors.policy_number ? 'form-input-error' : ''}`}
                placeholder="Policy number"
              />
            </FormField>

            <FormField label="Valid Till (Expiry Date)" required error={errors.valid_till?.message}>
              <input
                {...register('valid_till')}
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className={`form-input ${errors.valid_till ? 'form-input-error' : ''}`}
              />
            </FormField>

            <FormField label="Insurance Document" required error={docErrors.insurance_document}>
              <UploadZone
                accept="application/pdf,image/jpeg,image/png"
                maxSizeMB={2}
                label="Upload Insurance Document"
                file={docFiles.insurance_document || null}
                error={docErrors.insurance_document}
                onFile={(f, err) => setFile('insurance_document', f, err)}
              />
            </FormField>
          </div>
        </div>
      )}

      {/* Optional */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Optional Documents</h3>
        {OPTIONAL_DOCS.map((doc) => (
          <FormField key={doc.key} label={doc.label} error={docErrors[doc.key]}>
            <UploadZone
              accept={doc.accept}
              maxSizeMB={doc.maxMB}
              label={`Upload ${doc.label}`}
              file={docFiles[doc.key] || null}
              onFile={(f, err) => setFile(doc.key, f, err)}
            />
          </FormField>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <button type="button" onClick={onBack} className="btn-secondary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button type="submit" className="btn-primary">
          Next: Declaration
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}