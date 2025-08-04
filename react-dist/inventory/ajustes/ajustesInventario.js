import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputTextarea } from 'primereact/inputtextarea';
import { Tag } from 'primereact/tag';
import { InputNumber } from 'primereact/inputnumber';
import { Panel } from 'primereact/panel';
const initialProducts = [{
  id: "1",
  name: "Laptop Dell Inspiron 15",
  sku: "DELL-INS-15",
  currentStock: 25,
  unit: "unidades",
  category: "Electrónicos"
}, {
  id: "2",
  name: "Mouse Inalámbrico Logitech",
  sku: "LOG-MX-MASTER",
  currentStock: 150,
  unit: "unidades",
  category: "Accesorios"
}, {
  id: "3",
  name: 'Monitor Samsung 24"',
  sku: "SAM-MON-24",
  currentStock: 45,
  unit: "unidades",
  category: "Monitores"
}, {
  id: "4",
  name: "Teclado Mecánico RGB",
  sku: "KEY-MECH-RGB",
  currentStock: 80,
  unit: "unidades",
  category: "Accesorios"
}, {
  id: "5",
  name: "Impresora HP LaserJet",
  sku: "HP-LASER-PRO",
  currentStock: 12,
  unit: "unidades",
  category: "Impresoras"
}];
const reasonOptions = [{
  label: "Recuento físico",
  value: "Recuento físico"
}, {
  label: "Producto dañado",
  value: "Producto dañado"
}, {
  label: "Producto vencido",
  value: "Producto vencido"
}, {
  label: "Robo/Pérdida",
  value: "Robo/Pérdida"
}, {
  label: "Error de sistema",
  value: "Error de sistema"
}, {
  label: "Devolución de cliente",
  value: "Devolución de cliente"
}, {
  label: "Transferencia entre almacenes",
  value: "Transferencia entre almacenes"
}, {
  label: "Corrección de inventario",
  value: "Corrección de inventario"
}, {
  label: "Otro",
  value: "Otro"
}];
export const InventoryAdjustmentsApp = () => {
  const [products] = useState(initialProducts);
  const [adjustments, setAdjustments] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const updateAdjustment = (productId, field, value) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    setAdjustments(prev => {
      const current = prev[productId] || {
        productId,
        currentStock: product.currentStock,
        newQuantity: product.currentStock,
        adjustment: 0,
        reason: '',
        notes: ''
      };
      const updated = {
        ...current,
        [field]: value
      };
      if (field === 'newQuantity') {
        updated.adjustment = updated.newQuantity - product.currentStock;
      }
      return {
        ...prev,
        [productId]: updated
      };
    });
  };
  const incrementQuantity = productId => {
    const current = adjustments[productId]?.newQuantity || products.find(p => p.id === productId)?.currentStock || 0;
    updateAdjustment(productId, 'newQuantity', current + 1);
  };
  const decrementQuantity = productId => {
    const current = adjustments[productId]?.newQuantity || products.find(p => p.id === productId)?.currentStock || 0;
    if (current > 0) {
      updateAdjustment(productId, 'newQuantity', current - 1);
    }
  };
  const handleSaveAdjustments = () => {
    const adjustmentsToSave = Object.values(adjustments).filter(adj => adj.adjustment !== 0 && adj.reason);
    if (adjustmentsToSave.length === 0) {
      alert("No hay ajustes para guardar o faltan razones por especificar");
      return;
    }
    console.log("Ajustes a guardar:", adjustmentsToSave);
    alert(`Se guardarán ${adjustmentsToSave.length} ajustes de inventario`);
    setAdjustments({});
  };
  const productTemplate = rowData => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 'bold',
      marginBottom: '4px'
    }
  }, rowData.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.875rem',
      color: '#6b7280'
    }
  }, rowData.category));
  const stockTemplate = rowData => /*#__PURE__*/React.createElement(Tag, {
    value: `${rowData.currentStock} ${rowData.unit}`,
    severity: "info"
  });
  const quantityTemplate = rowData => {
    const current = adjustments[rowData.id] || {
      productId: rowData.id,
      currentStock: rowData.currentStock,
      newQuantity: rowData.currentStock,
      adjustment: 0,
      reason: '',
      notes: ''
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      icon: "pi pi-minus",
      rounded: true,
      text: true,
      onClick: () => decrementQuantity(rowData.id)
    }), /*#__PURE__*/React.createElement(InputNumber, {
      value: current.newQuantity,
      onValueChange: e => updateAdjustment(rowData.id, 'newQuantity', e.value || 0),
      min: 0,
      showButtons: true,
      buttonLayout: "horizontal",
      decrementButtonClassName: "p-button-secondary",
      incrementButtonClassName: "p-button-secondary"
    }), /*#__PURE__*/React.createElement(Button, {
      icon: "pi pi-plus",
      rounded: true,
      text: true,
      onClick: () => incrementQuantity(rowData.id)
    }));
  };
  const reasonTemplate = rowData => /*#__PURE__*/React.createElement(Dropdown, {
    value: adjustments[rowData.id]?.reason || '',
    options: reasonOptions,
    onChange: e => updateAdjustment(rowData.id, 'reason', e.value),
    className: "w-full",
    placeholder: "Seleccione"
  });
  const notesTemplate = rowData => /*#__PURE__*/React.createElement(InputTextarea, {
    value: adjustments[rowData.id]?.notes || '',
    onChange: e => updateAdjustment(rowData.id, 'notes', e.target.value),
    rows: 1,
    autoResize: true,
    className: "w-full"
  });
  const adjustmentTemplate = rowData => {
    const adj = adjustments[rowData.id]?.adjustment || 0;
    const severity = adj > 0 ? 'success' : adj < 0 ? 'danger' : 'info';
    return /*#__PURE__*/React.createElement(Tag, {
      value: adj,
      severity: severity
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement(Panel, {
    header: "Ajustes de Inventario"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4 flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "p-input-icon-left w-50"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-search"
  }), /*#__PURE__*/React.createElement(InputText, {
    value: globalFilter,
    onChange: e => setGlobalFilter(e.target.value),
    placeholder: "Buscar producto",
    className: "w-full"
  })), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar Ajustes",
    icon: "pi pi-save",
    onClick: handleSaveAdjustments,
    disabled: Object.values(adjustments).filter(a => a.adjustment !== 0 && a.reason).length === 0
  })), /*#__PURE__*/React.createElement(DataTable, {
    value: products,
    globalFilter: globalFilter,
    paginator: true,
    rows: 5,
    responsiveLayout: "scroll"
  }, /*#__PURE__*/React.createElement(Column, {
    header: "Producto",
    body: productTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Stock Actual",
    body: stockTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Cantidad Nueva",
    body: quantityTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Ajuste",
    body: adjustmentTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Motivo",
    body: reasonTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Notas",
    body: notesTemplate
  }))));
};