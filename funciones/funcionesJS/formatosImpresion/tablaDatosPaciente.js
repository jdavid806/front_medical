export function generarTablaPaciente(patient, additionalData = {}) {
  // Datos adicionales pueden ser cosas como la fecha de la receta
  const { date = "--" } = additionalData;

  // return `
  // <style>
  // body {
  //           font-family: "Open Sans", sans-serif;
  //           margin: 0px 10px 10px 10px;
  //           color: #444;
  //           position: relative;
  //       }

  // h4 {
  //     text-align: left;
  //     margin-bottom: 10px;
  //   }

  //   #tablePatient {
  //     width: 100%;
  //     border-collapse: collapse;
  //     font-size: 13px;
  //   }

  //   #tablePatient td {
  //     vertical-align: top;
  //     padding: 0px 0px;
  //   }

  //   #tablePatient td:first-child {
  //     width: 50%;
  //   }

  //   #tablePatient td:last-child {
  //     width: 50%;
  //   }
  // </style>
  //     <h4 style="margin: 0.1rem 0;">Datos del Paciente</h4>
  //     <table id="tablePatient" style="margin-bottom: 5px">
  //       <tr>
  //         <td><strong>Nombre:</strong> ${
  //           patient?.datos_basicos?.nombre || ""
  //         }</td>
  //         <td><strong>Fecha: </strong>${date}</td>
  //       </tr>
  //       <tr>
  //         <td><strong>Documento:</strong> ${
  //           patient?.datos_basicos?.documento || ""
  //         }</td>
  //         <td><strong>Teléfono:</strong> ${
  //           patient?.datos_basicos?.telefono || ""
  //         }</td>
  //       </tr>
  //       <tr>
  //         <td><strong>Edad:</strong> ${patient?.datos_basicos?.edad || ""}</td>
  //         <td><strong>Correo:</strong> ${
  //           patient?.datos_basicos?.correo || ""
  //         }</td>
  //       </tr>
  //       <tr>
  //         <td><strong>Género:</strong> ${
  //           patient?.datos_generales?.genero || ""
  //         }</td>
  //         <td><strong>Dirección:</strong> ${
  //           patient?.datos_generales?.direccion || ""
  //         }</td>
  //       </tr>
  //       <tr>
  //         <td><strong>Entidad:</strong> ${
  //           patient?.datos_generales?.entidad || ""
  //         }</td>
  //         <td><strong>Tipo Afiliado:</strong> ${
  //           patient?.datos_generales["tipo afiliado"] || ""
  //         }</td>
  //       </tr>
  //     </table>
  //   `;

  return `
  <style>
  body {
            font-family: "Open Sans", sans-serif;
            margin: 0px 10px 10px 10px;
            color: #444;
            position: relative;
        }

  h4 {
      text-align: left;
      margin-bottom: 10px;
    }

    #tablePatient {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    #tablePatient td {
      vertical-align: top;
      padding: 0px 0px;
    }

    #tablePatient td:first-child {
      width: 50%;
    }

    #tablePatient td:last-child {
      width: 50%;
    }
  </style>
      <h4 style="margin: 0.1rem 0;">Datos del Paciente</h4>
      <table id="tablePatient" style="margin-bottom: 5px">
        <tr>
          <td><strong>Nombre:</strong> ${
            patient?.datos_basicos?.nombre || ""
          }</td>
          <td><strong>Fecha: </strong>${date}</td>
        </tr>
        <tr>
          <td><strong>Documento:</strong> ${
            patient?.datos_basicos?.documento || ""
          }</td>
           <td><strong>Edad:</strong> ${patient?.datos_basicos?.edad || ""}</td>
        </tr>
        <tr>
         <td><strong>Entidad:</strong> ${
            patient?.datos_generales?.entidad || ""
          }</td>
          <td><strong>Género:</strong> ${
            patient?.datos_generales?.genero || ""
          }</td>
        </tr>
      </table>
    `;
}

export function generarTablaPacienteFicha(patient, additionalData = {}) {
  const { date = "--" } = additionalData;

  return `
  <style>
  body {
    font-family: "Open Sans", sans-serif;
    margin: 0px 10px 10px 10px;
    color: #444;
    position: relative;
  }

  h4 {
    text-align: left;
    margin-bottom: 10px;
  }

  #tablePatientFicha {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  #tablePatientFicha td {
    vertical-align: top;
    padding: 2px 4px;
  }

  #tablePatientFicha td:first-child {
    width: 50%;
  }

  #tablePatientFicha td:last-child {
    width: 50%;
  }
</style>

<h4 style="margin: 0.1rem 0;">Datos del Paciente</h4>
<table id="tablePatientFicha" style="margin-bottom: 5px">
  <tr>
    <td><strong>Sr./Sra:</strong> ${patient?.datos_basicos?.nombre || ""}</td>
    <td><strong>Cédula:</strong> ${patient?.datos_basicos?.documento || ""}</td>
  </tr>
  <tr>
    <td><strong>Seguro Médico/Plan:</strong> ${patient?.datos_generales?.entidad || ""}</td>
    <td><strong>F. Nac:</strong> ${patient?.datos_basicos?.fecha_nacimiento || "DD/MM/AAAA"} | <strong>Edad:</strong> ${patient?.datos_basicos?.edad || ""}</td>
  </tr>
  <tr>
    <td><strong>Calle:</strong> ${patient?.direccion?.calle || ""}</td>
    <td><strong>Sector:</strong> ${patient?.direccion?.sector || ""}</td>
  </tr>
  <tr>
    <td><strong>Ciudad:</strong> ${patient?.direccion?.ciudad || ""}</td>
    <td><strong>Email:</strong> ${patient?.datos_basicos?.correo || ""}</td>
  </tr>
  <tr>
    <td><strong>Tel/Móvil:</strong> ${patient?.datos_basicos?.telefono || ""}</td>
    <td><strong>Usa WhatsApp:</strong> ${patient?.datos_generales?.whatsapp ? "Sí" : "No"}</td>
  </tr>
  <tr>
    <td><strong>Profesión:</strong> ${patient?.datos_generales?.profesion || ""}</td>
    <td><strong>Acompañante:</strong> ${patient?.acompanante?.nombre || "Nombre"} - ${patient?.acompanante?.telefono || "333-4444"}</td>
  </tr>
</table>
<table style="table-layout: fixed; width: 100%;">
  <tr>
    <td style="width: 33%;"><strong>T. VISTA</strong> ${patient?.datos_generales?.vista || ""}</td>
    <td style="width: 33%;"><strong>T. CLIENTE</strong> ${patient?.datos_generales?.cliente || ""}</td>
    <td style="width: 33%;"><strong>RESULTADO</strong> ${patient?.datos_generales?.resultado || ""}</td>
  </tr>
</table>


    `;
}

export default generarTablaPaciente;
