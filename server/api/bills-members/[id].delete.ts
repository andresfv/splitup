import { getDb } from '../../utils/db';

/**
 * Elimina una factura de la base de datos.
 */
export default defineEventHandler(async (event) => {
  const id = getIdParam(event);

  try {
    const db = await getDb();

    const result = await db.run('DELETE FROM bill_member WHERE id = ?', [id])

    assertFound(result.changes, 'La factura por participante no existe');

    return { success: true };

  } catch (error) {
    handleDbError(error, 'Error al eliminar la factura por participante');
  }
})
