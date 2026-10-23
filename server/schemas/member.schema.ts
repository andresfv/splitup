import { z } from 'zod';

export const memberSchema = z.object({
  name: z.string().min(1),
  active: z.boolean()
});