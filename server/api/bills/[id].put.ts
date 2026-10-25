import { billSchema } from '~~/server/schemas/bill.schema';
import { getDb } from '../../utils/db';


/**
* Actualiza un place existente en la base de datos.
 */
export default defineEventHandler(async (event) => {
  const id = getIdParam(event);
  const body = await validateBody(event, billSchema);

  try {
    const db = await getDb();

    const result = await db.run(
      'UPDATE bill SET place = ?, amount = ?, is_paid = ?, date = ? WHERE id = ?',
      body.placeId, body.amount, body.isPaid ? 1 : 0, body.date, id
    );

    assertFound(result.changes, 'La factura no existe');

    return {
      id: id,
      placeId: body.placeId,
      date: body.date,
      amount: body.amount,
      isPaid: body.isPaid
    };

  } catch (error) {
    handleDbError(error, 'Error al actualizar la factura', {
      foreignKey: 'El comercio no existe'
    });
  }
});
