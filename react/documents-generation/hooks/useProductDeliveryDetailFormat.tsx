import React from "react";
import ReactDOMServer from "react-dom/server";
import { useGeneratePDF } from "./useGeneratePDF";
import { MedicalSupply } from "../../pharmacy/supplies/interfaces";
import { MedicalSupplyManager } from "../../helpers/MedicalSupplyManager";
import { ProductDeliveryDetailFormat } from "../formats/ProductDeliveryDetailFormat";

interface ProductDeliveryDetailFormatProps {
    delivery: MedicalSupply;
    deliveryManager: MedicalSupplyManager;
    type: 'Impresion' | 'Descargar';
}

export const useProductDeliveryDetailFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generateFormat(data: ProductDeliveryDetailFormatProps) {

        const { delivery, deliveryManager, type } = data;

        console.log("Data Balance General", data);

        const namePDF = `Solicitud-Productos-${delivery.id}`;
        const html = ReactDOMServer.renderToStaticMarkup(
            <ProductDeliveryDetailFormat delivery={delivery} deliveryManager={deliveryManager} />
        );

        generatePDF({
            html: html,
            pdfName: namePDF,
            type: type
        });
    }

    return {
        generateFormat
    }
}