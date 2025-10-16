import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from 'primereact/multiselect';
import { AutoComplete } from "primereact/autocomplete";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useDebounce } from "primereact/hooks";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { CustomModal } from "../components/CustomModal.js";
import { UpdateAdmissionAuthorizationForm } from "./UpdateAdmissionAuthorizationForm.js";
import { KoneksiUploadAndVisualizeExamResultsModal } from "./KoneksiUploadAndVisualizeExamResultsModal.js";
import { formatDate } from "../../services/utilidades.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import { cancelConsultationClaim } from "../../services/koneksiService.js";
import { admissionService, patientService, inventoryService } from "../../services/api/index.js";
import { exportToExcel } from "../accounting/utils/ExportToExcelOptions.js";
import { useUsers } from "../users/hooks/useUsers.js";
import { useEntities } from "../entities/hooks/useEntities.js";
import { clinicalRecordStateColors, clinicalRecordStates } from "../../services/commons.js";
export const AdmissionTable = ({
  items,
  onReload,
  onPage,
  onSearch,
  first,
  rows,
  lazy,
  loading,
  onCancelItem,
  totalRecords,
  handleFilter
}) => {
  const {
    users
  } = useUsers();
  const {
    entities
  } = useEntities();
  const [tableItems, setTableItems] = useState([]);
  const [selectedAdmittedBy, setSelectedAdmittedBy] = useState(null);
  const [patientSearch, debouncedPatientSearch, setPatientSearch] = useDebounce(null, 500);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedDate, setSelectedDate] = React.useState([new Date(), new Date()]);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState("");
  const [patients, setPatients] = useState([]);
  const [showUpdateAuthorizationModal, setShowUpdateAuthorizationModal] = useState(false);
  const [showUploadAndVisualizeResultsModal, setShowUploadAndVisualizeResultsModal] = useState(false);
  const [showAttachFileModal, setShowAttachFileModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const toast = useRef(null);
  const onFilter = () => {
    const filterValues = {
      selectedAdmittedBy,
      selectedPatient: selectedPatient?.id?.toString() || null,
      selectedEntity,
      selectedDate,
      selectedProduct
    };
    handleFilter && handleFilter(filterValues);
  };
  useEffect(() => {
    onFilter();
    fetchProducts();
  }, []);
  useEffect(() => {
    const mappedItems = items.map(item => {
      return {
        id: item.id,
        createdAt: formatDate(item.created_at),
        admittedBy: `${item.user.first_name || ""} ${item.user.middle_name || ""} ${item.user.last_name || ""} ${item.user.second_last_name || ""}`,
        patientName: `${item.patient.first_name || ""} ${item.patient.middle_name || ""} ${item.patient.last_name || ""} ${item.patient.second_last_name || ""}`,
        entityName: item.entity?.name || "--",
        koneksiClaimId: item.koneksi_claim_id,
        patientDNI: item.patient.document_number || "--",
        authorizationNumber: item.authorization_number || "--",
        authorizedAmount: item.entity_authorized_amount || "0.00",
        originalItem: item,
        status: item.status,
        invoiceCode: item?.invoice?.invoice_code || "",
        invoiceId: item?.invoice?.id || "",
        products: item?.invoice?.details?.map(detail => detail.product.name).join(', ') || ""
      };
    });
    setTableItems(mappedItems);
  }, [items]);
  async function fetchProducts() {
    const response = await inventoryService.getAll();
    setProducts(response.data);
  }
  const TableMenu = ({
    rowData,
    onEdit,
    onDelete
  }) => {
    const menu = useRef(null);
    const handleEdit = () => {
      console.log("Editando admisión con ID:", rowData.id);
      onEdit(rowData.id);
    };
    const handleDelete = () => {
      console.log("Solicitando eliminar admisión con ID:", rowData.id);
      onDelete(rowData);
    };
    const handleUpdateAuthorization = () => {
      openUpdateAuthorizationModal(rowData.originalItem.id);
    };
    const handlePrintInvoice = async () => {
      await generateInvoice(rowData.originalItem.appointment_id, false);
    };
    const handleDownloadInvoice = async () => {
      //@ts-ignore
      await generateInvoice(rowData.originalItem.appointment_id, true);
    };
    const handleAttachDocument = () => {
      openAttachDocumentModal(rowData.originalItem.id);
    };
    const handleViewDocument = () => {
      seeDocument(rowData.originalItem.document_minio_id);
    };
    const handleUploadResults = () => {
      openUploadAndVisualizeResultsModal(rowData.id);
    };
    const handleCancelClaim = () => {
      cancelClaim(rowData.koneksiClaimId);
    };
    const handleCancelAdmission = () => {
      onCancelItem && onCancelItem(rowData.originalItem.id);
    };
    const menuItems = [{
      label: "Actualizar información de autorización",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-pencil me-2"
      }),
      command: handleUpdateAuthorization
    }, {
      label: "Imprimir factura",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-receipt me-2"
      }),
      command: () => handlePrintInvoice()
    }, {
      label: "Descargar factura",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-receipt me-2"
      }),
      command: handleDownloadInvoice
    }, ...(!rowData.originalItem.document_minio_id ? [{
      label: "Adjuntar documento",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-file-pdf me-2"
      }),
      command: handleAttachDocument
    }] : []), ...(rowData.originalItem.document_minio_id ? [{
      label: "Ver documento adjunto",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-file-pdf me-2"
      }),
      command: handleViewDocument
    }] : []), ...(rowData.koneksiClaimId ? [{
      label: "Cargar y visualizar resultados de examenes",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-file-medical me-2"
      }),
      command: handleUploadResults
    }, {
      label: "Anular reclamación",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-ban me-2"
      }),
      command: handleCancelClaim
    }] : []), {
      label: "Solicitar cancelación",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-times me-2"
      }),
      command: handleCancelAdmission
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      className: "p-button-primary flex items-center gap-2",
      onClick: e => menu.current?.toggle(e),
      "aria-controls": `popup_menu_${rowData.id}`,
      "aria-haspopup": true
    }, "Acciones", /*#__PURE__*/React.createElement("i", {
      className: "fas fa-cog ml-2"
    })), /*#__PURE__*/React.createElement(Menu, {
      model: menuItems,
      popup: true,
      ref: menu,
      id: `popup_menu_${rowData.id}`,
      appendTo: document.body,
      style: {
        zIndex: 9999
      }
    }));
  };
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-center",
      style: {
        gap: "0.5rem",
        minWidth: "120px"
      }
    }, /*#__PURE__*/React.createElement(TableMenu, {
      rowData: rowData,
      onEdit: () => openUpdateAuthorizationModal(rowData.originalItem.id),
      onDelete: () => confirmDelete(rowData)
    }));
  };
  const columns = [{
    header: "Admisionado el",
    field: "createdAt",
    sortable: true
  }, {
    header: "Admisionado por",
    field: "admittedBy",
    sortable: true
  }, {
    header: "Paciente",
    field: "patientName",
    sortable: true
  }, {
    header: "Número de identificación",
    field: "patientDNI",
    sortable: true
  }, {
    header: "Entidad",
    field: "entityName",
    sortable: true
  }, {
    header: "Número de autorización",
    field: "authorizationNumber",
    sortable: true
  }, {
    header: "Monto autorizado",
    field: "authorizedAmount",
    sortable: true
  }, {
    header: "Codigo de factura",
    field: "invoiceCode",
    sortable: true
  }, {
    header: "Id",
    field: "invoiceId",
    sortable: true
  }, {
    header: "Productos",
    field: "products",
    sortable: true
  }, {
    field: "status",
    header: "Estado",
    body: data => {
      const color = clinicalRecordStateColors[data.status] || "secondary";
      const text = clinicalRecordStates[data.status] || "SIN ESTADO";
      return /*#__PURE__*/React.createElement("span", {
        className: `badge badge-phoenix badge-phoenix-${color}`
      }, text);
    },
    sortable: true
  }, {
    header: "Acciones",
    field: "actions",
    body: actionBodyTemplate,
    exportable: false
  }];
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [admissionToDelete, setAdmissionToDelete] = useState(null);
  const confirmDelete = admission => {
    setAdmissionToDelete(admission);
    setDeleteDialogVisible(true);
  };
  const deleteAdmission = async () => {
    if (admissionToDelete && onCancelItem) {
      try {
        onCancelItem(admissionToDelete.id);
        SwalManager.success({
          title: "Admisión Cancelada"
        });
        if (onReload) {
          await onReload();
        }
      } catch (error) {
        console.error("Error al cancelar admisión:", error);
        SwalManager.error({
          title: "Error",
          text: "No se pudo cancelar la admisión"
        });
      }
    }
    setDeleteDialogVisible(false);
    setAdmissionToDelete(null);
  };
  const deleteDialogFooter = /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-text",
    onClick: () => setDeleteDialogVisible(false)
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Eliminar",
    icon: "pi pi-check",
    className: "p-button-danger",
    onClick: deleteAdmission
  }));
  const cancelClaim = claimId => {
    SwalManager.confirmCancel(async () => {
      try {
        const response = await cancelConsultationClaim(claimId);
        SwalManager.success({
          title: "Éxito",
          text: "Reclamación anulada con éxito."
        });
      } catch (error) {
        SwalManager.error({
          title: "Error",
          text: "No se pudo anular la reclamación."
        });
      }
    });
  };
  const openUploadAndVisualizeResultsModal = admissionId => {
    setSelectedAdmissionId(admissionId);
    setShowUploadAndVisualizeResultsModal(true);
  };
  const openUpdateAuthorizationModal = admissionId => {
    setSelectedAdmissionId(admissionId);
    setShowUpdateAuthorizationModal(true);
  };
  const openAttachDocumentModal = async admissionId => {
    setSelectedAdmissionId(admissionId);
    setShowAttachFileModal(true);
  };
  const handleUploadDocument = async () => {
    try {
      //@ts-ignore
      const minioId = await guardarDocumentoAdmision("admissionDocumentInput", selectedAdmissionId);
      if (minioId !== undefined) {
        await admissionService.update(selectedAdmissionId, {
          document_minio_id: minioId.toString()
        });
        SwalManager.success({
          text: "Resultados guardados exitosamente"
        });
      } else {
        console.error("No se obtuvo un resultado válido.");
      }
    } catch (error) {
      console.error("Error al guardar el archivo:", error);
    } finally {
      setShowAttachFileModal(false);
      onReload && onReload();
    }
  };
  const seeDocument = async minioId => {
    if (minioId) {
      //@ts-ignore
      const url = await getFileUrl(minioId);
      window.open(url, "_blank");
      return;
    }
    SwalManager.error({
      title: "Error",
      text: "No se pudo visualizar el documento adjunto."
    });
  };
  const searchPatients = async event => {
    const filteredPatients = await patientService.getByFilters({
      per_page: 1000000,
      search: event.query
    });
    setPatients(filteredPatients.data.data.map(patient => ({
      ...patient,
      label: `${patient.first_name} ${patient.last_name}, Tel: ${patient.whatsapp}, Doc: ${patient.document_number}`
    })));
  };
  useEffect(() => {
    onFilter();
  }, [selectedAdmittedBy, selectedPatient, selectedEntity, selectedDate, selectedProduct]);
  return /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Dialog, {
    visible: deleteDialogVisible,
    style: {
      width: "450px"
    },
    header: "Confirmar",
    modal: true,
    footer: deleteDialogFooter,
    onHide: () => setDeleteDialogVisible(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex align-items-center justify-content-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-exclamation-triangle mr-3",
    style: {
      fontSize: "2rem",
      color: "#F8BB86"
    }
  }), admissionToDelete && /*#__PURE__*/React.createElement("span", null, "\xBFEst\xE1s seguro que deseas cancelar la admisi\xF3n del paciente ", /*#__PURE__*/React.createElement("b", null, admissionToDelete.patientName), "?"))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mb-2"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary me-2",
    onClick: () => {
      exportToExcel({
        data: tableItems,
        fileName: `Admisiones`,
        excludeColumns: ["id"]
      });
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-excel me-2"
  }), "Exportar a Excel")), /*#__PURE__*/React.createElement(Accordion, null, /*#__PURE__*/React.createElement(AccordionTab, {
    header: "Filtrar admisiones"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-grow-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "rangoFechasCitas",
    className: "form-label"
  }, "Admisionado entre"), /*#__PURE__*/React.createElement(Calendar, {
    id: "rangoFechasCitas",
    name: "rangoFechaCitas",
    selectionMode: "range",
    dateFormat: "dd/mm/yy",
    value: selectedDate,
    onChange: e => {
      setSelectedDate(e.value);
    },
    className: "w-100",
    placeholder: "Seleccione un rango"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "admittedBy",
    className: "form-label"
  }, "Admisionado por"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "admittedBy",
    options: users,
    optionLabel: "label",
    optionValue: "id",
    filter: true,
    placeholder: "Admisionado por",
    className: "w-100",
    value: selectedAdmittedBy,
    onChange: e => {
      setSelectedAdmittedBy(e.value);
    },
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "patient",
    className: "form-label"
  }, "Paciente"), /*#__PURE__*/React.createElement(AutoComplete, {
    inputId: "patient",
    placeholder: "Buscar un paciente",
    field: "label",
    suggestions: patients,
    completeMethod: searchPatients,
    inputClassName: "w-100",
    className: "w-100",
    appendTo: "self",
    value: patientSearch,
    onChange: e => {
      setPatientSearch(e.value);
    },
    onSelect: e => {
      setSelectedPatient(e.value);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "entity",
    className: "form-label"
  }, "Entidad"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "entity",
    options: entities,
    optionLabel: "label",
    optionValue: "id",
    filter: true,
    placeholder: "Entidad",
    className: "w-100",
    value: selectedEntity,
    onChange: e => {
      setSelectedEntity(e.value);
    },
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "procedure",
    className: "form-label"
  }, "Procedimientos"), /*#__PURE__*/React.createElement(MultiSelect, {
    inputId: "procedure",
    options: products,
    optionLabel: "attributes.name",
    optionValue: "id",
    filter: true,
    placeholder: "Procedimiento",
    className: "w-100",
    value: selectedProduct,
    onChange: e => {
      setSelectedProduct(e.value);
    },
    showClear: true
  }))))))), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableItems,
    lazy: lazy,
    first: first,
    rows: rows,
    totalRecords: totalRecords,
    loading: loading,
    onPage: onPage,
    onSearch: onSearch,
    onReload: onReload
  }))), /*#__PURE__*/React.createElement(CustomFormModal, {
    formId: "updateAdmissionAuthorization",
    title: "Actualizar informaci\xF3n de autorizaci\xF3n",
    show: showUpdateAuthorizationModal,
    onHide: () => setShowUpdateAuthorizationModal(false)
  }, /*#__PURE__*/React.createElement(UpdateAdmissionAuthorizationForm, {
    formId: "updateAdmissionAuthorization",
    admissionId: selectedAdmissionId
  })), /*#__PURE__*/React.createElement(CustomModal, {
    title: "Subir documento adjunto",
    show: showAttachFileModal,
    onHide: () => setShowAttachFileModal(false),
    footerTemplate: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
      type: "file",
      accept: ".pdf",
      id: "admissionDocumentInput"
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-secondary",
      onClick: () => setShowAttachFileModal(false)
    }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-primary",
      onClick: () => {
        handleUploadDocument();
        setShowAttachFileModal(false);
      }
    }, "Confirmar"))
  }, /*#__PURE__*/React.createElement("p", null, "Por favor, seleccione un archivo PDF.")), /*#__PURE__*/React.createElement(CustomModal, {
    title: "Cargar y visualizar resultados de examenes",
    show: showUploadAndVisualizeResultsModal,
    onHide: () => setShowUploadAndVisualizeResultsModal(false)
  }, /*#__PURE__*/React.createElement(KoneksiUploadAndVisualizeExamResultsModal, {
    admissionId: selectedAdmissionId
  })));
};