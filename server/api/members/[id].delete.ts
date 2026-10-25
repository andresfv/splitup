import { getDb } from '../../utils/db';

/**
 * Elimina un miembro de la base de datos.
 */
export default defineEventHandler(async (event) => {
  const id = getIdParam(event);

  try {
    const db = await getDb();

    const result = await db.run('DELETE FROM member WHERE id = ?', [id])

    assertFound(result.changes, 'El miembro no existe');

    return { success: true };

  } catch (error) {
    handleDbError(error, 'Error al eliminar el miembro', {
      foreignKey: 'No se puede eliminar el miembro porque tiene facturas asociadas'
    });
  }
})
