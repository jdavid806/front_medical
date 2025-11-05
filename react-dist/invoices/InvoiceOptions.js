import React, { forwardRef, useCallback, useEffect, useImperativeHandle } from "react";
import { Button } from "primereact/button";
import { useInvoice } from "./hooks/useInvoice.js";
import { formatDate, formatWhatsAppMessage } from "../../services/utilidades.js";
import { usePRToast } from "../hooks/usePRToast.js";
import { userService } from "../../services/api/index.js";
import { useTemplate } from "../hooks/useTemplate.js";
import { useMassMessaging } from "../hooks/useMassMessaging.js";
import { useRef } from "react";
import { generarFormato } from "../../funciones/funcionesJS/generarPDF.js";
export const InvoiceOptions = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    invoiceId,
    onAppear
  } = props;
  const {
    invoice,
    fetchInvoice
  } = useInvoice();
  const {
    showSuccessToast,
    showErrorToast
  } = usePRToast();
  const tenant = window.location.hostname.split(".")[0];
  const templateData = {
    tenantId: tenant,
    belongsTo: "facturacion-creacion",
    type: "whatsapp"
  };
  const {
    template,
    fetchTemplate
  } = useTemplate(templateData);
  const {
    sendMessage: sendMessageHook
  } = useMassMessaging();
  const sendMessage = useRef(sendMessageHook);
  useEffect(() => {
    sendMessage.current = sendMessageHook;
  }, [sendMessageHook]);
  useEffect(() => {
    fetchInvoice(invoiceId);
  }, [invoiceId]);
  useEffect(() => {
    if (!invoice || !template || !sendMessage) {
      return;
    }
    onAppear();
  }, [invoice, template, sendMessage]);
  const handleSendWhatsApp = async () => {
    try {
      await sendMessageWhatsapp(invoice);
    } catch (error) {
      console.error("Error enviando WhatsApp:", error);
    }
  };
  async function generatePdfFile(invoiceData) {
    console.log("A");
    const user = await userService.getLoggedUser();
    const finalInvoiceData = {
      ...invoiceData,
      patient: invoiceData.third_party,
      user: user
    };
    console.log(finalInvoiceData);
    await generarFormato("FacturaFactura", finalInvoiceData, "Impresion", "invoiceInput");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let fileInput = document.getElementById("pdf-input-hidden-to-invoiceInput");
        let file = fileInput?.files[0];
        if (!file) {
          resolve(null);
          return;
        }
        let formData = new FormData();
        formData.append("file", file);
        formData.append("model_type", "App\\Models\\Invoice");
        formData.append("model_id", invoice.id);
        //@ts-ignore - Esta función debería existir en tu entorno
        guardarArchivo(formData, true).then(response => {
          resolve(response.file);
        }).catch(reject);
      }, 1000);
    });
  }
  const sendMessageWhatsapp = useCallback(async invoiceData => {
    try {
      // Generar el PDF primero
      // @ts-ignore
      const dataToFile = await generatePdfFile(invoiceData);
      //@ts-ignore - Esta función debería existir en tu entorno
      const urlPDF = getUrlImage(dataToFile.file_url.replaceAll("\\", "/"), true);
      if (!template) {
        await fetchTemplate();
      }
      const client = invoiceData.third_party.name;
      const replacements = {
        NOMBRE_PACIENTE: client || "--",
        NUMERO_FACTURA: invoiceData.invoice_code || invoiceData.invoice_reminder,
        FECHA_FACTURA: formatDate(invoiceData.created_at),
        MONTO_FACTURADO: "$" + (+invoiceData.total_amount).toFixed(2),
        "ENLACE DOCUMENTO": ""
      };
      const templateFormatted = formatWhatsAppMessage(template?.template || "", replacements);
      const dataMessage = {
        channel: "whatsapp",
        recipients: [invoiceData.third_party.phone],
        message_type: "media",
        message: templateFormatted,
        attachment_url: urlPDF,
        attachment_type: "document",
        minio_model_type: dataToFile?.model_type,
        minio_model_id: dataToFile?.model_id,
        minio_id: dataToFile?.id,
        webhook_url: "https://example.com/webhook"
      };
      await sendMessage.current(dataMessage);
      showSuccessToast({
        message: "Mensaje enviado correctamente",
        title: "Éxito"
      });
    } catch (error) {
      console.error("Error enviando mensaje por WhatsApp:", error);
      showErrorToast({
        message: "Error al enviar el mensaje por WhatsApp",
        title: "Error"
      });
    }
  }, [template, invoice, sendMessage]);
  useImperativeHandle(ref, () => ({
    handleSendWhatsApp
  }));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "text-center py-6 px-4 bg-light rounded-3 shadow-sm",
    style: {
      maxWidth: '600px',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-check-circle text-6xl text-success mb-4"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "mb-3 fw-bold"
  }, "\xA1Entrega Generada Exitosamente!"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted mb-4"
  }, "La entrega ha sido creada y guardada en el sistema."), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center gap-3 flex-wrap"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    label: "Enviar por WhatsApp",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-whatsapp"
    }),
    className: "p-button-success p-button-lg",
    onClick: handleSendWhatsApp
  }), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    label: "Imprimir Factura",
    className: "p-button-primary p-button-lg",
    icon: "pi pi-print",
    onClick: async () => {
      const user = await userService.getLoggedUser();
      // @ts-ignore
      await generateInvoiceFromInvoice(invoice, user, invoice.third_party, false);
    }
  }), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    label: "Descargar Factura",
    icon: "pi pi-download",
    className: "p-button-help p-button-lg",
    onClick: async () => {
      const user = await userService.getLoggedUser();
      // @ts-ignore
      await generateInvoiceFromInvoice(invoice, user, invoice.third_party, true);
    }
  }))));
});