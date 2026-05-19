import { z } from 'zod';

export const step5Schema = z.object({
  age_group: z.string().min(1, 'Please select an age group'),
  skill_level: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
    errorMap: () => ({ message: 'Please select a skill level' }),
  }),
  events_applied: z.array(z.string()).min(1, 'Please select at least one event'),
});
