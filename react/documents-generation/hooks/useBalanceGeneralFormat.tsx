import React from "react";
import ReactDOMServer from "react-dom/server";
import { BalanceGeneralFormat } from "../formats/BalanceGeneralFormat";
import { useGeneratePDF } from "./useGeneratePDF";
import { BalanceGeneralResponse } from "../../billing/reports/hooks/useBalanceGeneral";

export const useBalanceGeneralFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generarFormatoBalanceGeneral(data: BalanceGeneralResponse, date: string, type: 'Impresion' | 'Descargar') {

        console.log("Data Balance General", data);

        const namePDF = `Reporte-Balance-General`;
        const html = ReactDOMServer.renderToStaticMarkup(
            <BalanceGeneralFormat balanceSheetData={data} date={date} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type
        });
    }

    return {
        generarFormatoBalanceGeneral
    }
}