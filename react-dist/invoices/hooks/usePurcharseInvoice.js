import { useState } from "react";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { invoiceService } from "../../../services/api/index.js";
const mapInvoiceData = response => {
  return response.data.map(item => {
    const attr = item;
    const mappedItem = {
      id: attr.id.toString(),
      numeroFactura: `F-${attr.id.toString().padStart(4, "0")}`,
      proveedor: attr.third_party?.full_name || "Sin cliente",
      fecha: new Date(attr.created_at),
      identificacion: attr.third_party?.id || "",
      monto: parseFloat(attr.total_amount),
      remainingAmount: parseFloat(attr.remaining_amount),
      paid: parseFloat(attr.total_amount) - parseFloat(attr.remaining_amount),
      tipoFactura: "Contado",
      estado: attr.status || "--",
      subtotal: parseFloat(attr.subtotal),
      withholding_tax: parseFloat(attr.withholdings),
      discuount: parseFloat(attr.discount),
      tax: parseFloat(attr.iva),
      notes: attr.notes || [],
      adjustedType: attr?.notes && attr.notes.length ? attr.notes.map(note => {
        note.name = "";
        note.type == "debit" ? note.name = "Débito" : note.name = "Crédito";
        return `${note.name}`;
      }).join(", ") : "Sin ajuste",
      detalles: item?.details.map(d => {
        const tax = Number(d.subtotal) * (Number(d.tax_product) / 100);
        const total = Number(d.subtotal) + tax;
        return {
          id: d.id,
          cantidad: d.quantity,
          precioUnitario: parseFloat(d.unit_price),
          subtotal: parseFloat(d.subtotal),
          productoId: d.product_id,
          productoNombre: d?.product?.name || d?.accounting_account?.account_name,
          discount: d.discount,
          tax: tax,
          total: parseFloat(total.toFixed(2))
        };
      })
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