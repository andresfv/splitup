/**
 * Obtiene el último día del mes actual.
 * La hora se normaliza a 23:59:59.999.
 */
export const getLastDayOfCurrentMonth = (): Date => {
    const today = new Date();

    return new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
    );
};