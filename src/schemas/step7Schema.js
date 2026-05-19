import { z } from 'zod';

export const createStep7Schema = (isMinor) =>
  z.object({
    declaration_confirmed: z.literal(true, {
      errorMap: () => ({ message: 'You must confirm all details are correct' }),
    }),
    terms_agreed: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the terms and conditions' }),
    }),
    ...(isMinor && {
      guardian_consent: z.literal(true, {
        errorMap: () => ({ message: "Parent/guardian consent is required for athletes under 18" }),
      }),
    }),
  });
