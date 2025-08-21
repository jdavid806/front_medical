import React from "react";
import ReactDOMServer from "react-dom/server";
import { ServicesFormat } from "../../../formats/reports-medical/commissions/ServicesFormat";
import { useGeneratePDF } from "../../useGeneratePDF";

export const useServicesFormat = () => {
  const { generatePDF } = useGeneratePDF();

  function generateFormatServices(
    data: any,
    mainData,
    dateRange,
    type: "Impresion" | "Descargar"
  ) {
    const namePDF = `Reporte-Comisiones-Servicios`;
    const html = ReactDOMServer.renderToStaticMarkup(
      <ServicesFormat data={data} mainNode={mainData} dateRange={dateRange} nameReport={namePDF} />
    );

    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      orientation: "landscape",
    });
  }

  return {
    generateFormatServices,
  };
};
