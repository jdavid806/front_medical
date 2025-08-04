import React, { useEffect, useState } from "react";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { ResolveRequestForm } from "../general-request/components/ResolveRequestForm.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import { CustomModal } from "../components/CustomModal.js";
import { useAdmissions } from "./hooks/useAdmissions.js";
import { admissionService } from "../../services/api/index.js";
import { formatDate } from "../../services/utilidades.js";
export const AdmissionsPendingCancellation = () => {
  const {
    admissions,
    fetchAdmissions,
    loading,
    totalRecords
  } = useAdmissions();
  const [mappedClinicalRecords, setMappedClinicalRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [first, setFirst] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState(null);
  const [showResolveRequestModal, setShowResolveRequestModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState("");
  useEffect(() => {
    setMappedClinicalRecords(admissions.map(item => {
      const requestedBy = item.latest_pending_cancellation_request?.requested_by;
      const requestedByName = `${requestedBy?.first_name || ''} ${requestedBy?.middle_name || ''} ${requestedBy?.last_name || ''} ${requestedBy?.second_last_name || ''}`.trim();
      return {
        id: item.id,
        admittedBy: `${item.user.first_name || ''} ${item.user.middle_name || ''} ${item.user.last_name || ''} ${item.user.second_last_name || ''}`,
        patientName: `${item.patient.first_name || ''} ${item.patient.middle_name || ''} ${item.patient.last_name || ''} ${item.patient.second_last_name || ''}`,
        reason: item.latest_pending_cancellation_request?.notes || "--",
        requestableId: item.latest_pending_cancellation_request?.requestable_id.toString() || "",
        requestId: item.latest_pending_cancellation_request?.id.toString() || "",
        requestedBy: requestedByName || "--",
        requestedAt: formatDate(item.latest_pending_cancellation_request?.created_at) || "--"
      };
    }));
  }, [admissions]);
  const openResolveRequestModal = requestId => {
    console.log(requestId);
    if (!requestId) {
      SwalManager.error({
        text: "No ha sido posible obtener la solicitud",
        title: "Error"
      });
      return;
    }
    ;
    setSelectedRequestId(requestId);
    setShowResolveRequestModal(true);
  };
  const handlePageChange = page => {
    console.log(page);
    const calculatedPage = Math.floor(page.first / page.rows) + 1;
    setFirst(page.first);
    setPerPage(page.rows);
    setCurrentPage(calculatedPage);
    fetchAdmissions({
      per_page: page.rows,
      page: calculatedPage,
      search: search ?? "",
      hasLatestPendingCancellationRequest: "1"
    });
  };
  const handleSearchChange = _search => {
    console.log(_search);
    setSearch(_search);
    fetchAdmissions({
      per_page: perPage,
      page: currentPage,
      search: _search,
      hasLatestPendingCancellationRequest: "1"
    });
  };
  const refresh = () => fetchAdmissions({
    per_page: perPage,
    page: currentPage,
    search: search ?? "",
    hasLatestPendingCancellationRequest: "1"
  });
  const handleSave = data => {
    console.log(data);
    setShowResolveRequestModal(false);
    refresh();
  };
  const openRequestable = async requestableId => {
    const admission = await admissionService.get(requestableId);
    //@ts-ignore
    generateInvoice(admission.appointment_id);
  };
  const columns = [{
    field: "admittedBy",
    header: "Admitido por"
  }, {
    field: "patientName",
    header: "Paciente"
  }, {
    field: "requestedBy",
    header: "Solicitado por"
  }, {
    field: "requestedAt",
    header: "Solicitado el"
  }, {
    field: "reason",
    header: "Razón de la anulación"
  }, {
    field: "",
    header: "",
    body: rowData => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-link",
      onClick: () => openRequestable(rowData.requestableId)
    }, /*#__PURE__*/React.createElement("i", {
      className: "fs-7 fa-solid fa-eye cursor-pointer",
      title: "Ver historia clinica"
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-link",
      onClick: () => openResolveRequestModal(rowData.requestId)
    }, /*#__PURE__*/React.createElement("i", {
      className: "fs-7 fa-solid fa-file-signature cursor-pointer",
      title: "Resolver solicitud"
    })))
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: mappedClinicalRecords,
    lazy: true,
    first: first,
    rows: perPage,
    totalRecords: totalRecords,
    loading: loading,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    onReload: refresh
  }), /*#__PURE__*/React.createElement(CustomModal, {
    show: showResolveRequestModal,
    onHide: () => setShowResolveRequestModal(false),
    title: "Resolver solicitud"
  }, /*#__PURE__*/React.createElement(ResolveRequestForm, {
    requestId: selectedRequestId,
    onSave: handleSave
  })));
};