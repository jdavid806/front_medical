import React from "react";
import ReactDOMServer from "react-dom/server";
import { ProductivityFormat }  from "../../../formats/reports-medical/invoicesDoctors/ProductivityFormat";
import { useGeneratePDF } from "../../useGeneratePDF";

export const useProductivityFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generateFormatProductivity(data: any, rangeDate, type: 'Impresion' | 'Descargar') {

        const namePDF = `Reporte-procedimientos-Facturador`;
        const html = ReactDOMServer.renderToStaticMarkup(
            <ProductivityFormat reportData={data} dateRange={rangeDate} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type
        });
    }

    return {
        generateFormatProductivity
    }
}