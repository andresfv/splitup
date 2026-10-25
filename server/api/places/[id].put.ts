import { getDb } from '../../utils/db';
import { placeSchema } from '~~/server/schemas/place.schema';

/**
* Actualiza un place existente en la base de datos.
 */
export default defineEventHandler(async (event) => {
  const id = getIdParam(event);
  const body = await validateBody(event, placeSchema);

  try {
    const db = await getDb();

    const result = await db.run(
      'UPDATE place SET name = ? WHERE id = ?',
      body.name, id
    );

    assertFound(result.changes, 'El comercio no existe');

    return {
      id: id,
      name: body.name,
     };

  } catch (error) {
    handleDbError(error, 'Error al actualizar el comercio', {
      unique: 'Ya existe un comercio con ese nombre'
    });
  }
});
