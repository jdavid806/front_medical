import React from "react";
import ReactDOMServer from "react-dom/server";
import { useGeneratePDF } from "./useGeneratePDF";
import { StatusResultResponse } from "../../billing/reports/hooks/useStatusResult";
import { StatusResultFormat } from "../formats/StatusResultFormat";

export const useStatusResultFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generateStatusResultFormat(data: StatusResultResponse, type: 'Impresion' | 'Descargar') {

        console.log("Data Status Result", data);

        const namePDF = `Reporte-Estado-Resultados`;
        const html = ReactDOMServer.renderToStaticMarkup(
            <StatusResultFormat incomeStatementData={data} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type
        });
    }

    return {
        generateStatusResultFormat
    }
}
