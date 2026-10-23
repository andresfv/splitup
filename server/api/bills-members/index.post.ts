import { getDb } from '../../utils/db';
import { billMemberSchema } from '~~/server/schemas/billMember.schema';

/**
 * Crea una nueva factura por participante en la base de datos.
 */
export default defineEventHandler(async (event) => {

  try {

    const body = await readValidatedBody(event, (data) => billMemberSchema.parse(data));
    const db = await getDb();

    const result = await db.run(
      'INSERT INTO bill_member (bill, member, amount, is_paid) VALUES (?, ?, ?, ?)',
      [body.billId, body.memberId, body.amount, body.isPaid ? 1 : 0]
    )

    return {
      id: result.lastID,
      bill: body.billId,
      member: body.memberId,
      amount: body.amount,
      isPaid: body.isPaid
    }
  } catch (error) {
    console.error('Error al crear la factura por participante:', error);
    throw createError('Error al crear la factura por participante');
  }
});
