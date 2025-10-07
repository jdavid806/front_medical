import React, { useEffect, useState } from "react";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { Dialog } from "primereact/dialog";
import { usePRToast } from "../hooks/usePRToast.js";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { ResolvePrescriptionCancellationRequestForm } from "../general-request/components/ResolvePrescriptionCancellationRequestForm.js";
import { VerifySupervisorForm } from "../users/VerifySupervisorForm.js";
// Datos mockeados
const mockPrescriptions = [{
  id: "1",
  prescriptionNumber: "REC-2024-001",
  patientName: "Juan Pérez García",
  patientId: "P-12345",
  doctorName: "Dra. María Rodríguez López",
  medication: "Paracetamol 500mg",
  dosage: "1 tableta cada 8 horas",
  reason: "Error en la dosificación prescrita",
  requestId: "REQ-001",
  prescriptionId: "PRESC-001",
  requestedBy: "Lic. Ana Martínez",
  requestedAt: "2024-01-15",
  status: "Pendiente"
}, {
  id: "2",
  prescriptionNumber: "REC-2024-002",
  patientName: "Ana García Hernández",
  patientId: "P-12346",
  doctorName: "Dr. Carlos Sánchez Méndez",
  medication: "Amoxicilina 250mg",
  dosage: "1 cápsula cada 12 horas",
  reason: "Paciente presenta alergia al medicamento",
  requestId: "REQ-002",
  prescriptionId: "PRESC-002",
  requestedBy: "Lic. Pedro Ramírez",
  requestedAt: "2024-01-16",
  status: "Pendiente"
}, {
  id: "3",
  prescriptionNumber: "REC-2024-003",
  patientName: "Luis Fernández Castro",
  patientId: "P-12347",
  doctorName: "Dra. Elena Morales Ruiz",
  medication: "Ibuprofeno 400mg",
  dosage: "1 tableta cada 6 horas",
  reason: "Interacción medicamentosa detectada",
  requestId: "REQ-003",
  prescriptionId: "PRESC-003",
  requestedBy: "Lic. Sofía Vargas",
  requestedAt: "2024-01-17",
  status: "Pendiente"
}];
export const PrescriptionCancellationRequests = () => {
  const {
    showErrorToast,
    toast
  } = usePRToast();
  const [prescriptions, setPrescriptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [first, setFirst] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showResolveRequestModal, setShowResolveRequestModal] = useState(false);
  const [showVerifySupervisorModal, setShowVerifySupervisorModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState("");

  // Simular fetching de datos
  const fetchPrescriptions = async params => {
    setLoading(true);

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    let filteredData = [...mockPrescriptions];

    // Aplicar búsqueda si existe
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredData = mockPrescriptions.filter(prescription => prescription.patientName.toLowerCase().includes(searchLower) || prescription.prescriptionNumber.toLowerCase().includes(searchLower) || prescription.doctorName.toLowerCase().includes(searchLower) || prescription.medication.toLowerCase().includes(searchLower));
    }

    // Simular paginación
    const startIndex = (params?.page - 1) * (params?.per_page || 10);
    const endIndex = startIndex + (params?.per_page || 10);
    const paginatedData = filteredData.slice(startIndex, endIndex);
    setPrescriptions(paginatedData);
    setTotalRecords(filteredData.length);
    setLoading(false);
  };
  useEffect(() => {
    fetchPrescriptions({
      per_page: perPage,
      page: currentPage,
      search: search ?? ""
    });
  }, []);
  const handlePageChange = page => {
    const calculatedPage = Math.floor(page.first / page.rows) + 1;
    setFirst(page.first);
    setPerPage(page.rows);
    setCurrentPage(calculatedPage);
    fetchPrescriptions({
      per_page: page.rows,
      page: calculatedPage,
      search: search ?? ""
    });
  };
  const handleSearchChange = _search => {
    setSearch(_search);
    fetchPrescriptions({
      per_page: perPage,
      page: currentPage,
      search: _search
    });
  };
  const refresh = () => fetchPrescriptions({
    per_page: perPage,
    page: currentPage,
    search: search ?? ""
  });
  const handleSave = data => {
    console.log("Solicitud resuelta:", data);
    setShowResolveRequestModal(false);
    refresh();
  };

  // const openPrescription = (prescriptionId: string) => {
  //     // Misma lógica que en la tabla de recetas para imprimir
  //     //@ts-ignore
  //     crearDocumento(prescriptionId, "Impresion", "Receta", "Completa", "Receta Medica");
  // };

  // const openVerifySupervisorModal = (requestId: string, prescriptionId: string) => {
  //     setSelectedRequestId(requestId);
  //     setSelectedPrescriptionId(prescriptionId);
  //     setShowVerifySupervisorModal(true);
  // };

  // const handleVerifySupervisor = (result: boolean) => {
  //     if (!result) {
  //         showErrorToast({
  //             title: "Error de verificación",
  //             message: "No ha sido posible verificar la identidad del supervisor"
  //         });
  //         return;
  //     }
  //     setShowVerifySupervisorModal(false);
  //     setShowResolveRequestModal(true);
  // };

  const columns = [{
    field: "prescriptionNumber",
    header: "Número de Receta"
  }, {
    field: "patientName",
    header: "Paciente"
  }, {
    field: "patientId",
    header: "ID Paciente"
  }, {
    field: "doctorName",
    header: "Médico Prescriptor"
  }, {
    field: "medication",
    header: "Medicamento"
  }, {
    field: "dosage",
    header: "Dosificación"
  }, {
    field: "reason",
    header: "Motivo de Anulación"
  }, {
    field: "requestedBy",
    header: "Solicitado por"
  }, {
    field: "requestedAt",
    header: "Fecha Solicitud"
  }, {
    field: "",
    header: "Acciones",
    body: rowData => /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-link p-0",
      onClick: () => openPrescription(rowData.prescriptionId),
      title: "Ver receta"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fs-7 fa-solid fa-eye cursor-pointer text-primary"
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-link p-0",
      onClick: () => openVerifySupervisorModal(rowData.requestId, rowData.prescriptionId),
      title: "Resolver solicitud de anulaci\xF3n"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fs-7 fa-solid fa-file-signature cursor-pointer text-warning"
    })))
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "card-title mb-4"
  }, "Solicitudes de Anulaci\xF3n de Recetas Pendientes"), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: prescriptions,
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
    header: "Verificar supervisor",
    style: {
      width: '500px'
    }
  }, /*#__PURE__*/React.createElement(VerifySupervisorForm, {
    onVerify: handleVerifySupervisor
  })), /*#__PURE__*/React.createElement(Dialog, {
    visible: showResolveRequestModal,
    onHide: () => setShowResolveRequestModal(false),
    header: "Resolver Solicitud de Anulaci\xF3n",
    style: {
      width: '600px'
    }
  }, /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(ResolvePrescriptionCancellationRequestForm, {
    requestId: selectedRequestId,
    prescriptionId: selectedPrescriptionId,
    onSave: handleSave
  })));
};