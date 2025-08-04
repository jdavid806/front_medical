import React from "react";
import ReactDOMServer from "react-dom/server";
import { useGeneratePDF } from "./useGeneratePDF.js";
import { ComparativeStatusResultFormat } from "../formats/ComparativeStatusResultFormat.js";
export const useComparativeStatusResultFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateComparativeStatusResultFormat(data, type) {
    console.log("Data Comparativo Estado Resultados", data);
    const namePDF = `Reporte-Comparativo-Estado-Resultados`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(ComparativeStatusResultFormat, {
      comparativeIncomeStatementData: data
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type
    });
  }
  return {
    generateComparativeStatusResultFormat
  };
};