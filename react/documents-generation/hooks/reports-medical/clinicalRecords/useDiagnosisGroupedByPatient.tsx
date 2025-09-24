import React from "react";
import ReactDOMServer from "react-dom/server";
import { DiagnosisGroupedByPatient } from "../../../formats/reports-medical/clinicalRecords/DiagnosisGroupedByPatientFormat";
import { useGeneratePDF } from "../../useGeneratePDF";

export const useDiagnosisGroupedByPatientFormat = () => {
  const { generatePDF } = useGeneratePDF();

  function generateFormatDiagnosisGroupedByPatient(
    data: any,
    mainNode: any,
    dateRange: any,
    type: "Impresion" | "Descargar"
  ) {
    const namePDF = `Reporte-Agendamiento`;
    const html = ReactDOMServer.renderToStaticMarkup(
      <DiagnosisGroupedByPatient data={data} mainNode={mainNode} dateRange={dateRange} />
    );

    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      orientation: "landscape",
    });
  }

  return {
    generateFormatDiagnosisGroupedByPatient,
  };
};
