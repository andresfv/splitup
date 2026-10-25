import { z } from 'zod';

export const memberSchema = z.object({
  name: z.string({ error: 'El nombre es requerido' })
    .trim()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  active: z.boolean({ error: 'El estado activo debe ser verdadero o falso' })
});
