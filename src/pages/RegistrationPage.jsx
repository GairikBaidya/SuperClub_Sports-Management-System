import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import StepIndicator from '../components/common/StepIndicator';
import { useToast, ToastContainer } from '../components/common/Toast';
import { useFormPersistence } from '../hooks/useFormPersistence';
import { calcAge } from '../lib/constants';
import { supabase } from '../lib/supabaseClient';
import { uploadDocument } from '../lib/uploadDocument';

import Step1Personal from '../components/registration/Step1Personal';
import Step2Guardian from '../components/registration/Step2Guardian';
import Step3Address from '../components/registration/Step3Address';
import Step4Club from '../components/registration/Step4Club';
import Step5Competition from '../components/registration/Step5Competition';
import Step6Documents from '../components/registration/Step6Documents';
import Step7Declaration from '../components/registration/Step7Declaration';
import Step8Payment from '../components/registration/Step8Payment';

const TOTAL_STEPS = 8;

export default function RegistrationPage() {
  const navigate = useNavigate();
  const { load, save, clear } = useFormPersistence();
  const { toasts, toast, removeToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Multi-step data stores
  const [formData, setFormData] = useState(() => {
    const saved = load();
    return saved || { step1: {}, step2: {}, step3: {}, step4: {}, step5: {}, step6: {}, step7: {} };
  });
  const [docFiles, setDocFiles] = useState({}); // File objects — not persisted to localStorage

  const age = calcAge(formData.step1?.date_of_birth);

  // Persist whenever formData changes
  useEffect(() => {
    save(formData);
  }, [formData, save]);

  const goTo = (step) => setCurrentStep(step);
  const goNext = () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleStep = (stepKey, data, files) => {
    setFormData((prev) => ({ ...prev, [stepKey]: data }));
    if (files) setDocFiles((prev) => ({ ...prev, ...files }));
    goNext();
  };

  // Final submission
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const s1 = formData.step1 || {};
      const s2 = formData.step2 || {};
      const s3 = formData.step3 || {};
      const s4 = formData.step4 || {};
      const s5 = formData.step5 || {};
      const s6 = formData.step6 || {};
      const s7 = formData.step7 || {};

      // 1. Insert athlete row
      const athleteId = crypto.randomUUID();
      const { error: athleteError } = await supabase
        .from('athletes')
        .insert({
          id: athleteId,
          full_name: s1.full_name,
          date_of_birth: s1.date_of_birth,
          gender: s1.gender,
          blood_group: s1.blood_group,
          mobile_number: s1.mobile_number,
          email: s1.email,
          father_name: s2.father_name || null,
          mother_name: s2.mother_name || null,
          guardian_name: s2.guardian_name || null,
          guardian_mobile: s2.guardian_mobile || null,
          guardian_email: s2.guardian_email || null,
          current_address: s3.current_address,
          city: s3.city,
          state: s3.state,
          pin_code: s3.pin_code,
          country: s3.country || 'India',
          club_name: s4.club_name || null,
          state_representation: s4.state_representation || null,
          district: s4.district || null,
          age_group: s5.age_group || null,
          skill_level: s5.skill_level || null,
          events_applied: s5.events_applied || [],
          declaration_confirmed: s7.declaration_confirmed || false,
          terms_agreed: s7.terms_agreed || false,
          guardian_consent: s7.guardian_consent || null,
          registration_status: 'Submitted',
          form_step_completed: 8,
        });

      if (athleteError) throw athleteError;

      // 2. Upload docs
      const DOC_KEYS = [
        'passport_photo', 'aadhaar_card', 'birth_certificate', 'school_bonafide',
        'noc_club', 'noc_state', 'insurance_document', 'achievement_certificate', 'medical_fitness',
      ];

      for (const key of DOC_KEYS) {
        const file = docFiles[key];
        if (!file) continue;

        toast.info(`Uploading ${key.replace(/_/g, ' ')}...`);
        const { signedUrl, fileName, fileSizeBytes, mimeType, wasCompressed } = await uploadDocument(file, athleteId, key);

        if (wasCompressed) {
          toast.success('✅ Your image has been optimized for faster upload');
        }

        await supabase.from('athlete_documents').insert({
          athlete_id: athleteId,
          doc_type: key,
          file_name: fileName,
          file_url: signedUrl,
          file_size_bytes: fileSizeBytes,
          mime_type: mimeType,
        });
      }

      // 3. Insurance
      if (s5._requiresInsurance && s6.insurance_provider) {
        const insuranceDocId = null; // Could fetch from athlete_documents
        await supabase.from('athlete_insurance').insert({
          athlete_id: athleteId,
          provider_name: s6.insurance_provider,
          policy_number: s6.policy_number,
          valid_till: s6.valid_till,
        });
      }

      // 4. Clear draft
      clear();

      // 5. Navigate to success
      navigate(`/success?id=${athleteId}`);
    } catch (err) {
      console.error('Submission error:', err);
      toast.error(err.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepComponents = {
    1: <Step1Personal data={formData.step1} onNext={(d) => handleStep('step1', d)} />,
    2: <Step2Guardian data={formData.step2} age={age} onNext={(d) => handleStep('step2', d)} onBack={goBack} />,
    3: <Step3Address data={formData.step3} onNext={(d) => handleStep('step3', d)} onBack={goBack} />,
    4: <Step4Club data={formData.step4} files={docFiles} onNext={(d, f) => handleStep('step4', d, f)} onBack={goBack} />,
    5: <Step5Competition data={formData.step5} age={age} onNext={(d) => handleStep('step5', d)} onBack={goBack} />,
    6: <Step6Documents
          data={formData.step6}
          files={docFiles}
          requiresInsurance={formData.step5?._requiresInsurance}
          onNext={(d, f) => handleStep('step6', d, f)}
          onBack={goBack}
          toast={toast}
        />,
    7: <Step7Declaration data={formData.step7} formData={formData} age={age} onNext={(d) => handleStep('step7', d)} onBack={goBack} />,
    8: <Step8Payment onSubmit={handleFinalSubmit} onBack={goBack} isSubmitting={isSubmitting} />,
  };

  return (
    <div className="sc-page">
      <div className="sc-glow-top" />

      {/* Header */}
      <header className="sc-header">
        <Link to="/" className="sc-header-logo">
          <div className="sc-header-icon">SC</div>
          <span className="sc-header-text">Super<span>Club</span></span>
        </Link>
        <span className="sc-header-badge">Athlete Registration</span>
      </header>

      {/* Step indicator */}
      <div className="max-w-3xl mx-auto px-4 pt-6 sc-fade-in">
        <StepIndicator currentStep={currentStep} />
      </div>

      {/* Form card */}
      <div className="max-w-3xl mx-auto px-4 pb-12 sc-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="card p-6 sm:p-8">
          {stepComponents[currentStep]}
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
