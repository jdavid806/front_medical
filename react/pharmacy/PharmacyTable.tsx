import React, { useState, useEffect } from "react";
import { CustomPRTable, CustomPRTableColumnProps } from "../components/CustomPRTable";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import TableActionsWrapper from "../components/table-actions/TableActionsWrapper";
import { SwalManager } from "../../services/alertManagerImported";
import { exportToExcel } from "../accounting/utils/ExportToExcelOptions";
import { CustomFormModal } from "../components/CustomFormModal";
import { MakeRequestForm, MakeRequestFormInputs } from "../general-request/components/MakeRequestForm";
import { RequestCancellationTableAction } from "../components/table-actions/RequestCancellationTableAction";
import { cancelConsultationClaim } from "../../services/koneksiService";
import { formatDate } from "../../services/utilidades";

export interface PharmacyTableFilters {
    selectedDate: Nullable<(Date | null)[]>;
    selectedClient: string | null;
    selectedStatus: string | null;
}
interface pharmacyInvoicesI {
    id: string;
    invoice: string;
    date: string;
    client: string;
    total_amount: number;
    remaining_amount: number;
    paid: number;
    status: string;
    originalItem?: any;
    koneksiClaimId?: string | null;
    appointment_id?: string;
}

interface PharmacyTableProps {
    items: pharmacyInvoicesI[];
    onCancelItem?: (id: string) => void;
    lazy?: boolean;
    totalRecords?: number;
    first?: number;
    rows?: number;
    loading?: boolean;
    onReload?: () => void;
    onPage?: (event: any) => void;
    onSearch?: (event: any) => void;
    handleFilter?: (event: PharmacyTableFilters) => void;
}

