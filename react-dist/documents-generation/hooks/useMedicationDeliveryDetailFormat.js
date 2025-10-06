import React from "react";
import ReactDOMServer from "react-dom/server";
import { useGeneratePDF } from "./useGeneratePDF.js";
import { MedicationDeliveryDetailFormat } from "../formats/MedicationDeliveryDetailFormat.js";
export const useMedicationDeliveryDetailFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormat(data) {
    const {
      prescription,
      prescriptionManager,
      type
    } = data;
    const namePDF = `Solicitud-Medicamentos-${prescription.id}`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(MedicationDeliveryDetailFormat, {
      prescription: prescription,
      prescriptionManager: prescriptionManager
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type
    });
  }
  return {
    generateFormat
  };
};