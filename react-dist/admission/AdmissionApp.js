import React, { useEffect, useState } from 'react';
import { useAdmissions } from "./hooks/useAdmissions.js";
import { PrimeReactProvider } from 'primereact/api';
import { AdmissionTable } from "./AdmissionTable.js";
import { useMakeRequest } from "../general-request/hooks/useMakeRequest.js";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { MakeRequestForm } from "../general-request/components/MakeRequestForm.js";
import { SwalManager } from "../../services/alertManagerImported.js";
export const AdmissionApp = () => {
  const {
    admissions,
    fetchAdmissions,
    loading,
    totalRecords
  } = useAdmissions();
  const {
    makeRequest
  } = useMakeRequest();
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [first, setFirst] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState(null);
  const [filters, setFilters] = useState({
    createdAt: [new Date(), new Date()]?.filter(date => !!date).map(date => date.toISOString().split('T')[0]).join(",")
  });
  const handlePageChange = page => {
    const calculatedPage = Math.floor(page.first / page.rows) + 1;
    setFirst(page.first);
    setPerPage(page.rows);
    setCurrentPage(calculatedPage);
    fetchAdmissions({
      per_page: page.rows,
      page: calculatedPage,
      search: search ?? "",
      ...filters,
      sort: '-createdAt'
    });
  };
  const handleSearchChange = _search => {
    setSearch(_search);
    fetchAdmissions({
      per_page: perPage,
      page: currentPage,
      search: _search,
      ...filters,
      sort: '-createdAt'
    });
  };
  const refresh = () => {
    fetchAdmissions({
      per_page: perPage,
      page: currentPage,
      search: search,
      ...filters,
      sort: '-createdAt'
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
          requestable_type: "admission",
          notes: requestData.notes || null
        });
        setShowCancellationModal(false);
        refresh();
      } else {
        SwalManager.error({
          text: "No se ha seleccionado una admisión",
          title: "Error"
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleFilter = filters => {
    setFilters({
      admittedBy: filters.selectedAdmittedBy,
      patientId: filters.selectedPatient,
      entityId: filters.selectedEntity,
      createdAt: filters.selectedDate?.filter(date => !!date).map(date => date.toISOString().split('T')[0]).join(",")
    });
  };
  useEffect(() => {
    fetchAdmissions({
      per_page: perPage,
      page: currentPage,
      search: search,
      ...filters,
      sort: '-createdAt'
    });
  }, [filters]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: 'self',
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement(AdmissionTable, {
    items: admissions,
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
    title: "Solicitud de anulaci\xF3n"
  }, /*#__PURE__*/React.createElement(MakeRequestForm, {
    formId: "cancellationForm",
    onHandleSubmit: handleMakeRequest
  })));
};