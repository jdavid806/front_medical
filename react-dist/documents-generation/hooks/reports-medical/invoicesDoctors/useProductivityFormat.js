import React from "react";
import ReactDOMServer from "react-dom/server";
import { ProductivityFormat } from "../../../formats/reports-medical/invoicesDoctors/ProductivityFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const useProductivityFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormatProductivity(data, rangeDate, type) {
    const namePDF = `Reporte-procedimientos-Facturador`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(ProductivityFormat, {
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
    generateFormatProductivity
  };
};