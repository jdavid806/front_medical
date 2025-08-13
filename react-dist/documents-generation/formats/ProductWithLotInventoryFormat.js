import React from "react";
import { formatDate } from "../../../services/utilidades.js";
export const ProductWithLotInventoryFormat = ({
  inventoryData,
  showExpired = true
}) => {
  // Filtrar productos que no son "Laboratorio"
  const filteredInventory = inventoryData.map(deposit => ({
    ...deposit,
    products: deposit.products.filter(product => product.name !== "Laboratorio")
  }));

  // Filtrar lotes activos y vencidos
  const getActiveLots = lots => {
    return lots.filter(lot => lot.expiration_status !== 'expired');
  };
  const getExpiringSoonLots = lots => {
    return lots.filter(lot => lot.expiration_status === 'expiring_soon');
  };
  const getExpiredLots = lots => {
    return lots.filter(lot => lot.expiration_status === 'expired');
  };

  // Calcular total de productos y lotes para cada depósito
  const getInventorySummary = inventory => {
    const totalProducts = inventory.products.length;
    const totalActiveLots = inventory.products.reduce((sum, product) => sum + getActiveLots(product.lotes).length, 0);
    const totalExpiringSoonLots = inventory.products.reduce((sum, product) => sum + getExpiringSoonLots(product.lotes).length, 0);
    const totalExpiredLots = inventory.products.reduce((sum, product) => sum + getExpiredLots(product.lotes).length, 0);
    return {
      totalProducts,
      totalActiveLots,
      totalExpiringSoonLots,
      totalExpiredLots
    };
  };

  // Formatear moneda
  const formatCurrency = value => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Obtener estado del lote como etiqueta
  const getLotStatusLabel = status => {
    const labels = {
      active: 'Activo',
      expiring_soon: 'Próximo a vencer',
      expired: 'Vencido'
    };
    return labels[status] || status;
  };

  // Obtener clase CSS para el estado del lote
  const getLotStatusClass = status => {
    const classes = {
      active: 'text-success',
      expiring_soon: 'text-warning',
      expired: 'text-danger'
    };
    return classes[status] || '';
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "inventory-report"
  }, filteredInventory.map((deposit, depositIndex) => {
    const depositSummary = getInventorySummary(deposit);
    return /*#__PURE__*/React.createElement("div", {
      key: deposit.id,
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "deposit-header p-2 mb-2",
      style: {
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6'
      }
    }, /*#__PURE__*/React.createElement("h4", {
      className: "mb-1"
    }, deposit.name), /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-wrap gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "badge bg-info"
    }, depositSummary.totalProducts, " productos"), /*#__PURE__*/React.createElement("span", {
      className: "badge bg-success"
    }, depositSummary.totalActiveLots, " lotes activos"), /*#__PURE__*/React.createElement("span", {
      className: "badge bg-warning text-dark"
    }, depositSummary.totalExpiringSoonLots, " pr\xF3ximos a vencer"), showExpired && /*#__PURE__*/React.createElement("span", {
      className: "badge bg-danger"
    }, depositSummary.totalExpiredLots, " lotes vencidos"))), /*#__PURE__*/React.createElement("table", {
      className: "table table-bordered mb-3"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      colSpan: 6,
      className: "bg-light"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-0 p-1"
    }, "Productos en ", deposit.name))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: {
        width: '30%'
      }
    }, "Producto"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '15%'
      }
    }, "Tipo"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '15%'
      }
    }, "Precio Venta"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '15%'
      }
    }, "Stock M\xEDn/M\xE1x"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '12%'
      }
    }, "Lotes Activos"), showExpired && /*#__PURE__*/React.createElement("th", {
      style: {
        width: '13%'
      }
    }, "Lotes Vencidos"))), /*#__PURE__*/React.createElement("tbody", null, deposit.products.map((product, productIndex) => /*#__PURE__*/React.createElement(React.Fragment, {
      key: product.id
    }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, product.name), /*#__PURE__*/React.createElement("td", null, product.product_type?.name || '--'), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(product.sale_price)), /*#__PURE__*/React.createElement("td", {
      className: "text-center"
    }, product.minimum_stock || '--', " / ", product.maximum_stock || '--'), /*#__PURE__*/React.createElement("td", {
      className: "text-center"
    }, getActiveLots(product.lotes).length), showExpired && /*#__PURE__*/React.createElement("td", {
      className: "text-center"
    }, getExpiredLots(product.lotes).length)), getActiveLots(product.lotes).length > 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
      colSpan: showExpired ? 6 : 5,
      className: "p-0"
    }, /*#__PURE__*/React.createElement("table", {
      className: "table table-sm mb-0",
      style: {
        backgroundColor: '#f8f9fa'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      colSpan: 6,
      className: "bg-light"
    }, /*#__PURE__*/React.createElement("small", null, "Lotes activos de ", product.name))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: {
        width: '15%'
      }
    }, "N\xB0 Lote"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '20%'
      }
    }, "Fecha Vencimiento"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '15%'
      }
    }, "Cantidad"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '15%'
      }
    }, "Precio Compra"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '15%'
      }
    }, "Estado"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '20%'
      }
    }, "Perecedero"))), /*#__PURE__*/React.createElement("tbody", null, getActiveLots(product.lotes).map((lot, lotIndex) => /*#__PURE__*/React.createElement("tr", {
      key: lot.id
    }, /*#__PURE__*/React.createElement("td", null, lot.lot_number), /*#__PURE__*/React.createElement("td", null, formatDate(lot.expiration_date)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, lot.quantity), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(Number(lot.purchase_price))), /*#__PURE__*/React.createElement("td", {
      className: getLotStatusClass(lot.expiration_status)
    }, getLotStatusLabel(lot.expiration_status)), /*#__PURE__*/React.createElement("td", null, lot.is_perishable ? 'Sí' : 'No'))))))), showExpired && getExpiredLots(product.lotes).length > 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
      colSpan: 6,
      className: "p-0"
    }, /*#__PURE__*/React.createElement("table", {
      className: "table table-sm mb-0",
      style: {
        backgroundColor: '#fff0f0'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      colSpan: 6,
      className: "bg-danger text-white"
    }, /*#__PURE__*/React.createElement("small", null, "Lotes vencidos de ", product.name))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: {
        width: '15%'
      }
    }, "N\xB0 Lote"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '20%'
      }
    }, "Fecha Vencimiento"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '15%'
      }
    }, "Cantidad"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '15%'
      }
    }, "Precio Compra"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '15%'
      }
    }, "Estado"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '20%'
      }
    }, "Perecedero"))), /*#__PURE__*/React.createElement("tbody", null, getExpiredLots(product.lotes).map((lot, lotIndex) => /*#__PURE__*/React.createElement("tr", {
      key: lot.id
    }, /*#__PURE__*/React.createElement("td", null, lot.lot_number), /*#__PURE__*/React.createElement("td", null, formatDate(lot.expiration_date)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, lot.quantity), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(Number(lot.purchase_price))), /*#__PURE__*/React.createElement("td", {
      className: "text-danger"
    }, "Vencido"), /*#__PURE__*/React.createElement("td", null, lot.is_perishable ? 'Sí' : 'No'))))))))))), /*#__PURE__*/React.createElement("div", {
      className: "deposit-summary p-2 mt-2",
      style: {
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6'
      }
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-2"
    }, "Resumen de ", deposit.name), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("table", {
      className: "table table-sm mb-0"
    }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Productos:")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, depositSummary.totalProducts)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Lotes Activos:")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, depositSummary.totalActiveLots))))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("table", {
      className: "table table-sm mb-0"
    }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Lotes Pr\xF3ximos a Vencer:")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, depositSummary.totalExpiringSoonLots)), showExpired && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Lotes Vencidos:")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, depositSummary.totalExpiredLots))))))));
  }), /*#__PURE__*/React.createElement("style", null, `
        .inventory-report {
          font-family: Arial, sans-serif;
          font-size: 12px;
          color: #000;
        }
        
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
        }
        
        .table th, .table td {
          padding: 0.5rem;
          border: 1px solid #dee2e6;
          vertical-align: middle;
        }
        
        .table th {
          background-color: #f8f9fa;
          font-weight: bold;
          text-align: left;
        }
        
        .text-end {
          text-align: right !important;
        }
        
        .text-center {
          text-align: center !important;
        }
        
        .badge {
          display: inline-block;
          padding: 0.25em 0.4em;
          font-size: 75%;
          font-weight: 700;
          line-height: 1;
          text-align: center;
          white-space: nowrap;
          vertical-align: baseline;
          border-radius: 0.25rem;
        }
        
        .bg-info {
          background-color: #17a2b8 !important;
          color: white;
        }
        
        .bg-success {
          background-color: #28a745 !important;
          color: white;
        }
        
        .bg-warning {
          background-color: #ffc107 !important;
          color: #212529;
        }
        
        .bg-danger {
          background-color: #dc3545 !important;
          color: white;
        }
        
        .text-success {
          color: #28a745 !important;
        }
        
        .text-warning {
          color: #ffc107 !important;
        }
        
        .text-danger {
          color: #dc3545 !important;
        }
        
        @media print {
          body {
            margin: 0;
            padding: 0;
            color: #000;
            background: #fff;
          }
          
          .inventory-report {
            font-size: 10pt;
          }
          
          .table {
            page-break-inside: avoid;
          }
          
          .deposit-header, .deposit-summary {
            page-break-after: avoid;
          }
          
          .no-print {
            display: none !important;
          }
        }
      `));
};