import { z } from 'zod';

// Step 2 schema is dynamic (depends on age). We export a factory.
export const createStep2Schema = (isMinor) =>
  z.object({
    father_name: isMinor
      ? z.string().min(2, "Father's name is required for minors")
      : z.string().optional(),
    mother_name: z.string().optional(),
    guardian_name: z.string().optional(),
    guardian_mobile: isMinor
      ? z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit guardian mobile number')
      : z.string().optional().refine(
          (val) => !val || /^[6-9]\d{9}$/.test(val),
          'Enter a valid 10-digit guardian mobile number'
        ),
    guardian_email: z
      .string()
      .optional()
      .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Enter a valid email address'),
  });
