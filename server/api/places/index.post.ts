import { z } from 'zod';
import { getDb } from '../../utils/db';

const placeCreateSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
});

/**
 * Crea un nuevo place en la base de datos.
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, (data) => placeCreateSchema.parse(data));

    const db = await getDb();

    const result = await db.run(
      'INSERT INTO place (name) VALUES (?)',
      body.name
    );

    return { id: result.lastID,
      name: body.name
     }
    
  } catch (error) {
    console.error('Error al crear el comercio:', error);
    throw createError('Error interno del servidor');
  }
});