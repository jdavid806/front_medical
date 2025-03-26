import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Badge } from "primereact/badge";
export const NewPurchaseInvoice = () => {
  // Mock data para el formulario principal
  const invoiceTypes = [{
    label: "Factura de Compra",
    value: "purchase"
  }, {
    label: "Factura de Servicio",
    value: "service"
  }, {
    label: "Factura de Importación",
    value: "import"
  }];
  const providers = [{
    label: "Proveedor A",
    value: "providerA"
  }, {
    label: "Proveedor B",
    value: "providerB"
  }, {
    label: "Proveedor C",
    value: "providerC"
  }];
  const contacts = [{
    label: "Juan Pérez - juan@proveedor.com",
    value: "contact1"
  }, {
    label: "María Gómez - maria@proveedor.com",
    value: "contact2"
  }, {
    label: "Carlos Ruiz - carlos@proveedor.com",
    value: "contact3"
  }];
  const providerInvoiceTypes = [{
    label: "FC",
    value: "FC"
  }, {
    label: "FD",
    value: "FD"
  }, {
    label: "FX",
    value: "FX"
  }];
  const providerInvoiceNumberTypes = [{
    label: "Consecutivo",
    value: "consecutive"
  }, {
    label: "Automático",
    value: "automatic"
  }, {
    label: "Manual",
    value: "manual"
  }];
  const costCenters = [{
    label: "Administración",
    value: "admin"
  }, {
    label: "Ventas",
    value: "sales"
  }, {
    label: "Producción",
    value: "production"
  }, {
    label: "TI",
    value: "it"
  }];

  // Mock data para la tabla de productos
  const productTypes = [{
    label: "Producto",
    value: "product"
  }, {
    label: "Servicio",
    value: "service"
  }, {
    label: "Material",
    value: "material"
  }];
  const products = [{
    label: "Producto A",
    value: "productA"
  }, {
    label: "Producto B",
    value: "productB"
  }, {
    label: "Producto C",
    value: "productC"
  }];
  const additionalDataOptions = [{
    label: "Ninguno",
    value: "none"
  }, {
    label: "Garantía",
    value: "warranty"
  }, {
    label: "Instalación",
    value: "installation"
  }];
  const taxOptions = [{
    label: "IVA 19%",
    value: "iva19"
  }, {
    label: "IVA 5%",
    value: "iva5"
  }, {
    label: "Exento",
    value: "exempt"
  }];

  // Form state
  const [formData, setFormData] = useState({
    invoiceType: null,
    elaborationDate: new Date(),
    provider: null,
    contact: null,
    invoiceNumber: generateInvoiceNumber(),
    providerInvoiceType: null,
    providerInvoiceNumber: null,
    providerInvoiceSpecific: "",
    costCenter: null,
    options: {
      providerPerItem: false,
      taxIncluded: false,
      discountPercentage: false
    }
  });

  // State para la tabla de productos
  const [items, setItems] = useState([{
    id: 1,
    type: "product",
    product: "productA",
    description: "",
    quantity: 1,
    unitValue: 0,
    discount: 0,
    additionalData: "none",
    taxes: "iva19",
    totalValue: 0
  }]);

  // Generate a random invoice number (mock)
  function generateInvoiceNumber() {
    return Math.floor(Math.random() * 90000) + 10000;
  }
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleTextChange = e => {
    const {
      id,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  const handleCheckboxChange = field => {
    setFormData(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [field]: !prev.options[field]
      }
    }));
  };

  // Handlers para la tabla de productos
  const handleItemChange = (id, field, value) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          [field]: value
        };

        // Calcular valor total si cambian cantidad, valor unitario o descuento
        if (field === "quantity" || field === "unitValue" || field === "discount") {
          updatedItem.totalValue = Math.round(updatedItem.quantity * updatedItem.unitValue - updatedItem.quantity * updatedItem.unitValue * updatedItem.discount / 100);
        }
        return updatedItem;
      }
      return item;
    }));
  };
  const addNewItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    setItems([...items, {
      id: newId,
      type: "product",
      product: "productA",
      description: "",
      quantity: 1,
      unitValue: 0,
      discount: 0,
      additionalData: "none",
      taxes: "iva19",
      totalValue: 0
    }]);
  };
  const removeItem = id => {
    setItems(items.filter(item => item.id !== id));
  };
  const handleSubmit = e => {
    e.preventDefault();
    console.log("Form data submitted:", {
      ...formData,
      items
    });
    // Aquí iría la lógica para enviar el formulario
  };

  // Componentes personalizados para la tabla
  const typeEditor = options => {
    return /*#__PURE__*/React.createElement(Dropdown, {
      value: options.rowData.type,
      options: productTypes,
      onChange: e => {
        const updatedItems = [...items];
        const index = updatedItems.findIndex(item => item.id === options.rowData.id);
        updatedItems[index] = {
          ...updatedItems[index],
          type: e.value
        };
        setItems(updatedItems);
      },
      placeholder: "Seleccione tipo",
      className: "w-100"
    });
  };
  const productEditor = options => {
    return /*#__PURE__*/React.createElement(Dropdown, {
      value: options.rowData.product,
      options: products,
      onChange: e => {
        const updatedItems = [...items];
        const index = updatedItems.findIndex(item => item.id === options.rowData.id);
        updatedItems[index] = {
          ...updatedItems[index],
          product: e.value
        };
        setItems(updatedItems);
      },
      placeholder: "Seleccione producto",
      className: "w-100"
    });
  };
  const descriptionEditor = options => {
    return /*#__PURE__*/React.createElement(InputText, {
      value: options.rowData.description,
      onChange: e => {
        const updatedItems = [...items];
        const index = updatedItems.findIndex(item => item.id === options.rowData.id);
        updatedItems[index] = {
          ...updatedItems[index],
          description: e.target.value
        };
        setItems(updatedItems);
      },
      className: "w-100"
    });
  };
  const quantityEditor = options => {
    return /*#__PURE__*/React.createElement(InputNumber, {
      value: options.rowData.quantity,
      onValueChange: e => {
        const updatedItems = [...items];
        const index = updatedItems.findIndex(item => item.id === options.rowData.id);
        updatedItems[index] = {
          ...updatedItems[index],
          quantity: e.value || 0,
          totalValue: Math.round((e.value || 0) * updatedItems[index].unitValue - (e.value || 0) * updatedItems[index].unitValue * updatedItems[index].discount / 100)
        };
        setItems(updatedItems);
      },
      mode: "decimal",
      min: 0,
      max: 1000,
      className: "w-100"
    });
  };
  const unitValueEditor = options => {
    return /*#__PURE__*/React.createElement(InputNumber, {
      value: options.rowData.unitValue,
      onValueChange: e => {
        const updatedItems = [...items];
        const index = updatedItems.findIndex(item => item.id === options.rowData.id);
        updatedItems[index] = {
          ...updatedItems[index],
          unitValue: e.value || 0,
          totalValue: Math.round(updatedItems[index].quantity * (e.value || 0) - updatedItems[index].quantity * (e.value || 0) * updatedItems[index].discount / 100)
        };
        setItems(updatedItems);
      },
      mode: "currency",
      currency: "COP",
      locale: "es-CO",
      min: 0,
      className: "w-100"
    });
  };
  const discountEditor = options => {
    return /*#__PURE__*/React.createElement(InputNumber, {
      value: options.rowData.discount,
      onValueChange: e => {
        const updatedItems = [...items];
        const index = updatedItems.findIndex(item => item.id === options.rowData.id);
        updatedItems[index] = {
          ...updatedItems[index],
          discount: e.value || 0,
          totalValue: Math.round(updatedItems[index].quantity * updatedItems[index].unitValue - updatedItems[index].quantity * updatedItems[index].unitValue * (e.value || 0) / 100)
        };
        setItems(updatedItems);
      },
      mode: "decimal",
      min: 0,
      max: 100,
      suffix: "%",
      className: "w-100"
    });
  };
  const additionalDataEditor = options => {
    return /*#__PURE__*/React.createElement(Dropdown, {
      value: options.rowData.additionalData,
      options: additionalDataOptions,
      onChange: e => {
        const updatedItems = [...items];
        const index = updatedItems.findIndex(item => item.id === options.rowData.id);
        updatedItems[index] = {
          ...updatedItems[index],
          additionalData: e.value
        };
        setItems(updatedItems);
      },
      placeholder: "Seleccione",
      className: "w-100"
    });
  };
  const taxesEditor = options => {
    return /*#__PURE__*/React.createElement(Dropdown, {
      value: options.rowData.taxes,
      options: taxOptions,
      onChange: e => {
        const updatedItems = [...items];
        const index = updatedItems.findIndex(item => item.id === options.rowData.id);
        updatedItems[index] = {
          ...updatedItems[index],
          taxes: e.value
        };
        setItems(updatedItems);
      },
      placeholder: "Seleccione",
      className: "w-100"
    });
  };
  const totalValueBody = rowData => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(rowData.totalValue);
  };
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement(Button, {
      icon: "pi pi-trash",
      className: "p-button-rounded p-button-danger p-button-text",
      onClick: () => removeItem(rowData.id)
    });
  };

  // Componente de resumen de factura

  // Reemplaza el componente InvoiceSummary con este:
  const InvoiceSummary = () => {
    // Calcular totales (igual que antes)
    const grossTotal = items.reduce((sum, item) => sum + item.quantity * item.unitValue, 0);
    const totalDiscount = items.reduce((sum, item) => sum + item.quantity * item.unitValue * item.discount / 100, 0);
    const subtotal = grossTotal - totalDiscount;
    const ivaRate = 0;
    const retefuenteRate = 0;
    const ivaAmount = subtotal * (ivaRate / 100);
    const retefuenteAmount = subtotal * (retefuenteRate / 100);
    const netTotal = subtotal + ivaAmount - retefuenteAmount;
    return /*#__PURE__*/React.createElement("div", {
      className: "row g-3 mb-4 mt-4 border-top pt-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-12"
    }, /*#__PURE__*/React.createElement(Accordion, null, /*#__PURE__*/React.createElement(AccordionTab, {
      header: /*#__PURE__*/React.createElement("div", {
        className: "flex align-items-center"
      }, /*#__PURE__*/React.createElement("i", {
        className: "pi pi-calculator mr-2"
      }), /*#__PURE__*/React.createElement("span", null, "Resumen de Factura"), /*#__PURE__*/React.createElement(Badge, {
        value: new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(netTotal),
        className: "ml-auto",
        severity: "success"
      }))
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-6 md:col-4 lg:col-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-3 border-round border-1 surface-border"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-medium text-500"
    }, "Total Bruto"), /*#__PURE__*/React.createElement("div", {
      className: "text-xl font-medium"
    }, new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(grossTotal)))), /*#__PURE__*/React.createElement("div", {
      className: "col-6 md:col-4 lg:col-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-3 border-round border-1 surface-border"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-medium text-500"
    }, "Descuento"), /*#__PURE__*/React.createElement("div", {
      className: "text-xl font-medium text-red-500"
    }, "-", " ", new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(totalDiscount)))), /*#__PURE__*/React.createElement("div", {
      className: "col-6 md:col-4 lg:col-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-3 border-round border-1 surface-border"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-medium text-500"
    }, "Subtotal"), /*#__PURE__*/React.createElement("div", {
      className: "text-xl font-medium"
    }, new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(subtotal)))), /*#__PURE__*/React.createElement("div", {
      className: "col-6 md:col-4 lg:col-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-3 border-round border-1 surface-border"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-medium text-500"
    }, "IVA 0%"), /*#__PURE__*/React.createElement("div", {
      className: "text-xl font-medium"
    }, new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(ivaAmount)))), /*#__PURE__*/React.createElement("div", {
      className: "col-6 md:col-4 lg:col-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-3 border-round border-1 surface-border"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-medium text-500"
    }, "Retefuente 0%"), /*#__PURE__*/React.createElement("div", {
      className: "text-xl font-medium text-red-500"
    }, "-", " ", new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(retefuenteAmount))))), /*#__PURE__*/React.createElement("div", {
      className: "mt-4 p-4 bg-blue-50 border-round"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-between align-items-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-2xl font-bold"
    }, "Total Neto:"), /*#__PURE__*/React.createElement("div", {
      className: "text-3xl font-bold"
    }, new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(netTotal))))))));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "mb-4"
  }, "Informaci\xF3n b\xE1sica"), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "invoiceType",
    className: "form-label"
  }, "Tipo"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "invoiceType",
    value: formData.invoiceType,
    options: invoiceTypes,
    onChange: e => handleInputChange("invoiceType", e.value),
    placeholder: "Seleccione el tipo",
    className: "w-100",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "elaborationDate",
    className: "form-label"
  }, "Fecha de elaboraci\xF3n"), /*#__PURE__*/React.createElement(Calendar, {
    id: "elaborationDate",
    value: formData.elaborationDate,
    onChange: e => handleInputChange("elaborationDate", e.value),
    dateFormat: "dd/mm/yy",
    showIcon: true,
    className: "w-100",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "provider",
    className: "form-label"
  }, "Proveedores"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "provider",
    value: formData.provider,
    options: providers,
    onChange: e => handleInputChange("provider", e.value),
    placeholder: "Seleccione proveedor",
    className: "w-100",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact",
    className: "form-label"
  }, "Contacto"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "contact",
    value: formData.contact,
    options: contacts,
    onChange: e => handleInputChange("contact", e.value),
    placeholder: "Seleccione contacto",
    className: "w-100"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "invoiceNumber",
    className: "form-label"
  }, "N\xFAmero(N\xFAmeraci\xF3n autom\xE1tica)"), /*#__PURE__*/React.createElement(InputNumber, {
    id: "invoiceNumber",
    value: formData.invoiceNumber,
    mode: "decimal",
    disabled: true,
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "providerInvoiceType",
    className: "form-label"
  }, "Numero de factura proveedor"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "providerInvoiceType",
    value: formData.providerInvoiceType,
    options: providerInvoiceTypes,
    onChange: e => handleInputChange("providerInvoiceType", e.value),
    placeholder: "FC/FD/FX",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "providerInvoiceType",
    className: "form-label"
  }), /*#__PURE__*/React.createElement(Dropdown, {
    id: "providerInvoiceNumber",
    value: formData.providerInvoiceNumber,
    options: providerInvoiceNumberTypes,
    onChange: e => handleInputChange("providerInvoiceNumber", e.value),
    placeholder: "Seleccione",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "costCenter",
    className: "form-label"
  }, "Centro de costos"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "costCenter",
    value: formData.costCenter,
    options: costCenters,
    onChange: e => handleInputChange("costCenter", e.value),
    placeholder: "Seleccione centro de costos",
    className: "w-100"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "row g-3 mb-4 mt-4 border-top pt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-check"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "providerPerItem",
    checked: formData.options.providerPerItem,
    onChange: () => handleCheckboxChange("providerPerItem")
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "providerPerItem",
    className: "form-check-label ms-2"
  }, "Proveedor por \xEDtem")), /*#__PURE__*/React.createElement("div", {
    className: "form-check"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "taxIncluded",
    checked: formData.options.taxIncluded,
    onChange: () => handleCheckboxChange("taxIncluded")
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "taxIncluded",
    className: "form-check-label ms-2"
  }, "IVA/Impoconsumo incluido")), /*#__PURE__*/React.createElement("div", {
    className: "form-check"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "discountPercentage",
    checked: formData.options.discountPercentage,
    onChange: () => handleCheckboxChange("discountPercentage")
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "discountPercentage",
    className: "form-check-label ms-2"
  }, "Descuento en porcentaje")))), /*#__PURE__*/React.createElement("div", {
    className: "row g-3 mb-4 mt-4 border-top pt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "mb-3"
  }, "Informaci\xF3n de facturaci\xF3n"), /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: items,
    editMode: "cell",
    dataKey: "id",
    className: "p-datatable-sm",
    emptyMessage: "No hay productos agregados"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "type",
    header: "Tipo",
    body: rowData => productTypes.find(t => t.value === rowData.type)?.label || "",
    editor: options => typeEditor(options)
  }), /*#__PURE__*/React.createElement(Column, {
    field: "product",
    header: "Producto",
    body: rowData => products.find(p => p.value === rowData.product)?.label || "",
    editor: options => productEditor(options)
  }), /*#__PURE__*/React.createElement(Column, {
    field: "description",
    header: "Descripci\xF3n",
    editor: options => descriptionEditor(options)
  }), /*#__PURE__*/React.createElement(Column, {
    field: "quantity",
    header: "Cantidad",
    editor: options => quantityEditor(options)
  }), /*#__PURE__*/React.createElement(Column, {
    field: "unitValue",
    header: "Valor Unitario",
    body: rowData => new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP"
    }).format(rowData.unitValue),
    editor: options => unitValueEditor(options)
  }), /*#__PURE__*/React.createElement(Column, {
    field: "discount",
    header: "Descuento",
    body: rowData => `${rowData.discount}%`,
    editor: options => discountEditor(options)
  }), /*#__PURE__*/React.createElement(Column, {
    field: "additionalData",
    header: "Datos complementarios",
    body: rowData => additionalDataOptions.find(a => a.value === rowData.additionalData)?.label || "",
    editor: options => additionalDataEditor(options)
  }), /*#__PURE__*/React.createElement(Column, {
    field: "taxes",
    header: "Impuestos",
    body: rowData => taxOptions.find(t => t.value === rowData.taxes)?.label || "",
    editor: options => taxesEditor(options)
  }), /*#__PURE__*/React.createElement(Column, {
    field: "totalValue",
    header: "Valor Total",
    body: totalValueBody
  }), /*#__PURE__*/React.createElement(Column, {
    body: actionBodyTemplate,
    style: {
      width: "4rem"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: "fa-solid fa-stethoscope",
    label: "Agregar producto",
    className: "p-button-sm",
    onClick: addNewItem
  })))), /*#__PURE__*/React.createElement(InvoiceSummary, null), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mt-4"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-outline-secondary"
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-secondary"
  }, "Guardar Factura"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-secondary"
  }, "Guardar y Enviar por email"))))));
};