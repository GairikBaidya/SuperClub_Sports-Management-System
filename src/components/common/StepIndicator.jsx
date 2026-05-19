import React from 'react';

// Step labels
const STEPS = [
  'Personal',
  'Guardian',
  'Address',
  'Club',
  'Competition',
  'Documents',
  'Declaration',
  'Payment',
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="w-full px-4 py-6">
      {/* Mobile: simple text */}
      <div className="flex items-center justify-between mb-2 sm:hidden">
        <span className="text-sm font-semibold" style={{ color: 'var(--gold)', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '2px', textTransform: 'uppercase' }}>
          Step {currentStep} of {STEPS.length}
        </span>
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{STEPS[currentStep - 1]}</span>
      </div>
      <div className="w-full rounded-full h-1.5 sm:hidden" style={{ background: 'var(--steel)' }}>
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / STEPS.length) * 100}%`, background: 'linear-gradient(90deg, var(--gold), var(--crimson))' }}
        />
      </div>

      {/* Desktop: full step bar */}
      <div className="hidden sm:flex items-center">
        {STEPS.map((label, index) => {
          const step = index + 1;
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;

          return (
            <React.Fragment key={step}>
              {/* Step circle + label */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                    isActive ? 'step-active' : ''
                  }`}
                  style={
                    isCompleted
                      ? { background: 'linear-gradient(135deg, var(--gold), #D4940A)', color: 'var(--night)' }
                      : isActive
                      ? { background: 'linear-gradient(135deg, var(--gold), #D4940A)', color: 'var(--night)', boxShadow: '0 0 20px rgba(232,184,75,0.4)' }
                      : { background: 'var(--surface)', color: 'var(--text-muted)', border: '2px solid var(--steel)' }
                  }
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                <span
                  className="mt-1 text-xs font-medium whitespace-nowrap"
                  style={{
                    color: isActive ? 'var(--gold)' : isCompleted ? 'var(--text-secondary)' : 'var(--text-muted)',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    letterSpacing: '1px',
                  }}
                >
                  {label}
                </span>
              </div>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div className="flex-1 mx-1 mt-[-16px]">
                  <div className="h-0.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--steel)' }}>
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: isCompleted ? '100%' : '0%',
                        background: 'linear-gradient(90deg, var(--gold), var(--crimson))',
                      }}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
