import React from "react";
import ReactDOMServer from "react-dom/server";
import { PaymentsFormat } from "../../../formats/reports-medical/invoices/PaymentsFormat";
import { useGeneratePDF } from "../../useGeneratePDF";

export const usePaymentsFormat = () => {
  const { generatePDF } = useGeneratePDF();

  function generateFormatPayments(
    data: any,
    rangeDate,
    type: "Impresion" | "Descargar"
  ) {
    const namePDF = `Reporte-Facturas-metodos-de-pago`;
    const html = ReactDOMServer.renderToStaticMarkup(
      <PaymentsFormat reportData={data} dateRange={rangeDate} />
    );

    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      orientation: "landscape",
    });
  }

  return {
    generateFormatPayments,
  };
};
