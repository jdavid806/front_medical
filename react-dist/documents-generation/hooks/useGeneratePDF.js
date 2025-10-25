import { useCompany } from "../../hooks/useCompany.js";
import { generatePDFFromHTML } from "../../../funciones/funcionesJS/exportPDF.js";
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
    generatePDFFromHTML(html, company, {
      name: pdfName,
      isDownload: type !== "Impresion",
      orientation: orientation
    });
  }
  return {
    generatePDF
  };
};