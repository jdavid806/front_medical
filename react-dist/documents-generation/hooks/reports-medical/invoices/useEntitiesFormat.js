import React from "react";
import ReactDOMServer from "react-dom/server";
import { EntitiesFormat } from "../../../formats/reports-medical/invoices/EntitiesFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const useEntitiesFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormatEntities(data, rangeDate, type) {
    const namePDF = `Reporte-Facturas-Entidades`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(EntitiesFormat, {
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
    generateFormatEntities
  };
};