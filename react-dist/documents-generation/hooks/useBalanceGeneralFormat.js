import React from "react";
import ReactDOMServer from "react-dom/server";
import { BalanceGeneralFormat } from "../formats/BalanceGeneralFormat.js";
import { useGeneratePDF } from "./useGeneratePDF.js";
export const useBalanceGeneralFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generarFormatoBalanceGeneral(data, date, type) {
    console.log("Data Balance General", data);
    const namePDF = `Reporte-Balance-General`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(BalanceGeneralFormat, {
      balanceSheetData: data,
      date: date
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type
    });
  }
  return {
    generarFormatoBalanceGeneral
  };
};