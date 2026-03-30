import { z } from 'zod';

export const billMemberSchema = z.object({
  billId: z.number(),
  memberId: z.number(),
  amount: z.number(),
  isPaid: z.boolean().default(false)
});