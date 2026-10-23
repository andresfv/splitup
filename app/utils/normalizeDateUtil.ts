    /**
     * Normaliza una fecha estableciendo la hora a medianoche (00:00:00.000).
     * Útil para comparar solo la parte de fecha, ignorando hora/minutos/segundos.
     */
    export const normalizeDate = (date: Date): Date => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        return normalized;
    }