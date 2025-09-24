import React from "react";
import ReactDOMServer from "react-dom/server";
import { AverageBySpecialist } from "../../../formats/reports-medical/clinicalRecords/AverageBySpecialistFormat";
import { useGeneratePDF } from "../../useGeneratePDF";

export const useAverageBySpecialistFormat = () => {
  const { generatePDF } = useGeneratePDF();

  function generateFormatAverageBySpecialist(
    data: any,
    mainNode: any,
    dateRange: any,
    type: "Impresion" | "Descargar"
  ) {
    const namePDF = `Reporte-Agendamiento`;
    const html = ReactDOMServer.renderToStaticMarkup(
      <AverageBySpecialist data={data} mainNode={mainNode} dateRange={dateRange} />
    );

    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      orientation: "landscape",
    });
  }

  return {
    generateFormatAverageBySpecialist,
  };
};
