// import { generatePDFFromHTML } from "./exportPDF.js";
import { generarFormatoIncapacidad } from "./formatosImpresion/formatoIncapacidad.js";
import { generarFormatoReceta } from "./formatosImpresion/formatoReceta.js";
import { generarFormatoConsentimiento } from "./formatosImpresion/formatoConsentimiento.js";
import { generarFormatoConsulta } from "./formatosImpresion/formatoConsulta.js";
import { generarFormatoRecetaOrden } from "./formatosImpresion/formatoRecetaOrden.js";
import { generarFormatoOrden } from "./formatosImpresion/formatoOrden.js";
import { generarFormatoRecetaOptometria } from "./formatosImpresion/formatoRecetaOptometria.js";
import { generarFormatoCita } from "./formatosImpresion/formatoCita.js";
import { generarFormatoFactura } from "./formatosImpresion/formatoAdmisionFactura.js";


export async function generarFormato(name, object, tipo, inputId = "") {
  switch (name) {
    case "Incapacidad":
      await generarFormatoIncapacidad(object, tipo, inputId);
      break;
    case "Consentimiento":
      generarFormatoConsentimiento(object, tipo);
      break;
    case "Consulta":
      await generarFormatoConsulta(object, tipo, inputId);
      break;
    case "RecetaExamen":
      await generarFormatoRecetaOrden(object, tipo, inputId);
      break;
    case "Receta":
      await generarFormatoReceta(object, tipo, inputId);
      break;
    case "Examen":
      await generarFormatoOrden(object, tipo, inputId);
      break;
    case "RecetaOptometria":
      await generarFormatoRecetaOptometria(object, tipo, inputId);
      break;
    case "ReciboCaja":
      generarFormatoReciboCaja(object, tipo);
      break;
    case "Cita":
      generarFormatoCita(object, tipo, inputId);
      break;

    case "Factura":
      await generarFormatoFactura(object, tipo, inputId);
      break;

    default:
      break;
  }
}
