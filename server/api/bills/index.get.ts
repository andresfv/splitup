import { getDb } from '../../utils/db';

/**
* Obtiene la lista de facturas desde la base de datos.
 */
export default defineEventHandler(async () => {
    try {
        
    const db = await getDb();
    const bills = await db.all(
        'SELECT b.id, b.amount, b.is_paid, b.date, b.place as placeId FROM bills b');
    
    return bills.map(bill => ({
        id: bill.id,
        placeId: bill.placeId,
        amount: bill.amount,
        isPaid: Boolean(bill.is_paid),
        date: new Date(bill.date)
    }));

    } catch (error) {
        console.error('Error al obtener las facturas:', error);
        throw createError('Error al obtener las facturas');
    }
});
