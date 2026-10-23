import type { NuxtError } from "#app";
import { toast } from 'vue-sonner';

export function handleFetchError(e: unknown) {
    const error = e as NuxtError;
    if (error.status && error.status < 500) {
        toast.error(error.message || 'Ocurrió un error');
    } else {
        showError(error);
    }
}