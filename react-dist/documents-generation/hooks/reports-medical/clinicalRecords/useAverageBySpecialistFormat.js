import React from "react";
import ReactDOMServer from "react-dom/server";
import { AverageBySpecialist } from "../../../formats/reports-medical/clinicalRecords/AverageBySpecialistFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const useAverageBySpecialistFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormatAverageBySpecialist(data, mainNode, dateRange, type) {
    const namePDF = `Reporte-Agendamiento`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(AverageBySpecialist, {
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
    generateFormatAverageBySpecialist
  };
};