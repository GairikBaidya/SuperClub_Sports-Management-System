import { z } from 'zod';

export const step4Schema = z.object({
  club_name: z.string().optional(),
  state_representation: z.string().optional(),
  district: z.string().optional(),
  // Files are handled outside Zod (File objects can't be serialized)
});
