import React from "react";
import ReactDOMServer from "react-dom/server";
import { PaymentsFormat } from "../../../formats/reports-medical/invoices/PaymentsFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const usePaymentsFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormatPayments(data, rangeDate, type) {
    const namePDF = `Reporte-Facturas-metodos-de-pago`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(PaymentsFormat, {
      reportData: data,
      dateRange: rangeDate
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      orientation: "landscape"
    });
  }
  return {
    generateFormatPayments
  };
};