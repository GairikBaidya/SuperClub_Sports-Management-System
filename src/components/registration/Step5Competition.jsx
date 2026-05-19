import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormField from '../common/FormField';
import { step5Schema } from '../../schemas/step5Schema';
import { AGE_GROUPS, SKILL_LEVELS, EVENTS_LIST, suggestAgeGroup } from '../../lib/constants';

export default function Step5Competition({ data, age, onNext, onBack }) {
  const suggestedGroup = suggestAgeGroup(age);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(step5Schema),
    defaultValues: {
      age_group: suggestedGroup,
      skill_level: '',
      events_applied: [],
      ...data,
    },
  });

  const selectedEvents = watch('events_applied') || [];

  // Determine if any selected event requires insurance
  const requiresInsurance = selectedEvents.some((eventId) => {
    const evt = EVENTS_LIST.find((e) => e.id === eventId);
    return evt?.isInsuranceRequired;
  });

  const onSubmit = (values) => {
    onNext({ ...values, _requiresInsurance: requiresInsurance });
  };

  const toggleEvent = (eventId, currentValues, onChange) => {
    if (currentValues.includes(eventId)) {
      onChange(currentValues.filter((id) => id !== eventId));
    } else {
      onChange([...currentValues, eventId]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Competition Details</h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Select your age group, skill level, and events.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <FormField label="Age Group" required error={errors.age_group?.message} hint={`Auto-suggested: ${suggestedGroup}`}>
          <select {...register('age_group')} className={`form-input ${errors.age_group ? 'form-input-error' : ''}`}>
            <option value="">Select age group</option>
            {AGE_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </FormField>

        <FormField label="Skill Level" required error={errors.skill_level?.message}>
          <select {...register('skill_level')} className={`form-input ${errors.skill_level ? 'form-input-error' : ''}`}>
            <option value="">Select level</option>
            {SKILL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </FormField>
      </div>

      {/* Events multi-select */}
      <FormField label="Events / Competitions" required error={errors.events_applied?.message}>
        <Controller
          name="events_applied"
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {EVENTS_LIST.map((event) => {
                const checked = value.includes(event.id);
                return (
                  <label
                    key={event.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                      checked
                        ? 'border-[#E8B84B] bg-[rgba(232,184,75,0.06)]'
                        : 'border-[rgba(255,255,255,0.12)] hover:border-[rgba(232,184,75,0.3)]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleEvent(event.id, value, onChange)}
                      className="w-4 h-4 rounded focus:ring-primary-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight">{event.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{event.sport}</p>
                    </div>
                    {event.isInsuranceRequired && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0" style={{ background: 'rgba(249,115,22,0.12)', color: '#F97316' }}>
                        Insurance req.
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          )}
        />
      </FormField>

      {requiresInsurance && (
        <div className="mt-4 p-3.5 rounded-xl flex gap-3" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
          <span className="flex-shrink-0">⚠️</span>
          <p className="text-sm" style={{ color: '#F97316' }}>
            Insurance is required to participate in one or more selected events. You will be asked to upload insurance details in the next step.
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button type="button" onClick={onBack} className="btn-secondary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button type="submit" className="btn-primary">
          Next: Documents
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}