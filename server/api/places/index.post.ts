import { getDb } from '../../utils/db';
import { placeSchema } from '~~/server/schemas/place.schema';

/**
 * Crea un nuevo place en la base de datos.
 */
export default defineEventHandler(async (event) => {
  const body = await validateBody(event, placeSchema);

  try {
    const db = await getDb();

    const result = await db.run(
      'INSERT INTO place (name) VALUES (?)',
      body.name
    );

    return { id: result.lastID,
      name: body.name
     }

  } catch (error) {
    handleDbError(error, 'Error al crear el comercio', {
      unique: 'Ya existe un comercio con ese nombre'
    });
  }
});
