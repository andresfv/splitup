import { getDb } from '../../utils/db';

/**
* Obtiene la lista de miembros desde la base de datos.
 */
export default defineEventHandler(async () => {
    try {
        
    const db = await getDb();
    const members = await db.all('SELECT * FROM member');
    
    return members.map(member => ({
        id: member.id,
        name: member.name,
        active: Boolean(member.active),
    }));

    } catch (error) {
        console.error('Error al obtener los miembros:', error);
        throw createError('Error al obtener los miembros');
    }
});
