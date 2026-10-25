import { getDb } from '../../utils/db';
import { billMemberSchema } from '~~/server/schemas/billMember.schema';


/**
* Actualiza una factura por participante existente en la base de datos.
 */
export default defineEventHandler(async (event) => {
  const id = getIdParam(event);
  const body = await validateBody(event, billMemberSchema);

  try {
    const db = await getDb();

    const result = await db.run(
      'UPDATE bill_member SET bill = ?, member = ?, amount = ?, is_paid = ? WHERE id = ?',
      body.billId, body.memberId, body.amount, body.isPaid ? 1 : 0, id
    );

    assertFound(result.changes, 'La factura por participante no existe');

    return {
      id: id,
      billId: body.billId,
      memberId: body.memberId,
      amount: body.amount,
      isPaid: body.isPaid
    };

  } catch (error) {
    handleDbError(error, 'Error al actualizar la factura por participante', {
      foreignKey: 'La factura o el participante no existe',
      unique: 'El participante ya está asociado a esta factura'
    });
  }
});
