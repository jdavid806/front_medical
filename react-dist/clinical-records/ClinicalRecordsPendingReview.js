import React, { useEffect, useState } from "react";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { formatDate } from "../../services/utilidades.js";
import { Dialog } from "primereact/dialog";
import { useClinicalRecordsPendingReview } from "./hooks/useClinicalRecordsPendingReview.js";
import { ResolveClinicalRecordReviewRequestForm } from "../general-request/components/ResolveClinicalRecordReviewRequestForm.js";
import { VerifySupervisorForm } from "../users/VerifySupervisorForm.js";
import { usePRToast } from "../hooks/usePRToast.js";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
export const ClinicalRecordsPendingReview = () => {
  const {
    clinicalRecords,
    fetchClinicalRecords,
    loading,
    totalRecords
  } = useClinicalRecordsPendingReview();
  const {
    showErrorToast,
    toast
  } = usePRToast();
  const [mappedClinicalRecords, setMappedClinicalRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [first, setFirst] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState(null);
  const [showResolveRequestModal, setShowResolveRequestModal] = useState(false);
  const [showVerifySupervisorModal, setShowVerifySupervisorModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState("");
  useEffect(() => {
    setMappedClinicalRecords(clinicalRecords.map(item => {
      const requestedBy = item.latest_pending_review_request?.requested_by;
      const requestedByName = `${requestedBy?.first_name || ''} ${requestedBy?.middle_name || ''} ${requestedBy?.last_name || ''} ${requestedBy?.second_last_name || ''}`.trim();
      return {
        id: item.id,
        clinicalRecordName: item.clinical_record_type.name || "--",
        patientName: `${item.patient.first_name || ''} ${item.patient.middle_name || ''} ${item.patient.last_name || ''} ${item.patient.second_last_name || ''}`.trim(),
        doctorName: `${item.created_by_user.first_name || ''} ${item.created_by_user.middle_name || ''} ${item.created_by_user.last_name || ''} ${item.created_by_user.second_last_name || ''}`.trim(),
        reason: item.latest_pending_review_request?.notes || "--",
        requestableId: item.latest_pending_review_request?.requestable_id.toString() || "",
        requestId: item.latest_pending_review_request?.id.toString() || "",
        requestedBy: requestedByName || "--",
        requestedAt: formatDate(item.latest_pending_review_request?.created_at) || "--"
      };
    }));
  }, [clinicalRecords]);
  const handlePageChange = page => {
    console.log(page);
    const calculatedPage = Math.floor(page.first / page.rows) + 1;
    setFirst(page.first);
    setPerPage(page.rows);
    setCurrentPage(calculatedPage);
    fetchClinicalRecords({
      per_page: page.rows,
      page: calculatedPage,
      search: search ?? "",
      hasLatestPendingReviewRequest: "1"
    });
  };
  const handleSearchChange = _search => {
    console.log(_search);
    setSearch(_search);
    fetchClinicalRecords({
      per_page: perPage,
      page: currentPage,
      search: _search,
      hasLatestPendingReviewRequest: "1"
    });
  };
  const refresh = () => fetchClinicalRecords({
    per_page: perPage,
    page: currentPage,
    search: search ?? "",
    hasLatestPendingReviewRequest: "1"
  });
  const handleSave = data => {
    console.log(data);
    setShowResolveRequestModal(false);
    refresh();
  };
  const openRequestable = requestableId => {
    //@ts-ignore
    crearDocumento(requestableId, "Impresion", "Consulta", "Completa", "Historia Clinica");
  };
  const openVerifySupervisorModal = requestId => {
    setSelectedRequestId(requestId);
    setShowVerifySupervisorModal(true);
  };
  const columns = [{
    field: "clinicalRecordName",
    header: "Historia Clinica"
  }, {
    field: "patientName",
    header: "Paciente"
  }, {
    field: "doctorName",
    header: "Doctor(a)"
  }, {
    field: "requestedBy",
    header: "Solicitado por"
  }, {
    field: "requestedAt",
    header: "Solicitado el"
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
      onClick: () => openVerifySupervisorModal(rowData.requestId)
    }, /*#__PURE__*/React.createElement("i", {
      className: "fs-7 fa-solid fa-file-signature cursor-pointer",
      title: "Resolver solicitud"
    })))
  }];
  const handleVerifySupervisor = result => {
    if (!result) {
      showErrorToast({
        title: "Error de verificación",
        message: "No ha sido posible verificar la identidad del supervisor"
      });
      return;
    }
    setShowVerifySupervisorModal(false);
    setShowResolveRequestModal(true);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
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
  }))), /*#__PURE__*/React.createElement(Dialog, {
    visible: showVerifySupervisorModal,
    onHide: () => setShowVerifySupervisorModal(false),
    header: "Verificar supervisor"
  }, /*#__PURE__*/React.createElement(VerifySupervisorForm, {
    onVerify: handleVerifySupervisor
  })), /*#__PURE__*/React.createElement(Dialog, {
    visible: showResolveRequestModal,
    onHide: () => setShowResolveRequestModal(false),
    header: "Resolver solicitud"
  }, /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(ResolveClinicalRecordReviewRequestForm, {
    requestId: selectedRequestId,
    onSave: handleSave
  })));
};