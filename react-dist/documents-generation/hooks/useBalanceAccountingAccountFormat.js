import React from "react";
import ReactDOMServer from "react-dom/server";
import { BalanceAccountingAccountFormat } from "../formats/BalanceAccountingAccountFormat.js";
import { useGeneratePDF } from "./useGeneratePDF.js";
export const useBalanceAccountingAccountFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generarFormatoBalanceAccountingAccount(data, dateRange, type) {
    const namePDF = `Reporte-Balance-Cuenta-Contable`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(BalanceAccountingAccountFormat, {
      balanceData: data,
      dateRange: dateRange
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type
    });
  }
  return {
    generarFormatoBalanceAccountingAccount
  };
};