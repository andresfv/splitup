import { billSchema } from '~~/server/schemas/bill.schema';
import { getDb } from '../../utils/db';

/**
 * Crea una nueva factura en la base de datos.
 */
export default defineEventHandler(async (event) => {

  try {

    const body = await readValidatedBody(event, (data) => billSchema.parse(data));
    const db = await getDb();

    const result = await db.run(
      'INSERT INTO bill (place, amount, is_paid, date) VALUES (?, ?, ?, ?)',
      [body.placeId, body.amount, body.isPaid ? 1 : 0, body.date]
    )

    return {
      id: result.lastID,
      place: body.placeId,
      amount: body.amount,
      isPaid: body.isPaid,
      date: body.date
    }
  } catch (error) {
    console.error('Error al crear la factura:', error);
    throw createError('Error al crear la factura');
  }
});
