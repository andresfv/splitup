import { z } from 'zod';

export const placeSchema = z.object({
  name: z.string().min(1),
});