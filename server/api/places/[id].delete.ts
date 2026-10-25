import { getDb } from '../../utils/db';

/**
 * Elimina un place de la base de datos.
 */
export default defineEventHandler(async (event) => {
  const id = getIdParam(event);

  try {
    const db = await getDb();

    const result = await db.run('DELETE FROM place WHERE id = ?', [id]);

    assertFound(result.changes, 'El comercio no existe');

    return { success: true };

  } catch (error) {
    handleDbError(error, 'Error al eliminar el comercio', {
      foreignKey: 'No se puede eliminar el comercio porque tiene facturas asociadas'
    });
  }
});
