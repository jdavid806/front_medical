import React from "react";
import ReactDOMServer from "react-dom/server";
import { PurchaseInvoicesFormat } from "../../../formats/billing/invoices/PurchaseInvoicesFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const usePurchaseInvoicesFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormatPurchaseInvoices(mainData, type) {
    const namePDF = `Reporte-Comisiones-Ordenes`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(PurchaseInvoicesFormat, {
      invoice: mainData
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      orientation: "landscape"
    });
  }
  return {
    generateFormatPurchaseInvoices
  };
};