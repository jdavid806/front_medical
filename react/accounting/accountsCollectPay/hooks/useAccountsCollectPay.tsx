import { useState, useEffect } from 'react';
import { invoiceService } from '../../../../services/api/index.js';
import { InvoiceData, UseAccountsCollectPayParams } from '../../accountsCollectPay/interfaces/accountColletcPayInterface';



export const useAccountsCollectPay = (filters: UseAccountsCollectPayParams) => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [totalRecords, setTotalRecords] = useState<any>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await invoiceService.filterInvoice(filters); // Usamos el payload completo
        setInvoices(response.data);
        setTotalRecords(response.total);
      } catch (err: any) {
        setError(err?.message || 'Error al obtener las facturas');
      } finally {
        setLoading(false);
      }
    };

    if (filters) {
      fetchInvoices();
    }
  }, [JSON.stringify(filters)]); // Dependencia basada en los cambios del objeto `filters`

  return { invoices, totalRecords, loading, error };
};