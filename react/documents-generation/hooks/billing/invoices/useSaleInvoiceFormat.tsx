import React from "react";
import ReactDOMServer from "react-dom/server";
import { SaleInvoicesFormat } from "../../../formats/billing/invoices/SalesInvoicesFormat";
import { useGeneratePDF } from "../../useGeneratePDF";

export const useSaleInvoicesFormat = () => {
  const { generatePDF } = useGeneratePDF();

  function generateFormatSaleInvoices(
    mainData: any,
    type: "Impresion" | "Descargar"
  ) {
    const namePDF = `Reporte-Factura-Venta`;
    const html = ReactDOMServer.renderToStaticMarkup(
      <SaleInvoicesFormat invoice={mainData} />
    );

    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      orientation: "landscape",
    });
  }

  return {
    generateFormatSaleInvoices,
  };
};
