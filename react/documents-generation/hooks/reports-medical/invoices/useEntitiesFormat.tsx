import React from "react";
import ReactDOMServer from "react-dom/server";
import { EntitiesFormat }  from "../../../formats/reports-medical/invoices/EntitiesFormat";
import { useGeneratePDF } from "../../useGeneratePDF";

export const useEntitiesFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generateFormatEntities(data: any, rangeDate, type: 'Impresion' | 'Descargar') {

        const namePDF = `Reporte-Facturas-Entidades`;
        const html = ReactDOMServer.renderToStaticMarkup(
            <EntitiesFormat reportData={data} dateRange={rangeDate} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type
        });
    }

    return {
        generateFormatEntities
    }
}