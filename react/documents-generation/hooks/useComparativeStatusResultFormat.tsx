import React from "react";
import ReactDOMServer from "react-dom/server";
import { useGeneratePDF } from "./useGeneratePDF";
import { ComparativeStatusResultResponse } from "../../billing/reports/hooks/useComparativeStatusResult";
import { ComparativeStatusResultFormat } from "../formats/ComparativeStatusResultFormat";

export const useComparativeStatusResultFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generateComparativeStatusResultFormat(data: ComparativeStatusResultResponse, type: 'Impresion' | 'Descargar') {

        console.log("Data Comparativo Estado Resultados", data);

        const namePDF = `Reporte-Comparativo-Estado-Resultados`;
        const html = ReactDOMServer.renderToStaticMarkup(
            <ComparativeStatusResultFormat comparativeIncomeStatementData={data} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type
        });
    }

    return {
        generateComparativeStatusResultFormat
    }
}
