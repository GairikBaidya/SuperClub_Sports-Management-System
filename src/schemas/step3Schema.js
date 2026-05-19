import { z } from 'zod';

export const step3Schema = z.object({
  current_address: z.string().min(10, 'Address must be at least 10 characters'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pin_code: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
  country: z.string().min(1, 'Country is required'),
});
