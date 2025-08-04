import React from "react";
import ReactDOMServer from "react-dom/server";
import { BalanceGeneralFormat } from "../formats/BalanceGeneralFormat";
import { useGeneratePDF } from "./useGeneratePDF";
import { ComparativeBalanceGeneralResponse } from "../../billing/reports/hooks/useComparativeBalanceGeneral";
import { ComparativeBalanceGeneralFormat } from "../formats/ComparativeBalanceGeneralFormat";

export const useComparativeBalanceGeneralFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generateComparativeBalanceGeneralFormat(data: ComparativeBalanceGeneralResponse, type: 'Impresion' | 'Descargar') {

        console.log("Data Comparativo Balance General", data);

        const namePDF = `Reporte-Comparativo-Balance-General`;
        const html = ReactDOMServer.renderToStaticMarkup(
            <ComparativeBalanceGeneralFormat comparativeBalanceSheetData={data} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type
        });
    }

    return {
        generateComparativeBalanceGeneralFormat
    }
}