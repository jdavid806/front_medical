import React from "react";
import ReactDOMServer from "react-dom/server";
import { useGeneratePDF } from "./useGeneratePDF.js";
import { ProductDeliveryDetailFormat } from "../formats/ProductDeliveryDetailFormat.js";
export const useProductDeliveryDetailFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormat(data) {
    const {
      delivery,
      deliveryManager,
      type
    } = data;
    console.log("Data Balance General", data);
    const namePDF = `Solicitud-Productos-${delivery.id}`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(ProductDeliveryDetailFormat, {
      delivery: delivery,
      deliveryManager: deliveryManager
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type
    });
  }
  return {
    generateFormat
  };
};