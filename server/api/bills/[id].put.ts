import { billSchema } from '~~/server/schemas/bill.schema';
import { getDb } from '../../utils/db';


/**
* Actualiza un place existente en la base de datos.
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
    const body = await readValidatedBody(event, (data) => billSchema.parse(data));

    const db = await getDb();

    await db.run(
      'UPDATE bills SET place = ?, amount = ?, is_paid = ?, date = ? WHERE id = ?',
      body.placeId, body.amount, body.isPaid ? 1 : 0, body.date, id
    );

    return {
      id: id,
      placeId: body.placeId,
      date: body.date,
      amount: body.amount,
      isPaid: body.isPaid
    };

  } catch (error) {
    console.error('Error al actualizar la factura:', error);
    throw createError('Error interno del servidor');
  }
});