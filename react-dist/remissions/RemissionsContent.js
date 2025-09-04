import { PrimeReactProvider } from "primereact/api";
import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { userService, remissionService } from "../../services/api/index.js";
import { Card } from "primereact/card";
import { generatePDFFromHTML } from "../../funciones/funcionesJS/exportPDF.js";
import { useCompany } from "../hooks/useCompany.js";
const getCurrentMonthRange = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  return [firstDay, now];
};
export const RemissionsContent = () => {
  const [dates, setDates] = useState(getCurrentMonthRange());
  const [mappedServiceDoctors, setMappedServiceDoctors] = useState([]);
  const [selectedService, setSelectedService] = useState(0);
  const [dataRemissions, SetdataRemissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    company,
    setCompany,
    fetchCompany
  } = useCompany();
  useEffect(() => {
    fetchDoctors();
    handeFilter();
  }, []);
  const fetchDoctors = async () => {
    const data = await userService.getAll();
    const mappedData = data.map(item => {
      return {
        value: item.id,
        label: item.first_name + " " + item.last_name
      };
    });
    setMappedServiceDoctors(mappedData);
  };
  const handeFilter = async () => {
    setLoading(true);
    try {
      const patientId = new URLSearchParams(window.location.search).get("patient_id");
      const startDate = formatDateRange(dates)[0];
      const endDate = formatDateRange(dates)[1];
      const data = await remissionService.getRemissionsByParams(startDate, endDate, selectedService, patientId);
      SetdataRemissions(data);
    } finally {
      setLoading(false);
    }
  };
  const formatDateRange = dateRange => {
    if (!Array.isArray(dateRange) || dateRange.length !== 2) return "";
    const formatDate = date => date.toISOString().split("T")[0];
    const [fromDate, toDate] = dateRange;
    return [formatDate(fromDate), formatDate(toDate)];
  };
  const formatDate = isoDate => {
    if (!isoDate) return "";
    return new Date(isoDate).toLocaleDateString();
  };
  const statusBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        width: "10px",
        height: "10px",
        backgroundColor: rowData.is_active ? "green" : "red",
        borderRadius: "50%",
        display: "inline-block",
        marginRight: "8px"
      }
    });
  };
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "btn-group me-1"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn dropdown-toggle mb-1 btn-primary",
      type: "button",
      "data-bs-toggle": "dropdown",
      "aria-haspopup": "true",
      "aria-expanded": "false"
    }, "Acciones"), /*#__PURE__*/React.createElement("div", {
      className: "dropdown-menu"
    }, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item cursor-pointer",
      onClick: () => handlePrint(rowData)
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-print me-2"
    }), "Imprimir"), /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item cursor-pointer",
      onClick: () => {
        handleDownload(rowData);
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-download me-2"
    }), "Descargar"), /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item cursor-pointer",
      href: "#"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-share me-2"
    }), "Compartir")));
  };
  function calculateAge(birthDateStr) {
    const today = new Date();
    const birthDate = new Date(birthDateStr);
    let age = today.getFullYear() - birthDate.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();

    // Adjust if the birthday hasn't occurred yet this year
    if (currentMonth < birthMonth || currentMonth === birthMonth && currentDay < birthDay) {
      age--;
    }
    return age;
  }
  const handlePrint = async rowData => {
    const nameReceiverUser = `${rowData?.receiver_by_user?.first_name ?? ""} ${rowData?.receiver_by_user?.middle_name ?? ""} ${rowData?.receiver_by_user?.last_name ?? ""} ${rowData?.receiver_by_user?.second_last_name ?? ""}`;
    const nameRemitterUser = `${rowData?.remitter_by_user?.first_name ?? ""} ${rowData?.remitter_by_user?.middle_name ?? ""} ${rowData?.remitter_by_user?.last_name ?? ""} ${rowData?.remitter_by_user?.second_last_name ?? ""}`;
    const namePatient = `${rowData?.clinical_record?.patient?.first_name ?? ""} ${rowData?.clinical_record?.patient?.middle_name ?? ""} ${rowData?.clinical_record?.patient?.last_name ?? ""} ${rowData?.clinical_record?.patient?.second_last_name ?? ""}`;
    const printContent = `
    <html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header-info {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            background-color: #f0f0f0;
            padding: 7px 10px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .patient-info {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .patient-info td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }
        .patient-info td:first-child {
            font-weight: bold;
            width: 30%;
        }
        .signature {
            margin-top: 50px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-info">
            <div>No. Remisión: <strong>RM-${rowData.id}</strong></div>
            <div>Fecha: <strong>${formatDate(rowData.created_at)}</strong></div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">MÉDICO REMITENTE</div>
        <p><strong>Nombre: </strong>${nameRemitterUser}</p>
        <p><strong>Especialidad: </strong>${rowData.remitter_by_user.specialty.name}</p>
    </div>

    <hr>

    <div class="section">
        <div class="section-title">INFORMACIÓN DEL PACIENTE</div>
        <table class="patient-info">
            <tr>
                <td>Nombre:</td>
                <td>${namePatient}</td>
            </tr>
            <tr>
                <td>Documento:</td>
                <td>${rowData.clinical_record.patient.document_number}</td>
            </tr>
            <tr>
                <td>Edad:</td>
                <td>${calculateAge(rowData.clinical_record.patient.date_of_birth)} años</td>
            </tr>
            <tr>
                <td>EPS:</td>
                <td>${rowData.clinical_record.patient.social_security.entity.name}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">REMITIR A:</div>
        <p><strong>Médico Solicitado: </strong>${nameReceiverUser}</p>
        <p><strong>Especialidad: </strong>${rowData.receiver_by_user.specialty.name}</p>
    </div>

    <div class="footer">
        <div class="signature">
            <p>_________________________</p>
            <p>Firma y sello del médico remitente</p>
        </div>
    </div>
</body>
</html>
    `;
    const configPDF = {
      name: "Remisión_Médica",
      isDownload: false
    };
    generatePDFFromHTML(printContent, company, configPDF);
  };
  const handleDownload = async rowData => {
    const nameReceiverUser = `${rowData.receiver_by_user.first_name ?? ""} ${rowData.receiver_by_user.middle_name ?? ""} ${rowData.receiver_by_user.last_name ?? ""} ${rowData.receiver_by_user.second_last_name ?? ""}`;
    const nameRemitterUser = `${rowData.remitter_by_user.first_name ?? ""} ${rowData.remitter_by_user.middle_name ?? ""} ${rowData.remitter_by_user.last_name ?? ""} ${rowData.remitter_by_user.second_last_name ?? ""}`;
    const namePatient = `${rowData.clinical_record.patient.first_name ?? ""} ${rowData.clinical_record.patient.middle_name ?? ""} ${rowData.clinical_record.patient.last_name ?? ""} ${rowData.clinical_record.patient.second_last_name ?? ""}`;
    const printContent = `
    <html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header-info {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            background-color: #f0f0f0;
            padding: 7px 10px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .patient-info {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .patient-info td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }
        .patient-info td:first-child {
            font-weight: bold;
            width: 30%;
        }
        .signature {
            margin-top: 50px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-info">
            <div>No. Remisión: <strong>RM-${rowData.id}</strong></div>
            <div>Fecha: <strong>${formatDate(rowData.created_at)}</strong></div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">MÉDICO REMITENTE</div>
        <p><strong>Nombre: </strong>${nameRemitterUser}</p>
        <p><strong>Especialidad: </strong>${rowData.remitter_by_user.specialty.name}</p>
    </div>

    <hr>

    <div class="section">
        <div class="section-title">INFORMACIÓN DEL PACIENTE</div>
        <table class="patient-info">
            <tr>
                <td>Nombre:</td>
                <td>${namePatient}</td>
            </tr>
            <tr>
                <td>Documento:</td>
                <td>${rowData.clinical_record.patient.document_number}</td>
            </tr>
            <tr>
                <td>Edad:</td>
                <td>${calculateAge(rowData.clinical_record.patient.date_of_birth)} años</td>
            </tr>
            <tr>
                <td>EPS:</td>
                <td>${rowData.clinical_record.patient.social_security.entity.name}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">REMITIR A:</div>
        <p><strong>Médico Solicitado: </strong>${nameReceiverUser}</p>
        <p><strong>Especialidad: </strong>${rowData.receiver_by_user.specialty.name}</p>
    </div>

    <div class="footer">
        <div class="signature">
            <p>_________________________</p>
            <p>Firma y sello del médico remitente</p>
        </div>
    </div>
</body>
</html>
    `;
    const configPDF = {
      name: "Remisión_Médica",
      isDownload: true
    };
    generatePDFFromHTML(printContent, company, configPDF);
  };
  const handleShare = rowData => {
    console.log("Compartir", rowData);
    // Lógica para compartir
  };
  return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement("div", {
    className: "accordion",
    id: "accordionExample"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-item"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "accordion-header",
    id: "headingThree"
  }, /*#__PURE__*/React.createElement("button", {
    className: "accordion-button collapsed",
    type: "button",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#collapseThree",
    "aria-expanded": "false",
    "aria-controls": "collapseThree"
  }, "Filtros")), /*#__PURE__*/React.createElement("div", {
    className: "accordion-collapse collapse",
    id: "collapseThree",
    "aria-labelledby": "headingThree",
    "data-bs-parent": "#accordionExample"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-body pt-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "doctors",
    className: "form-label"
  }, "Fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: dates,
    onChange: e => setDates(e.value),
    selectionMode: "range",
    appendTo: "self",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "doctors",
    className: "form-label"
  }, "Remitido a"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "doctors",
    value: selectedService,
    onChange: e => setSelectedService(e.value),
    options: mappedServiceDoctors,
    optionLabel: "label",
    optionValue: "value",
    filter: true,
    className: "w-100",
    appendTo: "self"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mt-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handeFilter,
    className: "btn btn-primary"
  }, "Filtrar")))))), /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(DataTable, {
    value: dataRemissions,
    loading: loading,
    emptyMessage: "No hay datos disponibles",
    showGridlines: true,
    className: "p-datatable-sm",
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    paginatorTemplate: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",
    currentPageReportTemplate: "Mostrando {first} a {last} de {totalRecords} registros"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "is_active",
    header: "Estado",
    body: statusBodyTemplate,
    style: {
      width: "80px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Tipo",
    body: rowData => rowData.clinical_record.clinical_record_type.name
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Remitido por",
    body: rowData => `${rowData.remitter_by_user.first_name} ${rowData.remitter_by_user.last_name}`
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Nota",
    field: "note",
    style: {
      maxWidth: "300px"
    },
    bodyStyle: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Remitido a",
    body: rowData => `${rowData?.receiver_by_user?.first_name ?? ""} ${rowData?.receiver_by_user?.last_name ?? ""}`
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Fecha",
    body: rowData => formatDate(rowData.created_at),
    style: {
      width: "120px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Opciones",
    body: actionBodyTemplate,
    style: {
      width: "150px"
    }
  }))), /*#__PURE__*/React.createElement("style", null, `
            .p-datatable-wrapper {
              overflow: visible !important;
            }

            .p-datatable {
              position: static !important;
            }

            .dropdown-menu {
              position: absolute !important;
              z-index: 1100 !important;
              transform: none !important;
              top: 100% !important;
              left: 0 !important;
            }
          `)));
};