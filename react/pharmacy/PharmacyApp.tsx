// PharmacyApp.tsx
import React, { useEffect, useState } from 'react';
import { usePharmacyInvoices } from './hooks/usePharmacyInvoices';
import { PrimeReactProvider } from 'primereact/api';
import { useMakeRequest } from '../general-request/hooks/useMakeRequest';
import { CustomFormModal } from '../components/CustomFormModal';
import { MakeRequestForm, MakeRequestFormInputs } from '../general-request/components/MakeRequestForm';
import { SwalManager } from '../../services/alertManagerImported';
import { PharmacyTable } from './PharmacyTable';

export const PharmacyApp: React.FC = () => {
  const { invoices, fetchInvoices, loading, totalRecords } = usePharmacyInvoices();
  const { makeRequest } = useMakeRequest();

  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [first, setFirst] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    fetchInvoices({
      per_page: perPage,
      page: currentPage,
      search: search || "",
      ...filters
    });
  }, []);

  const handlePageChange = (page: any) => {
    const calculatedPage = Math.floor(page.first / page.rows) + 1;
    setFirst(page.first);
    setPerPage(page.rows);
    setCurrentPage(calculatedPage);
    fetchInvoices({
      per_page: page.rows,
      page: calculatedPage,
      search: search || "",
      ...filters
    });
  };

  const handleSearchChange = (_search: string) => {
    setSearch(_search);
    fetchInvoices({
      per_page: perPage,
      page: currentPage,
      search: _search,
      ...filters
    });
  };

  const refresh = () => {
    fetchInvoices({
      per_page: perPage,
      page: currentPage,
      search: search || "",
      ...filters
    });
  };

  const requestCancellation = (id: string) => {
    setSelectedItemId(id);
    setShowCancellationModal(true);
  };

  const handleMakeRequest = async (requestData: MakeRequestFormInputs) => {
    try {
      if (selectedItemId) {
        await makeRequest({
          type: "cancellation",
          requestable_id: selectedItemId,
          requestable_type: "pharmacy_invoice",
          notes: requestData.notes || null,
        });
        setShowCancellationModal(false);
        refresh();
        SwalManager.success({
          text: "Solicitud de anulación enviada correctamente",
          title: "Éxito",
        });
      } else {
        SwalManager.error({
          text: "No se ha seleccionado una factura",
          title: "Error",
        });
      }
    } catch (error) {
      console.error(error);
      SwalManager.error({
        text: "Error al enviar la solicitud de anulación",
        title: "Error",
      });
    }
  };

  const handleFilter = (filters: PharmacyTableFilters) => {
    const newFilters: any = {};

    if (filters.selectedClient) {
      newFilters.thirdParty = filters.selectedClient;
    }

    if (filters.selectedStatus) {
      newFilters.status = filters.selectedStatus;
    }

    if (filters.selectedDate?.filter(date => !!date).length === 2) {
      const [startDate, endDate] = filters.selectedDate;
      if (startDate && endDate) {
        newFilters.createdAt = `${startDate.toISOString().split('T')[0]},${endDate.toISOString().split('T')[0]}`;
      }
    }

    setFilters(newFilters);

    fetchInvoices({
      per_page: perPage,
      page: 1,
      search: search || "",
      ...newFilters
    });

    setCurrentPage(1);
    setFirst(0);
  };

  return (
    <>
      <PrimeReactProvider value={{
        appendTo: 'self',
        zIndex: {
          overlay: 100000
        }
      }}>
        <PharmacyTable
          items={invoices}
          onCancelItem={requestCancellation}
          first={first}
          rows={perPage}
          totalRecords={totalRecords}
          loading={loading}
          onPage={handlePageChange}
          onSearch={handleSearchChange}
          onReload={refresh}
          handleFilter={handleFilter}
        />
      </PrimeReactProvider>

      <CustomFormModal
        show={showCancellationModal}
        onHide={() => setShowCancellationModal(false)}
        formId="cancellationForm"
        title="Solicitud de anulación de factura"
      >
        <MakeRequestForm
          formId="cancellationForm"
          onHandleSubmit={handleMakeRequest}
        />
      </CustomFormModal>
    </>
  );
};