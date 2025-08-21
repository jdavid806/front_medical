import React from "react";
import ReactDOMServer from "react-dom/server";
import { ProceduresCountFormat }  from "../../../formats/reports-medical/invoices/ProceduresCountFormat";
import { useGeneratePDF } from "../../useGeneratePDF";

export const useProceduresCountFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generateFormatProceduresCount(data: any, dateRange, type: 'Impresion' | 'Descargar') {

        const namePDF = `Reporte-procedimientos#-Facturador`;
        const html = ReactDOMServer.renderToStaticMarkup(
            <ProceduresCountFormat reportData={data} dateRange={dateRange} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type
        });
    }

    return {
        generateFormatProceduresCount
    }
}