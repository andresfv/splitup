import { getDb } from '../../utils/db';

/**
* Obtiene la lista de places desde la base de datos.
 */
export default defineEventHandler(async () => {
    try {
    const db = await getDb();
    const places = await db.all('SELECT * FROM place');
    
    return places.map(place => ({
        id: place.id,
        name: place.name,
    }));

    } catch (error) {
    console.error('Error al obtener los comercios:', error);
    throw createError('Error interno del servidor');
  }
});