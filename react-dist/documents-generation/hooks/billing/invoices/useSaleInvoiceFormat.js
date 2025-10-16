import React from "react";
import ReactDOMServer from "react-dom/server";
import { SaleInvoicesFormat } from "../../../formats/billing/invoices/SalesInvoicesFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const useSaleInvoicesFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormatSaleInvoices(mainData, type) {
    const namePDF = `Reporte-Factura-Venta`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(SaleInvoicesFormat, {
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
    generateFormatSaleInvoices
  };
};