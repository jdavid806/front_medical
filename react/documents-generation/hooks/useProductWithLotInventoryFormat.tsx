import React from "react";
import ReactDOMServer from "react-dom/server";
import { BalanceGeneralFormat } from "../formats/BalanceGeneralFormat";
import { useGeneratePDF } from "./useGeneratePDF";
import { BalanceGeneralResponse } from "../../billing/reports/hooks/useBalanceGeneral";
import { ProductWithLotInventoryFormat } from "../formats/ProductWithLotInventoryFormat";

export const useProductWithLotInventoryFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generarFormatoInventario(data: any, namePDF: string, type: 'Impresion' | 'Descargar') {

        console.log("Data Balance General", data);

        const html = ReactDOMServer.renderToStaticMarkup(
            <ProductWithLotInventoryFormat inventoryData={data} />
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