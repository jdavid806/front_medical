import React from "react";
import ReactDOMServer from "react-dom/server";
import { useCompany } from "../../hooks/useCompany";
import { generatePDFFromHTMLV2 } from "../../../funciones/funcionesJS/exportPDFV2";

export const useGeneratePDF = () => {
  const { company } = useCompany();

  function generatePDF({
    html,
    pdfName,
    type,
    orientation = "portrait",
  }: {
    html: string;
    pdfName: string;
    type: "Impresion" | "Descargar";
    orientation?: "portrait" | "landscape";
    dimensions?: Array<any>;
  }) {
    generatePDFFromHTMLV2(html, company, {
      name: pdfName,
      isDownload: type !== "Impresion",
      orientation: orientation,
    });
  }

  return {
    generatePDF,
  };
};
