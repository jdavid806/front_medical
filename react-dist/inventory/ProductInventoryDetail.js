import React from 'react';
export const ProductInventoryDetail = ({
  product
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-tag"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "ID:"), " ", /*#__PURE__*/React.createElement("span", null, product.id)), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-alt"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Nombre:"), " ", /*#__PURE__*/React.createElement("span", null, product.name)), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Descripci\xF3n:"), " ", /*#__PURE__*/React.createElement("span", null, product.description || '--')), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-barcode"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "C\xF3digo de Barras:"), " ", /*#__PURE__*/React.createElement("span", null, product.barcode))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-box"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Stock:"), " ", /*#__PURE__*/React.createElement("span", null, product.stock || '--')), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-exclamation-triangle"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Stock M\xEDnimo:"), " ", /*#__PURE__*/React.createElement("span", null, product.minimum_stock || '--')), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-chart-line"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Stock M\xE1ximo:"), " ", /*#__PURE__*/React.createElement("span", null, product.maximum_stock || '--')))), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-coins"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Precio de Compra:"), " ", /*#__PURE__*/React.createElement("span", null, product.purchase_price || '--')), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-dollar-sign"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Precio de Venta:"), " ", /*#__PURE__*/React.createElement("span", null, product.sale_price)), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-info-circle"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Estado:"), " ", /*#__PURE__*/React.createElement("span", null, '--'))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-industry"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Laboratorio:"), " ", /*#__PURE__*/React.createElement("span", null, product.laboratory_id || '--')), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-tags"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Marca:"), " ", /*#__PURE__*/React.createElement("span", null, product.brand_id || '--')), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-store"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Proveedor:"), " ", /*#__PURE__*/React.createElement("span", null, product.supplier_id || '--')))), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-clipboard-check"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Registro Sanitario:"), " ", /*#__PURE__*/React.createElement("span", null, product.sanitary_registration || '--')), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-calendar-alt"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Fecha de Expiraci\xF3n:"), " ", /*#__PURE__*/React.createElement("span", null, product.expiration_date || '--'))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-vial"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Concentraci\xF3n:"), " ", /*#__PURE__*/React.createElement("span", null, product.concentration || '--')), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-prescription"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "\xBFRequiere Receta?:"), " ", /*#__PURE__*/React.createElement("span", null, product.prescription ? 'Sí' : 'No'))))));
};