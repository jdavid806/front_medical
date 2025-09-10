import { generatePDFFromHTMLV2 } from "../exportPDFV2.js";
import { formatDate } from "../../../services/utilidades";
import { datosUsuario } from "./datosUsuario.js";

let company = {};
let patient = {};
let patient_id = new URLSearchParams(window.location.search).get("patient_id");
let user = {};

async function consultarData() {
  const response = await consultarDatosEmpresa();
  const responePatient = await consultarDatosPaciente(patient_id);

  patient = responePatient;
  company = {
    legal_name: response.nombre_consultorio,
    document_number: response.datos_consultorio[0].RNC,
    address: response.datos_consultorio[1].Dirección,
    phone: response.datos_consultorio[2].Teléfono,
    email: response.datos_consultorio[3].Correo,
    logo: response.logo_consultorio,
    watermark: response.marca_agua,
  };
}
document.addEventListener("DOMContentLoaded", () => {
  consultarData();
});
export async function generarFormatoRemision(rowData, tipo, inputId = "") {
  function calculateAge(birthDateStr) {
    const today = new Date();
    const birthDate = new Date(birthDateStr);

    let age = today.getFullYear() - birthDate.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();

    // Adjust if the birthday hasn't occurred yet this year
    if (
      currentMonth < birthMonth ||
      (currentMonth === birthMonth && currentDay < birthDay)
    ) {
      age--;
    }

    return age;
  }

  const nameReceiverUser = `${rowData?.receiver_by_user?.first_name ?? ""} ${
    rowData?.receiver_by_user?.middle_name ?? ""
  } ${rowData?.receiver_by_user?.last_name ?? ""} ${
    rowData?.receiver_by_user?.second_last_name ?? ""
  }`;
  const nameRemitterUser = `${rowData?.remitter_by_user?.first_name ?? ""} ${
    rowData?.remitter_by_user?.middle_name ?? ""
  } ${rowData?.remitter_by_user?.last_name ?? ""} ${
    rowData?.remitter_by_user?.second_last_name ?? ""
  }`;
  const namePatient = `${rowData?.clinical_record?.patient?.first_name ?? ""} ${
    rowData?.clinical_record?.patient?.middle_name ?? ""
  } ${rowData?.clinical_record?.patient?.last_name ?? ""} ${
    rowData?.clinical_record?.patient?.second_last_name ?? ""
  }`;

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
        <p><strong>Especialidad: </strong>${
          rowData.remitter_by_user.specialty.name
        }</p>
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
                <td>${calculateAge(
                  rowData.clinical_record.patient.date_of_birth
                )} años</td>
            </tr>
            <tr>
                <td>EPS:</td>
                <td>${
                  rowData.clinical_record.patient.social_security.entity.name
                }</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">REMITIR A:</div>
        <p><strong>Médico Solicitado: </strong>${nameReceiverUser}</p>
        <p><strong>Especialidad: </strong>${
          rowData.receiver_by_user.specialty.name
        }</p>
    </div>

   ${datosUsuario(rowData.remitter_by_user)}  
</body>
</html>
    `;

  const configPDF = {
    name: "Remisión_Médica",
    isDownload: false,
  };
  await generatePDFFromHTMLV2(printContent, company, configPDF, inputId);
}

export default generarFormatoRemision;
