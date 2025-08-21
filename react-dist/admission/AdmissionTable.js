import React, { useState } from "react";
import { useEffect } from "react";
import { formatDate } from "../../services/utilidades.js";
import TableActionsWrapper from "../components/table-actions/TableActionsWrapper.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import { cancelConsultationClaim } from "../../services/koneksiService.js";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { useUsers } from "../users/hooks/useUsers.js";
import { useEntities } from "../entities/hooks/useEntities.js";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { UpdateAdmissionAuthorizationForm } from "./UpdateAdmissionAuthorizationForm.js";
import { CustomModal } from "../components/CustomModal.js";
import { admissionService, patientService, inventoryService } from "../../services/api/index.js";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { AutoComplete } from "primereact/autocomplete";
import { useDebounce } from "primereact/hooks";
import { RequestCancellationTableAction } from "../components/table-actions/RequestCancellationTableAction.js";
import { clinicalRecordStateColors, clinicalRecordStates } from "../../services/commons.js";
import { KoneksiUploadAndVisualizeExamResultsModal } from "./KoneksiUploadAndVisualizeExamResultsModal.js";
import { exportToExcel } from "../accounting/utils/ExportToExcelOptions.js";
import { MultiSelect } from 'primereact/multiselect';
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
        invoiceCode: item?.invoice?.invoice_code,
        invoiceId: item?.invoice?.id,
        products: item?.invoice?.details.map(detail => detail.product.name).join(', ')
      };
    });
    setTableItems(mappedItems);
  }, [items]);
  async function fetchProducts() {
    const response = await inventoryService.getAll();
    setProducts(response.data);
  }
  const columns = [{
    header: "Admisionado el",
    field: "createdAt"
  }, {
    header: "Admisionado por",
    field: "admittedBy"
  }, {
    header: "Paciente",
    field: "patientName"
  }, {
    header: "Número de identificación",
    field: "patientDNI"
  }, {
    header: "Entidad",
    field: "entityName"
  }, {
    header: "Número de autorización",
    field: "authorizationNumber"
  }, {
    header: "Monto autorizado",
    field: "authorizedAmount"
  }, {
    header: "Codigo de factura",
    field: "invoiceCode"
  }, {
    header: "Id",
    field: "invoiceId"
  }, {
    header: "Productos",
    field: "products"
  }, {
    field: "status",
    header: "Estado",
    body: data => {
      const color = clinicalRecordStateColors[data.status] || "secondary";
      const text = clinicalRecordStates[data.status] || "SIN ESTADO";
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        className: `badge badge-phoenix badge-phoenix-${color}`
      }, text));
    }
  }, {
    header: "",
    field: "",
    body: data => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TableActionsWrapper, null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: () => openUpdateAuthorizationModal(data.originalItem.id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-pencil",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Actualizar informaci\xF3n de autorizaci\xF3n")))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: async () => {
        //@ts-ignore
        await generateInvoice(data.originalItem.appointment_id, false);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-receipt",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Imprimir factura")))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: async () => {
        //@ts-ignore
        await generateInvoice(data.originalItem.appointment_id, true);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-receipt",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Descargar factura")))), !data.originalItem.document_minio_id && /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: () => openAttachDocumentModal(data.originalItem.id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-pdf",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Adjuntar documento")))), data.originalItem.document_minio_id && /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: () => seeDocument(data.originalItem.document_minio_id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-pdf",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Ver documento adjunto")))), data.koneksiClaimId && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: () => openUploadAndVisualizeResultsModal(data.id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-medical",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Cargar y visualizar resultados de examenes")))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: () => cancelClaim(data.koneksiClaimId)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-ban",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Anular reclamaci\xF3n"))))), /*#__PURE__*/React.createElement(RequestCancellationTableAction, {
      onTrigger: () => onCancelItem && onCancelItem(data.originalItem.id)
    })))
  }];
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "accordion mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-item"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "accordion-header",
    id: "filters"
  }, /*#__PURE__*/React.createElement("button", {
    className: "accordion-button collapsed",
    type: "button",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#filtersCollapse",
    "aria-expanded": "false",
    "aria-controls": "filtersCollapse"
  }, "Filtrar admisiones")), /*#__PURE__*/React.createElement("div", {
    id: "filtersCollapse",
    className: "accordion-collapse collapse",
    "aria-labelledby": "filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-body"
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
  }))))))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mb-3"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary me-2",
    onClick: () => {
      exportToExcel({
        data: tableItems,
        // Pasamos la factura como un array de un elemento
        fileName: `Admisiones`,
        excludeColumns: ["id"] // Excluimos campos que no queremos mostrar
      });
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-excel me-2"
  }), "Exportar a Excel")), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableItems,
    lazy: true,
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