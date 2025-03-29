import React, { useState, useCallback, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { FilterService } from "primereact/api";
import { Toolbar } from "primereact/toolbar";

// Configurar filtros personalizados para PrimeReact
FilterService.register('customSearch', (value, filter) => {
  if (filter === undefined || filter === null || filter.trim() === '') {
    return true;
  }
  if (value === undefined || value === null) {
    return false;
  }
  return value.toString().toLowerCase().includes(filter.toLowerCase());
});
const initialCuentas = [{
  id: "1",
  codigo: "1",
  nombre: "Activo",
  nivel: "clase",
  fiscalDifference: false,
  activa: true,
  children: [{
    id: "1-1",
    codigo: "11",
    nombre: "Activo Corriente",
    nivel: "grupo",
    fiscalDifference: false,
    activa: true,
    children: [{
      id: "1-1-1",
      codigo: "1105",
      nombre: "Caja y Bancos",
      nivel: "cuenta",
      fiscalDifference: false,
      activa: true,
      children: [{
        id: "1-1-1-1",
        codigo: "110505",
        nombre: "Bancos nacionales",
        nivel: "subcuenta",
        fiscalDifference: false,
        activa: true,
        children: [{
          id: "1-1-1-1-1",
          codigo: "11050501",
          nombre: "Banco de Bogotá",
          nivel: "auxiliar",
          fiscalDifference: false,
          activa: true,
          children: [{
            id: "1-1-1-1-1-1",
            codigo: "1105050101",
            nombre: "Cuenta Corriente",
            nivel: "subauxiliar",
            fiscalDifference: false,
            activa: true
          }]
        }]
      }]
    }]
  }]
}, {
  id: "2",
  codigo: "2",
  nombre: "Pasivo",
  nivel: "clase",
  fiscalDifference: false,
  activa: true,
  children: [{
    id: "2-1",
    codigo: "21",
    nombre: "Pasivo Corriente",
    nivel: "grupo",
    fiscalDifference: false,
    activa: true,
    children: [{
      id: "2-1-1",
      codigo: "2105",
      nombre: "Obligaciones Bancarias",
      nivel: "cuenta",
      fiscalDifference: false,
      activa: true,
      children: [{
        id: "2-1-1-1",
        codigo: "210505",
        nombre: "Préstamos a Corto Plazo",
        nivel: "subcuenta",
        fiscalDifference: false,
        activa: true
      }]
    }]
  }]
}, {
  id: "3",
  codigo: "3",
  nombre: "Patrimonio",
  nivel: "clase",
  fiscalDifference: false,
  activa: true,
  children: [{
    id: "3-1",
    codigo: "31",
    nombre: "Capital Social",
    nivel: "grupo",
    fiscalDifference: false,
    activa: true,
    children: [{
      id: "3-1-1",
      codigo: "3105",
      nombre: "Acciones Ordinarias",
      nivel: "cuenta",
      fiscalDifference: false,
      activa: true
    }]
  }]
}];
const categorias = [{
  label: "Caja - bancos",
  value: "Caja - bancos"
}, {
  label: "Cuentas por cobrar",
  value: "Cuentas por cobrar"
}, {
  label: "Otros activos corrientes",
  value: "Otros activos corrientes"
}];
const detalleSaldos = [{
  label: "Sin detalle de vencimientos",
  value: "Sin detalle de vencimientos"
}, {
  label: "Clientes, controla vencimientos y estados de cuenta",
  value: "Clientes, controla vencimientos y estados de cuenta"
}, {
  label: "Proveedores, controla vencimientos y estado de cuenta",
  value: "Proveedores, controla vencimientos y estado de cuenta"
}];
const accountLevels = [{
  label: 'Clase',
  value: 'clase'
}, {
  label: 'Grupo',
  value: 'grupo'
}, {
  label: 'Cuenta',
  value: 'cuenta'
}, {
  label: 'SubCuenta',
  value: 'subcuenta'
}, {
  label: 'Auxiliar',
  value: 'auxiliar'
}, {
  label: 'SubAuxiliar',
  value: 'subauxiliar'
}];
export const AccountingAccounts = () => {
  // Estados principales
  const [cuentas, setCuentas] = useState(initialCuentas);
  const [tableData, setTableData] = useState([]);
  const [activeAccordionKeys, setActiveAccordionKeys] = useState({});
  const [selectedPath, setSelectedPath] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Filtros mejorados con PrimeReact
  const [filters, setFilters] = useState({
    codigo: {
      value: '',
      matchMode: 'customSearch'
    },
    nombre: {
      value: '',
      matchMode: 'customSearch'
    }
  });

  // Estados del formulario
  const [fiscalChecked, setFiscalChecked] = useState(false);
  const [activaChecked, setActivaChecked] = useState(true);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedDetalle, setSelectedDetalle] = useState(null);
  const [showNewAccountDialog, setShowNewAccountDialog] = useState(false);
  const [showNewComponentDialog, setShowNewComponentDialog] = useState(false);
  const [newAccount, setNewAccount] = useState({
    tipo: 'clase',
    codigo: '',
    nombre: '',
    fiscalDifference: false,
    activa: true
  });

  // Función para encontrar la ruta de un nodo
  const findNodePath = useCallback((nodes, id, path = []) => {
    for (const node of nodes) {
      if (node.id === id) return [...path, node];
      if (node.children) {
        const found = findNodePath(node.children, id, [...path, node]);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // Función para obtener índices activos basados en la ruta
  const getActiveIndexesFromPath = useCallback((nodes, path) => {
    let currentNodes = nodes;
    const activeIndexes = {};
    let currentPath = 'root';
    for (const pathNode of path.slice(0, -1)) {
      const index = currentNodes.findIndex(n => n.id === pathNode.id);
      if (index === -1) break;
      if (!activeIndexes[currentPath]) {
        activeIndexes[currentPath] = [];
      }
      if (!activeIndexes[currentPath].includes(index)) {
        activeIndexes[currentPath].push(index);
      }
      currentNodes = currentNodes[index].children || [];
      currentPath = pathNode.id;
    }
    return activeIndexes;
  }, []);

  // Manejador de selección de cuenta
  const handleAccountSelect = useCallback((id, parentId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const path = findNodePath(cuentas, id);
    if (path) {
      const account = path[path.length - 1];
      setSelectedAccount(account);
      setSelectedPath(path);
      setTableData(path.map(node => ({
        tipo: node.nivel.charAt(0).toUpperCase() + node.nivel.slice(1),
        codigo: node.codigo,
        nombre: node.nombre
      })));
      const newActiveIndexes = getActiveIndexesFromPath(cuentas, path);
      setActiveAccordionKeys(prev => {
        // If clicking on the same parent, toggle the accordion
        if (parentId) {
          const parentNodes = parentId === 'root' ? cuentas : cuentas.flatMap(c => c.children || []).find(c => c.id === parentId)?.children || [];
          const index = parentNodes.findIndex(n => n.id === id);
          if (prev[parentId]?.includes(index)) {
            return {
              ...prev,
              [parentId]: prev[parentId].filter(i => i !== index)
            };
          }
        }
        return newActiveIndexes;
      });

      // Set form values from selected account
      setFiscalChecked(account.fiscalDifference);
      setActivaChecked(account.activa);
      setSelectedCategoria(account.categoria ? categorias.find(c => c.value === account.categoria) || null : null);
      setSelectedDetalle(account.detalleSaldos ? detalleSaldos.find(d => d.value === account.detalleSaldos) || null : null);
    }
  }, [cuentas, findNodePath, getActiveIndexesFromPath]);

  // Renderizar acordeón con indentación
  const renderAccordion = useCallback((data, depth = 0, parentId = 'root') => {
    return data.map((item, index) => {
      const hasContent = item.children && item.children.length > 0;
      const isActive = activeAccordionKeys[parentId]?.includes(index) || false;
      return /*#__PURE__*/React.createElement(AccordionTab, {
        key: item.id,
        header: /*#__PURE__*/React.createElement("div", {
          className: "accordion-header-content",
          onClick: e => handleAccountSelect(item.id, parentId, e),
          style: {
            paddingLeft: `${depth * 1.5}rem`
          }
        }, /*#__PURE__*/React.createElement("span", {
          className: "account-code"
        }, item.codigo), /*#__PURE__*/React.createElement("span", {
          className: "account-name"
        }, item.nombre), hasContent && /*#__PURE__*/React.createElement("i", {
          className: `pi pi-chevron-${isActive ? 'down' : 'right'} accordion-arrow`
        }))
      }, hasContent && /*#__PURE__*/React.createElement(Accordion, {
        multiple: true,
        activeIndex: activeAccordionKeys[item.id] || [],
        onTabChange: e => {
          setActiveAccordionKeys(prev => ({
            ...prev,
            [item.id]: e.index
          }));
        }
      }, renderAccordion(item.children || [], depth + 1, item.id)));
    });
  }, [activeAccordionKeys, handleAccountSelect]);

  // Filtrar cuentas con PrimeReact
  const filteredCuentas = useMemo(() => {
    if (!filters.codigo.value && !filters.nombre.value) return cuentas;
    const filterNodes = nodes => {
      return nodes.map(node => {
        const matchesCode = !filters.codigo.value || node.codigo.toLowerCase().includes(filters.codigo.value.toLowerCase());
        const matchesName = !filters.nombre.value || node.nombre.toLowerCase().includes(filters.nombre.value.toLowerCase());
        const filteredChildren = node.children ? filterNodes(node.children) : undefined;
        if (matchesCode || matchesName || filteredChildren && filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren
          };
        }
        return null;
      }).filter(node => node !== null);
    };
    return filterNodes(cuentas);
  }, [cuentas, filters]);
  const accordionContent = useMemo(() => renderAccordion(filteredCuentas, 0), [filteredCuentas, renderAccordion]);

  // Manejadores de eventos
  const handleSubmit = e => {
    e.preventDefault();
    if (!selectedAccount) return;

    // Actualizar la cuenta seleccionada
    const updatedAccount = {
      ...selectedAccount,
      fiscalDifference: fiscalChecked,
      activa: activaChecked,
      categoria: selectedCategoria?.value,
      detalleSaldos: selectedDetalle?.value
    };

    // Función para actualizar el árbol de cuentas
    const updateAccounts = nodes => {
      return nodes.map(node => {
        if (node.id === selectedAccount.id) {
          return updatedAccount;
        }
        if (node.children) {
          return {
            ...node,
            children: updateAccounts(node.children)
          };
        }
        return node;
      });
    };
    setCuentas(updateAccounts(cuentas));
  };
  const handleCreateAccount = () => {
    if (!newAccount.codigo || !newAccount.nombre) return;
    const newAccountNode = {
      id: `new-${Date.now()}`,
      codigo: newAccount.codigo,
      nombre: newAccount.nombre,
      nivel: newAccount.tipo,
      fiscalDifference: newAccount.fiscalDifference,
      activa: newAccount.activa,
      categoria: newAccount.categoria,
      detalleSaldos: newAccount.detalleSaldos
    };

    // Lógica para agregar la nueva cuenta al árbol
    if (selectedAccount) {
      // Agregar como hijo de la cuenta seleccionada
      const addToParent = nodes => {
        return nodes.map(node => {
          if (node.id === selectedAccount.id) {
            return {
              ...node,
              children: [...(node.children || []), newAccountNode]
            };
          }
          if (node.children) {
            return {
              ...node,
              children: addToParent(node.children)
            };
          }
          return node;
        });
      };
      setCuentas(addToParent(cuentas));
    } else {
      // Agregar como nueva cuenta de nivel superior
      setCuentas([...cuentas, newAccountNode]);
    }
    setShowNewAccountDialog(false);
    setNewAccount({
      tipo: 'clase',
      codigo: '',
      nombre: '',
      fiscalDifference: false,
      activa: true
    });
  };
  const handleCreateComponent = () => {
    // Lógica para crear un nuevo componente
    setShowNewComponentDialog(false);
  };
  const leftToolbarTemplate = () => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Nuevo Componente",
      icon: "pi pi-plus",
      className: "p-button-success",
      onClick: () => setShowNewComponentDialog(true)
    }), /*#__PURE__*/React.createElement(Button, {
      label: "Nueva Cuenta",
      icon: "pi pi-plus",
      className: "p-button-primary",
      onClick: () => setShowNewAccountDialog(true)
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "accounting-container container-fluid py-4"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "main-card shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light"
  }, /*#__PURE__*/React.createElement(Toolbar, {
    left: leftToolbarTemplate
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-body p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-6"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "h-100 border-0 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column flex-md-row justify-content-between align-items-md-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "h5 mb-3 mb-md-0"
  }, "Estructura Contable"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 w-100 w-md-auto"
  }, /*#__PURE__*/React.createElement("span", {
    className: "p-float-label flex-grow-1"
  }, /*#__PURE__*/React.createElement(InputText, {
    id: "searchCode",
    value: filters.codigo.value,
    onChange: e => setFilters({
      ...filters,
      codigo: {
        ...filters.codigo,
        value: e.target.value
      }
    }),
    className: "w-100"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "searchCode"
  }, "C\xF3digo")), /*#__PURE__*/React.createElement("span", {
    className: "p-float-label flex-grow-1"
  }, /*#__PURE__*/React.createElement(InputText, {
    id: "searchName",
    value: filters.nombre.value,
    onChange: e => setFilters({
      ...filters,
      nombre: {
        ...filters.nombre,
        value: e.target.value
      }
    }),
    className: "w-100"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "searchName"
  }, "Nombre"))))), /*#__PURE__*/React.createElement("div", {
    className: "card-body p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "account-accordion-container"
  }, /*#__PURE__*/React.createElement(Accordion, {
    multiple: true,
    activeIndex: activeAccordionKeys['root'] || [],
    onTabChange: e => {
      setActiveAccordionKeys(prev => ({
        ...prev,
        ['root']: e.index
      }));
    }
  }, accordionContent))))), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3 h-100"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "border-0 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "h5 m-0"
  }, "Jerarqu\xEDa de la Cuenta"), /*#__PURE__*/React.createElement(Button, {
    label: "Nueva Subcuenta",
    icon: "pi pi-plus",
    className: "p-button-sm p-button-outlined",
    onClick: () => setShowNewAccountDialog(true),
    disabled: !selectedAccount
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-body p-2"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: tableData,
    emptyMessage: "Seleccione una cuenta del plan",
    className: "p-datatable-sm",
    scrollable: true,
    scrollHeight: "200px"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "tipo",
    header: "Nivel",
    style: {
      width: '25%'
    },
    body: rowData => /*#__PURE__*/React.createElement("span", {
      className: `level-${rowData.tipo.toLowerCase()}`
    }, rowData.tipo)
  }), /*#__PURE__*/React.createElement(Column, {
    field: "codigo",
    header: "C\xF3digo",
    style: {
      width: '25%'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "nombre",
    header: "Nombre",
    style: {
      width: '50%'
    }
  })))), /*#__PURE__*/React.createElement(Card, {
    className: "border-0 shadow-sm flex-grow-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "h5 m-0"
  }, "Caracter\xEDsticas de la Cuenta")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "d-flex flex-column h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label fw-bold"
  }, "Categor\xEDa"), /*#__PURE__*/React.createElement(Dropdown, {
    value: selectedCategoria,
    options: categorias,
    onChange: e => setSelectedCategoria(e.value),
    optionLabel: "label",
    placeholder: "Seleccione categor\xEDa",
    className: "w-100",
    disabled: !selectedAccount
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label fw-bold"
  }, "Detalle de saldos"), /*#__PURE__*/React.createElement(Dropdown, {
    value: selectedDetalle,
    options: detalleSaldos,
    onChange: e => setSelectedDetalle(e.value),
    optionLabel: "label",
    placeholder: "Seleccione opci\xF3n",
    className: "w-100",
    disabled: !selectedAccount
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-check"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "fiscalDifference",
    checked: fiscalChecked,
    onChange: e => setFiscalChecked(e.checked ?? false),
    className: "form-check-input",
    disabled: !selectedAccount
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "fiscalDifference",
    className: "form-check-label"
  }, "Cuenta de diferencia fiscal"))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-check"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "active",
    checked: activaChecked,
    onChange: e => setActivaChecked(e.checked ?? false),
    className: "form-check-input",
    disabled: !selectedAccount
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "active",
    className: "form-check-label"
  }, "Cuenta activa")))), /*#__PURE__*/React.createElement("div", {
    className: "mt-auto d-flex gap-2 justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-outlined p-button-danger rounded-pill",
    disabled: !selectedAccount
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: "pi pi-save",
    className: "p-button-primary rounded-pill",
    type: "submit",
    disabled: !selectedAccount
  })))))))))), /*#__PURE__*/React.createElement(Dialog, {
    header: "Crear Nueva Cuenta",
    visible: showNewAccountDialog,
    style: {
      width: '50vw'
    },
    onHide: () => setShowNewAccountDialog(false),
    footer: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
      label: "Cancelar",
      icon: "pi pi-times",
      onClick: () => setShowNewAccountDialog(false),
      className: "p-button-text"
    }), /*#__PURE__*/React.createElement(Button, {
      label: "Crear",
      icon: "pi pi-check",
      onClick: handleCreateAccount,
      autoFocus: true
    }))
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "accountType"
  }, "Tipo de Cuenta"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "accountType",
    value: newAccount.tipo,
    options: accountLevels,
    onChange: e => setNewAccount({
      ...newAccount,
      tipo: e.value
    }),
    optionLabel: "label",
    placeholder: "Seleccione el tipo"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "accountCode"
  }, "C\xF3digo *"), /*#__PURE__*/React.createElement(InputText, {
    id: "accountCode",
    value: newAccount.codigo,
    onChange: e => setNewAccount({
      ...newAccount,
      codigo: e.target.value
    }),
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "accountName"
  }, "Nombre *"), /*#__PURE__*/React.createElement(InputText, {
    id: "accountName",
    value: newAccount.nombre,
    onChange: e => setNewAccount({
      ...newAccount,
      nombre: e.target.value
    }),
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "accountCategory"
  }, "Categor\xEDa"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "accountCategory",
    value: selectedCategoria,
    options: categorias,
    onChange: e => setSelectedCategoria(e.value),
    optionLabel: "label",
    placeholder: "Seleccione categor\xEDa"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "accountDetail"
  }, "Detalle de saldos"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "accountDetail",
    value: selectedDetalle,
    options: detalleSaldos,
    onChange: e => setSelectedDetalle(e.value),
    optionLabel: "label",
    placeholder: "Seleccione opci\xF3n"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field-checkbox"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "newFiscalDifference",
    checked: newAccount.fiscalDifference,
    onChange: e => setNewAccount({
      ...newAccount,
      fiscalDifference: e.checked ?? false
    })
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newFiscalDifference"
  }, "Cuenta de diferencia fiscal")), /*#__PURE__*/React.createElement("div", {
    className: "field-checkbox"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "newActive",
    checked: newAccount.activa,
    onChange: e => setNewAccount({
      ...newAccount,
      activa: e.checked ?? false
    })
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newActive"
  }, "Cuenta activa")))), /*#__PURE__*/React.createElement(Dialog, {
    header: "Crear Nuevo Componente",
    visible: showNewComponentDialog,
    style: {
      width: '50vw'
    },
    onHide: () => setShowNewComponentDialog(false),
    footer: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
      label: "Cancelar",
      icon: "pi pi-times",
      onClick: () => setShowNewComponentDialog(false),
      className: "p-button-text"
    }), /*#__PURE__*/React.createElement(Button, {
      label: "Crear",
      icon: "pi pi-check",
      onClick: handleCreateComponent,
      autoFocus: true
    }))
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "componentName"
  }, "Nombre del Componente *"), /*#__PURE__*/React.createElement(InputText, {
    id: "componentName",
    placeholder: "Ingrese el nombre del componente"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "componentDescription"
  }, "Descripci\xF3n"), /*#__PURE__*/React.createElement(InputText, {
    id: "componentDescription",
    placeholder: "Ingrese una descripci\xF3n"
  })))), /*#__PURE__*/React.createElement("style", null, `
                .main-card {
                    border: none;
                }
                
                .card-header {
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid #e0e0e0;
                }
                
                .card-body {
                    padding: 1.5rem;
                }
                
                .account-accordion-container {
                    max-height: 60vh;
                }
                
                .accordion-header-content {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.75rem 1rem;
                    transition: all 0.2s;
                    cursor: pointer;
                    border-bottom: 1px solid #eee;
                }
                
                .accordion-header-content:hover {
                    background-color: #f8f9fa;
                }
                
                .account-code {
                    font-weight: 600;
                    color: #2c3e50;
                    width: 80px;
                    flex-shrink: 0;
                    font-family: 'Roboto Mono', monospace;
                }
                
                .account-name {
                    color: #34495e;
                    flex-grow: 1;
                    font-size: medium !important;
                }
                
                .p-accordion .p-accordion-tab {
                    margin-bottom: 0.25rem;
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .p-accordion-header-link {
                    background: none !important;
                    border: none !important;
                    padding: 0 !important;
                }
                
                .p-accordion-content {
                    background-color: #fff !important;
                    border-left: 2px solid #3b82f6 !important;
                    margin-left: 1rem;
                    padding: 0.5rem !important;
                }
                
                .accordion-arrow {
                    transition: transform 0.2s;
                    margin-left: auto;
                }
                
                /* Estilos para la jerarquía en la tabla */
                .level-clase {
                    font-weight: bold;
                    color: #1e40af;
                }
                
                .level-grupo {
                    font-weight: bold;
                    color: #1e3a8a;
                }
                
                .level-cuenta {
                    color: #1e3a8a;
                }
                
                .level-subcuenta {
                    color: #4338ca;
                }
                
                .level-auxiliar {
                    color: #6b21a8;
                }
                
                .level-subauxiliar {
                    color: #86198f;
                }
                
                .form-label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #495057;
                }
                
                .field {
                    margin-bottom: 1.5rem;
                }
                
                .field-checkbox {
                    margin: 1.5rem 0;
                    display: flex;
                    align-items: center;
                }
                
                .field-checkbox label {
                    margin-left: 0.5rem;
                }
                
                .p-datatable .p-datatable-tbody > tr > td {
                    padding: 0.5rem 1rem;
                }
                
                @media (max-width: 768px) {
                    .account-code {
                        width: 60px;
                    }
                    
                    .accordion-header-content {
                        padding: 0.5rem;
                    }
                    
                    .card-body {
                        padding: 1rem;
                    }
                }
            `));
};