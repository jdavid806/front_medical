import React from "react";
import ReactDOMServer from "react-dom/server";
import { EntitiesCountFormat } from "../../../formats/reports-medical/invoicesDoctors/EntitiesCountFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const useEntitiesCountFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormatEntitiesCount(data, rangeDate, type) {
    const namePDF = `Reporte-procedimientos-Facturador`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(EntitiesCountFormat, {
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
    generateFormatEntitiesCount
  };
};