import { z } from 'zod';
import type { H3Event } from 'h3';

const idSchema = z.coerce.number({ error: 'ID inválido' }).int('ID inválido').positive('ID inválido');

/**
 * Lee y valida el body de la petición con un esquema zod.
 * Si falla, lanza un 400 con el primer mensaje de error y el detalle por campo.
 */
export async function validateBody<T extends z.ZodType>(event: H3Event, schema: T): Promise<z.output<T>> {
  const body = await readBody(event).catch(() => {
    throw createError({
      status: 400,
      statusText: 'Datos inválidos',
      message: 'El cuerpo de la petición no es un JSON válido'
    });
  });
  const result = schema.safeParse(body);

  if (!result.success) {
    throw createError({
      status: 400,
      statusText: 'Datos inválidos',
      message: result.error.issues[0]?.message ?? 'Datos inválidos',
      data: { errors: z.flattenError(result.error).fieldErrors }
    });
  }

  return result.data;
}

/**
 * Obtiene el parámetro `id` de la ruta y valida que sea un entero positivo.
 */
export function getIdParam(event: H3Event): number {
  const result = idSchema.safeParse(getRouterParam(event, 'id'));

  if (!result.success) {
    throw createError({
      status: 400,
      statusText: 'ID inválido',
      message: 'ID inválido'
    });
  }

  return result.data;
}

/**
 * Lanza un 404 si la operación no afectó ninguna fila.
 */
export function assertFound(changes: number | undefined, message: string) {
  if (!changes) {
    throw createError({
      status: 404,
      statusText: message,
      message
    });
  }
}

interface DbErrorMessages {
  foreignKey?: string;
  unique?: string;
}

/**
 * Traduce errores de SQLite a errores HTTP.
 * Relanza errores HTTP ya creados, convierte violaciones de restricciones en 409
 * y el resto en 500 con el mensaje indicado.
 */
export function handleDbError(error: unknown, fallbackMessage: string, messages: DbErrorMessages = {}): never {
  if (isError(error)) throw error;

  const { code, message = '' } = error as { code?: string; message?: string };

  if (code === 'SQLITE_CONSTRAINT') {
    const constraintMessage = message.includes('FOREIGN KEY')
      ? messages.foreignKey
      : message.includes('UNIQUE') ? messages.unique : undefined;

    if (constraintMessage) {
      throw createError({
        status: 409,
        statusText: constraintMessage,
        message: constraintMessage
      });
    }
  }

  console.error(`${fallbackMessage}:`, error);
  throw createError(fallbackMessage);
}
