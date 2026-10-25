import { z } from 'zod';

export const billMemberSchema = z.object({
  billId: z.number({ error: 'La factura es requerida' })
    .int('La factura es inválida')
    .positive('La factura es inválida'),
  memberId: z.number({ error: 'El participante es requerido' })
    .int('El participante es inválido')
    .positive('El participante es inválido'),
  amount: z.number({ error: 'El monto debe ser un número' })
    .nonnegative('El monto no puede ser negativo'),
  isPaid: z.boolean({ error: 'El estado de pago debe ser verdadero o falso' }).default(false)
});
