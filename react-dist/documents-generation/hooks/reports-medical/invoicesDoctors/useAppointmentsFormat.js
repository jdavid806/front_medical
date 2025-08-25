import React from "react";
import ReactDOMServer from "react-dom/server";
import { AppointmentsFormat } from "../../../formats/reports-medical/invoicesDoctors/AppointmentsFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const useAppointmentsFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormatAppointments(data, rangeDate, type) {
    const namePDF = `Reporte-procedimientos-Facturador`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(AppointmentsFormat, {
      reportData: data,
      dateRange: rangeDate
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type
    });
  }
  return {
    generateFormatAppointments
  };
};