import React, { useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CustomModal } from "../components/CustomModal.js";
import { ProductInventoryDetail } from "./ProductInventoryDetail.js";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { ProductInventoryForm } from "./ProductInventoryForm.js";
import { useProductUpdate } from "../products/hooks/useProductUpdate.js";
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import TableActionsWrapper from "../components/table-actions/TableActionsWrapper.js";
import { EditTableAction } from "../components/table-actions/EditTableAction.js";
import { useProductInventoryOnlyDeposits } from "./hooks/useProductInventoryOnlyDeposits.js";
import { useProductInventoryFormat } from "../documents-generation/hooks/useProductInventoryFormat.js";
export const ProductInventoryApp = ({
  type
}) => {
  const [expandedRows, setExpandedRows] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const {
    productInventory,
    loading,
    fetchProductInventoryOnlyDeposits
  } = useProductInventoryOnlyDeposits(type);
  const {
    updateProduct
  } = useProductUpdate();
  const {
    generarFormatoInventario
  } = useProductInventoryFormat();

  // Filtrar productos que no son "Laboratorio"
  const filteredInventory = productInventory.map(deposit => ({
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
  function openFormModal(selectedProduct) {
    setSelectedProduct(structuredClone(selectedProduct));
    setShowFormModal(true);
  }

  // Plantilla de expansión para depósitos (muestra productos)
  const depositRowExpansionTemplate = data => {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-3"
    }, /*#__PURE__*/React.createElement(DataTable, {
      value: data.products,
      dataKey: "id",
      onRowClick: e => {
        setSelectedProduct(e.data);
      },
      selectionMode: "single",
      selection: selectedProduct,
      onSelectionChange: e => setSelectedProduct(e.value)
    }, /*#__PURE__*/React.createElement(Column, {
      field: "name",
      header: "Producto",
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Tipo",
      body: rowData => rowData.product_type?.name || '--'
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Precio",
      body: rowData => `$${rowData.sale_price}`
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Stock",
      body: rowData => getProductStock(rowData)
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Stock M\xEDn/M\xE1x",
      body: rowData => `${rowData.minimum_stock || '--'} / ${rowData.maximum_stock || '--'}`
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Acciones",
      body: rowData => /*#__PURE__*/React.createElement(TableActionsWrapper, null, /*#__PURE__*/React.createElement(EditTableAction, {
        onTrigger: () => openFormModal(rowData)
      }), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
        className: "dropdown-item",
        href: "#",
        onClick: () => {
          setSelectedProduct(rowData);
          setShowDetailModal(true);
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "d-flex gap-2 align-items-center"
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-eye",
        style: {
          width: '20px'
        }
      }), /*#__PURE__*/React.createElement("span", null, "Ver m\xE1s")))))
    })));
  };

  // Resumen del depósito para la fila principal
  const depositSummaryTemplate = data => {
    const summary = getInventorySummary(data);
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-column gap-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-bold"
    }, data.name), /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-wrap gap-3"
    }, /*#__PURE__*/React.createElement(Badge, {
      severity: "info",
      value: `${summary.totalProducts} productos`
    }), /*#__PURE__*/React.createElement(Badge, {
      severity: "success",
      value: `${summary.totalStock} unidades en stock`
    })));
  };
  const onHandleSubmit = async data => {
    if (!selectedProduct) return;
    updateProduct(selectedProduct.id.toString(), {
      product: data,
      entities: []
    }).then(() => {
      setShowFormModal(false);
      fetchProductInventoryOnlyDeposits();
    });
  };
  const exportToPDF = () => {
    generarFormatoInventario(productInventory, 'inventario-productos', 'Impresion');
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-auto"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Exportar a PDF",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-pdf"
    }),
    className: "btn btn-primary",
    onClick: () => exportToPDF()
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-12"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: filteredInventory,
    expandedRows: expandedRows,
    onRowToggle: e => setExpandedRows(e.data),
    rowExpansionTemplate: depositRowExpansionTemplate,
    dataKey: "id",
    loading: loading
  }, /*#__PURE__*/React.createElement(Column, {
    expander: true,
    style: {
      width: '3rem'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    body: depositSummaryTemplate
  }))))), /*#__PURE__*/React.createElement(CustomModal, {
    title: "Detalles del producto",
    show: showDetailModal,
    onHide: () => setShowDetailModal(false)
  }, /*#__PURE__*/React.createElement(ProductInventoryDetail, {
    product: selectedProduct
  })), /*#__PURE__*/React.createElement(CustomFormModal, {
    formId: "product-inventory-form",
    title: "Editar inventario del producto",
    show: showFormModal,
    onHide: () => setShowFormModal(false)
  }, /*#__PURE__*/React.createElement(ProductInventoryForm, {
    formId: "product-inventory-form",
    productId: selectedProduct?.id.toString() || "",
    onHandleSubmit: onHandleSubmit
  })));
};