import { useState } from "react";
import { getUserLogged } from "../../../services/utilidades.js";
import { calculateTotal } from "../admission-billing/utils/helpers.js";
import { admissionService, thirdPartyService } from "../../../services/api/index.js";
export const useAdmissionCreate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const createAdmission = async (formData, appointmentData) => {
    setLoading(true);
    setError(null);
    try {
      const userLogged = getUserLogged();
      const currentDate = new Date().toISOString().split('T')[0];
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      const dueDateString = dueDate.toISOString().split('T')[0];
      const thirdParty = await thirdPartyService.getByExternalIdAndType({
        externalId: formData.patient.id,
        externalType: "client"
      });
      const admissionData = {
        external_id: `${userLogged.external_id}`,
        public_invoice: formData.billing.facturacionConsumidor,
        admission: {
          entity_id: formData.patient.entity_id,
          entity_authorized_amount: formData.billing.authorizedAmount.replace('.', '') || 0,
          authorization_number: formData.billing.facturacionEntidad ? formData.billing.authorizationNumber : "",
          authorization_date: formData.billing.facturacionEntidad && formData.billing.authorizationDate ? formData.billing.authorizationDate.toISOString().split('T')[0] : "",
          appointment_id: appointmentData?.id,
          koneksi_claim_id: null
        },
        invoice: {
          type: formData.billing.facturacionEntidad ? "entity" : "public",
          status: "Pagado",
          subtotal: calculateTotal(formData.products, formData.billing.facturacionEntidad),
          discount: 0,
          taxes: formData.products.reduce((sum, product) => sum + product.price * product.quantity * product.tax / 100, 0),
          total_amount: calculateTotal(formData.products, formData.billing.facturacionEntidad),
          observations: "",
          due_date: dueDateString,
          paid_amount: calculateTotal(formData.products, formData.billing.facturacionEntidad),
          user_id: userLogged.id,
          third_party_id: thirdParty?.id,
          sub_type: formData.billing.facturacionEntidad ? "entity" : "public"
        },
        invoice_detail: formData.products.map(product => ({
          product_id: product.id,
          type_product: "",
          description: product.description,
          quantity: product.quantity,
          unit_price: product.price,
          tax_rate: product.tax,
          discount: product.discount,
          total: product.total
        })),
        payments: formData.payments.map((payment, index) => {
          return {
            method: payment.method,
            amount: payment.amount,
            authorization_number: payment.authorizationNumber,
            notes: payment.notes,
            payment_method_id: payment.id,
            payment_date: currentDate,
            status: "completed"
          };
        })
      };
      const response = await admissionService.createAdmission(admissionData, formData.patient.id);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || "Error al crear la admisión");
      setLoading(false);
      throw err;
    }
  };
  return {
    createAdmission,
    loading,
    error,
    clearError: () => setError(null)
  };
};