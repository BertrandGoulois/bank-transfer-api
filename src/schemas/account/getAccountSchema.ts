import { z } from 'zod';

export const getAccountSchema = z.object({
  accountId: z.string().regex(/^\d+$/).transform(Number)
});