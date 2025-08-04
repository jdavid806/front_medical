import { generatePDFFromHTML } from "../exportPDF.js";
import datosUsuario from "./datosUsuario.js";
import { generarTablaPaciente, generarTablaPacienteFicha } from "./tablaDatosPaciente.js";

let company = {};
let patient = {};
let patient_id = new URLSearchParams(window.location.search).get("patient_id");

async function consultarData() {
  const response = await consultarDatosEmpresa();
  const responePatient = await consultarDatosPaciente(patient_id);

  patient = responePatient;
  // console.log(patient);
  company = {
    legal_name: response.nombre_consultorio,
    document_number: response.datos_consultorio[0].RNC,
    address: response.datos_consultorio[1].Dirección,
    phone: response.datos_consultorio[2].Teléfono,
    email: response.datos_consultorio[3].Correo,
  };
  // console.log("company", company);
}
document.addEventListener("DOMContentLoaded", () => {
  consultarData();
});

export function generarFormatoConsulta(datosConsulta, tipo, inputId = null) {
  console.log("consulta", datosConsulta);
  let user = {
    nombre: datosConsulta?.doctorName,
    especialidad: datosConsulta.user?.user_specialty_name,
    registro_medico: datosConsulta.user?.clinical_record || "",
    sello: `https://dev.monaros.co/` + getUrlImage(datosConsulta.user?.image_minio_url || ""),
    firma: `https://dev.monaros.co/` + getUrlImage(datosConsulta.user?.firma_minio_url || "")
  }
  console.log("user", user);

  const tablePatient = generarTablaPaciente(patient, {
    date: datosConsulta.createdAt || "--",
  });
  const tablePatientFicha = generarTablaPacienteFicha(patient, {
    date: datosConsulta.createdAt || "--",
  });

  // ==================== CONSTANTES Y HELPERS ====================
  const casosEspeciales = {
    si: "Sí",
    no: "No",
    ambos: "Ambos",
    OD: "Ojo Derecho",
    OI: "Ojo Izquierdo",
    noAplica: "No Aplica",
    noNiega: "No Niega",
  };

  const capitalizar = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());
  const obtenerUrl = (path) => obtenerRutaPrincipal() + path;
  const formatearValor = (valor) => {
    if (valor === null || valor === undefined || valor === "") return null;
    if (typeof valor === "object" && Object.keys(valor).length === 0)
      return null;
    if (Array.isArray(valor)) return valor.length > 0 ? valor : null;
    return valor;
  };

  const formatearValorOpcion = (valor) => {
    if (!valor || typeof valor !== "string") return valor;
    if (casosEspeciales[valor]) return casosEspeciales[valor];
    return valor
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const limpiarTextarea = (valor) => {
    if (!valor || typeof valor !== "string") return valor;

    // Eliminar <p> y </p> del inicio y final, pero mantener el contenido interno
    return valor
      .replace(/^<p>/, "") // Quitar <p> al inicio
      .replace(/<\/p>$/, ""); // Quitar </p> al final
  };

  const obtenerValorAnidado = (obj, path) =>
    path.split(".").reduce((o, p) => o?.[p], obj);

  // ==================== FUNCIONES DE GENERACIÓN ====================
  const generarContenidoBase = (tipoHistoria, descripcion) => `
  <div class="container p-3 border rounded shadow-sm text-start" style="padding-top: 0;">
    <h3 class="text-primary text-center" style="margin: 0; padding: 0;">${tipoHistoria}</h3>
    <hr style="margin: 0.25rem 0;">
    ${datosConsulta.clinicalRecordTypeId == 63 ? tablePatientFicha : tablePatient}
    <hr style="margin: 0.25rem 0;">
    <div style="margin: 0;"><strong>Descripción:</strong> ${
      limpiarTextarea(descripcion) || "Sin descripción"
    }</div>
`;

  const generarSeccion = (titulo, contenido) => {
    const contenidoLimpio = limpiarTextarea(contenido);
    if (!contenidoLimpio) return "";
    return `
    <h4 style="margin: 0.1rem 0;">${titulo}</h4>
    <div style="margin: 0.1rem 0;">${contenidoLimpio}</div>
  `;
  };

  const generarCamposVerificacion = () => {
    const campos = [
      {
        texto: "¿Se ha confirmado la identidad del paciente?",
        valor: datosConsulta.data.values.confirmacionIdentidad.text,
      },
      {
        texto: "¿Se ha marcado el sitio quirurgico?",
        valor: datosConsulta.data.values.marcadoSitioQuirurgico.text,
      },
      {
        texto: "¿Se ha comprobado la disponibilidad de anestesia y medicación?",
        valor: datosConsulta.data.values.disponibilidadAnestesiaMedicacion.text,
      },
      {
        texto: "¿Se ha colocado el pulsioximetro al paciente?",
        valor: datosConsulta.data.values.pulsioximetro.text,
      },
      {
        texto: "¿El paciente tiene alergias conocidas?",
        valor: datosConsulta.data.values.alergiasConocidas.text,
      },
      {
        texto: "Vía aérea dificil/riesgo de aspiración",
        valor: datosConsulta.data.values.viaAspiracion.text,
      },
      {
        texto: "¿En este caso, hay instrumental y equipos de ayuda disponible?",
        valor: datosConsulta.data.values.instrumentalAyudaDisponible.text,
      },
      {
        texto: "Riesgo de hemorragia > 500 ml",
        valor: datosConsulta.data.values.riesgoHemorragia.text,
      },
      {
        texto:
          "¿En este caso, se ha previsto la disponibilidad de sangre, plasma u otros fluidos?",
        valor: datosConsulta.data.values.disponibilidadSangre.text,
      },
      {
        texto:
          "Confirmar que todos los miembros del equipo programados se hayan presentado por su nombre y funcion",
        valor: datosConsulta.data.values.presentacionEquipo.text,
      },
      {
        texto:
          "Confirmar indentidad del paciente, procedimiento y sitio quirurgico",
        valor:
          datosConsulta.data.values.confirmarIdentidadProcedimientoSitio.text,
      },
      {
        texto:
          "Confirmar que todos los miembros del equipo han cumplido correctamente con el",
        valor: datosConsulta.data.values.cumplimiento.text,
      },
      {
        texto: "Se ha administrado profilaxis con antibioticos",
        valor: datosConsulta.data.values.administracionProfilaxis.text,
      },
      {
        texto: "¿Cuales son los pasos criticos o inesperados?",
        valor: datosConsulta.data.values.pasosCriticos.text,
      },
      {
        texto: "Duracion de la operacion",
        valor: datosConsulta.data.values.duracionOperacion.text,
      },
      {
        texto: "Perdida de sangre prevista",
        valor: datosConsulta.data.values.perdidaSangrePrevista.text,
      },
      {
        texto: "¿El paciente presenta algún problema en especifico?",
        valor: datosConsulta.data.values.problemaEspecifico.text,
      },
      {
        texto: "Se ha confirmado la esterilidad de la ropa",
        valor: datosConsulta.data.values.esterilidadRopa.text,
      },
      {
        texto: "¿Hay dudas o problemas relacionados con ellos?",
        valor: datosConsulta.data.values.dudasProblemas.text,
      },
      {
        texto: "Pueden visualizarse las imagenes diagnosticas esenciales?",
        valor: datosConsulta.data.values.imagenesDiagnosticas.text,
      },
      {
        texto: "El nombre del procedimiento",
        valor: datosConsulta.data.values.nombreProcedimiento.text,
      },
      {
        texto: "El recuento de instrumentos",
        valor: datosConsulta.data.values.recuentoInstrumentos.text,
      },
      {
        texto:
          "El etiquetado de las muestras (lectura de etiquetas en voz alta, incluido el nombre del paciente)",
        valor: datosConsulta.data.values.etiquetadoMuestras.text,
      },
      {
        texto:
          "Problemas que resolver relacionados al instrumental y/o equipos",
        valor: datosConsulta.data.values.problemasInstrumentalEquipos.text,
      },
    ];

    return campos
      .filter((campo) => campo.valor)
      .map(
        (campo) => `
  <div style="width: 100%; margin: 0;">
    <p style="display: inline-block; width: 83%; margin: 0;">${campo.texto}</p>
    <p style="display: inline-block; width: 15%; margin: 0;">${formatearValorOpcion(
      campo.valor
    )}</p>
  </div>
  <hr style="margin: 0; height: 1px; background-color: rgba(0, 0, 0, 0.2); border: none;">
`
      )
      .join("");
  };

  const generarEscalaAldrete = () => {
    const campos = [
      {
        titulo: "Actividad Muscular",
        texto: datosConsulta.data.values?.actividadMuscular?.text,
        valor: datosConsulta.data.values?.actividadMuscular?.value,
      },
      {
        titulo: "Respiratorios",
        texto: datosConsulta.data.values?.respiratorios?.text,
        valor: datosConsulta.data.values?.respiratorios?.value,
      },
      {
        titulo: "Circulatorios",
        texto: datosConsulta.data.values?.circulatorios?.text,
        valor: datosConsulta.data.values?.circulatorios?.value,
      },
      {
        titulo: "Estado de Conciencia",
        texto: datosConsulta.data.values?.estadoConciencia?.text,
        valor: datosConsulta.data.values?.estadoConciencia?.value,
      },
      {
        titulo: "Color de mucosa",
        texto: datosConsulta.data.values?.colorMucosas?.text,
        valor: datosConsulta.data.values?.colorMucosas?.value,
      },
    ];

    const totalAldrete = campos.reduce(
      (sum, campo) => sum + (Number(campo.valor) || 0),
      0
    );

    const listaCampos = campos
      .filter((campo) => campo.valor)
      .map(
        (campo) => `
      <div style="width: 100%; margin: 0;">
        <p style="display: inline-block; width: 35%; margin-top: 0; margin-bottom: 3px">${
          campo.titulo
        }</p>
        <p style="display: inline-block; width: 50%; margin-top: 0; margin-bottom: 3px">${formatearValorOpcion(
          campo.texto
        )}</p>
        <p style="display: inline-block; width: 10%; margin-top: 0; margin-bottom: 3px">${
          campo.valor
        }</p>
      </div>
    `
      )
      .join("");

    return (
      listaCampos +
      `
    <div style="width: 100%; margin: 0.35rem 0; font-weight: bold;">
      <p style="display: inline-block; margin: 0;">Total:</p>
      <p style="display: inline-block; margin: 0;">${totalAldrete}</p>
    </div>
  `
    );
  };

  // ==================== FUNCIONES ESPECÍFICAS POR TIPO ====================
  const generarFormatoOftalmologico = (datos) => {
    let contenido = `
      <h3 style="margin: 0.1rem 0;">Admisión</h3>
      <hr style="margin: 0.25rem 0;">`;

    // Secciones de admisión
    if (datos.values?.diagnostico)
      contenido += generarSeccion("Diagnóstico", datos.values.diagnostico);
    if (datos.values?.procedimiento)
      contenido += generarSeccion("Procedimiento", datos.values.procedimiento);
    if (datos.values?.observaciones)
      contenido += generarSeccion("Observaciones", datos.values.observaciones);

    // Verificación y Aldrete
    contenido += `
      <h3 style="margin: 0.1rem 0;">Verificación</h3>
      <hr style="margin: 0.25rem 0;">
      ${generarCamposVerificacion(datos.values)}
      ${
        datos.values?.aspectosCriticosRecuperacion
          ? generarSeccion(
              "Aspectos criticos de recuperacion",
              datos.values.aspectosCriticosRecuperacion
            )
          : ""
      }
      <h3 style="margin: 0.1rem 0;">Escala Aldrete</h3>
      <hr style="margin: 0.25rem 0;">
      ${generarEscalaAldrete(datos.values)}`;

    // Hoja de cirugía
    contenido += `<h3 style="margin: 0.1rem 0;">Hoja de cirugia</h3>
    <hr style="margin: 0.25rem 0;">`;

    if (datos.values?.diagnosticoPrincipal) {
      contenido += generarSeccion(
        "Diagnóstico principal",
        datos.values.diagnosticoPrincipal
      );
    }
    if (datos.values?.complicaciones) {
      contenido += generarSeccion(
        "Complicaciones",
        datos.values.complicaciones
      );
    }
    if (datos.values?.derecho) {
      contenido += generarSeccion("Ojo derecho", datos.values.derecho);
    }
    if (datos.values?.izquierdo) {
      contenido += generarSeccion("Ojo izquierdo", datos.values.izquierdo);
    }
    if (datos.values?.descripcionCirugia) {
      contenido += generarSeccion(
        "Descripción de la cirugia",
        datos.values.descripcionCirugia
      );
    }

    // Firmas
    contenido += `
      <table style="width: 100%; border-collapse: collapse; margin-top: 100px;">
        <tr>
          <td style="width: 50%; padding-right: 20px;">
            <hr style="border: 1px solid black; width: 90%; margin: 0.25rem 0;">
            <p style="text-align: center; margin: 0;">Cirujano</p>
          </td>
          <td style="width: 50%;">
            <hr style="border: 1px solid black; width: 90%; margin: 0.25rem 0;">
            <p style="text-align: center; margin: 0;">Técnico</p>
          </td>
        </tr>
      </table>`;

    // Signos vitales
    contenido += generarSeccionSignosVitales(datos.values);

    // Egreso
    contenido += `<h3 style="margin: 0.1rem 0;">Egreso</h3>
    <hr style="margin: 0.25rem 0;">`;

    if (datos.values?.diagnosticoIngreso) {
      contenido += generarSeccion(
        "Diagnóstico de ingreso",
        datos.values.diagnosticoIngreso
      );
    }
    if (datos.values?.procedimientos) {
      contenido += generarSeccion(
        "Procedimientos",
        datos.values.procedimientos
      );
    }
    if (datos.values?.diagnosticoEgreso) {
      contenido += generarSeccion(
        "Diagnóstico de egreso",
        datos.values.diagnosticoEgreso
      );
    }
    if (datos.values?.tratamiento) {
      contenido += generarSeccion("Tratamiento", datos.values.tratamiento);
    }

    return contenido;
  };

  const generarSeccionSignosVitales = (valores) => {
    let contenido = `<h3 style="margin: 0.1rem 0;">Signos vitales</h3>
    <hr style="margin: 0.25rem 0;">`;

    // Tensión arterial
    contenido += `<h4 style="margin: 0.1rem 0;">Tensión arterial</h4>
    <div style="margin: 0.1rem 0;">
      <div style="display: inline-block; width: 30%;">
        ${
          valores?.tensionSistólica
            ? `<strong>Sistolica: </strong> ${valores.tensionSistólica}`
            : ""
        }
      </div>
      <div style="display: inline-block; width: 30%;">
        ${
          valores?.tensionDiastólica
            ? `<strong>Diastólica: </strong> ${valores.tensionDiastólica}`
            : ""
        }
      </div>
      <div style="display: inline-block; width: 30%;">
        ${valores?.pam ? `<strong>PAM: </strong> ${valores.pam}` : ""}
      </div>
    </div>`;

    // Frecuencia
    if (valores?.frecC || valores?.frecR || valores?.ayuno !== undefined) {
      contenido += `<h4 style="margin: 0.1rem 0;">Frecuencia</h4>
      <div style="margin: 0.1rem 0;">
        <div style="display: inline-block; width: 30%;">
          ${valores.frecC ? `<strong>Cardiaca: </strong>${valores.frecC}` : ""}
        </div>
        <div style="display: inline-block; width: 30%;">
          ${
            valores.frecR
              ? `<strong>Respiratoria: </strong>${valores.frecR}`
              : ""
          }
        </div>
        <div style="display: inline-block; width: 30%;">
          <strong>Ayuno: </strong>${valores.ayuno ? "SI" : "NO"}
        </div>
      </div>`;
    }

    // Anestesia y respiración
    if (valores?.anestesia || valores?.respiracion) {
      contenido += `<div style="margin: 0.2rem 0;">
        <div style="display: inline-block; width: 30%;">
          ${
            valores.anestesia?.text
              ? `<strong>Anestesia: </strong> ${valores.anestesia.text}`
              : ""
          }
        </div>
        <div style="display: inline-block; width: 30%;">
          ${
            valores.respiracion?.text
              ? `<strong>Respiración: </strong>${valores.respiracion.text}`
              : ""
          }
        </div>
      </div>`;
    }

    // Otros signos vitales
    if (valores?.sat02 || valores?.etc02) {
      contenido += `<div style="margin: 0.1rem 0;">
        <div style="display: inline-block; width: 30%; vertical-align: top;">
          ${
            valores.sat02
              ? `<p style="margin: 0.1rem 0;"><strong>SAT02: </strong>${valores.sat02}</p>`
              : ""
          }
        </div>
        <div style="display: inline-block; width: 30%; vertical-align: top;">
          ${
            valores.etc02
              ? `<p style="margin: 0.1rem 0;"><strong>ETCO2: </strong>${valores.etc02}</p>`
              : ""
          }
        </div>
      </div>`;
    }

    // Campos individuales
    if (valores?.posicion)
      contenido += `<div style="margin: 0.05rem 0;"><strong>Posición: </strong>${valores.posicion}</div>`;
    if (valores?.ekg)
      contenido += `<div style="margin: 0.05rem 0;"><strong>EKG: </strong>${valores.ekg}</div>`;
    if (valores?.temp)
      contenido += `<div style="margin: 0.05rem 0;"><strong>Temp: </strong>${valores.temp}</div>`;
    if (valores?.cam)
      contenido += `<div style="margin: 0.05rem 0;"><strong>Cam: </strong>${valores.cam}</div>`;

    return contenido;
  };

  const generarTablaCristal = (valores) => {
    const camposCristal = [
      {
        campo1: "visionSencilla",
        campo2: "visionSencillaV",
        etiqueta: "Visión sencilla",
      },
      {
        campo1: "bifocalFLTTOP",
        campo2: "bifocalFLTTOPH",
        etiqueta: "Bifocal FLTTOP",
      },
      {
        campo1: "bifocalInvisible",
        campo2: "bifocalInvisibleD",
        etiqueta: "Bifocal invisible",
      },
      { campo1: "progresivo", campo2: "progresivoP", etiqueta: "Progresivo" },
    ];

    const tieneDatos = camposCristal.some(
      ({ campo1, campo2 }) => valores[campo1] != null || valores[campo2] != null
    );

    if (!tieneDatos) return "";

    return `
      <h3 class="text-primary" style="margin: 0.15rem 0 0.15rem 0;">Cristal recomendado</h3>
      <hr style="margin: 0.15rem 0;">
      <div class="table-responsive">
        <table class="table" style="width: 100%; border: none;">
          <tbody style="border: none;">
            ${camposCristal
              .map(({ campo1, campo2, etiqueta }) => {
                const valor1 = valores[campo1];
                const valor2 = valores[campo2];
                if (valor1 == null && valor2 == null) return "";

                const letra = campo2.substring(campo2.length - 1);
                return `
                <tr style="border: none;">
                  <td style="padding: 2px 8px; border: none; width: 50%;">
                    <strong>${etiqueta}:</strong> ${
                  valor1 != null ? formatearValorOpcion(valor1) : "-"
                }
                  </td>
                  <td style="padding: 2px 8px; border: none; width: 50%;">
                    <strong>${letra}:</strong> ${
                  valor2 != null ? formatearValorOpcion(valor2) : "-"
                }
                  </td>
                </tr>`;
              })
              .join("")}
          </tbody>
        </table>
      </div>`;
  };

  const generarTablaQueratometria = (valores) => {
    const tieneQueratometria = [
      "queratometriaOjoDerecho",
      "queratometriaOjoIzquierdo",
      "esferaOjoDerecho",
      "esferaOjoIzquierdo",
      "cilindroOjoDerecho",
      "cilindroOjoIzquierdo",
      "ejeOjoDerecho",
      "ejeOjoIzquierdo",
      "addOjoDerecho",
      "addOjoIzquierdo",
      "dnpOjoDerecho",
      "dnpOjoIzquierdo",
    ].some((campo) => valores[campo] != null);

    if (!tieneQueratometria) return "";

    const encabezados = [
      "Ojo",
      "Queratometría",
      "Esfera",
      "Cilindro",
      "Eje",
      "ADD",
      "DNP",
    ];

    const ojoDerecho = [
      "Ojo Derecho",
      formatearValor(valores.queratometriaOjoDerecho),
      formatearValor(valores.esferaOjoDerecho),
      formatearValor(valores.cilindroOjoDerecho),
      formatearValor(valores.ejeOjoDerecho),
      formatearValor(valores.addOjoDerecho),
      formatearValor(valores.dnpOjoDerecho),
    ];

    const ojoIzquierdo = [
      "Ojo Izquierdo",
      formatearValor(valores.queratometriaOjoIzquierdo),
      formatearValor(valores.esferaOjoIzquierdo),
      formatearValor(valores.cilindroOjoIzquierdo),
      formatearValor(valores.ejeOjoIzquierdo),
      formatearValor(valores.addOjoIzquierdo),
      formatearValor(valores.dnpOjoIzquierdo),
    ];

    return `
      <h3 class="text-primary" style="margin: 0.75rem 0 0.25rem 0;">Queratometría</h3>
      <hr style="margin: 0.25rem 0;">
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>${encabezados
              .map((header) => `<th>${header}</th>`)
              .join("")}</tr>
          </thead>
          <tbody>
            <tr>${ojoDerecho.map((valor) => `<td>${valor}</td>`).join("")}</tr>
            <tr>${ojoIzquierdo
              .map((valor) => `<td>${valor || "--"}</td>`)
              .join("")}</tr>
          </tbody>
        </table>
      </div>`;
  };

  const generarAntecedentesOftalmologicos = (valores) => {
    const antecedentes = [
      {
        id: "disminucionVision",
        label: "Disminución de la visión",
        value: valores?.disminucionVision?.text,
      },
      {
        id: "estrabismo",
        label: "Estrabismo",
        value: valores?.estrabismo?.text,
      },
      { id: "glaucoma", label: "Glaucoma", value: valores?.glaucoma?.text },
      { id: "ambliopia", label: "Ambliopia", value: valores?.ambliopia?.text },
      { id: "fumador", label: "Fumador", value: valores?.fumador?.text },
      { id: "otrosInfo", label: "Otros", value: valores?.otrosInfo },
    ].filter(
      (item) => item.value && item.value !== "no" && item.value !== "noAplica"
    );

    if (antecedentes.length === 0) return "";

    return `
      <h3 class="text-primary" style="margin: 0.25rem 0 0.25rem 0;">Antecedentes Oftalmológicos</h3>
      <hr style="margin: 0.25rem 0 0.5rem 0;">
      <ul>
        ${antecedentes
          .map(
            (item) => `
          <li><strong>${item.label}:</strong> ${formatearValorOpcion(
              item.value
            )}</li>
        `
          )
          .join("")}
      </ul>`;
  };

  const generarInformeNeuro = (datos) => {
    if (!datos.data.informeMensualTrimestral?.exists) return "";

    let contenido = `
      <div style="margin: 0.1rem 0;">
        <div style="display: inline-block; width: 49%; vertical-align: top;">
          <p style="margin: 0.1rem 0;"><strong>Tipo:</strong> ${datos.data.values.tipoInforme}</p>
        </div>
        <div style="display: inline-block; width: 49%; vertical-align: top;">
          <p style="margin: 0.1rem 0;"><strong>Especialidad:</strong> ${datos.data.values.especialidad}</p>
        </div>
      </div>`;

    datos.data.informeMensualTrimestral.registros.forEach((registro) => {
      contenido += `<p style="margin: 0.1rem 0;"><strong>${registro.tipoTitulo}:</strong> ${registro.detalle}</p>`;
    });

    return contenido;
  };

  const generarContenidoTabs = (datos) => {
    if (!datos.data.tabsStructure) return "";

    let contenidoTabs = "";
    let queratometriaEncontrada = false;

    const formatearCheckbox = (valor, field, datosCompletos) => {
      if (!field.toggleFields || field.toggleFields.length === 0) {
        return { tipo: "simple", valor: valor ? "Sí" : "No" };
      }

      // Buscar campos toggle que tengan valores
      const camposConValores = field.toggleFields.filter((toggleField) => {
        const valorToggle = datosCompletos.values[toggleField.name];
        return (
          valorToggle !== null &&
          valorToggle !== undefined &&
          valorToggle !== "" &&
          valorToggle !== false
        );
      });

      if (camposConValores.length === 0) {
        return { tipo: "simple", valor: "No" };
      }

      // Construir el valor complejo con los campos toggle que tienen datos
      const valoresCampos = camposConValores.map((toggleField) => {
        const valorToggle = datosCompletos.values[toggleField.name];
        const valorMostrar =
          typeof valorToggle === "object" && "text" in valorToggle
            ? valorToggle.text
            : valorToggle;

        return {
          label: toggleField.label,
          valor: valorMostrar,
          type: toggleField.type, // Añadimos el tipo de campo
        };
      });

      return { tipo: "complejo", valores: valoresCampos };
    };

    const tieneValor = (valor) => {
      if (valor === null || valor === undefined) return false;
      if (typeof valor === "string" && valor.trim() === "") return false;
      if (typeof valor === "boolean") return valor;
      if (typeof valor === "object" && "text" in valor) {
        return (
          valor.text !== null && valor.text !== undefined && valor.text !== ""
        );
      }
      return true;
    };

    datos.data.tabsStructure.forEach((tab) => {
      let contenidoTab = "";
      let tieneDatosEnTab = false;

      tab.cards.forEach((card) => {
        let contenidoCard = "";
        let tieneDatosEnCard = false;
        let checkboxesSimples = [];

        if (
          card.cardTitle?.toLowerCase() === "queratometría" &&
          !queratometriaEncontrada
        ) {
          const tieneQueratometria = [
            "queratometriaOjoDerecho",
            "queratometriaOjoIzquierdo",
            "esferaOjoDerecho",
            "esferaOjoIzquierdo",
            "cilindroOjoDerecho",
            "cilindroOjoIzquierdo",
            "ejeOjoDerecho",
            "ejeOjoIzquierdo",
            "addOjoDerecho",
            "addOjoIzquierdo",
            "dnpOjoDerecho",
            "dnpOjoIzquierdo",
          ].some((campo) => tieneValor(datos.data.values[campo]));

          if (tieneQueratometria) {
            queratometriaEncontrada = true;
            contenidoTab += generarTablaQueratometria(datos.data.values);
            tieneDatosEnTab = true;
          }
        } else {
          // Procesamiento normal de otras cards
          if (card.fields.length === 1 && card.cardTitle) {
            const field = card.fields[0];
            const valor = datos.data.values[field.name];

            if (!tieneValor(valor)) return;

            if (field.type === "checkbox") {
              const resultado = formatearCheckbox(valor, field, datos.data);
              const tituloCampo = card.cardTitle.replace(/ check$/i, "");

              if (resultado.tipo === "complejo") {
                tieneDatosEnCard = true;
                tieneDatosEnTab = true;
                contenidoCard += `
                  <div style="margin-bottom: 4px;">
                    <strong>${tituloCampo}:</strong> Sí<br>
                    ${resultado.valores
                      .map((item) => {
                        const valorMostrar =
                          item.type === "textarea"
                            ? limpiarTextarea(item.valor)
                            : formatearValorOpcion(item.valor);
                        return `&nbsp;&nbsp;<strong>${item.label}:</strong> ${valorMostrar}`;
                      })
                      .join("<br>")}
                  </div>`;
              } else if (resultado.valor === "Sí") {
                tieneDatosEnCard = true;
                tieneDatosEnTab = true;
                contenidoCard += `
                  <div style="margin-bottom: 4px;">
                    <strong>${tituloCampo}:</strong> Sí
                  </div>`;
              }
            } else {
              const valorMostrar =
                typeof valor === "object" && "text" in valor
                  ? valor.text
                  : valor;

              tieneDatosEnCard = true;
              tieneDatosEnTab = true;
              contenidoCard += `
                <div style="margin-bottom: 4px;">
                  <strong>${card.cardTitle}:</strong>
                  ${
                    field.type === "textarea" || field.type === "input"
                      ? limpiarTextarea(valorMostrar) || valorMostrar
                      : formatearValorOpcion(valorMostrar)
                  }
                </div>`;
            }
          } else {
            // Card con múltiples campos
            const campos = card.fields
              .map((field) => {
                const valor = datos.data.values[field.name];
                if (!tieneValor(valor)) return null;

                if (field.type === "checkbox") {
                  const resultado = formatearCheckbox(valor, field, datos.data);
                  const tituloCampo =
                    field.label ||
                    capitalizar(
                      field.name.replace(/([A-Z])/g, " $1").toLowerCase()
                    ).replace(/ check$/i, "");

                  if (resultado.tipo === "simple") {
                    if (resultado.valor === "Sí") {
                      checkboxesSimples.push({
                        titulo: tituloCampo,
                        valor: resultado.valor,
                        field,
                      });
                    }
                    return null;
                  } else {
                    return {
                      field,
                      valores: resultado.valores,
                      esCorto: false,
                      esCheckboxComplejo: true,
                    };
                  }
                } else {
                  const valorMostrar =
                    typeof valor === "object" && "text" in valor
                      ? valor.text
                      : valor;
                  return {
                    field,
                    valor: valorMostrar,
                    esCorto:
                      typeof valorMostrar === "string" &&
                      valorMostrar.length < 30 &&
                      !valorMostrar.includes("<") &&
                      field.type !== "textarea",
                  };
                }
              })
              .filter(Boolean);

            // Agregar checkboxes simples en dos columnas si hay más de uno
            if (checkboxesSimples.length > 1) {
              contenidoCard += `
                <table style="width: 100%; margin-bottom: 4px; border-collapse: collapse;"><tr>`;

              checkboxesSimples.forEach((checkbox, index) => {
                if (index > 0 && index % 2 === 0) {
                  contenidoCard += "</tr><tr>";
                }

                contenidoCard += `
                  <td style="width: 50%; padding: 2px 10px 2px 0; vertical-align: top;">
                    <strong>${checkbox.titulo}:</strong> ${checkbox.valor}
                  </td>`;
              });

              if (checkboxesSimples.length % 2 !== 0) {
                contenidoCard +=
                  '<td style="width: 50%; padding: 2px 0; vertical-align: top;"></td>';
              }

              contenidoCard += "</tr></table>";
              tieneDatosEnCard = true;
            } else if (checkboxesSimples.length === 1) {
              const checkbox = checkboxesSimples[0];
              contenidoCard += `
                <div style="margin-bottom: 4px;">
                  <strong>${checkbox.titulo}:</strong> ${checkbox.valor}
                </div>`;
              tieneDatosEnCard = true;
            }

            // Procesar otros campos
            if (campos.length > 0) {
              tieneDatosEnCard = true;
              tieneDatosEnTab = true;

              // Campos cortos en tabla de dos columnas
              const camposCortos = campos.filter(
                (c) => c.esCorto && !c.esCheckboxComplejo
              );
              if (camposCortos.length > 0) {
                contenidoCard += `<table style="width: 100%; margin-bottom: 4px; border-collapse: collapse;">`;

                for (let i = 0; i < camposCortos.length; i += 2) {
                  const campo1 = camposCortos[i];
                  const campo2 = camposCortos[i + 1];

                  contenidoCard += `<tr>`;
                  contenidoCard += `<td style="width: 50%; padding: 2px 10px 2px 0; vertical-align: top;">`;
                  if (campo1) {
                    const tituloCampo1 =
                      campo1.field.label ||
                      capitalizar(
                        campo1.field.name
                          .replace(/([A-Z])/g, " $1")
                          .toLowerCase()
                      );
                    contenidoCard += `<strong>${tituloCampo1}:</strong> ${formatearValorOpcion(
                      campo1.valor
                    )}`;
                  }
                  contenidoCard += `</td>`;
                  contenidoCard += `<td style="width: 50%; padding: 2px 0; vertical-align: top;">`;
                  if (campo2) {
                    const tituloCampo2 =
                      campo2.field.label ||
                      capitalizar(
                        campo2.field.name
                          .replace(/([A-Z])/g, " $1")
                          .toLowerCase()
                      );
                    contenidoCard += `<strong>${tituloCampo2}:</strong> ${formatearValorOpcion(
                      campo2.valor
                    )}`;
                  }
                  contenidoCard += `</td>`;
                  contenidoCard += `</tr>`;
                }

                contenidoCard += `</table>`;
              }

              // Procesar otros campos (largos y checkbox complejos)
              campos
                .filter((c) => !c.esCorto || c.esCheckboxComplejo)
                .forEach((campo) => {
                  const tituloCampo =
                    campo.field.label ||
                    capitalizar(
                      campo.field.name.replace(/([A-Z])/g, " $1").toLowerCase()
                    );

                  if (campo.esCheckboxComplejo) {
                    contenidoCard += `
                      <div style="margin-bottom: 4px;">
                        <strong>${tituloCampo}:</strong> Sí<br>
                        ${campo.valores
                          .map((item) => {
                            const valorMostrar =
                              item.type === "textarea"
                                ? limpiarTextarea(item.valor)
                                : formatearValorOpcion(item.valor);
                            return `&nbsp;&nbsp;<strong>${item.label}:</strong> ${valorMostrar}`;
                          })
                          .join("<br>")}
                      </div>`;
                  } else if (campo.field.type === "textarea") {
                    contenidoCard += `
                      <div style="margin-bottom: 4px;">
                        <div><strong>${tituloCampo}: </strong>${limpiarTextarea(
                      campo.valor
                    )}</div>
                      </div>`;
                  } else if (campo.field.type !== "label") {
                    contenidoCard += `
                      <div style="margin-bottom: 4px;">
                        <strong>${tituloCampo}: </strong> ${formatearValorOpcion(
                      campo.valor
                    )}
                      </div>`;
                  }
                });
            }
          }
        }

        if (tieneDatosEnCard) {
          contenidoTab += `
            ${
              card.cardTitle && card.fields.length > 1
                ? `<h4 class="fw-bold text-secondary" style="margin-top: 0; margin-bottom: 3px;">${card.cardTitle}</h4>`
                : ""
            }
            ${contenidoCard}`;
        }
      });

      if (tieneDatosEnTab) {
        contenidoTabs += `
          <h3 class="text-primary" style="margin: 0.75rem 0 0.25rem 0;">${tab.tabName}</h3>
          <hr style="margin: 0.25rem 0 0.5rem 0;">
          ${contenidoTab}`;
      }
    });

    return contenidoTabs;
  };

  // ==================== LÓGICA PRINCIPAL ====================
  // Obtener datos iniciales
  //   const urlConsulta = obtenerUrl(`/medical/clinical-records/${consultaId}`);
  //   const datosConsulta = await obtenerDatos(urlConsulta);

  //   console.log("datosConsulta", datosConsulta);

  //   const urlTipoHistoria = obtenerUrl(
  //     `/medical/clinical-record-types/${datosConsulta.clinicalRecordTypeId}`
  //   );
  //   console.log("urlTipoHistoria", datosConsulta.clinicalRecordTypeId);
  //   const tipoHistoria = await obtenerDatos(urlTipoHistoria);

  // Generar contenido según tipo de consulta
  let contenido = generarContenidoBase(
    datosConsulta.clinicalRecordName,
    datosConsulta.description
  );

  if (datosConsulta.clinicalRecordTypeId === 62) {
    // Formato procedimiento oftalmológico
    contenido += `<h3 style="margin: 0.1rem 0;">Admisión</h3>
    <hr style="margin: 0.25rem 0;">`;

    // Diagnóstico
    if (datosConsulta.data.values.diagnostico) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>Diagnóstico:</strong> ${limpiarTextarea(
          datosConsulta.data.values.diagnostico
        )}</p>`;
    }

    // Procedimiento
    if (datosConsulta.data.values.procedimiento) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>Procedimiento:</strong> ${limpiarTextarea(
          datosConsulta.data.values.procedimiento
        )}</p>`;
    }

    // Observaciones
    if (datosConsulta.data.values.observaciones) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>Observaciones:</strong> ${limpiarTextarea(
          datosConsulta.data.values.observaciones
        )}</p>`;
    }

    // Verificación
    contenido += `<h3 style="margin: 0.1rem 0;">Verificación</h3>
    <hr style="margin: 0.25rem 0;">
    ${generarCamposVerificacion()}`;

    // Aspectos críticos de recuperación
    if (datosConsulta.data.values.aspectosCriticosRecuperacion) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>Aspectos criticos de recuperacion del paciente:</strong> ${limpiarTextarea(
          datosConsulta.data.values.aspectosCriticosRecuperacion
        )}</p>`;
    }

    contenido += `
    <h3 style="margin: 0.1rem 0;">Escala Aldrete</h3>
    <hr style="margin: 0.25rem 0;">
    ${generarEscalaAldrete()}
    `;

    // Hoja de cirugía
    contenido += `<h3 style="margin: 0.1rem 0;">Hoja de cirugia</h3>
    <hr style="margin: 0.25rem 0;">`;

    // Diagnóstico principal
    if (datosConsulta.data.values?.diagnosticoPrincipal) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>Diagnóstico principal:</strong> ${limpiarTextarea(
          datosConsulta.data.values.diagnosticoPrincipal
        )}</p>`;
    }

    // Complicaciones
    if (datosConsulta.data.values.complicaciones) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>Complicaciones:</strong> ${limpiarTextarea(
          datosConsulta.data.values.complicaciones
        )}</p>`;
    }

    // Ojo derecho
    if (datosConsulta.data.values.derecho) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>Ojo derecho:</strong> ${limpiarTextarea(
          datosConsulta.data.values.derecho
        )}</p>`;
    }

    // Ojo izquierdo
    if (datosConsulta.data.values.izquierdo) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>Ojo izquierdo:</strong> ${limpiarTextarea(
          datosConsulta.data.values.izquierdo
        )}</p>`;
    }

    // Descripción de la cirugía
    if (datosConsulta.data.values.descripcionCirugia) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>Descripción de la cirugia:</strong> ${limpiarTextarea(
          datosConsulta.data.values.descripcionCirugia
        )}</p>`;
    }

    // Firmas
    contenido += `<table style="width: 100%; border-collapse: collapse; margin-top: 100px;">
        <tr>
            <td style="width: 50%; padding-right: 20px;">
                <hr style="border: 1px solid black; width: 90%; margin: 0.25rem 0;">
                <p style="text-align: center; margin: 0;">Cirujano</p>
            </td>
            <td style="width: 50%;">
                <hr style="border: 1px solid black; width: 90%; margin: 0.25rem 0;">
                <p style="text-align: center; margin: 0;">Técnico</p>
            </td>
        </tr>
    </table>
    `;

    // Hoja de enfermeria
    if (datosConsulta.data.notasMedicas.exists === true) {
      contenido += `<h3 style="margin: 0.1rem 0;">Hoja de enfermeria</h3>
  <hr style="margin: 0.25rem 0;">
  <table style="width: 100%; border-collapse: collapse; margin: 0.5rem 0; font-size: 0.9rem;">
    <thead>
      <tr style="background-color: #f2f2f2;">
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">#</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Fecha/Hora</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Medicamento</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Observaciones</th>
      </tr>
    </thead>
    <tbody>`;

      // Añadir cada registro como fila de la tabla
      datosConsulta.data.notasMedicas.registros.forEach((registro) => {
        contenido += `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${registro.index}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${
          registro.fechaHora
        }</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${limpiarTextarea(
          registro.medicamento
        )}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${limpiarTextarea(
          registro.observaciones
        )}</td>
      </tr>`;
      });

      contenido += `
    </tbody>
  </table>`;
    }

    // Signos vitales
    contenido += `<h3 style="margin: 0.1rem 0;">Signos vitales</h3>
    <hr style="margin: 0.25rem 0;">`;

    // Tensión arterial (mostrar si al menos uno de los valores existe)
    if (
      datosConsulta.data.values.tensionSistólica ||
      datosConsulta.data.values.tensionDiastólica ||
      datosConsulta.data.values.pam
    ) {
      contenido += `
        <h4 style="margin: 0.1rem 0;">Tensión arterial:</h4> 
        <p style="margin: 0.1rem 0;">
          ${
            datosConsulta.data.values.tensionSistólica
              ? `<strong>Sistólica: </strong> ${datosConsulta.data.values.tensionSistólica}`
              : ""
          }
          ${
            datosConsulta.data.values.tensionDiastólica
              ? `| <strong> Diastólica: </strong> ${datosConsulta.data.values.tensionDiastólica}`
              : ""
          }
          ${
            datosConsulta.data.values.pam
              ? `| <strong>PAM: </strong> ${datosConsulta.data.values.pam}`
              : ""
          }
        </p>`;
    }

    // Frecuencia (mostrar si al menos uno de los valores existe)
    if (
      datosConsulta.data.values.frecC ||
      datosConsulta.data.values.frecR ||
      datosConsulta.data.values.ayuno !== undefined
    ) {
      contenido += `
        <h4 style="margin: 0.1rem 0;">Frecuencia:</h4>
        <p style="margin: 0.1rem 0;">
          ${
            datosConsulta.data.values.frecC
              ? `<strong>Cardiaca: </strong> ${datosConsulta.data.values.frecC}`
              : ""
          }
          ${
            datosConsulta.data.values.frecR
              ? `| <strong>Respiratoria: </strong> ${datosConsulta.data.values.frecR}`
              : ""
          }
          | <strong>Ayuno: </strong> ${
            datosConsulta.data.values.ayuno ? "SI" : "NO"
          }
        </p>`;
    }

    if (
      datosConsulta.data.values.anestesia ||
      datosConsulta.data.values.respiracion
    ) {
      contenido += `
        <p style="margin: 0.1rem 0;">
          ${
            datosConsulta.data.values.anestesia?.text
              ? `<strong>Anestesia:</strong> ${datosConsulta.data.values.anestesia.text}`
              : ""
          }
          ${
            datosConsulta.data.values.respiracion?.text
              ? `| <strong>Respiración:</strong> ${datosConsulta.data.values.respiracion.text}`
              : ""
          }
        </p>`;
    }

    // Agentes inhalados
    if (datosConsulta.data.values.agentesInhalados) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>Agentes inhalados:</strong> ${limpiarTextarea(
          datosConsulta.data.values.agentesInhalados
        )}</p>`;
    }

    // Agente EV
    if (datosConsulta.data.values.agentesEV) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>Agente EV:</strong> ${limpiarTextarea(
          datosConsulta.data.values.agentesEV
        )}</p>`;
    }

    // Bloqueos
    if (datosConsulta.data.values.bloqueo) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>Bloqueos:</strong> ${limpiarTextarea(
          datosConsulta.data.values.bloqueo
        )}</p>`;
    }

    // Mantenimientos
    if (datosConsulta.data.values.mantenimientos) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>Mantenimientos:</strong> ${limpiarTextarea(
          datosConsulta.data.values.mantenimientos
        )}</p>`;
    }

    if (datosConsulta.data.values.sat02 || datosConsulta.data.values.etc02) {
      contenido += `
        <p style="margin: 0.1rem 0;">
          ${
            datosConsulta.data.values.sat02
              ? `<strong>SAT02:</strong> ${datosConsulta.data.values.sat02}`
              : ""
          }
          ${
            datosConsulta.data.values.etc02
              ? `| <strong>ETCO2:</strong> ${datosConsulta.data.values.etc02}`
              : ""
          }
        </p>`;
    }

    // Posición
    if (datosConsulta.data.values.posicion) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>Posición:</strong> ${limpiarTextarea(
          datosConsulta.data.values.posicion
        )}</p>`;
    }

    // EKG
    if (datosConsulta.data.values.ekg) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>EKG:</strong> ${limpiarTextarea(
          datosConsulta.data.values.ekg
        )}</p>`;
    }

    // Temp
    if (datosConsulta.data.values.temp) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>Temp:</strong> ${limpiarTextarea(
          datosConsulta.data.values.temp
        )}</p>`;
    }

    // Cam
    if (datosConsulta.data.values.cam) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>Cam:</strong> ${limpiarTextarea(
          datosConsulta.data.values.cam
        )}</p>`;
    }

    //Observaciones postquirurgicas
    if (datosConsulta.data.observacionesPostQuirurgicas.exists === true) {
      contenido += `<h3 style="margin: 0.1rem 0;">Observaciones Post-Quirúrgicas</h3>
  <hr style="margin: 0.25rem 0;">
  <table style="width: 100%; border-collapse: collapse; margin: 0.5rem 0; font-size: 0.9rem;">
    <thead>
      <tr style="background-color: #f2f2f2;">
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">#</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Fecha/Hora</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Observación</th>
      </tr>
    </thead>
    <tbody>`;

      // Añadir cada registro como fila de la tabla
      datosConsulta.data.observacionesPostQuirurgicas.registros.forEach(
        (registro) => {
          contenido += `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${registro.index}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${
          registro.fechaHora
        }</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${limpiarTextarea(
          registro.observacion
        )}</td>
      </tr>`;
        }
      );

      contenido += `
    </tbody>
  </table>`;
    }

    contenido += `<h3 style="margin: 0.1rem 0;">Egreso</h3>
    <hr style="margin: 0.25rem 0;">`;

    // Diagnóstico de ingreso
    if (datosConsulta.data.values.diagnosticoIngreso) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>Diagnóstico de ingreso:</strong> ${limpiarTextarea(
          datosConsulta.data.values.diagnosticoIngreso
        )}</p>`;
    }

    // Procedimientos
    if (datosConsulta.data.values.procedimientos) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>Procedimientos:</strong> ${limpiarTextarea(
          datosConsulta.data.values.procedimientos
        )}</p>`;
    }

    // Diagnóstico de egreso
    if (datosConsulta.data.values.diagnosticoEgreso) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>Diagnóstico de egreso:</strong> ${limpiarTextarea(
          datosConsulta.data.values.diagnosticoEgreso
        )}</p>`;
    }

    // Tratamiento
    if (datosConsulta.data.values.tratamiento) {
      contenido += `
        <p style="margin: 0.1rem 0;"><strong>Tratamiento:</strong> ${limpiarTextarea(
          datosConsulta.data.values.tratamiento
        )}</p>`;
    }
  // } else if (datosConsulta.clinicalRecordTypeId == 63) {
  //   contenido += `
  //   <h3 style="margin: 0.1rem 0;">ANAMNESIS</h3>
  //   <hr style="margin: 0.25rem 0;">
  //   <table style="width: 100%; border-collapse: collapse; margin: 0.5rem 0; font-size: 0.9rem;">
  //     <tr>
  //       <td width="30%">Habilidad manual ${datosConsulta.data.values?.habilidadManual?.text || ""}</td>
  //       <td width="30%">Antecedentes familiares ${datosConsulta.data.values?.antecedentesFamiliares?.text || ""}</td>
  //       <td width="30%">Dolor oido ${datosConsulta.data.values?.dolorOido?.text || ""}</td>
  //     </tr>
  //   </table>
  //   `
  }
   else if (window.location.href.includes("verRecetasOptometria")) {
    contenido += generarTablaCristal(datosConsulta.data.values);
    contenido += `
      <p><strong>Tratamiento: </strong>${datosConsulta.data.values.tratamiento}</p>
      <p><strong>Montura: </strong>${datosConsulta.data.values.montura}</p>`;
  } else if (datosConsulta.clinicalRecordTypeId == 64) {
    contenido += generarInformeNeuro(datosConsulta);
  } else if (datosConsulta.clinicalRecordTypeId === 61) {
    contenido += generarContenidoTabs(datosConsulta);
    contenido += generarTablaCristal(datosConsulta.data.receta);
    if (datosConsulta.data.receta.tratamiento) {
      contenido += `
      <p style="margin: 3px 0;"><strong>Tratamiento: </strong>${datosConsulta.data.receta.tratamiento}</p>`;
    }
    if (datosConsulta.data.receta.montura) {
      contenido += `<p style="margin: 3px 0;"><strong>Montura: </strong>${datosConsulta.data.receta.montura}</p>`;
    }
    // contenido += generarTablaQueratometria(datosConsulta.data.values);
    // contenido += generarAntecedentesOftalmologicos(datosConsulta.data.values);
  } else if (datosConsulta.data.tabsStructure) {
    contenido += generarContenidoTabs(datosConsulta);
  }

  // Cerrar contenedor principal
  contenido += `</div>
  ${datosUsuario(user)}`;

  generatePDFFromHTML(contenido, company, patient, inputId);
}

export default generarFormatoConsulta;
