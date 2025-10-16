import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from 'primereact/multiselect';
import { AutoComplete, AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Nullable } from "primereact/ts-helpers";
import { useDebounce } from "primereact/hooks";

import { CustomPRTable, CustomPRTableColumnProps } from "../components/CustomPRTable";
import { CustomFormModal } from "../components/CustomFormModal";
import { CustomModal } from "../components/CustomModal";
import { UpdateAdmissionAuthorizationForm } from "./UpdateAdmissionAuthorizationForm";
import { KoneksiUploadAndVisualizeExamResultsModal } from "./KoneksiUploadAndVisualizeExamResultsModal";

import { formatDate } from "../../services/utilidades";
import { SwalManager } from "../../services/alertManagerImported";
import { cancelConsultationClaim } from "../../services/koneksiService";
import { admissionService, patientService, inventoryService } from "../../services/api";
import { exportToExcel } from "../accounting/utils/ExportToExcelOptions";

import { useUsers } from "../users/hooks/useUsers";
import { usePatients } from "../patients/hooks/usePatients";
import { useEntities } from "../entities/hooks/useEntities";
import { Patient } from "../models/models";

import {
    clinicalRecordStateColors,
    clinicalRecordStates,
} from "../../services/commons";

export interface AdmissionTableFilters {
    selectedDate: Nullable<(Date | null)[]>;
    selectedEntity: string | null;
    selectedProduct: string | null;
    selectedPatient: string | null;
    selectedAdmittedBy: string | null;
}

interface AdmissionTableProps {
    items: any[];
    onCancelItem?: (id: string) => void;
    lazy?: boolean;
    totalRecords?: number;
    first?: number;
    rows?: number;
    loading?: boolean;
    onReload?: () => void;
    onPage?: (event: any) => void;
    onSearch?: (event: any) => void;
    handleFilter?: (event: AdmissionTableFilters) => void;
}

interface AdmissionTableItem {
    id: string;
    createdAt: string;
    admittedBy: string;
    patientName: string;
    patientDNI: string;
    authorizationNumber: string;
    authorizedAmount: string;
    entityName: string;
    koneksiClaimId: string | null;
    status: string;
    originalItem: any;
    invoiceCode: string;
    invoiceId: string;
    products: string;
}

