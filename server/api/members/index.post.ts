import { getDb } from '../../utils/db';
import { z } from 'zod';

const memberCreateSchema = z.object({
  name: z.string().min(1),
  active: z.boolean()
});

/**
 * Crea un nuevo miembro en la base de datos.
 */
export default defineEventHandler(async (event) => {

  try {

    const body = await readValidatedBody(event, (data) => memberCreateSchema.parse(data));
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
    console.error('Error al crear el miembro:', error);
    throw createError('Error al crear el miembro');
  }
});
