import React from "react";
import ReactDOMServer from "react-dom/server";
import { useGeneratePDF } from "./useGeneratePDF";
import { MedicationDeliveryDetailFormat } from "../formats/MedicationDeliveryDetailFormat";
import { PrescriptionDto } from "../../models/models";
import { MedicationPrescriptionManager } from "../../pharmacy/medication-delivery/helpers/MedicationPrescriptionManager";

interface MedicationDeliveryDetailFormatProps {
    prescription: PrescriptionDto;
    prescriptionManager: MedicationPrescriptionManager;
    type: 'Impresion' | 'Descargar';
}

export const useMedicationDeliveryDetailFormat = () => {

    const { generatePDF } = useGeneratePDF();

    function generateFormat(data: MedicationDeliveryDetailFormatProps) {

        const { prescription, prescriptionManager, type } = data;

        const namePDF = `Solicitud-Medicamentos-${prescription.id}`;
        const html = ReactDOMServer.renderToStaticMarkup(
            <MedicationDeliveryDetailFormat prescription={prescription} prescriptionManager={prescriptionManager} />
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