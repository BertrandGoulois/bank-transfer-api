import { z } from 'zod';

export const transferSchema = z.object({
  fromId: z.number().int().positive(),
  toId: z.number().int().positive(),
  amount: z.number().positive()
});