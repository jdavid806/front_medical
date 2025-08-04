import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { invoiceService } from "../../../services/api/index.js";
const mapInvoiceData = response => {
  console.log("Response map: ", response);
  return response.data.map(item => {
    const attr = item.attributes;
    const mappedItem = {
      id: attr.id.toString(),
      numeroFactura: `F-${attr.id.toString().padStart(4, '0')}`,
      proveedor: attr.customer?.name || "Sin cliente",
      fecha: new Date(attr.created_at),
      identificacion: attr.customer?.id || "",
      monto: parseFloat(attr.total_amount),
      remainingAmount: parseFloat(attr.remaining_amount),
      paid: parseFloat(attr.total_amount) - parseFloat(attr.remaining_amount),
      tipoFactura: "Contado",
      estado: attr.status || "pending",
      detalles: item.relationships.details.map(d => ({
        id: d.id,
        cantidad: d.attributes.quantity,
        precioUnitario: parseFloat(d.attributes.unit_price),
        subtotal: parseFloat(d.attributes.subtotal),
        productoId: d.attributes.product_id,
        productoNombre: d.attributes.product_name,
        discount: d.attributes.discount
      }))
    };
    return mappedItem;
  });
};
export const useInvoicePurchase = () => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchInvoiceById = async id => {
    setLoading(true);
    try {
      const response = await invoiceService.getPurcharseInvoiceById(id);
      const mapped = mapInvoiceData({
        data: [response.data]
      });
      setInvoice(mapped[0]);
      return mapped[0];
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchAllInvoice = async (params = {}) => {
    setLoading(true);
    try {
      const response = await invoiceService.getAllPurcharseInvoice(params);
      console.log("Response from fetchAllInvoice: ", response);
      if (response?.data) {
        return mapInvoiceData(response);
      }
      return [];
    } catch (err) {
      ErrorHandler.generic(err);
      return [];
    } finally {
      setLoading(false);
    }
  };
  const storeInvoice = async invoiceData => {
    setLoading(true);
    try {
      const response = await invoiceService.storePurcharseInvoice(invoiceData);
      return response;
    } catch (err) {
      ErrorHandler.generic(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return {
    invoice,
    setInvoice,
    fetchInvoiceById,
    storeInvoice,
    loading,
    fetchAllInvoice
  };
};