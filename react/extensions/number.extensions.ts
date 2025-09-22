// number.extensions.ts
export { };

declare global {
    interface Number {
        /**
         * Formatea el número como moneda
         * @param locale Localización (por defecto: 'es-CO')
         * @param currency Código de moneda (por defecto: 'COP')
         */
        currency(locale?: string, currency?: string): string;

        /**
         * Convierte a número con decimales fijos (evita el problema de toFixed que devuelve string)
         * @param decimalPlaces Número de decimales (por defecto: 2)
         */
        toFixedNumber(decimalPlaces?: number): number;

        /**
         * Formatea el número con separadores de miles
         * @param locale Localización (por defecto: 'es-CO')
         */
        format(locale?: string): string;
    }
}

Number.prototype.currency = function (locale: string = 'es-CO', currency: string = 'COP'): string {
    return this.toLocaleString(locale, {
        style: 'currency',
        currency: currency
    });
};

Number.prototype.toFixedNumber = function (decimalPlaces: number = 2): number {
    return parseFloat(this.toFixed(decimalPlaces));
};

Number.prototype.format = function (locale: string = 'es-CO'): string {
    return this.toLocaleString(locale);
};