import React from "react";
import ReactDOMServer from "react-dom/server";
import { ByEntityFormat } from "../../../formats/billing/by-entity/ByEntityFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const useByEntityFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormatByEntity(mainData, dateRange, type) {
    const namePDF = `Reporte-Comisiones-Ordenes`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(ByEntityFormat, {
      mainNode: mainData,
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
    generateFormatByEntity
  };
};