export const AdmissionTable: React.FC<AdmissionTableProps> = ({
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
    const { users } = useUsers();
    const { entities } = useEntities();

    const [tableItems, setTableItems] = useState<AdmissionTableItem[]>([]);
    const [selectedAdmittedBy, setSelectedAdmittedBy] = useState<string | null>(null);
    const [patientSearch, debouncedPatientSearch, setPatientSearch] = useDebounce<string | null>(null, 500);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = React.useState<Nullable<(Date | null)[]>>([new Date(), new Date()]);
    const [selectedAdmissionId, setSelectedAdmissionId] = useState<string>("");
    const [patients, setPatients] = useState<Patient[]>([]);

    const [showUpdateAuthorizationModal, setShowUpdateAuthorizationModal] = useState(false);
    const [showUploadAndVisualizeResultsModal, setShowUploadAndVisualizeResultsModal] = useState(false);
    const [showAttachFileModal, setShowAttachFileModal] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const toast = useRef<Toast>(null);

    const onFilter = () => {
        const filterValues: AdmissionTableFilters = {
            selectedAdmittedBy,
            selectedPatient: selectedPatient?.id?.toString() || null,
            selectedEntity,
            selectedDate,
            selectedProduct
        };
        handleFilter && handleFilter(filterValues);
    };

    useEffect(() => {
        onFilter();
        fetchProducts();
    }, []);

    useEffect(() => {
        const mappedItems: AdmissionTableItem[] = items.map((item: any) => {
            return {
                id: item.id,
                createdAt: formatDate(item.created_at),
                admittedBy: `${item.user.first_name || ""} ${item.user.middle_name || ""} ${item.user.last_name || ""} ${item.user.second_last_name || ""}`,
                patientName: `${item.patient.first_name || ""} ${item.patient.middle_name || ""} ${item.patient.last_name || ""} ${item.patient.second_last_name || ""}`,
                entityName: item.entity?.name || "--",
                koneksiClaimId: item.koneksi_claim_id,
                patientDNI: item.patient.document_number || "--",
                authorizationNumber: item.authorization_number || "--",
                authorizedAmount: item.entity_authorized_amount || "0.00",
                originalItem: item,
                status: item.status,
                invoiceCode: item?.invoice?.invoice_code || "",
                invoiceId: item?.invoice?.id || "",
                products: item?.invoice?.details?.map((detail: any) => detail.product.name).join(', ') || "",
            };
        });
        setTableItems(mappedItems);
    }, [items]);

    async function fetchProducts() {
        const response = await inventoryService.getAll();
        setProducts(response.data);
    }

    const TableMenu: React.FC<{
        rowData: AdmissionTableItem,
        onEdit: (id: string) => void,
        onDelete: (admission: AdmissionTableItem) => void
    }> = ({ rowData, onEdit, onDelete }) => {
        const menu = useRef<Menu>(null);

        const handleEdit = () => {
            console.log("Editando admisión con ID:", rowData.id);
            onEdit(rowData.id);
        };

        const handleDelete = () => {
            console.log("Solicitando eliminar admisión con ID:", rowData.id);
            onDelete(rowData);
        };

        const handleUpdateAuthorization = () => {
            openUpdateAuthorizationModal(rowData.originalItem.id);
        };

        const handlePrintInvoice = async () => {
            await generateInvoice(rowData.originalItem.appointment_id, false);
        };

        const handleDownloadInvoice = async () => {
            //@ts-ignore
            await generateInvoice(rowData.originalItem.appointment_id, true);
        };

        const handleAttachDocument = () => {
            openAttachDocumentModal(rowData.originalItem.id);
        };

        const handleViewDocument = () => {
            seeDocument(rowData.originalItem.document_minio_id);
        };

        const handleUploadResults = () => {
            openUploadAndVisualizeResultsModal(rowData.id!);
        };

        const handleCancelClaim = () => {
            cancelClaim(rowData.koneksiClaimId!);
        };

        const handleCancelAdmission = () => {
            onCancelItem && onCancelItem(rowData.originalItem.id);
        };

        const menuItems = [
            {
                label: "Actualizar información de autorización",
                icon: <i className="fa-solid fa-pencil me-2"></i>,
                command: handleUpdateAuthorization,
            },
            {
                label: "Imprimir factura",
                icon: <i className="fa-solid fa-receipt me-2"></i>,
                command: () => handlePrintInvoice(),
            },
            {
                label: "Descargar factura",
                icon: <i className="fa-solid fa-receipt me-2"></i>,
                command: handleDownloadInvoice,
            },
            ...(!rowData.originalItem.document_minio_id ? [{
                label: "Adjuntar documento",
                icon: <i className="fa-solid fa-file-pdf me-2"></i>,
                command: handleAttachDocument,
            }] : []),
            ...(rowData.originalItem.document_minio_id ? [{
                label: "Ver documento adjunto",
                icon: <i className="fa-solid fa-file-pdf me-2"></i>,
                command: handleViewDocument,
            }] : []),
            ...(rowData.koneksiClaimId ? [
                {
                    label: "Cargar y visualizar resultados de examenes",
                    icon: <i className="fa-solid fa-file-medical me-2"></i>,
                    command: handleUploadResults,
                },
                {
                    label: "Anular reclamación",
                    icon: <i className="fa-solid fa-ban me-2"></i>,
                    command: handleCancelClaim,
                }
            ] : []),
            {
                label: "Solicitar cancelación",
                icon: <i className="fa-solid fa-times me-2"></i>,
                command: handleCancelAdmission,
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

    const actionBodyTemplate = (rowData: any) => {
        return (
            <div
                className="flex align-items-center justify-content-center"
                style={{ gap: "0.5rem", minWidth: "120px" }}
            >
                <TableMenu
                    rowData={rowData}
                    onEdit={() => openUpdateAuthorizationModal(rowData.originalItem.id)}
                    onDelete={() => confirmDelete(rowData)}
                />
            </div>
        );
    };

    const columns: CustomPRTableColumnProps[] = [
        { header: "Admisionado el", field: "createdAt", sortable: true },
        { header: "Admisionado por", field: "admittedBy", sortable: true },
        { header: "Paciente", field: "patientName", sortable: true },
        { header: "Número de identificación", field: "patientDNI", sortable: true },
        { header: "Entidad", field: "entityName", sortable: true },
        { header: "Número de autorización", field: "authorizationNumber", sortable: true },
        { header: "Monto autorizado", field: "authorizedAmount", sortable: true },
        { header: "Codigo de factura", field: "invoiceCode", sortable: true },
        { header: "Id", field: "invoiceId", sortable: true },
        { header: "Productos", field: "products", sortable: true },
        {
            field: "status",
            header: "Estado",
            body: (data: AdmissionTableItem) => {
                const color = clinicalRecordStateColors[data.status] || "secondary";
                const text = clinicalRecordStates[data.status] || "SIN ESTADO";
                return (
                    <span className={`badge badge-phoenix badge-phoenix-${color}`}>
                        {text}
                    </span>
                );
            },
            sortable: true
        },
        {
            header: "Acciones",
            field: "actions",
            body: actionBodyTemplate,
            exportable: false
        },
    ];

    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [admissionToDelete, setAdmissionToDelete] = useState<AdmissionTableItem | null>(null);

    const confirmDelete = (admission: AdmissionTableItem) => {
        setAdmissionToDelete(admission);
        setDeleteDialogVisible(true);
    };

    const deleteAdmission = async () => {
        if (admissionToDelete && onCancelItem) {
            try {
                onCancelItem(admissionToDelete.id);

                SwalManager.success({
                    title: "Admisión Cancelada",
                });

                if (onReload) {
                    await onReload();
                }
            } catch (error) {
                console.error("Error al cancelar admisión:", error);
                SwalManager.error({
                    title: "Error",
                    text: "No se pudo cancelar la admisión",
                });
            }
        }
        setDeleteDialogVisible(false);
        setAdmissionToDelete(null);
    };

    const deleteDialogFooter = (
        <div className="flex justify-content-end gap-2">
            <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text"
                onClick={() => setDeleteDialogVisible(false)}
            />
            <Button
                label="Eliminar"
                icon="pi pi-check"
                className="p-button-danger"
                onClick={deleteAdmission}
            />
        </div>
    );

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

    const openUploadAndVisualizeResultsModal = (admissionId: string) => {
        setSelectedAdmissionId(admissionId);
        setShowUploadAndVisualizeResultsModal(true);
    };

    const openUpdateAuthorizationModal = (admissionId: string) => {
        setSelectedAdmissionId(admissionId);
        setShowUpdateAuthorizationModal(true);
    };

    const openAttachDocumentModal = async (admissionId: string) => {
        setSelectedAdmissionId(admissionId);
        setShowAttachFileModal(true);
    };

    const handleUploadDocument = async () => {
        try {
            //@ts-ignore
            const minioId = await guardarDocumentoAdmision(
                "admissionDocumentInput",
                selectedAdmissionId
            );

            if (minioId !== undefined) {
                await admissionService.update(selectedAdmissionId, {
                    document_minio_id: minioId.toString(),
                });
                SwalManager.success({ text: "Resultados guardados exitosamente" });
            } else {
                console.error("No se obtuvo un resultado válido.");
            }
        } catch (error) {
            console.error("Error al guardar el archivo:", error);
        } finally {
            setShowAttachFileModal(false);
            onReload && onReload();
        }
    };

    const seeDocument = async (minioId: string) => {
        if (minioId) {
            //@ts-ignore
            const url = await getFileUrl(minioId);
            window.open(url, "_blank");
            return;
        }

        SwalManager.error({
            title: "Error",
            text: "No se pudo visualizar el documento adjunto.",
        });
    };

    const searchPatients = async (event: AutoCompleteCompleteEvent) => {
        const filteredPatients = await patientService.getByFilters({
            per_page: 1000000,
            search: event.query,
        });

        setPatients(
            filteredPatients.data.data.map((patient) => ({
                ...patient,
                label: `${patient.first_name} ${patient.last_name}, Tel: ${patient.whatsapp}, Doc: ${patient.document_number}`,
            }))
        );
    };

    useEffect(() => {
        onFilter();
    }, [selectedAdmittedBy, selectedPatient, selectedEntity, selectedDate, selectedProduct]);

    return (
        <div className="w-100">
            <Toast ref={toast} />

            {/* Diálogo de confirmación de eliminación */}
            <Dialog
                visible={deleteDialogVisible}
                style={{ width: "450px" }}
                header="Confirmar"
                modal
                footer={deleteDialogFooter}
                onHide={() => setDeleteDialogVisible(false)}
            >
                <div className="flex align-items-center justify-content-center">
                    <i
                        className="fas fa-exclamation-triangle mr-3"
                        style={{ fontSize: "2rem", color: "#F8BB86" }}
                    />
                    {admissionToDelete && (
                        <span>
                            ¿Estás seguro que deseas cancelar la admisión del paciente <b>{admissionToDelete.patientName}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <div
                className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
                style={{ minHeight: "400px" }}
            >
                <div className="card-body h-100 w-100 d-flex flex-column">
                    <div className="d-flex justify-content-end mb-2">
                        <Button
                            className="p-button-primary me-2"
                            onClick={() => {
                                exportToExcel({
                                    data: tableItems,
                                    fileName: `Admisiones`,
                                    excludeColumns: ["id"],
                                });
                            }}
                        >
                            <i className="fa-solid fa-file-excel me-2"></i>
                            Exportar a Excel
                        </Button>
                    </div>
                    <Accordion>
                        <AccordionTab header="Filtrar admisiones">
                            <div className="d-flex gap-2">
                                <div className="flex-grow-1">
                                    <div className="row g-3">
                                        <div className="col-6">
                                            <label htmlFor="rangoFechasCitas" className="form-label">
                                                Admisionado entre
                                            </label>
                                            <Calendar
                                                id="rangoFechasCitas"
                                                name="rangoFechaCitas"
                                                selectionMode="range"
                                                dateFormat="dd/mm/yy"
                                                value={selectedDate}
                                                onChange={(e) => {
                                                    setSelectedDate(e.value);
                                                }}
                                                className="w-100"
                                                placeholder="Seleccione un rango"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="admittedBy" className="form-label">
                                                Admisionado por
                                            </label>
                                            <Dropdown
                                                inputId="admittedBy"
                                                options={users}
                                                optionLabel="label"
                                                optionValue="id"
                                                filter
                                                placeholder="Admisionado por"
                                                className="w-100"
                                                value={selectedAdmittedBy}
                                                onChange={(e) => {
                                                    setSelectedAdmittedBy(e.value);
                                                }}
                                                showClear
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="patient" className="form-label">
                                                Paciente
                                            </label>
                                            <AutoComplete
                                                inputId="patient"
                                                placeholder="Buscar un paciente"
                                                field="label"
                                                suggestions={patients}
                                                completeMethod={searchPatients}
                                                inputClassName="w-100"
                                                className={"w-100"}
                                                appendTo={"self"}
                                                value={patientSearch}
                                                onChange={(e) => {
                                                    setPatientSearch(e.value);
                                                }}
                                                onSelect={(e) => {
                                                    setSelectedPatient(e.value);
                                                }}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="entity" className="form-label">
                                                Entidad
                                            </label>
                                            <Dropdown
                                                inputId="entity"
                                                options={entities}
                                                optionLabel="label"
                                                optionValue="id"
                                                filter
                                                placeholder="Entidad"
                                                className="w-100"
                                                value={selectedEntity}
                                                onChange={(e) => {
                                                    setSelectedEntity(e.value);
                                                }}
                                                showClear
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="procedure" className="form-label">
                                                Procedimientos
                                            </label>
                                            <MultiSelect
                                                inputId="procedure"
                                                options={products}
                                                optionLabel="attributes.name"
                                                optionValue="id"
                                                filter
                                                placeholder="Procedimiento"
                                                className="w-100"
                                                value={selectedProduct}
                                                onChange={(e) => {
                                                    setSelectedProduct(e.value);
                                                }}
                                                showClear
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AccordionTab>
                    </Accordion>

                    <CustomPRTable
                        columns={columns}
                        data={tableItems}
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
                formId="updateAdmissionAuthorization"
                title="Actualizar información de autorización"
                show={showUpdateAuthorizationModal}
                onHide={() => setShowUpdateAuthorizationModal(false)}
            >
                <UpdateAdmissionAuthorizationForm
                    formId="updateAdmissionAuthorization"
                    admissionId={selectedAdmissionId}
                />
            </CustomFormModal>

            <CustomModal
                title="Subir documento adjunto"
                show={showAttachFileModal}
                onHide={() => setShowAttachFileModal(false)}
                footerTemplate={
                    <>
                        <input type="file" accept=".pdf" id="admissionDocumentInput" />
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setShowAttachFileModal(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                handleUploadDocument();
                                setShowAttachFileModal(false);
                            }}
                        >
                            Confirmar
                        </button>
                    </>
                }
            >
                <p>Por favor, seleccione un archivo PDF.</p>
            </CustomModal>

            <CustomModal
                title="Cargar y visualizar resultados de examenes"
                show={showUploadAndVisualizeResultsModal}
                onHide={() => setShowUploadAndVisualizeResultsModal(false)}
            >
                <KoneksiUploadAndVisualizeExamResultsModal
                    admissionId={selectedAdmissionId}
                />
            </CustomModal>
        </div>
    );
};