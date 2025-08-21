import React from "react";
import ReactDOMServer from "react-dom/server";
import { ProceduresCashFormat } from "../../../formats/reports-medical/invoices/ProceduresCashFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const useProceduresCashFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormatProceduresCash(data, rangeDate, type) {
    const namePDF = `Reporte-procedimientos-Facturador`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(ProceduresCashFormat, {
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
    generateFormatProceduresCash
  };
};