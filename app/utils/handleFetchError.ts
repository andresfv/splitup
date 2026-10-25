import type { NuxtError } from "#app";
import { toast } from 'vue-sonner';

export function handleFetchError(e: unknown) {
    const error = e as NuxtError<{ message?: string }>;
    if (error.status && error.status < 500) {
        toast.error(error.data?.message || error.statusText || 'Ocurrió un error');
    } else {
        showError(error);
    }
}
