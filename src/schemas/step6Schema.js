import { z } from 'zod';

// Insurance sub-schema (conditional)
export const insuranceSchema = z.object({
  insurance_provider: z.string().min(2, 'Insurance provider name is required'),
  policy_number: z.string().min(4, 'Enter a valid policy number'),
  valid_till: z.string().refine((val) => {
    return val && new Date(val) > new Date();
  }, 'Insurance policy must not be expired'),
});

// Step 6 has no core text fields — files validated imperatively
// Insurance only if isInsuranceRequired
export const createStep6Schema = (requireInsurance) => {
  if (requireInsurance) {
    return insuranceSchema;
  }
  return z.object({});
};
