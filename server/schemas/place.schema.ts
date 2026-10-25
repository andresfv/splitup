import { z } from 'zod';

export const placeSchema = z.object({
  name: z.string({ error: 'El nombre es requerido' })
    .trim()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
});
