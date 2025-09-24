import React from "react";
import ReactDOMServer from "react-dom/server";
import { Diagnosis } from "../../../formats/reports-medical/clinicalRecords/DiagnosisFormat";
import { useGeneratePDF } from "../../useGeneratePDF";

export const useDiagnosisFormat = () => {
  const { generatePDF } = useGeneratePDF();

  function generateFormatDiagnosis(
    data: any,
    dateRange: any,
    type: "Impresion" | "Descargar"
  ) {
    const namePDF = `Reporte-Agendamiento`;
    const html = ReactDOMServer.renderToStaticMarkup(
      <Diagnosis data={data} dateRange={dateRange} />
    );

    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      orientation: "landscape",
    });
  }

  return {
    generateFormatDiagnosis,
  };
};
