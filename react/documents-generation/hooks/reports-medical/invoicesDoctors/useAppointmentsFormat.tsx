import React from "react";
import ReactDOMServer from "react-dom/server";
import { AppointmentsFormat }  from "../../../formats/reports-medical/invoicesDoctors/AppointmentsFormat";
import { useGeneratePDF } from "../../useGeneratePDF";

export const useAppointmentsFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generateFormatAppointments(data: any, rangeDate, type: 'Impresion' | 'Descargar') {

        const namePDF = `Reporte-procedimientos-Facturador`;
        const html = ReactDOMServer.renderToStaticMarkup(
            <AppointmentsFormat reportData={data} dateRange={rangeDate} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type
        });
    }

    return {
        generateFormatAppointments
    }
}