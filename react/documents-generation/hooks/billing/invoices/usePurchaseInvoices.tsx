import React from "react";
import ReactDOMServer from "react-dom/server";
import { PurchaseInvoicesFormat } from "../../../formats/billing/invoices/PurchaseInvoicesFormat";
import { useGeneratePDF } from "../../useGeneratePDF";

export const usePurchaseInvoicesFormat = () => {
  const { generatePDF } = useGeneratePDF();

  function generateFormatPurchaseInvoices(
    mainData: any,
    type: "Impresion" | "Descargar"
  ) {
    const namePDF = `Reporte-Comisiones-Ordenes`;
    const html = ReactDOMServer.renderToStaticMarkup(
      <PurchaseInvoicesFormat invoice={mainData} />
    );

    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      orientation: "landscape",
    });
  }

  return {
    generateFormatPurchaseInvoices,
  };
};
