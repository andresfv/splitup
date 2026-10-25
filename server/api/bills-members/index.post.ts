import { getDb } from '../../utils/db';
import { billMemberSchema } from '~~/server/schemas/billMember.schema';

/**
 * Crea una nueva factura por participante en la base de datos.
 */
export default defineEventHandler(async (event) => {
  const body = await validateBody(event, billMemberSchema);

  try {
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
    handleDbError(error, 'Error al crear la factura por participante', {
      foreignKey: 'La factura o el participante no existe',
      unique: 'El participante ya está asociado a esta factura'
    });
  }
});
