import { z } from 'zod';

export const getByIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'id must be a number').transform(Number)
});