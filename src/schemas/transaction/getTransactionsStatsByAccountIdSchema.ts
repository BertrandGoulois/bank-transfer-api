import { z } from 'zod';

export const getTransactionsStatsByAccountIdSchema = z.object({
  accountId: z.string().regex(/^\d+$/, 'accountId must be a number').transform(Number)
});