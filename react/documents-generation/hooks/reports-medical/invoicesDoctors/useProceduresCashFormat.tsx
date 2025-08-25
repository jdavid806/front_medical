import React from "react";
import ReactDOMServer from "react-dom/server";
import { ProceduresCashFormat }  from "../../../formats/reports-medical/invoicesDoctors/ProceduresCashFormat";
import { useGeneratePDF } from "../../useGeneratePDF";

export const useProceduresCashFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generateFormatProceduresCash(data: any, rangeDate, type: 'Impresion' | 'Descargar') {

        const namePDF = `Reporte-procedimientos-Facturador`;
        const html = ReactDOMServer.renderToStaticMarkup(
            <ProceduresCashFormat reportData={data} dateRange={rangeDate} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type
        });
    }

    return {
        generateFormatProceduresCash
    }
}