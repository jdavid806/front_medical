import { useState } from 'react';
import { InvoiceService } from "../../../services/api/classes/invoiceService.js";
import { cleanJsonObject } from "../../../services/utilidades.js";
export const usePharmacyInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const fetchInvoices = async params => {
    setLoading(true);
    const invoiceService = new InvoiceService();
    try {
      const filterParams = {
        subType: "pharmacy",
        ...params
      };
      const response = await invoiceService.filterInvoices(cleanJsonObject(filterParams));
      setInvoices(response.data.map(invoice => handleToMappedInvoice(invoice)));
      setTotalRecords(response.total);
    } catch (error) {
      console.error("Error al obtener facturas:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const handleToMappedInvoice = response => {
    return {
      id: response.id,
      invoice: response.invoice_code,
      date: formatDate(response.created_at, true),
      client: response.third_party?.name || "Sin cliente",
      total_amount: parseFloat(response.total_amount),
      remaining_amount: parseFloat(response.remaining_amount),
      paid: parseFloat(response.total_amount) - parseFloat(response.remaining_amount),
      status: response.status,
      // Propiedades adicionales para las acciones
      originalItem: response,
      koneksiClaimId: response.koneksi_claim_id || null,
      appointment_id: response.appointment_id || response.id
    };
  };
  const formatDate = (dateString, withTime = false) => {
    // Implementa tu lógica de formateo de fecha aquí
    const date = new Date(dateString);
    if (withTime) {
      return date.toLocaleString();
    }
    return date.toLocaleDateString();
  };
  return {
    invoices,
    fetchInvoices,
    loading,
    totalRecords
  };
};