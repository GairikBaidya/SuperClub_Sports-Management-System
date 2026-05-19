import { useState } from 'react';
import { REGISTRATION_FEE } from '../../lib/constants';

export default function Step8Payment({ onSubmit: handleFinalSubmit, onBack, isSubmitting }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Payment</h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Complete your registration by paying the registration fee.</p>
      </div>

      {/* Fee card */}
      <div className="card p-6 mb-6 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <p className="text-sm mb-1">Registration Fee</p>
        <p className="text-4xl font-bold mb-2">₹{REGISTRATION_FEE}</p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Includes all event registrations and processing charges</p>

        <div className="mt-6">
          <button
            type="button"
            disabled
            className="btn-primary w-full opacity-50 cursor-not-allowed relative"
          >
            Proceed to Payment
            <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">Coming Soon</span>
          </button>
          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            Payment Gateway Integration coming in Phase 2
          </p>
        </div>
      </div>

      {/* Submit registration */}
      <div className="card p-5" style={{ background: 'rgba(34,211,160,0.06)', border: '1px solid rgba(34,211,160,0.2)' }}>
        <h3 className="text-sm font-semibold mb-1" style={{ color: '#22D3A0' }}>Submit Registration</h3>
        <p className="text-xs mb-4" style={{ color: 'rgba(34,211,160,0.7)' }}>
          Submit your registration now. Payment can be completed once Phase 2 is launched. Your slot will be reserved.
        </p>
        <button
          type="button"
          onClick={handleFinalSubmit}
          disabled={isSubmitting}
          className="btn-primary w-full"
          style={{ background: 'linear-gradient(135deg, #22D3A0, #059669)' }}
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Submitting Registration...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Submit Registration
            </>
          )}
        </button>
      </div>

      <div className="mt-4 flex justify-start">
        <button type="button" onClick={onBack} className="btn-secondary" disabled={isSubmitting}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>
    </div>
  );
}