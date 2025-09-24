import React from "react";
import ReactDOMServer from "react-dom/server";
import { ByScheduler } from "../../../formats/reports-medical/appointments/BySchedulerFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const useBySchedulerFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormatByScheduler(data, scheduler, dateRange, type) {
    const namePDF = `Reporte-Agendamiento`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(ByScheduler, {
      data: data,
      scheduler: scheduler,
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
    generateFormatByScheduler
  };
};