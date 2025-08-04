// import { generatePDFFromHTML } from "./exportPDF.js";
import { generarFormatoIncapacidad } from "./formatosImpresion/formatoIncapacidad.js";
import { generarFormatoReceta } from "./formatosImpresion/formatoReceta.js";
import { generarFormatoConsentimiento } from "./formatosImpresion/formatoConsentimiento.js";
import { generarFormatoConsulta } from "./formatosImpresion/formatoConsulta.js";
import { generarFormatoRecetaOrden } from "./formatosImpresion/formatoRecetaOrden.js";
import { generarFormatoOrden } from "./formatosImpresion/formatoOrden.js";
import { generarFormatoRecetaOptometria } from "./formatosImpresion/formatoRecetaOptometria.js";

export function generarFormato(name, object, tipo, inputId = "") {
  switch (name) {
    case "Incapacidad":
      generarFormatoIncapacidad(object, tipo, inputId);
      break;
    case "Consentimiento":
      generarFormatoConsentimiento(object, tipo);
      break;
    case "Consulta":
      generarFormatoConsulta(object, tipo, inputId);
      break;
    case "RecetaExamen":
      generarFormatoRecetaOrden(object, tipo, inputId);
      break;
    case "Receta":
      generarFormatoReceta(object, tipo, inputId);
      break;
    case "Examen":
      generarFormatoOrden(object, tipo, inputId);
      break;
    case "RecetaOptometria":
      generarFormatoRecetaOptometria(object, tipo, inputId);
      break;
    case "ReciboCaja":
      generarFormatoReciboCaja(object, tipo);
      break;

    default:
      break;
  }
}
