import React from "react";
const DocumentViewerModal = ({
  asignar
}) => {
  if (!asignar.showViewModal || !asignar.documentToView) return null;
  const doc = asignar.documentToView;
  return /*#__PURE__*/React.createElement("div", {
    className: "modal fade show d-block",
    style: {
      background: "rgba(0,0,0,0.5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog modal-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "modal-title"
  }, doc.titulo ?? "Consentimiento Informado"), /*#__PURE__*/React.createElement("button", {
    className: "btn-close",
    onClick: () => asignar.setShowViewModal(false)
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    id: "doc-content",
    dangerouslySetInnerHTML: {
      __html: doc.contenido + `<br/><p><b>Firma del paciente:</b></p>
                  <div id="signature-slot" style="border:1px dashed #aaa; height:80px; width:300px;">
                    ${doc.firma ? `<img src="${doc.firma}" style="max-width:250px; height:auto;" />` : ""}
                  </div>`
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-primary",
    onClick: () => {
      asignar.setShowSignatureModal(true);
      asignar.setCurrentDocumentId(doc.id);
      asignar.setShowViewModal(false);
    }
  }, "Firmar"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-success",
    onClick: () => {
      const content = document.getElementById("doc-content")?.innerHTML || "";
      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.left = "-9999px";
      document.body.appendChild(iframe);
      const docIframe = iframe.contentWindow?.document;
      if (docIframe) {
        docIframe.open();
        docIframe.write(`
                  <html>
                    <head>
                      <title>Documento</title>
                      <style>
                        body { font-family: Arial; padding: 40px; font-size: 14px; }
                        @page { size: A4; margin: 15mm; }
                      </style>
                    </head>
                    <body>${content}</body>
                  </html>
                `);
        docIframe.close();
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      }
    }
  }, "Descargar PDF")))));
};
export default DocumentViewerModal;