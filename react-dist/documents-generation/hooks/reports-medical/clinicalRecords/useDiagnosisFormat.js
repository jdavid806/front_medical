import React from "react";
import ReactDOMServer from "react-dom/server";
import { Diagnosis } from "../../../formats/reports-medical/clinicalRecords/DiagnosisFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const useDiagnosisFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormatDiagnosis(data, dateRange, type) {
    const namePDF = `Reporte-Agendamiento`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(Diagnosis, {
      data: data,
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
    generateFormatDiagnosis
  };
};