import { useCompany } from "../../hooks/useCompany.js";
import { generatePDFFromHTML } from "../../../funciones/funcionesJS/exportPDF.js";
export const useGeneratePDF = () => {
  const {
    company
  } = useCompany();
  function generatePDF({
    html,
    pdfName,
    type
  }) {
    console.log(company);
    generatePDFFromHTML(html, company, {
      name: pdfName,
      isDownload: type !== "Impresion"
    });
  }
  return {
    generatePDF
  };
};