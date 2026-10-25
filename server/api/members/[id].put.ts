import { getDb } from '../../utils/db';
import { memberSchema } from '~~/server/schemas/member.schema';

/**
* Actualiza un miembro existente en la base de datos.
 *
 */
export default defineEventHandler(async (event) => {
  const id = getIdParam(event);
  const body = await validateBody(event, memberSchema);

  try {
    const db = await getDb();

    const result = await db.run(
      'UPDATE member SET name = ?, active = ? WHERE id = ?',
      body.name, body.active ? 1 : 0, id
    );

    assertFound(result.changes, 'El miembro no existe');

    return { success: true };

  } catch (error) {
    handleDbError(error, 'Error al actualizar el miembro', {
      unique: 'Ya existe un miembro con ese nombre'
    });
  }
});
