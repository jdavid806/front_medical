import React, { useState, useMemo } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
// Datos mock mejorados
const mockSuppliers = [{
  id: '1',
  name: 'Distribuidora Alimentos S.A.'
}, {
  id: '2',
  name: 'Tecnología Avanzada Ltda.'
}, {
  id: '3',
  name: 'Suministros Médicos Unidos'
}, {
  id: '4',
  name: 'Construcciones Modernas'
}, {
  id: '5',
  name: 'Servicios Corporativos'
}];
const productDescriptions = ["Materiales de construcción", "Equipos electrónicos", "Suministros de oficina", "Servicios profesionales", "Productos alimenticios", "Insumos médicos", "Herramientas industriales", "Mobiliario", "Software", "Equipos de seguridad"];
const randomDate = (start, end) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};
const randomDays = () => Math.floor(Math.random() * 90) + 1;
const generateDetails = () => {
  const count = Math.floor(Math.random() * 4) + 1;
  return Array.from({
    length: count
  }, (_, i) => ({
    description: productDescriptions[Math.floor(Math.random() * productDescriptions.length)],
    quantity: Math.floor(Math.random() * 10) + 1,
    unit_price: parseFloat((Math.random() * 1000 + 50).toFixed(2)),
    subtotal: 0
  })).map(item => ({
    ...item,
    subtotal: parseFloat((item.quantity * item.unit_price).toFixed(2))
  }));
};
const generateAccountData = type => {
  const items = [];
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  for (let i = 1; i <= 15; i++) {
    const invoiceDate = randomDate(oneYearAgo, today);
    const dueDays = randomDays();
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + dueDays);
    const supplier = mockSuppliers[Math.floor(Math.random() * mockSuppliers.length)];
    const details = generateDetails();
    const price = details.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = type === 'receivable' ? price * 0.18 : price * 0.16;
    const withholdings = type === 'receivable' ? price * 0.03 : price * 0.02;
    const total = price + tax - withholdings;
    const daysToPay = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const status = daysToPay < 0 ? 'overdue' : 'pending';
    items.push({
      id: `${type === 'receivable' ? 'rcv' : 'pay'}-${i}`,
      invoice_date: invoiceDate,
      due_date: dueDate.toISOString().split('T')[0],
      supplier_name: supplier.name,
      supplier_id: supplier.id,
      fiscal_number: `FAC-${Math.floor(Math.random() * 10000)}-${new Date(invoiceDate).getFullYear()}`,
      price: parseFloat(price.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      withholdings: parseFloat(withholdings.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      days_to_pay: daysToPay,
      status,
      details
    });
  }
  return items.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
};
export const AccountsCollectPay = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSupplierIds, setSelectedSupplierIds] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [selectedDueDateRange, setSelectedDueDateRange] = useState(null);
  const [selectedDaysToPay, setSelectedDaysToPay] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Generar datos mock
  const allReceivable = useMemo(() => generateAccountData('receivable'), []);
  const allPayable = useMemo(() => generateAccountData('payable'), []);

  // Filtrar datos
  const filterItems = items => {
    return items.filter(item => {
      // Filtro por proveedor
      if (selectedSupplierIds.length > 0 && !selectedSupplierIds.includes(item.supplier_id)) {
        return false;
      }

      // Filtro por rango de fechas de factura
      if (selectedDateRange && selectedDateRange[0] && selectedDateRange[1]) {
        const invoiceDate = new Date(item.invoice_date);
        const startDate = new Date(selectedDateRange[0]);
        const endDate = new Date(selectedDateRange[1]);
        endDate.setHours(23, 59, 59, 999);
        if (invoiceDate < startDate || invoiceDate > endDate) {
          return false;
        }
      }

      // Filtro por rango de fechas de vencimiento
      if (selectedDueDateRange && selectedDueDateRange[0] && selectedDueDateRange[1]) {
        const dueDate = new Date(item.due_date);
        const startDate = new Date(selectedDueDateRange[0]);
        const endDate = new Date(selectedDueDateRange[1]);
        endDate.setHours(23, 59, 59, 999);
        if (dueDate < startDate || dueDate > endDate) {
          return false;
        }
      }

      // Filtro por días para pagar
      if (selectedDaysToPay) {
        const [min, max] = selectedDaysToPay.split('-').map(Number);
        if (selectedDaysToPay === '60+') {
          if (item.days_to_pay < 60) return false;
        } else if (max) {
          if (item.days_to_pay < min || item.days_to_pay > max) return false;
        } else {
          if (item.days_to_pay !== min) return false;
        }
      }
      return true;
    });
  };
  const accountsReceivable = useMemo(() => filterItems(allReceivable), [allReceivable, selectedSupplierIds, selectedDateRange, selectedDueDateRange, selectedDaysToPay]);
  const accountsPayable = useMemo(() => filterItems(allPayable), [allPayable, selectedSupplierIds, selectedDateRange, selectedDueDateRange, selectedDaysToPay]);
  const loadingReceivable = false;
  const loadingPayable = false;
  const daysToPayOptions = [{
    label: 'Todos',
    value: null
  }, {
    label: 'Próximos a vencer (1-5 días)',
    value: '1-5'
  }, {
    label: '6-10 días',
    value: '6-10'
  }, {
    label: '11-15 días',
    value: '11-15'
  }, {
    label: '16-25 días',
    value: '16-25'
  }, {
    label: '26-35 días',
    value: '26-35'
  }, {
    label: '36-45 días',
    value: '36-45'
  }, {
    label: 'Más de 60 días',
    value: '60+'
  }];
  const formatoDinero = cantidad => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(cantidad);
  };
  const obtenerFechaFormateada = fechaStr => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  const getStatusBadge = (status, days) => {
    if (status === 'paid') return /*#__PURE__*/React.createElement("span", {
      className: "badge bg-success"
    }, "Pagado");
    if (status === 'overdue') return /*#__PURE__*/React.createElement("span", {
      className: "badge bg-danger"
    }, "Vencido");
    if (days <= 5) return /*#__PURE__*/React.createElement("span", {
      className: "badge bg-warning text-dark"
    }, "Por vencer (", days, "d)");
    return /*#__PURE__*/React.createElement("span", {
      className: "badge bg-primary"
    }, "Pendiente (", days, "d)");
  };
  const renderItemDetails = details => /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "mb-3"
  }, "Detalle de Factura"), /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered table-sm"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "table-light"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: '50%'
    }
  }, "Descripci\xF3n"), /*#__PURE__*/React.createElement("th", {
    className: "text-center"
  }, "Cantidad"), /*#__PURE__*/React.createElement("th", {
    className: "text-end"
  }, "Precio Unitario"), /*#__PURE__*/React.createElement("th", {
    className: "text-end"
  }, "Subtotal"))), /*#__PURE__*/React.createElement("tbody", null, details.map((detail, idx) => /*#__PURE__*/React.createElement("tr", {
    key: idx
  }, /*#__PURE__*/React.createElement("td", null, detail.description), /*#__PURE__*/React.createElement("td", {
    className: "text-center"
  }, detail.quantity), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatoDinero(detail.unit_price)), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatoDinero(detail.subtotal))))))));
  const renderAccountItem = item => /*#__PURE__*/React.createElement("div", {
    className: "p-3 border-bottom"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center flex-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-3 mb-2 mb-md-0"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, item.fiscal_number), /*#__PURE__*/React.createElement("span", {
    className: "badge bg-secondary"
  }, item.supplier_name)), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-end"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted d-block"
  }, "Fecha Factura"), /*#__PURE__*/React.createElement("span", null, obtenerFechaFormateada(item.invoice_date))), /*#__PURE__*/React.createElement("div", {
    className: "text-end"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted d-block"
  }, "Fecha Vencimiento"), /*#__PURE__*/React.createElement("span", {
    className: item.status === 'overdue' ? 'text-danger fw-bold' : ''
  }, obtenerFechaFormateada(item.due_date))), /*#__PURE__*/React.createElement("div", {
    className: "text-end"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted d-block"
  }, "Total"), /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, formatoDinero(item.total))), /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted d-block"
  }, "Estado"), getStatusBadge(item.status, item.days_to_pay)))), renderItemDetails(item.details), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 bg-light rounded"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted d-block"
  }, "Precio"), /*#__PURE__*/React.createElement("span", null, formatoDinero(item.price)))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 bg-light rounded"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted d-block"
  }, "Impuesto"), /*#__PURE__*/React.createElement("span", null, formatoDinero(item.tax)))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 bg-light rounded"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted d-block"
  }, "Retenciones"), /*#__PURE__*/React.createElement("span", null, formatoDinero(item.withholdings)))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 bg-light rounded"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted d-block"
  }, "D\xEDas para pagar"), /*#__PURE__*/React.createElement("span", {
    className: item.days_to_pay <= 5 ? 'text-danger fw-bold' : ''
  }, item.days_to_pay, " d\xEDas")))));
  const renderAccordionItems = (items, loading) => {
    if (loading) {
      return /*#__PURE__*/React.createElement("div", {
        className: "d-flex justify-content-center align-items-center py-5"
      }, /*#__PURE__*/React.createElement("div", {
        className: "spinner-border text-primary",
        role: "status"
      }, /*#__PURE__*/React.createElement("span", {
        className: "visually-hidden"
      }, "Cargando...")));
    }
    if (!items || items.length === 0) {
      return /*#__PURE__*/React.createElement("div", {
        className: "d-flex justify-content-center align-items-center py-5"
      }, /*#__PURE__*/React.createElement("p", {
        className: "text-muted"
      }, "No se encontraron registros con los filtros aplicados"));
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "accordion custom-accordion"
    }, items.map(item => {
      const isExpanded = expandedId === item.id;
      return /*#__PURE__*/React.createElement("div", {
        key: `acc-item-${item.id}`,
        className: "accordion-item"
      }, /*#__PURE__*/React.createElement("h2", {
        className: "accordion-header"
      }, /*#__PURE__*/React.createElement("button", {
        className: `accordion-button ${isExpanded ? '' : 'collapsed'}`,
        type: "button",
        onClick: () => setExpandedId(isExpanded ? null : item.id),
        "aria-expanded": isExpanded
      }, /*#__PURE__*/React.createElement("div", {
        className: "d-flex justify-content-between align-items-center w-100 pe-3"
      }, /*#__PURE__*/React.createElement("span", {
        className: "fw-bold"
      }, item.fiscal_number, " - ", item.supplier_name), /*#__PURE__*/React.createElement("div", {
        className: "d-flex gap-4"
      }, /*#__PURE__*/React.createElement("span", null, obtenerFechaFormateada(item.due_date)), /*#__PURE__*/React.createElement("span", {
        className: "fw-bold"
      }, formatoDinero(item.total)), getStatusBadge(item.status, item.days_to_pay))))), /*#__PURE__*/React.createElement("div", {
        className: `accordion-collapse collapse ${isExpanded ? 'show' : ''}`,
        style: {
          transition: 'height 0.3s ease'
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "accordion-body p-0"
      }, renderAccountItem(item))));
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid py-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, "Gesti\xF3n de Cuentas")), /*#__PURE__*/React.createElement("div", {
    className: "card-body p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-item border-0"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "accordion-header",
    id: "filters"
  }, /*#__PURE__*/React.createElement("button", {
    className: "accordion-button collapsed",
    type: "button",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#filtersCollapse",
    "aria-expanded": "false",
    "aria-controls": "filtersCollapse"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-filter me-2"
  }), " Filtros")), /*#__PURE__*/React.createElement("div", {
    id: "filtersCollapse",
    className: "accordion-collapse collapse p-3",
    "aria-labelledby": "filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-3 col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "supplierFilter",
    className: "form-label"
  }, "Proveedor"), /*#__PURE__*/React.createElement(MultiSelect, {
    id: "supplierFilter",
    options: mockSuppliers,
    optionLabel: "name",
    optionValue: "id",
    filter: true,
    placeholder: "Seleccione proveedores",
    className: "w-100",
    value: selectedSupplierIds,
    onChange: e => setSelectedSupplierIds(e.value),
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-3 col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "dateRange",
    className: "form-label"
  }, "Fecha de Factura"), /*#__PURE__*/React.createElement(Calendar, {
    id: "dateRange",
    selectionMode: "range",
    dateFormat: "dd/mm/yy",
    value: selectedDateRange,
    onChange: e => setSelectedDateRange(e.value),
    className: "w-100",
    placeholder: "Seleccione un rango"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-3 col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "dueDateRange",
    className: "form-label"
  }, "Fecha de Vencimiento"), /*#__PURE__*/React.createElement(Calendar, {
    id: "dueDateRange",
    selectionMode: "range",
    dateFormat: "dd/mm/yy",
    value: selectedDueDateRange,
    onChange: e => setSelectedDueDateRange(e.value),
    className: "w-100",
    placeholder: "Seleccione un rango"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-3 col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "daysToPay",
    className: "form-label"
  }, "D\xEDas para pagar"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "daysToPay",
    options: daysToPayOptions,
    optionLabel: "label",
    optionValue: "value",
    value: selectedDaysToPay,
    onChange: e => setSelectedDaysToPay(e.value),
    className: "w-100",
    placeholder: "Seleccione d\xEDas"
  })))))), /*#__PURE__*/React.createElement(TabView, {
    activeIndex: activeTab,
    onTabChange: e => setActiveTab(e.index),
    className: "px-3"
  }, /*#__PURE__*/React.createElement(TabPanel, {
    header: "Cuentas por Cobrar",
    className: "p-0"
  }, renderAccordionItems(accountsReceivable, loadingReceivable)), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Cuentas por Pagar",
    className: "p-0"
  }, renderAccordionItems(accountsPayable, loadingPayable))))));
};