export const PharmacyTable: React.FC<PharmacyTableProps> = ({
    items,
    onReload,
    onPage,
    onSearch,
    first,
    rows,
    lazy,
    loading,
    onCancelItem,
    totalRecords,
    handleFilter,
}) => {
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Nullable<(Date | null)[]>>([null, null]);

    const [showCancellationModal, setShowCancellationModal] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

    const statusOptions = [
        { label: "Pagada", value: "paid" },
        { label: "Pendiente", value: "pending" },
        { label: "Anulada", value: "cancelled" }
    ];

    const clientOptions = [
        { label: "Cliente 1", value: "1" },
        { label: "Cliente 2", value: "2" }
    ];

    const onFilter = () => {
        const filterValues: PharmacyTableFilters = {
            selectedClient,
            selectedStatus,
            selectedDate
        };
        handleFilter && handleFilter(filterValues);
    };

    useEffect(() => {
        onFilter();
    }, [selectedClient, selectedStatus, selectedDate]);

    // ELIMINA ESTA FUNCIÓN LOCAL - ES LA QUE CAUSA EL CONFLICTO
    // const generateInvoice = async (appointmentId: string, download: boolean = false): Promise<void> => {
    //     try {
    //         //@ts-ignore - Esta función ya existe en el contexto global
    //         await generateInvoice(appointmentId, download);
    //         ...
    //     }
    // };

    const cancelClaim = (claimId: string) => {
        SwalManager.confirmCancel(async () => {
            try {
                const response = await cancelConsultationClaim(claimId);

                SwalManager.success({
                    title: "Éxito",
                    text: "Reclamación anulada con éxito.",
                });
            } catch (error) {
                SwalManager.error({
                    title: "Error",
                    text: "No se pudo anular la reclamación.",
                });
            }
        });
    };

    const handleViewDetails = (invoice: pharmacyInvoicesI) => {
        SwalManager.info({
            title: "Detalles de Factura",
            text: `Factura: ${invoice.invoice}<br>Cliente: ${invoice.client}<br>Total: $${invoice.total_amount.toFixed(2)}<br>Pagado: $${invoice.paid.toFixed(2)}<br>Pendiente: $${invoice.remaining_amount.toFixed(2)}`
        });
    };

    const handleCancelInvoice = (invoiceId: string) => {
        setSelectedInvoiceId(invoiceId);
        setShowCancellationModal(true);
    };

    const handleRegisterPayment = (invoiceId: string, currentInvoice: pharmacyInvoicesI) => {
        SwalManager.prompt({
            title: "Registrar Pago",
            text: `Ingrese el monto del pago (Máximo: $${currentInvoice.remaining_amount.toFixed(2)}):`,
            input: "number",
            inputValue: currentInvoice.remaining_amount.toFixed(2),
            inputAttributes: {
                min: "0",
                max: currentInvoice.remaining_amount.toString(),
                step: "0.01"
            },
            showCancelButton: true,
            confirmButtonText: "Registrar Pago",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const amount = parseFloat(result.value);
                if (amount > 0 && amount <= currentInvoice.remaining_amount) {
                    // Lógica para registrar el pago
                    console.log(`Registrando pago de $${amount} para factura ${invoiceId}`);
                    SwalManager.success({
                        title: "Éxito",
                        text: `Pago de $${amount.toFixed(2)} registrado correctamente.`,
                    });
                    onReload && onReload();
                } else {
                    SwalManager.error({
                        title: "Error",
                        text: "El monto ingresado no es válido.",
                    });
                }
            }
        });
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: { [key: string]: { color: string, text: string } } = {
            paid: { color: "success", text: "PAGADA" },
            pending: { color: "warning", text: "PENDIENTE" },
            cancelled: { color: "danger", text: "ANULADA" }
        };

        const config = statusConfig[status] || { color: "secondary", text: "DESCONOCIDO" };

        return (
            <span className={`badge badge-phoenix badge-phoenix-${config.color}`}>
                {config.text}
            </span>
        );
    };

    const columns: CustomPRTableColumnProps[] = [
        { header: "Factura", field: "invoice" },
        { header: "Fecha", field: "date" },
        { header: "Cliente", field: "client" },
        {
            header: "Total",
            field: "total_amount",
            body: (data: pharmacyInvoicesI) => `$${data.total_amount.toFixed(2)}`
        },
        {
            header: "Pagado",
            field: "paid",
            body: (data: pharmacyInvoicesI) => `$${data.paid.toFixed(2)}`
        },
        {
            header: "Pendiente",
            field: "remaining_amount",
            body: (data: pharmacyInvoicesI) => `$${data.remaining_amount.toFixed(2)}`
        },
        {
            header: "Estado",
            field: "status",
            body: (data: pharmacyInvoicesI) => getStatusBadge(data.status)
        },
        {
            header: "Acciones",
            field: "",
            body: (data: pharmacyInvoicesI) => (
                <TableActionsWrapper>
                    <li>
                        <a
                            className="dropdown-item"
                            href="#"
                            onClick={() => handleViewDetails(data)}
                        >
                            <div className="d-flex gap-2 align-items-center">
                                <i className="fa-solid fa-eye" style={{ width: "20px" }}></i>
                                <span>Ver detalles</span>
                            </div>
                        </a>
                    </li>

                    {/* IMPRIMIR FACTURA - EXACTAMENTE IGUAL QUE EN ADMISSIONTABLE */}
                    <li>
                        <a
                            className="dropdown-item"
                            href="#"
                            onClick={async () => {
                                try {
                                    //@ts-ignore - USAR DIRECTAMENTE LA FUNCIÓN GLOBAL
                                    await generateInvoice(data.originalItem?.appointment_id || data.id, false);
                                    SwalManager.success({
                                        title: "Éxito",
                                        text: "Factura impresa correctamente.",
                                    });
                                } catch (error) {
                                    console.error("Error al imprimir factura:", error);
                                    SwalManager.error({
                                        title: "Error",
                                        text: "No se pudo imprimir la factura.",
                                    });
                                }
                            }}
                        >
                            <div className="d-flex gap-2 align-items-center">
                                <i className="fa-solid fa-receipt" style={{ width: "20px" }}></i>
                                <span>Imprimir factura</span>
                            </div>
                        </a>
                    </li>

                    {/* DESCARGAR FACTURA - EXACTAMENTE IGUAL QUE EN ADMISSIONTABLE */}
                    <li>
                        <a
                            className="dropdown-item"
                            href="#"
                            onClick={async () => {
                                try {
                                    //@ts-ignore - USAR DIRECTAMENTE LA FUNCIÓN GLOBAL
                                    await generateInvoice(data.originalItem?.appointment_id || data.id, true);
                                    SwalManager.success({
                                        title: "Éxito",
                                        text: "Factura descargada correctamente.",
                                    });
                                } catch (error) {
                                    console.error("Error al descargar factura:", error);
                                    SwalManager.error({
                                        title: "Error",
                                        text: "No se pudo descargar la factura.",
                                    });
                                }
                            }}
                        >
                            <div className="d-flex gap-2 align-items-center">
                                <i className="fa-solid fa-receipt" style={{ width: "20px" }}></i>
                                <span>Descargar factura</span>
                            </div>
                        </a>
                    </li>

                    {data.status === "pending" && data.remaining_amount > 0 && (
                        <li>
                            <a
                                className="dropdown-item"
                                href="#"
                                onClick={() => handleRegisterPayment(data.id, data)}
                            >
                                <div className="d-flex gap-2 align-items-center">
                                    <i className="fa-solid fa-money-bill" style={{ width: "20px" }}></i>
                                    <span>Registrar pago</span>
                                </div>
                            </a>
                        </li>
                    )}

                    {/* Anulación de reclamación (igual que en AdmissionTable) */}
                    {data.koneksiClaimId && (
                        <li>
                            <a
                                className="dropdown-item"
                                href="#"
                                onClick={() => cancelClaim(data.koneksiClaimId!)}
                            >
                                <div className="d-flex gap-2 align-items-center">
                                    <i className="fa-solid fa-ban" style={{ width: "20px" }}></i>
                                    <span>Anular reclamación</span>
                                </div>
                            </a>
                        </li>
                    )}

                    {/* Solicitud de anulación (igual que en AdmissionTable) */}
                    <RequestCancellationTableAction
                        onTrigger={() => handleCancelInvoice(data.id)}
                    />
                </TableActionsWrapper>
            )
        }
    ];

    return (
        <>
            <div className="accordion mb-3">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="filters">
                        <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#filtersCollapse"
                            aria-expanded="false"
                            aria-controls="filtersCollapse"
                        >
                            Filtrar facturas de farmacia
                        </button>
                    </h2>
                    <div
                        id="filtersCollapse"
                        className="accordion-collapse collapse"
                        aria-labelledby="filters"
                    >
                        <div className="accordion-body">
                            <div className="d-flex gap-2">
                                <div className="flex-grow-1">
                                    <div className="row g-3">
                                        <div className="col-4">
                                            <label htmlFor="rangoFechas" className="form-label">
                                                Fecha de emisión
                                            </label>
                                            <Calendar
                                                id="rangoFechas"
                                                name="rangoFechas"
                                                selectionMode="range"
                                                dateFormat="dd/mm/yy"
                                                value={selectedDate}
                                                onChange={(e) => setSelectedDate(e.value)}
                                                className="w-100"
                                                placeholder="Seleccione un rango"
                                            />
                                        </div>
                                        <div className="col-4">
                                            <label htmlFor="cliente" className="form-label">
                                                Cliente
                                            </label>
                                            <Dropdown
                                                inputId="cliente"
                                                options={clientOptions}
                                                optionLabel="label"
                                                optionValue="value"
                                                filter
                                                placeholder="Seleccionar cliente"
                                                className="w-100"
                                                value={selectedClient}
                                                onChange={(e) => setSelectedClient(e.value)}
                                                showClear
                                            />
                                        </div>
                                        <div className="col-4">
                                            <label htmlFor="estado" className="form-label">
                                                Estado
                                            </label>
                                            <Dropdown
                                                inputId="estado"
                                                options={statusOptions}
                                                optionLabel="label"
                                                optionValue="value"
                                                placeholder="Seleccionar estado"
                                                className="w-100"
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.value)}
                                                showClear
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
                style={{ minHeight: "400px" }}
            >
                <div className="card-body h-100 w-100 d-flex flex-column">
                    <div className="d-flex justify-content-end mb-3">
                        <button
                            className="btn btn-primary me-2"
                            onClick={() => {
                                exportToExcel({
                                    data: items,
                                    fileName: `Facturas_Farmacia`,
                                    excludeColumns: ["id", "originalItem"],
                                });
                            }}
                        >
                            <i className="fa-solid fa-file-excel me-2"></i>
                            Exportar a Excel
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={onReload}
                        >
                            <i className="fa-solid fa-refresh me-2"></i>
                            Actualizar
                        </button>
                    </div>
                    <CustomPRTable
                        columns={columns}
                        data={items}
                        lazy={lazy}
                        first={first}
                        rows={rows}
                        totalRecords={totalRecords}
                        loading={loading}
                        onPage={onPage}
                        onSearch={onSearch}
                        onReload={onReload}
                    />
                </div>
            </div>

            <CustomFormModal
                show={showCancellationModal}
                onHide={() => setShowCancellationModal(false)}
                formId="cancellationForm"
                title="Solicitud de anulación de factura"
            >
                <MakeRequestForm
                    formId="cancellationForm"
                    onHandleSubmit={(requestData: MakeRequestFormInputs) => {
                        if (selectedInvoiceId) {
                            // Lógica para enviar la solicitud de anulación
                            console.log("Solicitud de anulación:", { selectedInvoiceId, requestData });
                            SwalManager.success({ text: "Solicitud de anulación enviada correctamente" });
                            setShowCancellationModal(false);
                            onReload && onReload();
                        }
                    }}
                />
            </CustomFormModal>
        </>
    );
};