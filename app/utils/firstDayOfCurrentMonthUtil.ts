/**
 * Obtiene el primer día del mes actual.
 * La hora se normaliza a 00:00:00.000.
 */
export const getFirstDayOfCurrentMonth = (): Date => {
    const today = new Date();

    return new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
        0,
        0,
        0,
        0
    );
};