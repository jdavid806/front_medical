import React, { useEffect, useState } from "react";
import { useProductInventory } from "./hooks/useProductInventory.js";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { CustomModal } from "../components/CustomModal.js";
import { ProductInventoryDetail } from "./ProductInventoryDetail.js";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { ProductInventoryForm } from "./ProductInventoryForm.js";
import TableActionsWrapper from "../components/table-actions/TableActionsWrapper.js";
import { EditTableAction } from "../components/table-actions/EditTableAction.js";
import { useProductUpdate } from "../products/hooks/useProductUpdate.js";
import { stringToDate } from "../../services/utilidades.js";
export const ProductInventoryApp = ({
  type
}) => {
  const [tableItems, setTableItems] = useState([]);
  const [expiredTableItems, setExpiredTableItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const {
    productInventory,
    loading,
    fetchProductInventory
  } = useProductInventory(type);
  const {
    updateProduct
  } = useProductUpdate();
  useEffect(() => {
    const mappedItems = productInventory.map(product => {
      return {
        uuid: product.id,
        name: product.name,
        stock: product.stock?.toString() || "--",
        weight: product.weight?.toString() || "--",
        capacity: product.capacity?.toString() || "--",
        concentration: product.concentration?.toString() || "--",
        expiration_date: product.expiration_date ? new Intl.DateTimeFormat("es-AR", {
          year: "numeric",
          month: "long",
          day: "numeric"
        }).format(new Date(new Date(product.expiration_date).getTime() + 24 * 60 * 60 * 1000)) : "--",
        original: product
      };
    });
    setTableItems(mappedItems);
  }, [productInventory]);
  useEffect(() => {
    const today = new Date();
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    const expiredTableItems = tableItems.filter(item => {
      const expirationDate = stringToDate(item.original.expiration_date);
      return (expirationDate.getTime() <= today.getTime() || expirationDate.getTime() <= oneMonthAgo.getTime()) && item.original.expiration_date !== null;
    });
    setExpiredTableItems(expiredTableItems);
  }, [tableItems]);
  function openFormModal(selectedProduct) {
    setSelectedProduct(structuredClone(selectedProduct));
    setShowFormModal(true);
  }
  const columns = [{
    field: "name",
    header: "Nombre",
    sortable: true
  }, {
    field: "stock",
    header: "Stock",
    sortable: true
  }, {
    field: "weight",
    header: "Peso",
    sortable: true
  }, {
    field: "capacity",
    header: "Capacidad",
    sortable: true
  }, {
    field: "concentration",
    header: "Concentración",
    sortable: true
  }, {
    field: "expiration_date",
    header: "Fecha de vencimiento",
    sortable: true
  }, {
    field: "actions",
    header: "Acciones",
    sortable: false,
    frozen: false,
    body: rowData => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TableActionsWrapper, null, /*#__PURE__*/React.createElement(EditTableAction, {
      onTrigger: () => openFormModal(rowData)
    })))
  }];
  const handleRowSelect = rowData => {
    setSelectedProduct(structuredClone(rowData));
  };
  const onHandleSubmit = async data => {
    updateProduct(selectedProduct?.uuid || "", {
      product: data,
      entities: []
    }).then(() => {
      setShowFormModal(false);
      fetchProductInventory();
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-8"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    data: tableItems,
    columns: columns,
    globalFilterFields: ["name", "stock", "weight", "capacity", "concentration", "expiration_date"],
    onSelectedRow: handleRowSelect,
    loading: loading,
    onReload: fetchProductInventory,
    selectionActive: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card animated-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "card-title"
  }, selectedProduct?.name || "Selecciona un producto"), /*#__PURE__*/React.createElement("div", {
    className: "card-content"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Tipo:"), " ", /*#__PURE__*/React.createElement("span", null, selectedProduct?.original.product_type?.name || "--")), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Stock:"), " ", /*#__PURE__*/React.createElement("span", null, selectedProduct?.stock || "--")), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Precio:"), " ", /*#__PURE__*/React.createElement("span", null, selectedProduct?.original.sale_price || "--"))), selectedProduct && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm btn-primary",
    type: "button",
    onClick: () => setShowDetailModal(true)
  }, "Ver m\xE1s"))))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card h-100 animated-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-3"
  }, /*#__PURE__*/React.createElement("h4", null, "Los siguientes productos se encuentran pr\xF3ximos a caducar o se encuentran caducados")), /*#__PURE__*/React.createElement(CustomPRTable, {
    data: expiredTableItems,
    columns: columns,
    globalFilterFields: ["name", "stock", "weight", "capacity", "concentration", "expiration_date"],
    onSelectedRow: handleRowSelect,
    loading: loading,
    onReload: fetchProductInventory
  }))))), /*#__PURE__*/React.createElement(CustomModal, {
    title: "Detalles del producto",
    show: showDetailModal,
    onHide: () => setShowDetailModal(false)
  }, /*#__PURE__*/React.createElement(ProductInventoryDetail, {
    product: selectedProduct?.original
  })), /*#__PURE__*/React.createElement(CustomFormModal, {
    formId: "product-inventory-form",
    title: "Editar inventario del producto",
    show: showFormModal,
    onHide: () => setShowFormModal(false)
  }, /*#__PURE__*/React.createElement(ProductInventoryForm, {
    formId: "product-inventory-form",
    productId: selectedProduct?.uuid || "",
    onHandleSubmit: onHandleSubmit
  })));
};