import { getDb } from '../../utils/db';

/**
 * Elimina un miembro de la base de datos.
 */
export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID requerido'
    });
  }

  try {
    const db = await getDb();

    await db.run('DELETE FROM member WHERE id = ?', [id])

    return { success: true };
    
  } catch (error) {
    console.error('Error al eliminar el miembro:', error);
    throw createError('Error al eliminar el miembro');
  }
})
