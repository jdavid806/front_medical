import React from "react";
import ReactDOMServer from "react-dom/server";
import { DiagnosisGroupedByPatient } from "../../../formats/reports-medical/clinicalRecords/DiagnosisGroupedByPatientFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const useDiagnosisGroupedByPatientFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormatDiagnosisGroupedByPatient(data, mainNode, dateRange, type) {
    const namePDF = `Reporte-Agendamiento`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(DiagnosisGroupedByPatient, {
      data: data,
      mainNode: mainNode,
      dateRange: dateRange
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      orientation: "landscape"
    });
  }
  return {
    generateFormatDiagnosisGroupedByPatient
  };
};