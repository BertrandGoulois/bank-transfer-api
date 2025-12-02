import { z } from 'zod';

export const depositSchema = z.object({
  accountId: z.number().int().positive(),
  amount: z.number().positive()
});