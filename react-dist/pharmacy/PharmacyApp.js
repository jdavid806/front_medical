// PharmacyApp.tsx
import React, { useEffect, useState } from 'react';
import { usePharmacyInvoices } from "./hooks/usePharmacyInvoices.js";
import { PrimeReactProvider } from 'primereact/api';
import { useMakeRequest } from "../general-request/hooks/useMakeRequest.js";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { MakeRequestForm } from "../general-request/components/MakeRequestForm.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import { PharmacyTable } from "./PharmacyTable.js";
export const PharmacyApp = () => {
  const {
    invoices,
    fetchInvoices,
    loading,
    totalRecords
  } = usePharmacyInvoices();
  const {
    makeRequest
  } = useMakeRequest();
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [first, setFirst] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState(null);
  const [filters, setFilters] = useState({});
  useEffect(() => {
    fetchInvoices({
      per_page: perPage,
      page: currentPage,
      search: search || "",
      ...filters
    });
  }, []);
  const handlePageChange = page => {
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
  const handleSearchChange = _search => {
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
  const requestCancellation = id => {
    setSelectedItemId(id);
    setShowCancellationModal(true);
  };
  const handleMakeRequest = async requestData => {
    try {
      if (selectedItemId) {
        await makeRequest({
          type: "cancellation",
          requestable_id: selectedItemId,
          requestable_type: "pharmacy_invoice",
          notes: requestData.notes || null
        });
        setShowCancellationModal(false);
        refresh();
        SwalManager.success({
          text: "Solicitud de anulación enviada correctamente",
          title: "Éxito"
        });
      } else {
        SwalManager.error({
          text: "No se ha seleccionado una factura",
          title: "Error"
        });
      }
    } catch (error) {
      console.error(error);
      SwalManager.error({
        text: "Error al enviar la solicitud de anulación",
        title: "Error"
      });
    }
  };
  const handleFilter = filters => {
    const newFilters = {};
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: 'self',
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement(PharmacyTable, {
    items: invoices,
    onCancelItem: requestCancellation,
    first: first,
    rows: perPage,
    totalRecords: totalRecords,
    loading: loading,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    onReload: refresh,
    handleFilter: handleFilter
  })), /*#__PURE__*/React.createElement(CustomFormModal, {
    show: showCancellationModal,
    onHide: () => setShowCancellationModal(false),
    formId: "cancellationForm",
    title: "Solicitud de anulaci\xF3n de factura"
  }, /*#__PURE__*/React.createElement(MakeRequestForm, {
    formId: "cancellationForm",
    onHandleSubmit: handleMakeRequest
  })));
};