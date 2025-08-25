import React from "react";
import ReactDOMServer from "react-dom/server";
import { EntitiesCountFormat }  from "../../../formats/reports-medical/invoicesDoctors/EntitiesCountFormat";
import { useGeneratePDF } from "../../useGeneratePDF";

export const useEntitiesCountFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generateFormatEntitiesCount(data: any, rangeDate, type: 'Impresion' | 'Descargar') {

        const namePDF = `Reporte-procedimientos-Facturador`;
        const html = ReactDOMServer.renderToStaticMarkup(
            <EntitiesCountFormat reportData={data} dateRange={rangeDate} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type
        });
    }

    return {
        generateFormatEntitiesCount
    }
}