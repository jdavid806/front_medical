import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
const cuentasData = [{
  code: 1,
  name: "Activo"
}, {
  code: 2,
  name: "Pasivo"
}, {
  code: 3,
  name: "Patrimonio"
}, {
  code: 4,
  name: "Ingresos"
}, {
  code: 5,
  name: "Gasto"
}, {
  code: 6,
  name: "Costos de venta"
}, {
  code: 7,
  name: "Costos de producción"
}, {
  code: 8,
  name: "Cuentas de orden deudoras"
}, {
  code: 9,
  name: "Cuentas de orden acreedoras"
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
}, {
  label: "Inventarios",
  value: "Inventarios"
}, {
  label: "Activos fijos",
  value: "Activos fijos"
}, {
  label: "Otros Activos",
  value: "Otros Activos"
}, {
  label: "Cuentas por pagar",
  value: "Cuentas por pagar"
}, {
  label: "Otros pasivos corrientes",
  value: "Otros pasivos corrientes"
}, {
  label: "Pasivo corto plazo",
  value: "Pasivo corto plazo"
}, {
  label: "Pasivo largos plazos",
  value: "Pasivo largos plazos"
}, {
  label: "Otros pasivos",
  value: "Otros pasivos"
}, {
  label: "Patrimonio",
  value: "Patrimonio"
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
export const AccountingAccounts = () => {
  const [fiscalChecked, setFiscalChecked] = useState(false);
  const [activaChecked, setActivaChecked] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedDetalle, setSelectedDetalle] = useState(null);
  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [expandedRows, setExpandedRows] = useState(null);

  // Estructura jerárquica de cuentas contables
  const cuentas = [{
    key: "1",
    codigo: "1",
    cuenta: "Activo",
    nivel: 1,
    children: [{
      key: "1-1",
      codigo: "11",
      cuenta: "Activo Corriente",
      nivel: 2,
      children: [{
        key: "1-1-1",
        codigo: "1105",
        cuenta: "Caja y Bancos",
        nivel: 3,
        children: [{
          key: "1-1-1-1",
          codigo: "110505",
          cuenta: "Bancos nacionales",
          nivel: 4,
          children: [{
            key: "1-1-1-1-1",
            codigo: "11050501",
            cuenta: "Banco de Bogotá",
            nivel: 5
          }]
        }]
      }]
    }]
  }, {
    key: "2",
    codigo: "2",
    cuenta: "Pasivo",
    nivel: 1,
    children: [{
      key: "2-1",
      codigo: "21",
      cuenta: "Pasivo Corriente",
      nivel: 2,
      children: [{
        key: "2-1-1",
        codigo: "2105",
        cuenta: "Bancos nacionales",
        nivel: 3,
        children: [{
          key: "2-1-1-1",
          codigo: "210510",
          cuenta: "Pagares",
          nivel: 4,
          children: [{
            key: "2-1-1-1-1",
            codigo: "21051001",
            cuenta: "Colpatria costo amortizado",
            nivel: 5
          }]
        }]
      }]
    }]
  }];

  // Filtrado de cuentas basado en el código o nombre
  const filterCuentas = (cuentas, searchCode, searchName) => {
    return cuentas.map(cuenta => {
      const matchesCode = searchCode === "" || cuenta.codigo.includes(searchCode);
      const matchesName = searchName === "" || cuenta.cuenta.toLowerCase().includes(searchName.toLowerCase());
      let filteredChildren = cuenta.children ? filterCuentas(cuenta.children, searchCode, searchName) : undefined;
      if (matchesCode || matchesName || filteredChildren && filteredChildren.length > 0) {
        return {
          ...cuenta,
          children: filteredChildren
        };
      }
      return null;
    }).filter(cuenta => cuenta !== null);
  };

  // Función para expandir/colapsar todos
  const toggleAll = () => {
    if (expandedRows) {
      setExpandedRows(null);
    } else {
      const expanded = {};
      const expandAll = cuentas => {
        cuentas.forEach(c => {
          expanded[c.key] = true;
          if (c.children) expandAll(c.children);
        });
      };
      expandAll(cuentas);
      setExpandedRows(expanded);
    }
  };

  // Cuentas filtradas
  const filteredCuentas = filterCuentas(cuentas, searchCode, searchName);
  const handleSubmit = e => {
    e.preventDefault();
    console.log({
      fiscal: fiscalChecked,
      activa: activaChecked,
      categoria: selectedCategoria,
      detalle: selectedDetalle
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container mt-4 w-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "m-0"
  }, "Cuentas Contables")), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mt-3 px-3"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-add"
  }, "+ Nuevo componente contable"), /*#__PURE__*/React.createElement("div", {
    className: "dropdown"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-dropdown"
  }, "+ Nueva"), /*#__PURE__*/React.createElement("div", {
    className: "dropdown-content"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Recibo Pago"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Recibo caja")))), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 pe-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-4 g-3 align-items-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label fw-bold"
  }, "C\xF3digo"), /*#__PURE__*/React.createElement(InputText, {
    value: searchCode,
    onChange: e => setSearchCode(e.target.value),
    placeholder: "Buscar c\xF3digo",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label fw-bold"
  }, "Cuenta"), /*#__PURE__*/React.createElement(InputText, {
    value: searchName,
    onChange: e => setSearchName(e.target.value),
    placeholder: "Buscar nombre",
    className: "w-100"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: toggleAll,
    className: "p-button-sm p-button-outlined"
  }, expandedRows ? "Colapsar Todo" : "Expandir Todo")), /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: filteredCuentas,
    expandedRows: expandedRows,
    onRowToggle: e => setExpandedRows(e.data),
    rowExpansionTemplate: data => /*#__PURE__*/React.createElement("div", {
      style: {
        paddingLeft: `${data.nivel * 20}px`
      }
    }, data.children?.map(child => /*#__PURE__*/React.createElement("div", {
      key: child.key,
      style: {
        paddingLeft: "20px"
      }
    }, child.cuenta, " (", child.codigo, ")"))),
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25],
    className: "p-datatable-sm"
  }, /*#__PURE__*/React.createElement(Column, {
    expander: true,
    style: {
      width: "3em"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "codigo",
    header: "C\xF3digo",
    sortable: true,
    className: "text-center",
    style: {
      width: "25%"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Cuenta Contable",
    body: rowData => /*#__PURE__*/React.createElement("div", {
      style: {
        paddingLeft: `${(rowData.nivel - 1) * 20}px`,
        fontWeight: rowData.nivel === 1 ? "bold" : "normal"
      }
    }, rowData.cuenta),
    sortable: true,
    style: {
      width: "72%"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 ps-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-center"
  }, "Detalle de Cuentas")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: [{
      tipo: "Clase",
      codigo: "1",
      nombre: "Activo"
    }, {
      tipo: "Grupo",
      codigo: "11",
      nombre: "Deudores comerciales"
    }, {
      tipo: "Cuenta",
      codigo: "05",
      nombre: "Clientes nacionales"
    }, {
      tipo: "subCuenta",
      codigo: "05",
      nombre: "Fiscal de clientes"
    }, {
      tipo: "Auxiliar",
      codigo: "11",
      nombre: "Fiscal de clientes nacionales"
    }],
    className: "p-datatable-sm"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "tipo",
    header: "Tipo",
    className: "text-center"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "codigo",
    header: "C\xF3digo",
    className: "text-center"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "nombre",
    header: "Nombre",
    className: "text-center"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row align-items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "m-0 text-center"
  }, "Caracter\xEDstica Transaccional")))), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-3 border-bottom pb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "m-0"
  }, "Relacionado con")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "m-0"
  }, "Sin asignar"))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 row align-items-center"
  }, /*#__PURE__*/React.createElement("label", {
    className: "col-sm-5 col-form-label text-end pe-3 fw-bold"
  }, "Categor\xEDa:"), /*#__PURE__*/React.createElement("div", {
    className: "col-sm-7"
  }, /*#__PURE__*/React.createElement(Dropdown, {
    value: selectedCategoria,
    onChange: e => setSelectedCategoria(e.value),
    options: categorias,
    optionLabel: "label",
    placeholder: "Seleccione categor\xEDa",
    className: "w-100",
    panelClassName: "shadow-sm"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3 row align-items-center"
  }, /*#__PURE__*/React.createElement("label", {
    className: "col-sm-5 col-form-label text-end pe-3 fw-bold"
  }, "Detallar saldos:"), /*#__PURE__*/React.createElement("div", {
    className: "col-sm-7"
  }, /*#__PURE__*/React.createElement(Dropdown, {
    value: selectedDetalle,
    onChange: e => setSelectedDetalle(e.value),
    options: detalleSaldos,
    optionLabel: "label",
    placeholder: "Seleccione opci\xF3n",
    className: "w-100",
    panelClassName: "shadow-sm"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-100 d-flex flex-column justify-content-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center justify-content-between mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "fiscal",
    className: "form-check-label fw-bold pe-2 mb-0"
  }, "Cuenta de diferencia fiscal:"), /*#__PURE__*/React.createElement("div", {
    className: "form-check ps-0"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "fiscal",
    checked: fiscalChecked,
    onChange: e => setFiscalChecked(e.checked ?? false)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center justify-content-between"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "activa",
    className: "form-check-label fw-bold pe-2 mb-0"
  }, "Activa:"), /*#__PURE__*/React.createElement("div", {
    className: "form-check ps-0"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "activa",
    checked: activaChecked,
    onChange: e => setActivaChecked(e.checked ?? false)
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center gap-2 mt-4"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-add",
    type: "button"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash-alt me-2"
  }), "Borrar Auxiliar"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn-add"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save me-2"
  }), "Guardar"))))))))), /*#__PURE__*/React.createElement("style", null, `
                h3 {
                    font-size: 1.2rem;
                    font-weight: 700;
                }
                .btn-add {  
                    background-color: #003C4A;
                    color: white;  
                    border: none;  
                    padding: 10px 20px;  
                    cursor: pointer;  
                    border-radius: 5px;
                }  
                .btn-dropdown {  
                    background-color: #cfe3f7;  
                    color: #003C4A;  
                    border: none;  
                    padding: 10px 20px;  
                    cursor: pointer;  
                    border-radius: 5px;  
                    position: relative;
                }  
                .dropdown {
                    position: relative;
                    display: inline-block;
                }
                .dropdown-content {  
                    display: none;
                    position: absolute;
                    background-color: white;  
                    border: 1px solid #ccc;  
                    z-index: 1;  
                    width: 130px;
                }  
                .dropdown:hover .dropdown-content {  
                    display: block;
                }  
                .dropdown-content a {  
                    display: block;
                    padding: 10px;  
                    color: #003C4A;  
                    text-decoration: none;  
                }  
                .dropdown-content a:hover {  
                    background-color: #f1f1f1;
                } 
                .p-datatable .p-datatable-thead > tr > th,
                .p-datatable .p-datatable-tbody > tr > td {
                    text-align: center !important;
                }
                .p-column-header-content {
                    justify-content: center !important;
                    width: 100%;
                }
                .p-sortable-column-icon {
                    margin-left: 0.5rem;
                }
                .card {
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                }
                .card-header {
                    background-color: #f8f9fa;
                    border-bottom: 1px solid #e0e0e0;
                }
                @media (max-width: 767px) {
                    .col-form-label {
                        text-align: left !important;
                        padding-right: 0.5rem !important;
                    }
                }
            `));
};