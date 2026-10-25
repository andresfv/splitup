import { getDb } from '../../utils/db';
import { memberSchema } from '~~/server/schemas/member.schema';

/**
 * Crea un nuevo miembro en la base de datos.
 */
export default defineEventHandler(async (event) => {
  const body = await validateBody(event, memberSchema);

  try {
    const db = await getDb();

    const result = await db.run(
      'INSERT INTO member (name, active) VALUES (?, ?)',
      [body.name, body.active ? 1 : 0]
    )

    return {
      id: result.lastID,
      name: body.name,
      active: body.active
    }

  } catch (error) {
    handleDbError(error, 'Error al crear el miembro', {
      unique: 'Ya existe un miembro con ese nombre'
    });
  }
});
