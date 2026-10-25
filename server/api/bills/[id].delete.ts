import { getDb } from '../../utils/db';

/**
 * Elimina una factura de la base de datos.
 */
export default defineEventHandler(async (event) => {
  const id = getIdParam(event);

  try {
    const db = await getDb();

    const result = await db.run('DELETE FROM bill WHERE id = ?', [id])

    assertFound(result.changes, 'La factura no existe');

    return { success: true };

  } catch (error) {
    handleDbError(error, 'Error al eliminar la factura', {
      foreignKey: 'No se puede eliminar la factura porque tiene participantes asociados'
    });
  }
})
