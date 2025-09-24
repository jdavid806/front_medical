import React from "react";
import ReactDOMServer from "react-dom/server";
import { ByScheduler } from "../../../formats/reports-medical/appointments/BySchedulerFormat";
import { useGeneratePDF } from "../../useGeneratePDF";

export const useBySchedulerFormat = () => {
  const { generatePDF } = useGeneratePDF();

  function generateFormatByScheduler(
    data: any,
    scheduler: any,
    dateRange: any,
    type: "Impresion" | "Descargar"
  ) {
    const namePDF = `Reporte-Agendamiento`;
    const html = ReactDOMServer.renderToStaticMarkup(
      <ByScheduler data={data} scheduler={scheduler} dateRange={dateRange} />
    );

    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      orientation: "landscape",
    });
  }

  return {
    generateFormatByScheduler,
  };
};
