import React, { useState, useEffect, useRef, useCallback } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { CustomPRTable, CustomPRTableColumnProps } from "../components/CustomPRTable";
import { formatDate } from "../../services/utilidades";
import { exportToExcel } from "../accounting/utils/ExportToExcelOptions";
import { generatePDFFromHTMLV2 } from "../../funciones/funcionesJS/exportPDFV2";
import { useCompany } from "../hooks/useCompany";
import { invoiceService } from "../../services/api";
import { generarFormatoContable } from "../../funciones/funcionesJS/generarPDFContable";

type Nota = {
  id: string;
  numeroNota: string;
  tipoNota: string;
  cliente: string;
  identificacion: string;
  fechaNota: Date;
  valorNota: number;
  motivo: string;
  type: string;
  invoice: {
    invoice_code: string;
    third_party: {
      name: string;
    } | null;
  };
  created_at: string;
  amount: number;
  reason: string;
  date: string;
  tipo: string;
};

type Filtros = {
  numeroNota: string;
  cliente: string;
  identificacion: string;
  rangoFechas: Date[] | null;
  tipoNota: string | null;
};

export const DebitCreditNotes = () => {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const { company, setCompany, fetchCompany } = useCompany();

  // Pagination state
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");

  const [filtros, setFiltros] = useState<Filtros>({
    numeroNota: "",
    cliente: "",
    identificacion: "",
    rangoFechas: null,
    tipoNota: null,
  });

  const tiposNota = [
    { label: "Débito", value: "Débito" },
    { label: "Crédito", value: "Crédito" },
  ];

  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadNotes(1, rows);
  }, []);

  const onPageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
    aplicarFiltros(event.page + 1, event.rows);
  };

  async function loadNotes(page = 1, per_page = 10) {
    setTableLoading(true);
    try {
      const responseNotes = await invoiceService.getNotes();
      const dataMapped = handleDataMapped(responseNotes.data);

      const startIndex = (page - 1) * per_page;
      const endIndex = startIndex + per_page;
      const paginatedData = dataMapped.slice(startIndex, endIndex);

      setNotas(paginatedData);
      setTotalRecords(dataMapped.length);
    } catch (error) {
      console.error("Error cargando notas:", error);
      showToast("error", "Error", "No se pudieron cargar las notas");
      setNotas([]);
      setTotalRecords(0);
    } finally {
      setTableLoading(false);
    }
  }

  function handleDataMapped(data: any[]) {
    const dataMapped = data.map((note) => {
      return {
        ...note,
        cliente: note.invoice.third_party
          ? note.invoice.third_party.name
          : "Sin cliente",
        tipo: note.type === "debit" ? "Débito" : "Crédito",
      };
    });
    return dataMapped;
  }

  const handleFilterChange = (field: keyof Filtros, value: any) => {
    setFiltros((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const aplicarFiltros = async (page = 1, per_page = 10) => {
    setTableLoading(true);
    try {
      const responseNotes = await invoiceService.getNotes();
      let filteredData = handleDataMapped(responseNotes.data);

      // Aplicar filtros
      if (filtros.numeroNota) {
        filteredData = filteredData.filter((nota) =>
          nota.id.toLowerCase().includes(filtros.numeroNota.toLowerCase())
        );
      }

      if (filtros.cliente) {
        filteredData = filteredData.filter((nota) =>
          nota.cliente.toLowerCase().includes(filtros.cliente.toLowerCase())
        );
      }

      if (filtros.identificacion) {
        filteredData = filteredData.filter((nota) =>
          nota.identificacion?.includes(filtros.identificacion)
        );
      }

      if (filtros.tipoNota) {
        filteredData = filteredData.filter(
          (nota) => nota.tipo === filtros.tipoNota
        );
      }

      if (filtros.rangoFechas && filtros.rangoFechas.length === 2) {
        const [inicio, fin] = filtros.rangoFechas;
        filteredData = filteredData.filter((nota) => {
          const fechaNota = new Date(nota.created_at);
          return fechaNota >= inicio && fechaNota <= fin;
        });
      }

      // Paginación
      const startIndex = (page - 1) * per_page;
      const endIndex = startIndex + per_page;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setNotas(paginatedData);
      setTotalRecords(filteredData.length);
    } catch (error) {
      console.error("Error aplicando filtros:", error);
      showToast("error", "Error", "No se pudieron aplicar los filtros");
      setNotas([]);
      setTotalRecords(0);
    } finally {
      setTableLoading(false);
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      numeroNota: "",
      cliente: "",
      identificacion: "",
      rangoFechas: null,
      tipoNota: null,
    });
    loadNotes(1, rows);
  };

  const formatCurrency = (value: number) => {
    return value?.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) || "$0.00";
  };

  const getTipoNotaSeverity = (tipo: string) => {
    return tipo === "debit" ? "danger" : "success";
  };

  function handleDataMappedToExport(dataToExport: any) {
    const dataFormatted = dataToExport.map((item: any) => {
      return {
        "no. nota": item.id,
        "tipo nota": item.tipo,
        cliente: item.cliente,
        factura: item.invoice.invoice_code,
        fecha_nota: formatDate(item.created_at),
        valor_nota: formatCurrency(item.amount),
        motivo: item.reason,
      };
    });
    return dataFormatted;
  }

  function handleDescargarExcel(data: any) {
    const formatedData = handleDataMappedToExport(data);
    exportToExcel({
      data: formatedData,
      fileName: `notas`,
    });
    showToast("success", "Éxito", "Excel descargado correctamente");
  }

  function exportToPDF(data: any[]) {
    const table = `
          <style>
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 25px;
            font-size: 12px;
          }
          th { 
            background-color: rgb(66, 74, 81); 
            color: white; 
            padding: 10px; 
            text-align: left;
            font-weight: normal;
          }
          td { 
            padding: 10px 8px; 
            border-bottom: 1px solid #eee;
          }
          </style>
      
          <table>
            <thead>
              <tr>
                <th>No. nota</th>
                <th>Tipo nota</th>
                <th>Cliente</th>
                <th>Factura</th>
                <th>Fecha nota</th>
                <th>Valor nota</th>
                <th>Motivo</th>
              </tr>
            </thead>
            <tbody>
              ${data.reduce(
      (acc: string, item: any) =>
        acc +
        `
                <tr>
                  <td>${item.id}</td>
                  <td>${item.tipo ?? ""}</td>
                  <td>${item.cliente ?? ""}</td>
                  <td>${item.invoice.invoice_code ?? ""}</td>
                  <td>${formatDate(item.created_at) ?? ""}</td>
                  <td>${formatCurrency(item.amount) ?? ""}</td>
                  <td>${item.reason ?? ""}</td>
                </tr>
              `,
      ""
    )}
            </tbody>
          </table>`;
    const configPDF = {
      name: "Notes",
      isDownload:true
    };
    generatePDFFromHTMLV2(table, company, configPDF);
    showToast("success", "Éxito", "PDF descargado correctamente");
  }

  const printInvoice = useCallback(
    async (nota: any) => {
      generarFormatoContable("NotaDebitoCredito", nota, "Impresion");
    },
    []
  );

  const TableMenu: React.FC<{
    rowData: Nota;
  }> = ({ rowData }) => {
    const menu = useRef<Menu>(null);

    const handleDownloadExcel = () => {
      handleDescargarExcel([rowData]);
    };

    const handleDownloadPdf = () => {
      exportToPDF([rowData]);
    };

    const handlePrintInvoice = () => {
      printInvoice(rowData);
    };

    const menuItems = [
      {
        label: "Descargar Excel",
        icon: <i className="fas fa-file-excel me-2"></i>,
        command: handleDownloadExcel,
      },
      {
        label: "Descargar PDF",
        icon: <i className="fas fa-file-pdf me-2"></i>,
        command: handleDownloadPdf,
      },
      {
        label: "Imprimir",
        icon: <i className="fas fa-print me-2"></i>,
        command: handlePrintInvoice,
      }
    ];

    return (
      <div style={{ position: "relative" }}>
        <Button
          className="p-button-primary flex items-center gap-2"
          onClick={(e) => menu.current?.toggle(e)}
          aria-controls={`popup_menu_${rowData.id}`}
          aria-haspopup
        >
          Acciones
          <i className="fas fa-cog ml-2"></i>
        </Button>
        <Menu
          model={menuItems}
          popup
          ref={menu}
          id={`popup_menu_${rowData.id}`}
          appendTo={document.body}
          style={{ zIndex: 9999 }}
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData: Nota) => {
    return (
      <div
        className="flex align-items-center justify-content-center"
        style={{ gap: "0.5rem", minWidth: "120px" }}
      >
        <TableMenu rowData={rowData} />
      </div>
    );
  };

  const showToast = (severity: "success" | "error" | "info" | "warn", summary: string, detail: string) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const handleSearchChange = (searchValue: string) => {
    setGlobalFilter(searchValue);
  };

  const handleRefresh = async () => {
    limpiarFiltros();
    await loadNotes(1, rows);
  };

  const handleExportAllExcel = () => {
    handleDescargarExcel(notas);
  };

  const handleExportAllPDF = () => {
    exportToPDF(notas);
  };

  const tableItems = notas.map(nota => ({
    id: nota.id,
    tipo: nota.tipo,
    cliente: nota.cliente,
    invoice_code: nota.invoice.invoice_code,
    date: nota.created_at,
    amount: nota.amount,
    reason: nota.reason,
    type: nota.type,
    actions: nota
  }));

  const columns: CustomPRTableColumnProps[] = [
    {
      field: 'id',
      header: 'No. Nota',
      sortable: true
    },
    {
      field: 'tipo',
      header: 'Tipo nota',
      sortable: true,
      body: (rowData: any) => (
        <Tag
          value={rowData.tipo}
          severity={getTipoNotaSeverity(rowData.type)}
        />
      )
    },
    {
      field: 'cliente',
      header: 'Cliente',
      sortable: true
    },
    {
      field: 'invoice_code',
      header: 'Factura',
      sortable: true
    },
    {
      field: 'date',
      header: 'Fecha nota',
      sortable: true,
      body: (rowData: any) => formatDate(rowData.date)
    },
    {
      field: 'amount',
      header: 'Valor nota',
      sortable: true,
      body: (rowData: any) => formatCurrency(rowData.amount)
    },
    {
      field: 'reason',
      header: 'Motivo',
      sortable: true
    },
    {
      field: 'actions',
      header: 'Acciones',
      body: (rowData: any) => actionBodyTemplate(rowData.actions),
      exportable: false,
      width: "120px"
    }
  ];

  return (
    <main className="main w-100" id="top">
      <Toast ref={toast} />

      {loading ? (
        <div
          className="flex justify-content-center align-items-center"
          style={{
            height: "50vh",
            marginLeft: "900px",
            marginTop: "300px",
          }}
        >
          <ProgressSpinner />
        </div>
      ) : (
        <div className="w-100">
          <div className="h-100 w-100 d-flex flex-column" style={{ marginTop: "-30px" }}>
            <div className="text-end pt-3 mb-2">
              <Button
                className="p-button-primary"
                onClick={() => (window.location.href = "NotasDebitoCredito")}
              >
                <i className="fas fa-file-edit me-2"></i>
                Nueva Nota Débito/Crédito
              </Button>
            </div>

            <Accordion>
              <AccordionTab header="Filtros de Búsqueda">
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Número de nota</label>
                    <InputText
                      value={filtros.numeroNota}
                      onChange={(e) => handleFilterChange("numeroNota", e.target.value)}
                      placeholder="ND-001-0000001"
                      className="w-100"
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Cliente</label>
                    <InputText
                      value={filtros.cliente}
                      onChange={(e) => handleFilterChange("cliente", e.target.value)}
                      placeholder="Nombre del cliente"
                      className="w-100"
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Identificación</label>
                    <InputText
                      value={filtros.identificacion}
                      onChange={(e) => handleFilterChange("identificacion", e.target.value)}
                      placeholder="RNC/Cédula del cliente"
                      className="w-100"
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Tipo de nota</label>
                    <Dropdown
                      value={filtros.tipoNota}
                      options={tiposNota}
                      onChange={(e) => handleFilterChange("tipoNota", e.value)}
                      optionLabel="label"
                      placeholder="Seleccione tipo"
                      className="w-100"
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Rango de fechas</label>
                    <Calendar
                      value={filtros.rangoFechas}
                      onChange={(e) => handleFilterChange("rangoFechas", e.value)}
                      selectionMode="range"
                      readOnlyInput
                      dateFormat="dd/mm/yy"
                      placeholder="Seleccione rango de fechas"
                      className="w-100"
                      showIcon
                    />
                  </div>

                  <div className="col-12 d-flex justify-content-end gap-2">
                    <Button
                      label="Limpiar"
                      icon="pi pi-trash"
                      className="p-button-secondary"
                      onClick={limpiarFiltros}
                    />
                    <Button
                      label="Aplicar Filtros"
                      icon="pi pi-filter"
                      className="p-button-primary"
                      onClick={() => aplicarFiltros()}
                      loading={tableLoading}
                    />
                  </div>
                </div>
              </AccordionTab>
            </Accordion>

            <CustomPRTable
              columns={columns}
              data={tableItems}
              loading={tableLoading}
              onSearch={handleSearchChange}
              onReload={handleRefresh}
              paginator
              rows={rows}
              first={first}
              onPage={onPageChange}
              totalRecords={totalRecords}
              rowsPerPageOptions={[5, 10, 25, 50]}
              currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} notas"
              emptyMessage="No se encontraron notas"
              exportExcel={handleExportAllExcel}
              exportPdf={handleExportAllPDF}
              showExportButtons={true}
            />
          </div>
        </div>
      )}
    </main>
  );
};