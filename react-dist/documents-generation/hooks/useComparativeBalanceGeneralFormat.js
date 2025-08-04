import React from "react";
import ReactDOMServer from "react-dom/server";
import { useGeneratePDF } from "./useGeneratePDF.js";
import { ComparativeBalanceGeneralFormat } from "../formats/ComparativeBalanceGeneralFormat.js";
export const useComparativeBalanceGeneralFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateComparativeBalanceGeneralFormat(data, type) {
    console.log("Data Comparativo Balance General", data);
    const namePDF = `Reporte-Comparativo-Balance-General`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(ComparativeBalanceGeneralFormat, {
      comparativeBalanceSheetData: data
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type
    });
  }
  return {
    generateComparativeBalanceGeneralFormat
  };
};