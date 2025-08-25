import React from "react";
import ReactDOMServer from "react-dom/server";
import { ByStateFormat } from "../../../formats/reports-medical/appointments/ByStateFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const useByStateFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormatByState(data, state, rangeDate, type) {
    const namePDF = `Reporte-Citas-Estados`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(ByStateFormat, {
      appointments: data,
      state: state,
      dateRange: rangeDate
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type
    });
  }
  return {
    generateFormatByState
  };
};