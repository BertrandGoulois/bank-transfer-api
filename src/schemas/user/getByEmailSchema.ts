import { z } from 'zod';

export const getByEmailSchema = z.object({
  email: z.email()
});