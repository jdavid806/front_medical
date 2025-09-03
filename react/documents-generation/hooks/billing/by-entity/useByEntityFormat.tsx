import React from "react";
import ReactDOMServer from "react-dom/server";
import { ByEntityFormat } from "../../../formats/billing/by-entity/ByEntityFormat";
import { useGeneratePDF } from "../../useGeneratePDF";

export const useByEntityFormat = () => {
  const { generatePDF } = useGeneratePDF();

  function generateFormatByEntity(
    mainData,
    dateRange,
    type: "Impresion" | "Descargar"
  ) {
    const namePDF = `Reporte-Comisiones-Ordenes`;
    const html = ReactDOMServer.renderToStaticMarkup(
      <ByEntityFormat mainNode={mainData} dateRange={dateRange} />
    );

    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      orientation: "landscape",
    });
  }

  return {
    generateFormatByEntity,
  };
};
