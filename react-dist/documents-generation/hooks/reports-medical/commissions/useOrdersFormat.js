import React from "react";
import ReactDOMServer from "react-dom/server";
import { OrdersFormat } from "../../../formats/reports-medical/commissions/OrdersFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const useOrdersFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormatOrders(data, mainData, dateRange, type) {
    const namePDF = `Reporte-Comisiones-Ordenes`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(OrdersFormat, {
      data: data,
      mainNode: mainData,
      dateRange: dateRange
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      orientation: "landscape"
    });
  }
  return {
    generateFormatOrders
  };
};