import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Paginator } from "primereact/paginator";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Menu } from "primereact/menu";
import { accountingVouchersService } from "../../../services/api";
import { AccountingVoucherDto, DetailsDto } from "../../models/models";
import { generatePDFFromHTMLV2 } from "../../../funciones/funcionesJS/exportPDFV2";
import { useCompany } from "../../hooks/useCompany";
import {
  FormAccoutingVouchers,
  Transaction,
} from "./form/FormAccoutingVouchers";
import { Dialog } from "primereact/dialog";
import { stringToDate } from "../../../services/utilidades";
import { useAccountingVoucherDelete } from "./hooks/useAccountingVoucherDelete";

export const AccountingVouchers: React.FC = () => {
  // Estado para los datos
  const [vouchers, setVouchers] = useState<AccountingVoucherDto[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<AccountingVoucherDto | null>(null);
  const [expandedRows, setExpandedRows] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [dates, setDates] = useState<[Date, Date] | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>([]);
  const [editTransactions, setEditTransactions] = useState<Transaction[]>([]);
  const { company } = useCompany();
  const { deleteAccountingVoucher } = useAccountingVoucherDelete();
  const menuRef = useRef<Menu>(null);

  // Estado para paginación
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [page, setPage] = useState(1);

  // Estado para filtros
  const [filtros, setFiltros] = useState({
    fechaInicio: null as Date | null,
    fechaFin: null as Date | null,
    numeroComprobante: "",
    codigoContable: "",
  });

  const loadData = async (pageNumber = 1, rowsData = 10, filters = filtros) => {
    setLoading(true);
    try {
      const params: any = {
        page: pageNumber,
        per_page: rowsData,
      };

      // Agregar filtros a los parámetros
      if (filters.fechaInicio) {
        params.fecha_inicio = formatDateForAPI(filters.fechaInicio);
      }
      if (filters.fechaFin) {
        params.fecha_fin = formatDateForAPI(filters.fechaFin);
      }
      if (filters.numeroComprobante) {
        params.numero_comprobante = filters.numeroComprobante;
      }
      if (filters.codigoContable) {
        params.codigo_contable = filters.codigoContable;
      }

      console.log("Parámetros de búsqueda:", params); // Para debug

      const response = await accountingVouchersService.getAccountingVouchers(params);

      const dataMapped = response.data.map((voucher: any) => ({
        ...voucher,
        details: voucher.details.map((detail: any) => ({
          ...detail,
          full_name: detail.third_party
            ? `${detail?.third_party?.first_name ?? ""} ${detail?.third_party?.middle_name ?? ""
              } ${detail?.third_party?.last_name ?? ""} ${detail?.third_party?.second_last_name ?? ""
              }`.trim() || detail?.third_party?.name
            : "No tiene terceros",
        })),
      }));

      setVouchers(dataMapped);
      setTotalRecords(response.meta.total);
      setFirst((pageNumber - 1) * rows);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  };

  const onPageChange = (event: any) => {
    const newPage = event.first / event.rows + 1;
    setFirst(event.first);
    setRows(event.rows);
    setPage(newPage);
    loadData(newPage, event.rows);
  };

  // Actualizar filtros cuando cambian las fechas - CORREGIDO
  const handleDateChange = (e: any) => {
    const selectedDates = e.value;
    setDates(selectedDates);

    if (selectedDates && selectedDates.length === 2) {
      setFiltros(prev => ({
        ...prev,
        fechaInicio: selectedDates[0],
        fechaFin: selectedDates[1]
      }));
    } else {
      setFiltros(prev => ({
        ...prev,
        fechaInicio: null,
        fechaFin: null
      }));
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadData(page);
  }, []);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Formatear moneda
  const formatCurrency = (value: number) => {
    const formatted = new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
    }).format(value);
    return formatted;
  };

  const formatTypeMovement = (value: string) => {
    switch (value) {
      case "credit":
        return "Crédito";
      case "debit":
        return "Débito";
      default:
        return value;
    }
  };

  async function handleExportPDF(voucher: any) {
    const headers = `
        <tr>
            <th>Tercero</th>
            <th>Cuenta contable</th>
            <th>Descripción</th>
            <th>Debito</th>
            <th>Credito</th>
        </tr>
    `;

    let totalDebit = 0;
    let totalCredit = 0;

    const rows = voucher.details.reduce((acc: string, rowData: any) => {
      if (rowData.type === "debit") {
        totalDebit += rowData.amount;
      } else if (rowData.type === "credit") {
        totalCredit += rowData.amount;
      }

      return (
        acc +
        `
                <tr>
                    <td>${rowData.full_name}</td>
                    <td>${rowData.accounting_account.name}</td>
                    <td>${rowData.description}</td>
                    <td class="right">${rowData.type === "debit"
          ? formatCurrency(rowData.amount)
          : ""
        }</td>
                    <td class="right">${rowData.type === "credit"
          ? formatCurrency(rowData.amount)
          : ""
        }</td>
                </tr>
                `
      );
    }, "");

    const totalRow = `
        <tr style="font-weight: bold; background-color: #f5f5f5;">
            <td colspan="3">Total</td>
            <td class="right">${formatCurrency(totalDebit)}</td>
            <td class="right">${formatCurrency(totalCredit)}</td>
        </tr>
    `;

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
            .right { text-align: right; }
        </style>

        <div style="font-weight: bold; background-color: #f5f5f5; margin-bottom: 15px">
        <span>Comprobante contable #: ${voucher.id}</span>
        </div>
        <table>
            <thead>
                ${headers}
            </thead>
            <tbody>
                ${rows}
                ${totalRow}
            </tbody>
        </table>
        <div style="font-weight: bold; background-color: #f5f5f5; margin-top: 25px">
        <span>Observaciones: ${voucher.description}</span>
        </div>
    `;

    const configPDF = {
      name: "Comprobante contable #" + voucher.seat_number,
      isDownload: false,
    };

    await generatePDFFromHTMLV2(table, company, configPDF);
  }

  function handleEditVoucher(voucher: AccountingVoucherDto) {
    setSelectedVoucher(voucher);
    setEditModalVisible(true);

    setInitialData({
      id: voucher.id,
      date: stringToDate(voucher.seat_date),
      observations: voucher.description,
    });

    setEditTransactions(
      voucher.details.map((detail: any) => ({
        id: detail.id,
        account: detail.accounting_account_id,
        description: detail.description,
        amount: +detail.amount,
        type: detail.type,
        thirdParty: detail.third_party.id,
        thirdPartyType: detail.third_party.type,
      }))
    );
  }

  const handleDeleteVoucher = async (id: string) => {
    const confirmed = await deleteAccountingVoucher(id);
    if (confirmed) loadData(page);
  };

  const handleAplicarFiltros = () => {
    setPage(1);
    setFirst(0);
    loadData(1, rows, filtros);
  };

  const limpiarFiltros = () => {
    setFiltros({
      fechaInicio: null,
      fechaFin: null,
      numeroComprobante: "",
      codigoContable: "",
    });
    setDates(null);
    // Recargar datos sin filtros
    setPage(1);
    setFirst(0);
    loadData(1, rows, {
      fechaInicio: null,
      fechaFin: null,
      numeroComprobante: "",
      codigoContable: "",
    });
  };

  const TableMenu: React.FC<{
    rowData: AccountingVoucherDto,
    onEdit: (voucher: AccountingVoucherDto) => void,
    onDelete: (id: string) => void,
    onExport: (voucher: AccountingVoucherDto) => void
  }> = ({ rowData, onEdit, onDelete, onExport }) => {
    const menu = useRef<Menu>(null);

    const menuItems = [
      {
        label: "Editar",
        icon: <i className="fas fa-edit me-2"></i>,
        command: () => onEdit(rowData)
      },
      {
        label: "Eliminar",
        icon: <i className="fas fa-trash me-2"></i>,
        command: () => onDelete(rowData.id.toString())
      },
      {
        label: "Exportar PDF",
        icon: <i className="fas fa-file-pdf me-2"></i>,
        command: () => onExport(rowData)
      }
    ];

    return (
      <div style={{ position: "relative" }}>
        <Button
          className="p-button-primary flex items-center gap-2 p-button-sm"
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

  const actionsTemplate = (rowData: AccountingVoucherDto) => {
    return (
      <TableMenu
        rowData={rowData}
        onEdit={handleEditVoucher}
        onDelete={handleDeleteVoucher}
        onExport={handleExportPDF}
      />
    );
  };

  const rowExpansionTemplate = (data: AccountingVoucherDto) => {
    return (
      <div className="p-3" style={{ backgroundColor: '#f8f9fa' }}>
        <h5>Detalles del Comprobante #{data.seat_number}</h5>
        <DataTable
          value={data.details}
          className="p-datatable-gridlines"
          stripedRows
          size="small"
        >
          <Column
            field="full_name"
            header="Tercero"
            style={{ width: "200px" }}
          />
          <Column
            field="accounting_account.name"
            header="Cuenta contable"
            style={{ width: "150px" }}
          />
          <Column
            field="description"
            header="Descripción"
            style={{ width: "200px" }}
          />
          <Column
            field="type"
            header="Tipo"
            body={(rowData: DetailsDto) => formatTypeMovement(rowData.type)}
            style={{ width: "120px" }}
          />
          <Column
            field="amount"
            header="Monto"
            body={(rowData: DetailsDto) => formatCurrency(rowData.amount)}
            style={{ width: "150px" }}
            bodyClassName="text-right"
          />
        </DataTable>
      </div>
    );
  };

  const onRowToggle = (e: any) => {
    setExpandedRows(e.data);
  };

  return (
    <>


      <Card>
        <div className="text-end pt-3 mb-2" style={{ marginTop: "-10px" }}>
          <Button
            label="Nuevo Comprobante"
            className="p-button-primary"
            onClick={() => (window.location.href = "CrearComprobantesContable")}

          >
            <i className="fas fa-plus me-2"></i>
          </Button>
        </div>
        <Accordion>
          <AccordionTab header="Filtros de Búsqueda">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Fechas</label>
                <Calendar
                  value={dates}
                  onChange={handleDateChange}
                  appendTo={document.body}
                  dateFormat="dd/mm/yy"
                  placeholder="Seleccione rango de fechas"
                  className="w-100"
                  showIcon
                  selectionMode="range"
                  readOnlyInput
                  hideOnRangeSelection
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">N° Comprobante</label>
                <InputText
                  value={filtros.numeroComprobante}
                  onChange={(e) => setFiltros({ ...filtros, numeroComprobante: e.target.value })}
                  placeholder="Buscar por número"
                  className="w-100"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Código Contable</label>
                <InputText
                  value={filtros.codigoContable}
                  onChange={(e) => setFiltros({ ...filtros, codigoContable: e.target.value })}
                  placeholder="Buscar por código"
                  className="w-100"
                />
              </div>

              <div className="col-md-3 d-flex align-items-end gap-2">
                <Button
                  label="Aplicar Filtros"
                  icon="pi pi-search"
                  className="p-button-primary"
                  onClick={handleAplicarFiltros}
                />
                <Button
                  label="Limpiar"
                  icon="pi pi-filter-slash"
                  className="p-button-secondary"
                  onClick={limpiarFiltros}
                />
              </div>
            </div>
          </AccordionTab>
        </Accordion>

        {loading ? (
          <div className="text-center p-5">
            <i
              className="pi pi-spinner pi-spin"
              style={{ fontSize: "2rem" }}
            ></i>
            <p>Cargando comprobantes...</p>
          </div>
        ) : (
          <>
            <DataTable
              value={vouchers}
              expandedRows={expandedRows}
              onRowToggle={onRowToggle}
              rowExpansionTemplate={rowExpansionTemplate}
              dataKey="id"
              className="p-datatable-gridlines"
              stripedRows
              size="small"
              emptyMessage="No se encontraron comprobantes"
            >
              <Column
                expander
                style={{ width: '3rem' }}
              />
              <Column
                field="seat_number"
                header="N° Comprobante"
                style={{ width: "120px" }}
              />
              <Column
                field="seat_date"
                header="Fecha"
                body={(rowData: AccountingVoucherDto) => formatDate(rowData.seat_date)}
                style={{ width: "120px" }}
              />
              <Column
                field="total_is"
                header="Total"
                body={(rowData: AccountingVoucherDto) => formatCurrency(rowData.total_is)}
                style={{ width: "130px" }}
              />
              <Column
                field="description"
                header="Descripción"
                style={{ minWidth: "200px" }}
              />
              <Column
                header="Acciones"
                body={actionsTemplate}
                style={{ width: "150px" }}
                align="center"
              />
            </DataTable>

            <div className="mt-3">
              <Paginator
                first={first}
                rows={rows}
                totalRecords={totalRecords}
                onPageChange={onPageChange}
                rowsPerPageOptions={[10, 20, 30]}
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              />
            </div>
          </>
        )}
      </Card>
      <Dialog
        visible={editModalVisible}
        header="Editar Comprobante"
        onHide={() => setEditModalVisible(false)}
        style={{ width: "90vw", height: "85vh", maxHeight: "100vh" }}
        modal
        closable={true}
      >
        <FormAccoutingVouchers
          voucherId={selectedVoucher?.id.toString() || ""}
          initialData={initialData}
          editTransactions={editTransactions}
          onUpdate={() => {
            loadData(page);
            setEditModalVisible(false);
          }}
        />
      </Dialog>
    </>
  );
};