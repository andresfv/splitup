import { z } from 'zod';
import { getDb } from '../../utils/db';

const memberUpdateSchema = z.object({
  name: z.string().min(1),
  active: z.boolean()
});

/**
* Actualiza un miembro existente en la base de datos.
 * 
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
    const body = await readValidatedBody(event, (data) => memberUpdateSchema.parse(data));

    const db = await getDb();

    await db.run(
      'UPDATE member SET name = ?, active = ? WHERE id = ?',
      body.name, body.active ? 1 : 0, id
    );

    return { success: true };

  } catch (error) {
    console.error('Error al actualizar el miembro:', error);
    throw createError('Error al actualizar el miembro');
  }
});
