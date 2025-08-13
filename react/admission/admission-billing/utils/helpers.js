export const calculateTotal = (products: any[]): number => {
  return products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
};
export const calculatePaid = (payments) => {
  return payments.reduce((sum, method) => sum + method.amount, 0);
};

export const validatePatientStep = (patientData, toast) => {
  const requiredFields = [
    'documentType', 'documentNumber', 'firstName', 'lastName',
    'birthDate', 'email', 'whatsapp', 'bloodType'
  ];
  
  const missingFields = requiredFields.filter(field => !patientData[field]);
  
  if (missingFields.length > 0) {
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Por favor complete todos los campos requeridos del paciente',
      life: 3000
    });
    return false;
  }
  return true;
};

export const validateProductsStep = (products, toast) => {
  if (products.length === 0) {
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Debe seleccionar al menos un producto',
      life: 3000
    });
    return false;
  }
  return true;
};

export const validatePaymentStep = (payments, total, toast) => {
  if (payments.length === 0) {
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Debe agregar al menos un método de pago',
      life: 3000
    });
    return false;
  }

  const paid = calculatePaid(payments);
  if (paid < total) {
    toast.current.show({
      severity: 'warn',
      summary: 'Advertencia',
      detail: `El monto pagado (${paid}) es menor al total (${total})`,
      life: 3000
    });
  }
  
  return true;
};