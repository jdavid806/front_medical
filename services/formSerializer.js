export class FormSerializer {
    static #defaultConfig = {
        checkboxAsBoolean: true,
        numberFields: true,
        dateFields: true,
        customMappings: {} // { [selector]: (element) => value }
    };

    static serialize(formElement, config = {}) {
        const mergedConfig = { ...this.#defaultConfig, ...config };
        const elements = formElement.elements;
        const result = {};

        for (const element of elements) {
            if (this.#shouldSkipElement(element)) continue;

            const key = this.#getElementKey(element);
            const value = this.#processElement(element, mergedConfig);

            if (key) result[key] = value;
        }

        return this.#applyCustomMappings(result, formElement, mergedConfig);
    }

    static #shouldSkipElement(element) {
        return element.disabled ||
            (element.tagName === 'BUTTON' && element.type === 'submit') ||
            element.matches('[data-skip-serialization]');
    }

    static #getElementKey(element) {
        return element.dataset.serializationKey ||
            element.name ||
            element.id ||
            element.closest('[data-serialization-key]')?.dataset.serializationKey;
    }

    static #processElement(element, config) {
        // Custom mapping tiene prioridad
        if (config.customMappings[this.#getElementKey(element)]) {
            return config.customMappings[this.#getElementKey(element)](element);
        }

        switch (element.type) {
            case 'checkbox':
                return config.checkboxAsBoolean ? element.checked : element.value;
            case 'radio':
                return element.checked ? element.value : undefined;
            case 'select-multiple':
                return Array.from(element.selectedOptions).map(opt => opt.value);
            default:
                return this.#autoConvertValue(element.value, element, config);
        }
    }

    static #autoConvertValue(value, element, config) {
        if (config.numberFields && element.type === 'number') {
            return Number(value);
        }

        if (config.dateFields && (element.type === 'date' || element.type === 'datetime-local')) {
            return new Date(value);
        }

        if (element.type === 'time') {
            const [h, m, s = '00'] = value.split(':'); // Incluimos segundos
            const pad = num => num.toString().padStart(2, '0'); // Función para padding
            return `${pad(h)}:${pad(m)}:${pad(s)}`; // Formato hh:mm:ss
        }

        return value;
    }

    static #applyCustomMappings(data, formElement, config) {
        return Object.entries(config.customMappings).reduce((acc, [selector, handler]) => {
            const element = formElement.querySelector(selector);
            if (element) {
                const originalKey = this.#getElementKey(element);
                if (originalKey && acc[originalKey] !== undefined) {
                    acc[originalKey] = handler(element);
                }
            }
            return acc;
        }, { ...data });
    }
}

export default FormSerializer