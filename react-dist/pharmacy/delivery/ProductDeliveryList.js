import React, { useEffect, useState } from "react";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { useSuppliesDeliveries } from "../supplies/hooks/useSuppliesDeliveries.js";
import { formatDateDMY } from "../../../services/utilidades.js";
import { MedicalSupplyManager } from "../../helpers/MedicalSupplyManager.js";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
export const ProductDeliveryList = ({
  onDeliverySelect
}) => {
  const {
    suppliesDeliveries,
    fetchSuppliesDeliveries
  } = useSuppliesDeliveries();
  const [search, setSearch] = useState('');
  const [expandedObservations, setExpandedObservations] = useState(null);
  const statusMenu = React.useRef(null);
  const statusItems = [{
    label: 'Todos',
    command: () => fetchDeliveries("ALL")
  }, {
    label: 'Pendiente',
    command: () => fetchDeliveries("pendiente")
  }, {
    label: 'Entregado',
    command: () => fetchDeliveries("entregado")
  }, {
    label: 'Entrega parcial',
    command: () => fetchDeliveries("entrega parcial")
  }];
  const toggleObservations = (deliveryId, event) => {
    event.stopPropagation();
    setExpandedObservations(expandedObservations === deliveryId ? null : deliveryId);
  };
  const truncateObservations = (text, maxLines = 3) => {
    if (!text) return 'Sin observaciones';
    const lines = text.split('\n');
    if (lines.length <= maxLines) return text;
    return lines.slice(0, maxLines).join('\n');
  };
  const getRemainingObservations = (text, maxLines = 3) => {
    if (!text) return '';
    const lines = text.split('\n');
    return lines.slice(maxLines).join('\n');
  };
  const fetchDeliveries = status => {
    if (search.length < 3) {
      return;
    }
    fetchSuppliesDeliveries({
      search,
      status
    });
  };
  useEffect(() => {
    fetchDeliveries("ALL");
  }, [search]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h5", {
    className: "card-title mb-4"
  }, "Pedidos Pendientes"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-wrap justify-content-between gap-2 align-items-center mb-3"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-filter me-2"
    }),
    label: "Filtrar por estado",
    onClick: event => statusMenu.current?.toggle(event),
    className: "btn btn-sm btn-outline-secondary"
  }), /*#__PURE__*/React.createElement(Menu, {
    model: statusItems,
    popup: true,
    ref: statusMenu
  })), /*#__PURE__*/React.createElement("div", {
    className: "input-group mb-4"
  }, /*#__PURE__*/React.createElement(InputText, {
    placeholder: "Buscar por # o nombre...",
    id: "searchOrder",
    className: "w-100",
    value: search,
    onChange: e => setSearch(e.target.value)
  })), /*#__PURE__*/React.createElement(Divider, {
    className: "my-3"
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-4"
  }, suppliesDeliveries.map(delivery => {
    const manager = new MedicalSupplyManager(delivery);
    const truncatedObs = truncateObservations(delivery.observations || '');
    const remainingObs = getRemainingObservations(delivery.observations || '');
    const shouldTruncate = delivery.observations && delivery.observations.split('\n').length > 3;
    return /*#__PURE__*/React.createElement("div", {
      key: delivery.id,
      className: "card shadow-sm border-0 cursor-pointer hover-shadow",
      onClick: () => onDeliverySelect(delivery),
      style: {
        transition: 'all 0.2s ease',
        borderRadius: '8px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-body p-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-start mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement("h6", {
      className: "card-title mb-0 fw-bold text-primary"
    }, "Solicitud #", delivery.id), /*#__PURE__*/React.createElement("span", {
      className: `badge fs-7 bg-${manager.statusSeverity}`,
      style: {
        fontSize: '0.7rem'
      }
    }, manager.statusLabel)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", {
      className: "text-muted fw-medium"
    }, formatDateDMY(delivery.created_at)))), /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-start gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "fw-semibold text-dark fs-7 min-width-fit"
    }, "Observaciones:"), /*#__PURE__*/React.createElement("div", {
      className: "flex-grow-1"
    }, /*#__PURE__*/React.createElement("p", {
      className: "mb-1 text-dark fs-7 lh-sm",
      style: {
        whiteSpace: 'pre-line',
        lineHeight: '1.4'
      }
    }, expandedObservations === delivery.id ? delivery.observations || 'Sin observaciones' : truncatedObs, shouldTruncate && expandedObservations !== delivery.id && /*#__PURE__*/React.createElement("span", {
      className: "text-muted"
    }, "...")), shouldTruncate && /*#__PURE__*/React.createElement("button", {
      className: "btn btn-link p-0 text-primary fs-7 text-decoration-none",
      onClick: e => toggleObservations(delivery.id, e),
      style: {
        fontSize: '0.75rem'
      }
    }, expandedObservations === delivery.id ? 'Ver menos' : 'Ver más')))), /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-column gap-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-1"
    }, /*#__PURE__*/React.createElement("small", {
      className: "fw-semibold text-muted fs-7"
    }, "Fecha solicitud:"), /*#__PURE__*/React.createElement("small", {
      className: "text-dark fs-7"
    }, formatDateDMY(delivery.created_at))), /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-1"
    }, /*#__PURE__*/React.createElement("small", {
      className: "fw-semibold text-muted fs-7"
    }, "Solicitante:"), /*#__PURE__*/React.createElement("small", {
      className: "text-dark fs-7"
    }, manager?.requestedBy?.name || '--'))))));
  })), /*#__PURE__*/React.createElement("style", null, `
                .hover-shadow:hover {
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                    transform: translateY(-2px);
                }
                .min-width-fit {
                    min-width: 110px;
                }
                .fs-7 {
                    font-size: 0.875rem !important;
                }
                .fs-9 {
                    font-size: 0.75rem !important;
                }
                .lh-sm {
                    line-height: 1.4 !important;
                }
            `));
};