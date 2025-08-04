import React from "react";
import ReactDOMServer from "react-dom/server";
import { useCompany } from "../../hooks/useCompany";
import { generatePDFFromHTML } from "../../../funciones/funcionesJS/exportPDF";

export const useGeneratePDF = () => {

    const { company } = useCompany();

    function generatePDF({ html, pdfName, type }: {
        html: string;
        pdfName: string;
        type: 'Impresion' | 'Descargar';
    }) {

        console.log(company);

        generatePDFFromHTML(html, company, {
            name: pdfName,
            isDownload: type !== "Impresion"
        });
    }

    return {
        generatePDF
    }
};