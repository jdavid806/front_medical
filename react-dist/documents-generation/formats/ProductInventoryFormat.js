import React from "react";
export const ProductInventoryFormat = ({
  inventoryData
}) => {
  // Filtrar productos que no son "Laboratorio"
  const filteredInventory = inventoryData.map(deposit => ({
    ...deposit,
    products: deposit.products.filter(product => product.name !== "Laboratorio")
  }));

  // Calcular el stock total de un producto en un depósito
  const getProductStock = product => {
    return product.inventories.reduce((sum, inventory) => sum + inventory.quantity, 0);
  };

  // Calcular total de productos y stock para cada depósito
  const getInventorySummary = inventory => {
    const totalProducts = inventory.products.length;
    const totalStock = inventory.products.reduce((sum, product) => sum + getProductStock(product), 0);
    return {
      totalProducts,
      totalStock
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
    }, depositSummary.totalStock, " unidades en stock"))), /*#__PURE__*/React.createElement("table", {
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
        width: '20%'
      }
    }, "Tipo"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '15%'
      }
    }, "Precio Venta"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '15%'
      }
    }, "Stock Actual"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '20%'
      }
    }, "Stock M\xEDn/M\xE1x"))), /*#__PURE__*/React.createElement("tbody", null, deposit.products.map((product, productIndex) => {
      const currentStock = getProductStock(product);
      const isBelowMin = product.minimum_stock !== null && currentStock < product.minimum_stock;
      const isAboveMax = product.maximum_stock !== null && currentStock > product.maximum_stock;
      return /*#__PURE__*/React.createElement("tr", {
        key: product.id
      }, /*#__PURE__*/React.createElement("td", null, product.name), /*#__PURE__*/React.createElement("td", null, product.product_type?.name || '--'), /*#__PURE__*/React.createElement("td", {
        className: "text-end"
      }, formatCurrency(product.sale_price)), /*#__PURE__*/React.createElement("td", {
        className: `text-end ${isBelowMin ? 'text-danger' : ''} ${isAboveMax ? 'text-warning' : ''}`
      }, currentStock), /*#__PURE__*/React.createElement("td", {
        className: "text-center"
      }, /*#__PURE__*/React.createElement("span", {
        className: isBelowMin ? 'text-danger' : ''
      }, product.minimum_stock || '--'), ' / ', /*#__PURE__*/React.createElement("span", {
        className: isAboveMax ? 'text-warning' : ''
      }, product.maximum_stock || '--')));
    }))), /*#__PURE__*/React.createElement("div", {
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
    }, depositSummary.totalProducts))))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("table", {
      className: "table table-sm mb-0"
    }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Stock:")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, depositSummary.totalStock, " unidades"))))))));
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