import React from "react";
import ReactDOMServer from "react-dom/server";
import { ProceduresCountFormat } from "../../../formats/reports-medical/invoices/ProceduresCountFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const useProceduresCountFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormatProceduresCount(data, dateRange, type) {
    const namePDF = `Reporte-procedimientos#-Facturador`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(ProceduresCountFormat, {
      reportData: data,
      dateRange: dateRange
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type
    });
  }
  return {
    generateFormatProceduresCount
  };
};