import React from "react";
import ReactDOMServer from "react-dom/server";
import { useGeneratePDF } from "./useGeneratePDF.js";
import { ProductWithLotInventoryFormat } from "../formats/ProductWithLotInventoryFormat.js";
export const useProductWithLotInventoryFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generarFormatoInventario(data, namePDF, type) {
    console.log("Data Balance General", data);
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(ProductWithLotInventoryFormat, {
      inventoryData: data
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type
    });
  }
  return {
    generarFormatoInventario
  };
};