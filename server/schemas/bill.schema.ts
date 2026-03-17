import { z } from 'zod';

export const billSchema = z.object({
  placeId: z.number(),
  amount: z.number().positive(),
  isPaid: z.boolean().default(false),
  date: z.coerce.date()
});