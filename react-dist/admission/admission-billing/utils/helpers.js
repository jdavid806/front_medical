export const calculateTotal = (products = [], facturacionEntidad) => {
  const priceField = facturacionEntidad ? 'copayment' : 'price';
  const productsArray = Array.isArray(products) ? products : Object.values(products || {});
  return productsArray.reduce((sum, product) => {
    const price = Number(product?.[priceField]) || 0;
    const quantity = Number(product?.quantity) || 0;
    const tax = Number(product?.tax) || 0;
    return sum + price * quantity * (1 + tax / 100);
  }, 0);
};
export const calculatePaid = (payments = []) => {
  const paymentsArray = Array.isArray(payments) ? payments : Object.values(payments);
  return paymentsArray.reduce((sum, payment) => {
    const amount = Number(payment?.amount) || 0;
    return sum + amount;
  }, 0);
};
export const calculateChange = (total, paid) => {
  return Math.max(0, paid - total);
};
export const validatePatientStep = (patientData, toast) => {
  if (!patientData.facturacionEntidad && !patientData.facturacionConsumidor) {
    toast.current?.show({
      severity: 'error',
      summary: 'Facturación incompleta',
      detail: 'Debe seleccionar una opción de facturación',
      life: 3000
    });
    return false;
  }
  if (patientData.facturacionEntidad) {
    const requiredBillingFields = ['entity', 'authorizationNumber'];
    const missingBillingFields = requiredBillingFields.filter(field => {
      const value = patientData?.[field];
      return value === undefined || value === null || value === '';
    });
    if (missingBillingFields.length > 0) {
      toast.current?.show({
        severity: 'error',
        summary: 'Facturación incompleta',
        detail: 'Debe completar todos los campos de facturación por entidad',
        life: 3000
      });
      return false;
    }
  }
  return true;
};
export const validateProductsStep = (products, toast) => {
  const productsArray = Array.isArray(products) ? products : Object.values(products || {});
  const validProducts = productsArray.filter(p => p !== null && p !== undefined);
  if (validProducts.length === 0) {
    toast.current?.show({
      severity: 'error',
      summary: 'Productos requeridos',
      detail: 'Debe agregar al menos un producto válido',
      life: 3000
    });
    return false;
  }
  const invalidProducts = validProducts.filter(product => {
    return !product?.description || product?.price == null || product?.quantity == null;
  });
  if (invalidProducts.length > 0) {
    toast.current?.show({
      severity: 'error',
      summary: 'Productos incompletos',
      detail: `Hay ${invalidProducts.length} productos sin descripción, precio o cantidad`,
      life: 3000
    });
    return false;
  }
  return true;
};
export const validatePaymentStep = (payments, total, toast) => {
  if (payments.length === 0 && total > 0) {
    toast.current?.show({
      severity: 'error',
      summary: 'Pagos requeridos',
      detail: 'Debe agregar al menos un método de pago',
      life: 3000
    });
    return false;
  }
  const paid = calculatePaid(payments);
  if (paid < total) {
    toast.current?.show({
      severity: 'error',
      summary: 'Pago insuficiente',
      detail: 'El monto pagado debe ser igual o mayor al total',
      life: 3000
    });
    return false;
  }
  const invalidPayments = payments.filter(payment => {
    return !payment.method || !payment.amount;
  });
  if (invalidPayments.length > 0) {
    toast.current?.show({
      severity: 'error',
      summary: 'Pagos incompletos',
      detail: 'Todos los pagos deben tener método y monto',
      life: 3000
    });
    return false;
  }
  return true;
};