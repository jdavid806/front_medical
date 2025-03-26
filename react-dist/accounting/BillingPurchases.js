import React, { useEffect, useState } from "react";
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { Calendar } from "primereact/calendar";
import { SplitButton } from 'primereact/splitbutton';
import CustomDataTable from "../components/CustomDataTable.js";
export const BillingPurchases = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [searchId, setSearchId] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  // Sample data - replace with your actual data fetching
  useEffect(() => {
    // Mock data
    const mockInvoices = [{
      invoiceNumber: 'FAC-001',
      date: '2023-05-15',
      identification: '123456789',
      provider: 'Proveedor A',
      amount: 1500.50,
      invoiceType: 'Compra',
      status: 'Pagada'
    }, {
      invoiceNumber: 'FAC-002',
      date: '2023-05-16',
      identification: '987654321',
      provider: 'Proveedor B',
      amount: 2300.75,
      invoiceType: 'Servicio',
      status: 'Pendiente'
    }, {
      invoiceNumber: 'FAC-003',
      date: '2023-05-17',
      identification: '456789123',
      provider: 'Proveedor C',
      amount: 1800.00,
      invoiceType: 'Compra',
      status: 'Anulada'
    }, {
      invoiceNumber: 'FAC-004',
      date: '2023-05-18',
      identification: '789123456',
      provider: 'Proveedor D',
      amount: 3200.00,
      invoiceType: 'Servicio',
      status: 'Pagada'
    }];
    setInvoices(mockInvoices);
    setFilteredInvoices(mockInvoices);
  }, []);

  // Apply filters whenever any filter value changes
  useEffect(() => {
    const filtered = invoices.filter(invoice => {
      // Filter by search text
      const matchesSearch = !searchText || invoice.invoiceNumber.toLowerCase().includes(searchText.toLowerCase()) || invoice.provider.toLowerCase().includes(searchText.toLowerCase()) || invoice.invoiceType.toLowerCase().includes(searchText.toLowerCase()) || invoice.status.toLowerCase().includes(searchText.toLowerCase());

      // Filter by ID
      const matchesId = !searchId || invoice.identification.includes(searchId);

      // Filter by date
      const matchesDate = !selectedDate || invoice.date === selectedDate.toISOString().split('T')[0];
      return matchesSearch && matchesId && matchesDate;
    });
    setFilteredInvoices(filtered);
  }, [searchText, searchId, selectedDate, invoices]);
  const columns = [{
    data: "invoiceNumber",
    className: "text-center",
    orderable: true,
    title: "N. Factura"
  }, {
    data: "date",
    className: "text-center",
    orderable: true,
    title: "Fecha"
  }, {
    data: "identification",
    className: "text-center",
    orderable: true,
    title: "Identificación"
  }, {
    data: "provider",
    className: "text-center",
    orderable: true,
    title: "Proveedor"
  }, {
    data: "amount",
    className: "text-center",
    orderable: true,
    title: "Monto Factura",
    render: data => `$${data.toFixed(2)}`
  }, {
    data: "invoiceType",
    className: "text-center",
    orderable: true,
    title: "Tipo Factura"
  }, {
    data: "status",
    className: "text-center",
    orderable: true,
    title: "Estado Factura",
    render: data => {
      let badgeClass = '';
      switch (data) {
        case 'Pagada':
          badgeClass = 'bg-success';
          break;
        case 'Pendiente':
          badgeClass = 'bg-warning text-dark';
          break;
        case 'Anulada':
          badgeClass = 'bg-danger';
          break;
        default:
          badgeClass = 'bg-secondary';
      }
      return `<span class="badge ${badgeClass}">${data}</span>`;
    }
  }];
  const handleViewDetails = invoiceNumber => {
    console.log('Viewing invoice:', invoiceNumber);
  };
  const handleEditInvoice = invoiceNumber => {
    console.log('Editing invoice:', invoiceNumber);
  };
  const handleDownloadInvoice = invoiceNumber => {
    console.log('Downloading invoice:', invoiceNumber);
  };
  const handleDeleteInvoice = invoiceNumber => {
    console.log('Deleting invoice:', invoiceNumber);
  };
  const handleMoreActions = invoiceNumber => {
    console.log('More actions for invoice:', invoiceNumber);
  };
  const newInvoiceItems = [{
    label: 'Factura de Venta',
    icon: 'fas fa-file-invoice-dollar',
    command: () => console.log('Nueva Factura de Compra')
  }, {
    label: 'Factura de Entidades',
    icon: 'fas fa-concierge-bell',
    command: () => console.log('Nueva Factura de Servicio')
  }, {
    label: 'Factura de compras',
    icon: 'fas fa-file-import',
    command: () => console.log('Importar Factura')
  }, {
    label: 'Factura  Recurrentes',
    icon: 'fas fa-file-import',
    command: () => console.log('Importar Factura')
  }, {
    label: 'Documento Soporte',
    icon: 'fas fa-file-import',
    command: () => console.log('Importar Factura')
  }, {
    label: 'Cotización',
    icon: 'fas fa-file-import',
    command: () => console.log('Importar Factura')
  }, {
    label: 'Remisión',
    icon: 'fas fa-file-import',
    command: () => console.log('Importar Factura')
  }, {
    label: 'Orden de compra',
    icon: 'fas fa-file-import',
    command: () => console.log('Importar Factura')
  }];
  const slots = {
    7: (cell, data) => /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "btn-group"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-sm btn-outline-primary",
      onClick: () => handleDownloadInvoice(data.invoiceNumber),
      title: "Descargar"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-download"
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-sm btn-outline-secondary",
      onClick: () => handleEditInvoice(data.invoiceNumber),
      title: "Editar"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-edit"
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-sm btn-outline-danger",
      onClick: () => handleDeleteInvoice(data.invoiceNumber),
      title: "Eliminar"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-trash"
    })), /*#__PURE__*/React.createElement("div", {
      className: "dropdown"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-sm btn-outline-dark dropdown-toggle dropdown-toggle-split",
      "data-bs-toggle": "dropdown",
      "aria-expanded": "false",
      title: "M\xE1s opciones"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-ellipsis-v"
    })), /*#__PURE__*/React.createElement("ul", {
      className: "dropdown-menu dropdown-menu-end"
    }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
      className: "dropdown-item",
      onClick: () => handleViewDetails(data.invoiceNumber)
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-brands fa-whatsapp"
    }), " Ver detalles")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
      className: "dropdown-item",
      onClick: () => console.log('Imprimir factura:', data.invoiceNumber)
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-print me-2"
    }), " Imprimir")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
      className: "dropdown-item",
      onClick: () => console.log('Compartir factura:', data.invoiceNumber)
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-share-alt me-2"
    }), " Compartir")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("hr", {
      className: "dropdown-divider"
    })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
      className: "dropdown-item text-danger",
      onClick: () => handleDeleteInvoice(data.invoiceNumber)
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-download me-2"
    }), " Eliminar"))))))
  };
  const handleResetFilters = () => {
    setSearchText('');
    setSearchId('');
    setSelectedDate(null);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row justify-content-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-lg-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card shadow-sm mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-white d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "mb-0"
  }, "Facturas de Compras"), /*#__PURE__*/React.createElement(SplitButton, {
    label: "Nueva",
    icon: "fas fa-download",
    model: newInvoiceItems,
    className: "p-button-sm",
    buttonClassName: "p-button-primary"
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(TabView, {
    activeIndex: activeTab,
    onTabChange: e => setActiveTab(e.index)
  }, /*#__PURE__*/React.createElement(TabPanel, {
    header: "Filtrar Facturas"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "searchText",
    className: "form-label"
  }, "B\xFAsqueda general"), /*#__PURE__*/React.createElement(InputText, {
    id: "searchText",
    value: searchText,
    onChange: e => setSearchText(e.target.value),
    placeholder: "Buscar por n\xFAmero, proveedor, tipo...",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "searchId",
    className: "form-label"
  }, "Identificaci\xF3n"), /*#__PURE__*/React.createElement(InputText, {
    id: "searchId",
    value: searchId,
    onChange: e => setSearchId(e.target.value),
    placeholder: "Buscar por identificaci\xF3n",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "invoiceDate",
    className: "form-label"
  }, "Fecha"), /*#__PURE__*/React.createElement(Calendar, {
    id: "invoiceDate",
    value: selectedDate,
    onChange: e => setSelectedDate(e.value),
    dateFormat: "dd/mm/yy",
    showIcon: true,
    className: "w-100",
    placeholder: "Seleccione fecha"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-2 d-flex align-items-end gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-secondary flex-grow-1",
    onClick: handleResetFilters
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-undo me-2"
  }), "Limpiar"))))), /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    columns: columns,
    data: filteredInvoices,
    slots: slots
  }, /*#__PURE__*/React.createElement("thead", {
    className: "table-light"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "text-center"
  }, "N. Factura"), /*#__PURE__*/React.createElement("th", {
    className: "text-center"
  }, "Fecha"), /*#__PURE__*/React.createElement("th", {
    className: "text-center"
  }, "Identificaci\xF3n"), /*#__PURE__*/React.createElement("th", {
    className: "text-center"
  }, "Proveedor"), /*#__PURE__*/React.createElement("th", {
    className: "text-center"
  }, "Monto Factura"), /*#__PURE__*/React.createElement("th", {
    className: "text-center"
  }, "Tipo Factura"), /*#__PURE__*/React.createElement("th", {
    className: "text-center"
  }, "Estado Factura"), /*#__PURE__*/React.createElement("th", {
    className: "text-center"
  }, "Acciones"))))))))));
};