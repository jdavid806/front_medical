export class AlertManager {
    static defaultOptions = {
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
        showCloseButton: true,
        allowOutsideClick: false
    };

    static success(options = {}) {
        return Swal.fire({
            ...this.defaultOptions,
            title: options.title || '¡Éxito!',
            text: options.text,
            html: options.html,
            icon: 'success',
            timer: options.timer || 2000
        });
    }

    static error(options = {}) {
        return Swal.fire({
            ...this.defaultOptions,
            title: options.title || 'Error',
            text: options.text,
            html: options.html,
            icon: 'error',
            timer: options.timer || null
        });
    }

    static formErrors(errors) {
        const errorsHTML = this.#formatErrorsToHTML(errors);
        return this.error({
            title: 'Errores de validación',
            html: `<div class="text-start">${errorsHTML}</div>`,
            timer: null
        });
    }

    static #formatErrorsToHTML(errors) {
        return Object.entries(errors).map(([field, messages]) => `
                <div class="mb-2">
                    <ul class="mb-0 mt-1 ps-3">
                        ${messages.map(msg => `<li>${msg}</li>`).join('')}
                    </ul>
                </div>
        `).join('');
    }
}

export default AlertManager;