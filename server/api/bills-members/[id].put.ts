import { getDb } from '../../utils/db';
import { billMemberSchema } from '~~/server/schemas/billMember.schema';


/**
* Actualiza una factura por participante existente en la base de datos.
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID requerido'
    });
  }

  try {
    const body = await readValidatedBody(event, (data) => billMemberSchema.parse(data));
    const db = await getDb();

    await db.run(
      'UPDATE bill_member SET bill = ?, member = ?, amount = ?, is_paid = ? WHERE id = ?',
      body.billId, body.memberId, body.amount, body.isPaid ? 1 : 0, id
    );

    return {
      id: id,
      bill: body.billId,
      member: body.memberId,
      amount: body.amount,
      isPaid: body.isPaid
    };

  } catch (error) {
    console.error('Error al actualizar la factura por participante:', error);
    throw createError('Error interno del servidor');
  }
});