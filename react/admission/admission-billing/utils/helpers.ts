export const calculateTotal = (products: any[]): number => {
  return products.reduce((sum, product) => sum + (product.price * product.quantity * (1 + (product.tax || 0) / 100)), 0);
};

export const calculatePaid = (payments: any[]): number => {
  return payments.reduce((sum, payment) => sum + payment.amount, 0);
};

export const calculateChange = (total: number, paid: number): number => {
  return Math.max(0, paid - total);
};

export const validatePatientStep = (patientData, toast) => {
  const requiredFields = [
    'documentType', 'documentNumber', 'firstName', 'lastName',
    'birthDate', 'email', 'whatsapp', 'bloodType'
  ];
  
  const missingFields = requiredFields.filter(field => !patientData[field]);
  
  if (missingFields.length > 0) {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Por favor complete todos los campos requeridos del paciente',
      life: 3000
    });
    return false;
  }
  return true;
};

export const validateProductsStep = (products: any[], toast: any): boolean => {
  if (products.length === 0) {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Debe agregar al menos un producto',
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
      summary: 'Error',
      detail: 'Debe agregar al menos un método de pago',
      life: 3000
    });
    return false;
  }

  const paid = calculatePaid(payments);
  if (paid < total) {
    toast.current?.show({
      severity: 'warn',
      summary: 'Advertencia',
      detail: 'El monto pagado es menor al total de la factura',
      life: 3000
    });
  }

  return true;
};