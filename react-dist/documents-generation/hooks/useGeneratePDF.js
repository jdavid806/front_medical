import { useCompany } from "../../hooks/useCompany.js";
import { generatePDFFromHTMLV2 } from "../../../funciones/funcionesJS/exportPDFV2.js";
export const useGeneratePDF = () => {
  const {
    company
  } = useCompany();
  function generatePDF({
    html,
    pdfName,
    type,
    orientation = "portrait"
  }) {
    generatePDFFromHTMLV2(html, company, {
      name: pdfName,
      isDownload: type !== "Impresion",
      orientation: orientation
    });
  }
  return {
    generatePDF
  };
};