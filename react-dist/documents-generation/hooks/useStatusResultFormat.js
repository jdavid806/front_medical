import React from "react";
import ReactDOMServer from "react-dom/server";
import { useGeneratePDF } from "./useGeneratePDF.js";
import { StatusResultFormat } from "../formats/StatusResultFormat.js";
export const useStatusResultFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateStatusResultFormat(data, type) {
    console.log("Data Status Result", data);
    const namePDF = `Reporte-Estado-Resultados`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(StatusResultFormat, {
      incomeStatementData: data
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type
    });
  }
  return {
    generateStatusResultFormat
  };
};