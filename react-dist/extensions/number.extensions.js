// number.extensions.ts
export {};
Number.prototype.currency = function (locale = 'es-CO', currency = 'COP') {
  return this.toLocaleString(locale, {
    style: 'currency',
    currency: currency
  });
};
Number.prototype.toFixedNumber = function (decimalPlaces = 2) {
  return parseFloat(this.toFixed(decimalPlaces));
};
Number.prototype.format = function (locale = 'es-CO') {
  return this.toLocaleString(locale);
};