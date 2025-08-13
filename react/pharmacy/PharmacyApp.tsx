import React, { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { PharmacyInvoices } from "./components/PharmacyInvoices";
import { SwalManager } from "../../services/alertManagerImported";
import { cleanJsonObject, formatDate } from "../../services/utilidades";
import { InvoiceService } from "../../services/api/classes/invoiceService";
import { pharmacyInvoicesI } from "./components/PharmacyInvoices";

export const PharmacyApp = () => {
  const [filters, setFilters] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<pharmacyInvoicesI[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 10,
    page: 1,
  });

  useEffect(() => {
    applyFilters(lazyState.page, lazyState.rows);
  }, [lazyState.page, lazyState.rows]);

  const applyFilters = async (page = 1, per_page = 10) => {
    setLoading(true);

    const invoiceService = new InvoiceService();
    const filterInvoiceParams = {
      subType: "pharmacy",
      page,
      per_page,
    };

    try {
      const response = await invoiceService.filterInvoices(
        cleanJsonObject(filterInvoiceParams)
      );
      console.log("response", response);
      setInvoices(
        response.data.map((invoice) => handleToMappedInvoice(invoice))
      );
      setTotalRecords(response.total);
    } catch (error) {
      console.error("Error al obtener facturas:", error);
    } finally {
      setLoading(false);
    }
  };

  function handleToMappedInvoice(response: any): pharmacyInvoicesI {
    return {
      id: response.id,
      invoice: response.invoice_code,
      date: formatDate(response.created_at, true),
      client: response.third_party?.name || "Sin cliente",
      total_amount: parseFloat(response.total_amount),
      remaining_amount: parseFloat(response.remaining_amount),
      paid:
        parseFloat(response.total_amount) -
        parseFloat(response.remaining_amount),
      status: response.status,
    };
  }

  const onPage = (event) => {
    setLazyState({
      ...lazyState,
      first: event.first,
      rows: event.rows,
      page: event.page + 1,
    });
    applyFilters(event.page + 1, event.rows);
  };

  return (
    <>
      <PrimeReactProvider
        value={{
          appendTo: "self",
          zIndex: {
            overlay: 100000,
          },
        }}
      >
        <PharmacyInvoices
          invoices={invoices}
          lazyState={lazyState}
          loading={loading}
          totalRecords={totalRecords}
          onPage={onPage}
        ></PharmacyInvoices>
      </PrimeReactProvider>
    </>
  );
};
