import React, { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Paginator } from "primereact/paginator";
import { accountingVouchersService } from "../../../services/api";
import { AccountingVoucherDto, DetailsDto } from "../../models/models";
import { generatePDFFromHTML } from "../../../funciones/funcionesJS/exportPDF";
import { useCompany } from "../../hooks/useCompany";
import { CustomModal } from "../../components/CustomModal";
import { FormAccoutingVouchers, Transaction } from "./form/FormAccoutingVouchers";
import { Dialog } from "primereact/dialog";
import { stringToDate } from "../../../services/utilidades";
import { useAccountingVoucherDelete } from "./hooks/useAccountingVoucherDelete";

type DropdownOption = {
  label: string;
  value: string;
  icon: string;
};

export const AccountingVouchers: React.FC = () => {
  // Estado para los datos
  const [vouchers, setVouchers] = useState<AccountingVoucherDto[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<AccountingVoucherDto | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [dates, setDates] = useState<[Date, Date] | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>([]);
  const [editTransactions, setEditTransactions] = useState<Transaction[]>([]);
  const { company, setCompany, fetchCompany } = useCompany();
  const { deleteAccountingVoucher } = useAccountingVoucherDelete();

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

  // Estado para el modal
  const [tipoComprobante, setTipoComprobante] = useState<string | null>(null);

  // Opciones para el dropdown de nuevo comprobante
  const opcionesNuevoComprobante: DropdownOption[] = [
    { label: "Recibo de Caja", value: "recibo_caja", icon: "pi-money-bill" },
    { label: "Recibo de Pago", value: "recibo_pago", icon: "pi-credit-card" },
  ];

  const loadData = async (pageNumber = 1, rowsData = 10) => {
    setLoading(true);
    try {
      const response = await accountingVouchersService.getAccountingVouchers({
        page: pageNumber,
        per_page: rowsData,
      });

      const dataMapped = response.data.map((voucher: any) => ({
        ...voucher,
        details: voucher.details.map((detail: any) => ({
          ...detail,
          full_name: detail.third_party
            ? `${detail?.third_party?.first_name ?? ""} ${detail?.third_party?.middle_name ?? ""} ${detail?.third_party?.last_name ?? ""} ${detail?.third_party?.second_last_name ?? ""}`.trim() || detail?.third_party?.name
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

  const buildQueryParams = () => {
    const params: any = {};

    if (filtros.fechaInicio) {
      params.fecha_inicio = formatDateForAPI(filtros.fechaInicio);
    }

    if (filtros.fechaFin) {
      params.fecha_fin = formatDateForAPI(filtros.fechaFin);
    }

    if (filtros.numeroComprobante) {
      params.numero_comprobante = filtros.numeroComprobante;
    }

    if (filtros.codigoContable) {
      params.codigo_contable = filtros.codigoContable;
    }

    return params;
  };

  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const onPageChange = (event: any) => {
    const newPage = event.first / event.rows + 1;
    setFirst(event.first);
    setRows(event.rows);
    setPage(newPage);
    loadData(newPage, event.rows);
  };

  const handleSearch = () => {
    // Resetear a la primera página al aplicar nuevos filtros
    setPage(1);
    setFirst(0);
    loadData(1);
  };

  useEffect(() => {
    if (dates && Array.isArray(dates)) {
      setFiltros({
        ...filtros,
        fechaInicio: dates[0],
        fechaFin: dates[1],
      });
    }
  }, [dates]);

  useEffect(() => {
    loadData(page);
  }, [
    filtros.fechaInicio,
    filtros.fechaFin,
    filtros.numeroComprobante,
    filtros.codigoContable,
  ]);

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

  function handleExportPDF(vouchers: any) {
    const headers = `
        <tr>
            <th>Tercero</th>
            <th>Cuenta contable</th>
            <th>Descripción</th>
            <th>Debito</th>
            <th>Credito</th>
        </tr>
    `;

    // Calculamos los totales de débito y crédito
    let totalDebit: any = "";
    let totalCredit: any = "";

    const rows = vouchers.details.reduce((acc: string, rowData: any) => {
      // Sumamos al total correspondiente
      if (rowData.type === "debit") {
        totalDebit += formatCurrency(rowData.amount);
      } else if (rowData.type === "credit") {
        totalCredit += formatCurrency(rowData.amount);
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

    // Agregamos la fila de totales
    const totalRow = `
        <tr style="font-weight: bold; background-color: #f5f5f5;">
            <td colspan="3">Total</td>
            <td class="right">$${totalDebit}</td>
            <td class="right">$${totalCredit}</td>
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
        <span>Comprobante contable #: ${vouchers.id}</span>
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
        <span>Observaciones: ${vouchers.description}</span>
        </div>
    `;

    const configPDF = {
      name: "Comprobante contable #" + vouchers.seat_number,
    };

    generatePDFFromHTML(table, company, configPDF);
  }

  function handleEditVoucher(voucher: AccountingVoucherDto) {
    setSelectedVoucher(voucher);
    setEditModalVisible(true);

    console.log("Editando comprobante contable:", voucher);

    setInitialData({
      id: voucher.id,
      date: stringToDate(voucher.seat_date),
      observations: voucher.description
    })

    setEditTransactions(voucher.details.map((detail: any) => ({
      id: detail.id,
      account: detail.accounting_account_id,
      description: detail.description,
      amount: +detail.amount,
      type: detail.type,
      thirdParty: detail.third_party.id,
      thirdPartyType: detail.third_party.type
    })));
  }

  const handleDeleteVoucher = async (id: string) => {
    const confirmed = await deleteAccountingVoucher(id)
    if (confirmed) loadData(page)
  };

  // Template para el encabezado del acordeón
  const voucherTemplate = (voucher: AccountingVoucherDto) => {
    return (
      <div className="d-flex justify-content-between align-items-center w-full">
        <div>
          <span className="font-bold">{voucher.seat_number}</span> -
          <span className="mx-2">{formatDate(voucher.seat_date)}</span>
          <br />
          <span className="font-bold">
            Total: {formatCurrency(voucher.total_is)}
          </span>
        </div>
        <div className="d-flex text-end justify-content-end gap-2">
          <Button
            tooltip="Editar comprobante"
            tooltipOptions={{ position: "top" }}
            className="p-button-warning"
            onClick={() => handleEditVoucher(voucher)}
          >
            <i className="fa-solid fa-pen-to-square" />
          </Button>
          <Button
            tooltip="Eliminar comprobante"
            tooltipOptions={{ position: "top" }}
            className="p-button-danger"
            onClick={() => handleDeleteVoucher(voucher.id.toString())}
          >
            <i className="fa-solid fa-trash" />
          </Button>
          <Button
            tooltip="Exportar a PDF"
            tooltipOptions={{ position: "top" }}
            className="p-button-secondary"
            onClick={() => handleExportPDF(voucher)}
          >
            <i className="fa-solid fa-file-pdf" />
          </Button>
        </div>
      </div>
    );
  };

  // Handler para selección de tipo de comprobante
  const handleSeleccionTipo = (value: string) => {
    setTipoComprobante(value);
  };

  // Template para opciones del dropdown
  const itemTemplate = (option: DropdownOption) => (
    <div className="flex align-items-center">
      <i className={`pi ${option.icon} mr-2`} />
      <span>{option.label}</span>
    </div>
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Movimientos Contables</h2>
        <div className="d-flex gap-2">
          <Button
            label="Nuevo Comprobante"
            icon="pi pi-file-edit"
            className="btn btn-primary"
            onClick={() => (window.location.href = "CrearComprobantesContable")}
          />

          <Dropdown
            value={tipoComprobante}
            options={opcionesNuevoComprobante}
            onChange={(e: DropdownChangeEvent) => handleSeleccionTipo(e.value)}
            optionLabel="label"
            itemTemplate={itemTemplate}
            placeholder="Seleccione tipo"
            dropdownIcon="pi pi-chevron-down"
            appendTo="self"
            className="w-full md:w-14rem"
          />
        </div>
      </div>

      <Card title="Filtros de Búsqueda" className="mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Fechas</label>
            <Calendar
              value={dates}
              onChange={(e: any) => setDates(e.value)}
              appendTo={document.body}
              dateFormat="dd/mm/yy"
              placeholder="Seleccione fecha"
              className="w-100"
              showIcon
              selectionMode="range"
              readOnlyInput
              hideOnRangeSelection
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">N° Comprobante</label>
            <InputText
              value={filtros.numeroComprobante}
              onChange={(e) =>
                setFiltros({ ...filtros, numeroComprobante: e.target.value })
              }
              placeholder="Buscar por número"
              className="w-100"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Código Contable</label>
            <InputText
              value={filtros.codigoContable}
              onChange={(e) =>
                setFiltros({ ...filtros, codigoContable: e.target.value })
              }
              placeholder="Buscar por código"
              className="w-100"
            />
          </div>
        </div>
      </Card>

      <Card title="Comprobantes Contables">
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
            <Accordion multiple>
              {vouchers.map((voucher) => (
                <AccordionTab
                  key={voucher.id}
                  header={voucherTemplate(voucher)}
                >
                  <DataTable
                    value={voucher.details}
                    className="p-datatable-gridlines custom-datatable"
                    stripedRows
                    size="small"
                  >
                    <Column
                      field={`full_name`}
                      header="Tercero"
                      style={{ width: "130px" }}
                    />
                    <Column
                      field="accounting_account.name"
                      header="Cuenta contable"
                      style={{ width: "130px" }}
                    />
                    <Column
                      field="description"
                      header="Descripción"
                      style={{ width: "130px" }}
                    />
                    <Column
                      field="type"
                      header="Tipo"
                      body={(rowData: DetailsDto) =>
                        formatTypeMovement(rowData.type)
                      }
                      style={{ width: "120px" }}
                      bodyClassName="text-right"
                    />
                    <Column
                      field="amount"
                      header="Monto"
                      body={(rowData: DetailsDto) =>
                        formatCurrency(rowData.amount)
                      }
                      style={{ width: "120px" }}
                    />
                  </DataTable>
                </AccordionTab>
              ))}
            </Accordion>

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
        style={{ width: "80vw", height: "100vh", maxHeight: "100vh" }}
        modal
        closable={true}
      >
        <FormAccoutingVouchers
          voucherId={selectedVoucher?.id.toString() || ""}
          initialData={initialData}
          editTransactions={editTransactions}
          onUpdate={() => {
            loadData(page);
            setEditModalVisible(false)
          }}

        />

      </Dialog>
    </>
  );
};
