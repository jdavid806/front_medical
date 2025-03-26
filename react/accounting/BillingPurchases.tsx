import React, { useEffect, useState } from "react";
import { ConfigColumns } from "datatables.net-bs5";
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { SplitButton } from 'primereact/splitbutton';
import { MenuItem } from 'primereact/menuitem';
import CustomDataTable from "../components/CustomDataTable";


interface Invoice {
  invoiceNumber: string;
  date: string;
  identification: string;
  provider: string;
  amount: number;
  invoiceType: string;
  status: string;
}

export const BillingPurchases: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [searchId, setSearchId] = useState('');
  const [selectedDate, setSelectedDate] = useState<Nullable<Date | null>>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);

  // Sample data - replace with your actual data fetching
  useEffect(() => {
    // Mock data
    const mockInvoices: Invoice[] = [
      {
        invoiceNumber: 'FAC-001',
        date: '2023-05-15',
        identification: '123456789',
        provider: 'Proveedor A',
        amount: 1500.50,
        invoiceType: 'Compra',
        status: 'Pagada'
      },
      {
        invoiceNumber: 'FAC-002',
        date: '2023-05-16',
        identification: '987654321',
        provider: 'Proveedor B',
        amount: 2300.75,
        invoiceType: 'Servicio',
        status: 'Pendiente'
      },
      {
        invoiceNumber: 'FAC-003',
        date: '2023-05-17',
        identification: '456789123',
        provider: 'Proveedor C',
        amount: 1800.00,
        invoiceType: 'Compra',
        status: 'Anulada'
      },
      {
        invoiceNumber: 'FAC-004',
        date: '2023-05-18',
        identification: '789123456',
        provider: 'Proveedor D',
        amount: 3200.00,
        invoiceType: 'Servicio',
        status: 'Pagada'
      }
    ];

    setInvoices(mockInvoices);
    setFilteredInvoices(mockInvoices);
  }, []);

  // Apply filters whenever any filter value changes
  useEffect(() => {
    const filtered = invoices.filter(invoice => {
      // Filter by search text
      const matchesSearch = !searchText ||
        invoice.invoiceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        invoice.provider.toLowerCase().includes(searchText.toLowerCase()) ||
        invoice.invoiceType.toLowerCase().includes(searchText.toLowerCase()) ||
        invoice.status.toLowerCase().includes(searchText.toLowerCase());

      // Filter by ID
      const matchesId = !searchId ||
        invoice.identification.includes(searchId);

      // Filter by date
      const matchesDate = !selectedDate ||
        invoice.date === selectedDate.toISOString().split('T')[0];

      return matchesSearch && matchesId && matchesDate;
    });

    setFilteredInvoices(filtered);
  }, [searchText, searchId, selectedDate, invoices]);

  const columns: ConfigColumns[] = [
    { data: "invoiceNumber", className: "text-center", orderable: true, title: "N. Factura" },
    { data: "date", className: "text-center", orderable: true, title: "Fecha" },
    { data: "identification", className: "text-center", orderable: true, title: "Identificación" },
    { data: "provider", className: "text-center", orderable: true, title: "Proveedor" },
    {
      data: "amount",
      className: "text-center",
      orderable: true,
      title: "Monto Factura",
      render: (data) => `$${data.toFixed(2)}`
    },
    { data: "invoiceType", className: "text-center", orderable: true, title: "Tipo Factura" },
    {
      data: "status",
      className: "text-center",
      orderable: true,
      title: "Estado Factura",
      render: (data) => {
        let badgeClass = '';
        switch (data) {
          case 'Pagada': badgeClass = 'bg-success'; break;
          case 'Pendiente': badgeClass = 'bg-warning text-dark'; break;
          case 'Anulada': badgeClass = 'bg-danger'; break;
          default: badgeClass = 'bg-secondary';
        }
        return `<span class="badge ${badgeClass}">${data}</span>`;
      }
    },
  ];

  const handleViewDetails = (invoiceNumber: string) => {
    console.log('Viewing invoice:', invoiceNumber);
  };

  const handleEditInvoice = (invoiceNumber: string) => {
    console.log('Editing invoice:', invoiceNumber);
  };

  const handleDownloadInvoice = (invoiceNumber: string) => {
    console.log('Downloading invoice:', invoiceNumber);
  };

  const handleDeleteInvoice = (invoiceNumber: string) => {
    console.log('Deleting invoice:', invoiceNumber);
  };

  const handleMoreActions = (invoiceNumber: string) => {
    console.log('More actions for invoice:', invoiceNumber);
  };

  const newInvoiceItems: MenuItem[] = [
    {
      label: 'Factura de Venta',
      icon: 'fas fa-file-invoice-dollar',
      command: () => console.log('Nueva Factura de Compra')
    },
    {
      label: 'Factura de Entidades',
      icon: 'fas fa-concierge-bell',
      command: () => console.log('Nueva Factura de Servicio')
    },
    {
      label: 'Factura de compras',
      icon: 'fas fa-file-import',
      command: () => console.log('Importar Factura')
    },
    {
      label: 'Factura  Recurrentes',
      icon: 'fas fa-file-import',
      command: () => console.log('Importar Factura')
    },
    {
      label: 'Documento Soporte',
      icon: 'fas fa-file-import',
      command: () => console.log('Importar Factura')
    },
    {
      label: 'Cotización',
      icon: 'fas fa-file-import',
      command: () => console.log('Importar Factura')
    },
    {
      label: 'Remisión',
      icon: 'fas fa-file-import',
      command: () => console.log('Importar Factura')
    },
    {
      label: 'Orden de compra',
      icon: 'fas fa-file-import',
      command: () => console.log('Importar Factura')
    }

  ];

  const slots = {
    7: (cell, data: Invoice) => (
      <div className="text-center">
        <div className="btn-group">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleDownloadInvoice(data.invoiceNumber)}
            title="Descargar"
          >
            <i className="fas fa-download"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => handleEditInvoice(data.invoiceNumber)}
            title="Editar"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDeleteInvoice(data.invoiceNumber)}
            title="Eliminar"
          >
            <i className="fas fa-trash"></i>
          </button>
          <div className="dropdown">
            <button
              className="btn btn-sm btn-outline-dark dropdown-toggle dropdown-toggle-split"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              title="Más opciones"
            >
              <i className="fas fa-ellipsis-v"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleViewDetails(data.invoiceNumber)}
                >
                  <i className="fa-brands fa-whatsapp"></i> Ver detalles
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => console.log('Imprimir factura:', data.invoiceNumber)}
                >
                  <i className="fas fa-print me-2"></i> Imprimir
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => console.log('Compartir factura:', data.invoiceNumber)}
                >
                  <i className="fas fa-share-alt me-2"></i> Compartir
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={() => handleDeleteInvoice(data.invoiceNumber)}
                >
                  <i className="fas fa-download me-2"></i> Eliminar
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    ),
  };

  const handleResetFilters = () => {
    setSearchText('');
    setSearchId('');
    setSelectedDate(null);
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Facturas de Compras</h5>
              <SplitButton
                label="Nueva"
                icon="fas fa-download"
                model={newInvoiceItems}
                className="p-button-sm"
                buttonClassName="p-button-primary"
              />
            </div>
            <div className="card-body">
              <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                <TabPanel header="Filtrar Facturas">
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <label htmlFor="searchText" className="form-label">Búsqueda general</label>
                      <InputText
                        id="searchText"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Buscar por número, proveedor, tipo..."
                        className="w-100"
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="searchId" className="form-label">Identificación</label>
                      <InputText
                        id="searchId"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="Buscar por identificación"
                        className="w-100"
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="invoiceDate" className="form-label">Fecha</label>
                      <Calendar
                        id="invoiceDate"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.value)}
                        dateFormat="dd/mm/yy"
                        showIcon
                        className="w-100"
                        placeholder="Seleccione fecha"
                      />
                    </div>
                    <div className="col-md-2 d-flex align-items-end gap-2">
                      <button
                        className="btn btn-outline-secondary flex-grow-1"
                        onClick={handleResetFilters}
                      >
                        <i className="fas fa-undo me-2"></i>Limpiar
                      </button>
                    </div>
                  </div>
                </TabPanel>
              </TabView>

              <div className="table-responsive">
                <CustomDataTable
                  columns={columns}
                  data={filteredInvoices}
                  slots={slots}
                >
                  <thead className="table-light">
                    <tr>
                      <th className="text-center">N. Factura</th>
                      <th className="text-center">Fecha</th>
                      <th className="text-center">Identificación</th>
                      <th className="text-center">Proveedor</th>
                      <th className="text-center">Monto Factura</th>
                      <th className="text-center">Tipo Factura</th>
                      <th className="text-center">Estado Factura</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                </CustomDataTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};