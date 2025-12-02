import { z } from 'zod';

export const withdrawalSchema = z.object({
  accountId: z.number().int().positive(),
  amount: z.number().positive()
});