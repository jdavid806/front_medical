export const calculateTotal = (products: any[]): number => {
  return products.reduce((sum, product) => sum + (product.price * product.quantity * (1 + (product.tax || 0) / 100)), 0);
};

export const calculatePaid = (payments: any[]): number => {
  return payments.reduce((sum, payment) => sum + payment.amount, 0);
};

export const calculateChange = (total: number, paid: number): number => {
  return Math.max(0, paid - total);
};

export const validatePatientStep = (patientData: any, toast: any): boolean => {
  const requiredFields = [
    'documentNumber', 'nameComplet', 'gender',
    'whatsapp', 'email', 'address'
  ];
  
  const missingFields = requiredFields.filter(field => {
    const value = patientData[field];
    return value === undefined || value === null || value === '';
  });

  if (missingFields.length > 0) {
    toast.current?.show({
      severity: 'error',
      summary: 'Campos requeridos',
      detail: 'Por favor complete todos los campos obligatorios del paciente',
      life: 3000
    });
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(patientData.email)) {
    toast.current?.show({
      severity: 'error',
      summary: 'Email inválido',
      detail: 'Por favor ingrese un email válido',
      life: 3000
    });
    return false;
  }

  if (patientData.facturacionEntidad) {
    const requiredBillingFields = ['entity', 'authorizationNumber'];
    const missingBillingFields = requiredBillingFields.filter(field => {
      const value = patientData.billing?.[field];
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

export const validateProductsStep = (products: any[], toast: any): boolean => {
  if (products.length === 0) {
    toast.current?.show({
      severity: 'error',
      summary: 'Productos requeridos',
      detail: 'Debe agregar al menos un producto',
      life: 3000
    });
    return false;
  }

  const invalidProducts = products.filter(product => {
    return !product.description || !product.price || !product.quantity;
  });

  if (invalidProducts.length > 0) {
    toast.current?.show({
      severity: 'error',
      summary: 'Productos incompletos',
      detail: 'Todos los productos deben tener descripción, precio y cantidad',
      life: 3000
    });
    return false;
  }

  return true;
};

export const validatePaymentStep = (payments: any[], total: number, toast: any): boolean => {
  if (payments.length === 0) {
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