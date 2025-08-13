import React, { useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CustomModal } from "../components/CustomModal.js";
import { ProductInventoryDetail } from "./ProductInventoryDetail.js";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { ProductInventoryForm } from "./ProductInventoryForm.js";
import { useProductUpdate } from "../products/hooks/useProductUpdate.js";
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
import { formatDate } from "../../services/utilidades.js";
import { useProductWithLotInventory } from "./hooks/useProductWithLotInventory.js";
import TableActionsWrapper from "../components/table-actions/TableActionsWrapper.js";
import { EditTableAction } from "../components/table-actions/EditTableAction.js";
import { useProductWithLotInventoryFormat } from "../documents-generation/hooks/useProductWithLotInventoryFormat.js";
export const ProductWithLotInventoryApp = ({
  type
}) => {
  const [expandedRows, setExpandedRows] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory');
  const {
    productInventory,
    loading,
    fetchProductWithLotInventory
  } = useProductWithLotInventory(type);
  const {
    updateProduct
  } = useProductUpdate();
  const {
    generarFormatoInventario
  } = useProductWithLotInventoryFormat();

  // Filtrar productos que no son "Laboratorio"
  const filteredInventory = productInventory.map(deposit => ({
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
      expandedRows: expandedRows,
      onRowToggle: e => setExpandedRows(e.data),
      rowExpansionTemplate: productRowExpansionTemplate,
      onRowClick: e => {
        setSelectedProduct(e.data);
      },
      selectionMode: "single",
      selection: selectedProduct,
      onSelectionChange: e => setSelectedProduct(e.value)
    }, /*#__PURE__*/React.createElement(Column, {
      expander: true,
      style: {
        width: '3rem'
      }
    }), /*#__PURE__*/React.createElement(Column, {
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
      header: "Stock M\xEDn/M\xE1x",
      body: rowData => `${rowData.minimum_stock || '--'} / ${rowData.maximum_stock || '--'}`
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Lotes Activos",
      body: rowData => getActiveLots(rowData.lotes).length
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Lotes Vencidos",
      body: rowData => getExpiredLots(rowData.lotes).length
    }), activeTab === 'inventory' && /*#__PURE__*/React.createElement(Column, {
      header: "Acciones",
      body: rowData => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TableActionsWrapper, null, /*#__PURE__*/React.createElement(EditTableAction, {
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
      }), /*#__PURE__*/React.createElement("span", null, "Ver m\xE1s"))))))
    })));
  };

  // Plantilla de expansión para productos (muestra lotes)
  const productRowExpansionTemplate = data => {
    const lotsToShow = activeTab === 'inventory' ? getActiveLots(data.lotes) : getExpiredLots(data.lotes);
    return /*#__PURE__*/React.createElement("div", {
      className: "p-3"
    }, /*#__PURE__*/React.createElement(DataTable, {
      value: lotsToShow
    }, /*#__PURE__*/React.createElement(Column, {
      field: "lot_number",
      header: "N\xB0 Lote",
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "expiration_date",
      header: "Fecha Vencimiento",
      sortable: true,
      body: rowData => formatDate(rowData.expiration_date)
    }), /*#__PURE__*/React.createElement(Column, {
      field: "quantity",
      header: "Cantidad",
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "purchase_price",
      header: "Precio Compra",
      body: rowData => `$${rowData.purchase_price}`
    }), activeTab === 'inventory' && /*#__PURE__*/React.createElement(Column, {
      header: "Estado",
      body: rowData => {
        const expirationStatus = rowData.expiration_status;
        const severity = {
          active: 'success',
          'expiring_soon': 'warning',
          expired: 'danger'
        };
        const label = {
          active: 'Activo',
          'expiring_soon': 'Próximo a vencer',
          expired: 'Vencido'
        };
        return /*#__PURE__*/React.createElement(Tag, {
          severity: severity[expirationStatus],
          value: label[expirationStatus]
        });
      }
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
      value: `${summary.totalActiveLots} lotes activos`
    }), /*#__PURE__*/React.createElement(Badge, {
      severity: "warning",
      value: `${summary.totalExpiringSoonLots} lotes próximos a vencer`
    }), /*#__PURE__*/React.createElement(Badge, {
      severity: "danger",
      value: `${summary.totalExpiredLots} lotes vencidos`
    })));
  };
  const handleEditProduct = product => {
    setSelectedProduct(product);
    setShowFormModal(true);
  };
  const onHandleSubmit = async data => {
    if (!selectedProduct) return;
    updateProduct(selectedProduct.id.toString(), {
      product: data,
      entities: []
    }).then(() => {
      setShowFormModal(false);
      fetchProductWithLotInventory();
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
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-between align-items-center mb-4 p-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-buttonset"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Inventario Activo",
    className: activeTab === 'inventory' ? '' : 'p-button-outlined',
    onClick: () => {
      setActiveTab('inventory');
      setSelectedProduct(null);
    }
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Inventario Vencido",
    className: activeTab === 'expired' ? '' : 'p-button-outlined',
    onClick: () => {
      setActiveTab('expired');
      setSelectedProduct(null);
    }
  }))), /*#__PURE__*/React.createElement(DataTable, {
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