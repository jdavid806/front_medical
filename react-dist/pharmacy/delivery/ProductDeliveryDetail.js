import React, { useEffect, useState } from "react";
import { Tag } from "primereact/tag";
import { formatDateDMY } from "../../../services/utilidades.js";
import { useProductDelivery } from "./hooks/useProductDelivery.js";
import { MedicalSupplyManager } from "../../helpers/MedicalSupplyManager.js";
import "../../extensions/number.extensions.js";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { useLoggedUser } from "../../users/hooks/useLoggedUser.js";
import { Button } from "primereact/button";
import { ProductDeliveryDetailDialog } from "./ProductDeliveryDetailDialog.js";
import { useProductDeliveryDetailFormat } from "../../documents-generation/hooks/useProductDeliveryDetailFormat.js";
import { useVerifyAndSaveProductDelivery } from "./hooks/useVerifyAndSaveProductDelivery.js";
export const ProductDeliveryDetail = ({
  deliveryId
}) => {
  const {
    delivery,
    getDelivery
  } = useProductDelivery();
  const {
    loggedUser
  } = useLoggedUser();
  const {
    generateFormat
  } = useProductDeliveryDetailFormat();
  const {
    verifyAndSaveProductDelivery
  } = useVerifyAndSaveProductDelivery();
  const [deliveryManager, setDeliveryManager] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  useEffect(() => {
    getDelivery(deliveryId);
  }, [deliveryId]);
  useEffect(() => {
    if (delivery) {
      setDeliveryManager(new MedicalSupplyManager(delivery));
    }
  }, [delivery]);
  const handlePrint = () => {
    if (!delivery || !deliveryManager) return;
    generateFormat({
      delivery: delivery,
      deliveryManager: deliveryManager,
      type: 'Impresion'
    });
  };
  const handleVerifyAndSaveProductDelivery = async () => {
    if (!delivery || !deliveryManager) return;
    try {
      const response = await verifyAndSaveProductDelivery(delivery.id.toString());
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center gap-2"
  }, /*#__PURE__*/React.createElement("b", null, "Solicitud #", delivery?.id), /*#__PURE__*/React.createElement(Tag, {
    value: deliveryManager?.statusLabel,
    severity: deliveryManager?.statusSeverity,
    className: "fs-6"
  })), /*#__PURE__*/React.createElement("p", null, "Creado: ", formatDateDMY(delivery?.created_at)), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "card-title"
  }, "Informaci\xF3n del solicitante"), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Nombre: "), /*#__PURE__*/React.createElement("span", null, deliveryManager?.requestedBy?.name || '--')), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Correo electr\xF3nico: "), /*#__PURE__*/React.createElement("span", null, deliveryManager?.requestedBy?.email || '--')), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Tel\xE9fono: "), /*#__PURE__*/React.createElement("span", null, deliveryManager?.requestedBy?.phone || '--')), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Direcci\xF3n: "), /*#__PURE__*/React.createElement("span", null, deliveryManager?.requestedBy?.address || '--'))))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "card-title"
  }, "Gestionado por"), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Nombre: "), /*#__PURE__*/React.createElement("span", null, `${loggedUser?.first_name || ''} ${loggedUser?.middle_name || ''} ${loggedUser?.last_name || ''} ${loggedUser?.second_last_name || ''}`)), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Correo electr\xF3nico: "), /*#__PURE__*/React.createElement("span", null, loggedUser?.email)), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Tel\xE9fono: "), /*#__PURE__*/React.createElement("span", null, loggedUser?.phone)), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Direcci\xF3n: "), /*#__PURE__*/React.createElement("span", null, loggedUser?.address)))))), /*#__PURE__*/React.createElement(CustomPRTable, {
    data: deliveryManager?.products,
    columns: [{
      field: 'product.name',
      header: 'Insumos'
    }, {
      field: 'quantity',
      header: 'Cantidad'
    }],
    disablePaginator: true,
    disableReload: true,
    disableSearch: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-prescription text-primary me-2 fs-4"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "fw-medium"
  }, "Solicitud #", delivery?.id), /*#__PURE__*/React.createElement("div", {
    className: "text-muted small"
  }, deliveryManager?.requestedBy?.name || '--', " - ", formatDateDMY(delivery?.created_at)))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm btn-outline-primary me-2",
    onClick: () => setDialogVisible(true)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-eye me-1"
  }), " Ver solicitud"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm btn-outline-secondary",
    onClick: handlePrint
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-print me-1"
  }), " Imprimir")))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end align-items-center"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-check me-2"
    }),
    label: "Entregar Productos",
    className: "btn btn-sm btn-primary",
    onClick: handleVerifyAndSaveProductDelivery
  }))), /*#__PURE__*/React.createElement(ProductDeliveryDetailDialog, {
    visible: dialogVisible,
    onHide: () => setDialogVisible(false),
    delivery: delivery
  }));
};