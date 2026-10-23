import { z } from 'zod';
import { getDb } from '../../utils/db';

const placeUpdateSchema = z.object({
  name: z.string().min(1),
});

/**
* Actualiza un place existente en la base de datos.
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID requerido'
    });
  }

  try {
    const body = await readValidatedBody(event, (data) => placeUpdateSchema.parse(data));

    const db = await getDb();

    await db.run(
      'UPDATE place SET name = ? WHERE id = ?',
      body.name, id
    );

    return { 
      id: id,
      name: body.name,
     };

  } catch (error) {
    console.error('Error al actualizar el comercio:', error);
    throw createError('Error interno del servidor');
  }
});