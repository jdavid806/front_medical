import React from "react";
import ReactDOMServer from "react-dom/server";
import { SummaryFormat }  from "../../../formats/reports-medical/appointments/SummaryFormat";
import { useGeneratePDF } from "../../useGeneratePDF";

export const useSummaryFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generateFormatSummary(data: any, state, rangeDate, type: 'Impresion' | 'Descargar') {

        const namePDF = `Reporte-Citas-Estados`;
        const html = ReactDOMServer.renderToStaticMarkup(
            <SummaryFormat entries={data} state={state} dateRange={rangeDate} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type
        });
    }

    return {
        generateFormatSummary
    }
}