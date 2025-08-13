import React from "react";
import ReactDOMServer from "react-dom/server";
import { useGeneratePDF } from "./useGeneratePDF";
import { ProductInventoryFormat } from "../formats/ProductInventoryFormat";

export const useProductInventoryFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generarFormatoInventario(data: any, namePDF: string, type: 'Impresion' | 'Descargar') {

        console.log("Data Balance General", data);

        const html = ReactDOMServer.renderToStaticMarkup(
            <ProductInventoryFormat inventoryData={data} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type
        });
    }

    return {
        generarFormatoInventario
    }
}