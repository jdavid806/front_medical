import { SwalManager } from "./alertManagerImported";

export class ErrorHandler {
    static generic(error) {
        if (error.data?.errors) {
            SwalManager.formErrors(error.data.errors);
        } else {
            SwalManager.error({
                text: error.data.error || error.message || 'Ocurrió un error inesperado'
            });
        }
    }
}