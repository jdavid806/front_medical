import React from "react";
import ReactDOMServer from "react-dom/server";
import { useGeneratePDF } from "./useGeneratePDF.js";
import { ProductInventoryFormat } from "../formats/ProductInventoryFormat.js";
export const useProductInventoryFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generarFormatoInventario(data, namePDF, type) {
    console.log("Data Balance General", data);
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(ProductInventoryFormat, {
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