import { getDb } from '../../utils/db';

/**
* Obtiene la lista de facturas por participante desde la base de datos.
 */
export default defineEventHandler(async () => {
    try {
    const db = await getDb();
    const billMembers = await db.all('SELECT * FROM bill_member');
    
    return billMembers.map(billMember => ({
       id: billMember.id,
       billId: billMember.bill,
       memberId: billMember.member,
       amount: billMember.amount,
       isPaid: Boolean(billMember.is_paid)
    }));

    } catch (error) {
    console.error('Error al obtener las facturas por participante:', error);
    throw createError('Error interno del servidor');
  }
});