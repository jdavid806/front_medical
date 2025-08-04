export const useInvoiceCalculator = (productsArray, paymentMethodsArray) => {
  const calculateLineTotal = product => {
    // ... implementación igual a la anterior
  };
  const calculateSubtotal = () => {
    // ... implementación igual a la anterior
  };

  // ... otras funciones de cálculo

  const paymentCoverage = () => {
    const total = calculateTotal();
    const payments = calculateTotalPayments();
    return Math.abs(payments - total) < 0.01;
  };
  return {
    calculateLineTotal,
    calculateSubtotal,
    calculateTotalDiscount,
    calculateTotalTax,
    calculateTotalWithholding,
    calculateTotal,
    calculateTotalPayments,
    paymentCoverage
  };
};