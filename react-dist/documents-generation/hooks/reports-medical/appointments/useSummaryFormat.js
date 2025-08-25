import React from "react";
import ReactDOMServer from "react-dom/server";
import { SummaryFormat } from "../../../formats/reports-medical/appointments/SummaryFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const useSummaryFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormatSummary(data, state, rangeDate, type) {
    const namePDF = `Reporte-Citas-Estados`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(SummaryFormat, {
      entries: data,
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
    generateFormatSummary
  };
};