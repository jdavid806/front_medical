import React from "react";
import ReactDOMServer from "react-dom/server";
import { ServicesFormat } from "../../../formats/reports-medical/commissions/ServicesFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const useServicesFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormatServices(data, mainData, dateRange, type) {
    const namePDF = `Reporte-Comisiones-Servicios`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(ServicesFormat, {
      data: data,
      mainNode: mainData,
      dateRange: dateRange,
      nameReport: namePDF
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      orientation: "landscape"
    });
  }
  return {
    generateFormatServices
  };
};