import React from "react";
import ReactDOMServer from "react-dom/server";
import { OrdersFormat } from "../../../formats/reports-medical/commissions/OrdersFormat";
import { useGeneratePDF } from "../../useGeneratePDF";

export const useOrdersFormat = () => {
  const { generatePDF } = useGeneratePDF();

  function generateFormatOrders(
    data: any,
    mainData,
    dateRange,
    type: "Impresion" | "Descargar"
  ) {
    const namePDF = `Reporte-Comisiones-Ordenes`;
    const html = ReactDOMServer.renderToStaticMarkup(
      <OrdersFormat data={data} mainNode={mainData} dateRange={dateRange} />
    );

    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      orientation: "landscape",
    });
  }

  return {
    generateFormatOrders,
  };
};
