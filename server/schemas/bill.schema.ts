import { z } from 'zod';

export const billSchema = z.object({
  placeId: z.number({ error: 'El comercio es requerido' })
    .int('El comercio es inválido')
    .positive('El comercio es inválido'),
  amount: z.number({ error: 'El monto debe ser un número' })
    .positive('El monto debe ser mayor a 0'),
  isPaid: z.boolean({ error: 'El estado de pago debe ser verdadero o falso' }).default(false),
  date: z.coerce.date({ error: 'La fecha es inválida' })
});
