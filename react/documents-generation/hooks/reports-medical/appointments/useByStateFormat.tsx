import React from "react";
import ReactDOMServer from "react-dom/server";
import { ByStateFormat }  from "../../../formats/reports-medical/appointments/ByStateFormat";
import { useGeneratePDF } from "../../useGeneratePDF";

export const useByStateFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generateFormatByState(data: any, state, rangeDate, type: 'Impresion' | 'Descargar') {

        const namePDF = `Reporte-Citas-Estados`;
        const html = ReactDOMServer.renderToStaticMarkup(
            <ByStateFormat appointments={data} state={state} dateRange={rangeDate} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type
        });
    }

    return {
        generateFormatByState
    }
}