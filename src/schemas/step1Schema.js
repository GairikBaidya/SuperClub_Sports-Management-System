import { z } from 'zod';

const today = new Date();
const maxDOB = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
const minDOB = new Date(today.getFullYear() - 80, today.getMonth(), today.getDate());

export const step1Schema = z.object({
  full_name: z
    .string()
    .min(3, 'Full name must contain at least 3 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name must contain only letters and spaces'),
  date_of_birth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((val) => {
      const d = new Date(val);
      return d <= maxDOB && d >= minDOB;
    }, 'Please enter a valid date of birth (age must be between 5 and 80 years)'),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say'], {
    errorMap: () => ({ message: 'Please select a gender' }),
  }),
  blood_group: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'], {
    errorMap: () => ({ message: 'Please select a blood group' }),
  }),
  mobile_number: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address'),
});
