import { ConfigColumns } from 'datatables.net-bs5';
import React, { useState } from 'react';
import { useEffect } from 'react';
import CustomDataTable from '../components/CustomDataTable';
import { formatDate } from '../../services/utilidades';
import TableActionsWrapper from '../components/table-actions/TableActionsWrapper';
import { SwalManager } from '../../services/alertManagerImported';
import { cancelConsultationClaim } from '../../services/koneksiService';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { useUsers } from '../users/hooks/useUsers';
import { usePatients } from '../patients/hooks/usePatients';
import { useEntities } from '../entities/hooks/useEntities';
import { Nullable } from 'primereact/ts-helpers';
import { CustomFormModal } from '../components/CustomFormModal';
import { UpdateAdmissionAuthorizationForm } from './UpdateAdmissionAuthorizationForm';
import { CustomModal } from '../components/CustomModal';
import { admissionService, patientService } from '../../services/api';
import { CustomPRTable, CustomPRTableColumnProps } from '../components/CustomPRTable';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Patient } from '../models/models';
import { useDebounce } from 'primereact/hooks';
import { RequestCancellationTableAction } from '../components/table-actions/RequestCancellationTableAction';
import { clinicalRecordStateColors, clinicalRecordStates } from '../../services/commons';
import { KoneksiUploadAndVisualizeExamResultsModal } from './KoneksiUploadAndVisualizeExamResultsModal';
import { exportToExcel } from '../accounting/utils/ExportToExcelOptions';

export interface AdmissionTableFilters {
    selectedDate: Nullable<(Date | null)[]>;
    selectedEntity: string | null;
    selectedPatient: string | null;
    selectedAdmittedBy: string | null;
}

interface AdmissionTableProps {
    items: any[],
    onCancelItem?: (id: string) => void;
    lazy?: boolean
    totalRecords?: number
    first?: number
    rows?: number
    loading?: boolean
    onReload?: () => void
    onPage?: (event: any) => void
    onSearch?: (event: any) => void
    handleFilter?: (event: AdmissionTableFilters) => void
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
    handleFilter
}) => {

    const { users } = useUsers();
    const { entities } = useEntities();

    const [tableItems, setTableItems] = useState<AdmissionTableItem[]>([]);
    const [selectedAdmittedBy, setSelectedAdmittedBy] = useState<string | null>(null);
    const [patientSearch, debouncedPatientSearch, setPatientSearch] = useDebounce<string | null>(null, 500);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = React.useState<Nullable<(Date | null)[]>>([new Date(), new Date()]);
    const [selectedAdmissionId, setSelectedAdmissionId] = useState<string>('');
    const [patients, setPatients] = useState<Patient[]>([]);

    const [showUpdateAuthorizationModal, setShowUpdateAuthorizationModal] = useState(false);
    const [showUploadAndVisualizeResultsModal, setShowUploadAndVisualizeResultsModal] = useState(false);

    const [showAttachFileModal, setShowAttachFileModal] = useState(false);

    const onFilter = () => {
        const filterValues: AdmissionTableFilters = {
            selectedAdmittedBy,
            selectedPatient: selectedPatient?.id?.toString() || null,
            selectedEntity,
            selectedDate
        };
        handleFilter && handleFilter(filterValues);
    };

    useEffect(() => {
        onFilter();
    }, []);

    useEffect(() => {
        const mappedItems: any[] = items.map(item => {
            return {
                id: item.id,
                createdAt: formatDate(item.created_at),
                admittedBy: `${item.user.first_name || ''} ${item.user.middle_name || ''} ${item.user.last_name || ''} ${item.user.second_last_name || ''}`,
                patientName: `${item.patient.first_name || ''} ${item.patient.middle_name || ''} ${item.patient.last_name || ''} ${item.patient.second_last_name || ''}`,
                entityName: item.entity?.name || '--',
                koneksiClaimId: item.koneksi_claim_id,
                patientDNI: item.patient.document_number || '--',
                authorizationNumber: item.authorization_number || '--',
                authorizedAmount: item.entity_authorized_amount || '0.00',
                originalItem: item,
                status: item.status
            }
        })
        setTableItems(mappedItems);
    }, [items])

    const columns: CustomPRTableColumnProps[] = [
        { header: 'Admisionado el', field: 'createdAt', },
        { header: 'Admisionado por', field: 'admittedBy', },
        { header: 'Paciente', field: 'patientName', },
        { header: 'Número de identificación', field: 'patientDNI', },
        { header: 'Entidad', field: 'entityName', },
        { header: 'Número de autorización', field: 'authorizationNumber', },
        { header: 'Monto autorizado', field: 'authorizedAmount' },
        {
            field: "status", header: "Estado", body: (data: AdmissionTableItem) => {
                const color = clinicalRecordStateColors[data.status] || "secondary";
                const text = clinicalRecordStates[data.status] || "SIN ESTADO";
                return (<>
                    <span className={`badge badge-phoenix badge-phoenix-${color}`}>
                        {text}
                    </span>
                </>)
            }
        },
        {
            header: '', field: '', body: (data: AdmissionTableItem) => <>
                <TableActionsWrapper>
                    <li>
                        <a className="dropdown-item" href="#" onClick={() => openUpdateAuthorizationModal(data.originalItem.id)}>
                            <div className="d-flex gap-2 align-items-center">
                                <i className="fa-solid fa-pencil" style={{ width: '20px' }}></i>
                                <span>Actualizar información de autorización</span>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#" onClick={async () => {
                            //@ts-ignore
                            await generateInvoice(data.originalItem.appointment_id, false);
                        }}>
                            <div className="d-flex gap-2 align-items-center">
                                <i className="fa-solid fa-receipt" style={{ width: '20px' }}></i>
                                <span>Imprimir factura</span>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#" onClick={async () => {
                            //@ts-ignore
                            await generateInvoice(data.originalItem.appointment_id, true);
                        }}>
                            <div className="d-flex gap-2 align-items-center">
                                <i className="fa-solid fa-receipt" style={{ width: '20px' }}></i>
                                <span>Descargar factura</span>
                            </div>
                        </a>
                    </li>
                    {!data.originalItem.document_minio_id &&
                        <li>
                            <a className="dropdown-item" href="#" onClick={() => openAttachDocumentModal(data.originalItem.id)}>
                                <div className="d-flex gap-2 align-items-center">
                                    <i className="fa-solid fa-file-pdf" style={{ width: '20px' }}></i>
                                    <span>Adjuntar documento</span>
                                </div>
                            </a>
                        </li>
                    }
                    {data.originalItem.document_minio_id &&
                        <li>
                            <a className="dropdown-item" href="#" onClick={() => seeDocument(data.originalItem.document_minio_id)}>
                                <div className="d-flex gap-2 align-items-center">
                                    <i className="fa-solid fa-file-pdf" style={{ width: '20px' }}></i>
                                    <span>Ver documento adjunto</span>
                                </div>
                            </a>
                        </li>
                    }
                    {data.koneksiClaimId &&
                        <>
                            <li>
                                <a className="dropdown-item" href="#" onClick={() => openUploadAndVisualizeResultsModal(data.id!)}>
                                    <div className="d-flex gap-2 align-items-center">
                                        <i className="fa-solid fa-file-medical" style={{ width: '20px' }}></i>
                                        <span>Cargar y visualizar resultados de examenes</span>
                                    </div>
                                </a>
                            </li>

                            <li>
                                <a className="dropdown-item" href="#" onClick={() => cancelClaim(data.koneksiClaimId!)}>
                                    <div className="d-flex gap-2 align-items-center">
                                        <i className="fa-solid fa-ban" style={{ width: '20px' }}></i>
                                        <span>Anular reclamación</span>
                                    </div>
                                </a>
                            </li>


                        </>
                    }
                    <RequestCancellationTableAction
                        onTrigger={() => onCancelItem && onCancelItem(data.originalItem.id)}
                    />
                </TableActionsWrapper>
            </>
        },
    ]

    const cancelClaim = (claimId: string) => {
        //console.log('Cancel claim with ID:', claimId);
        SwalManager.confirmCancel(
            async () => {

                try {

                    const response = await cancelConsultationClaim(claimId)

                    //console.log(response);

                    SwalManager.success({
                        title: 'Éxito',
                        text: 'Reclamación anulada con éxito.'
                    })

                } catch (error) {

                    SwalManager.error({
                        title: 'Error',
                        text: 'No se pudo anular la reclamación.'
                    })
                }
            }
        )
    }

    const openUploadAndVisualizeResultsModal = (admissionId: string) => {
        //console.log('Open update authorization modal with admission ID:', admissionId);
        setSelectedAdmissionId(admissionId);
        setShowUploadAndVisualizeResultsModal(true);
    }

    const openUpdateAuthorizationModal = (admissionId: string) => {
        //console.log('Open update authorization modal with admission ID:', admissionId);
        setSelectedAdmissionId(admissionId);
        setShowUpdateAuthorizationModal(true);
    }

    const openAttachDocumentModal = async (admissionId: string) => {
        setSelectedAdmissionId(admissionId);
        setShowAttachFileModal(true);
    }

    const handleUploadDocument = async () => {
        try {
            //@ts-ignore
            const minioId = await guardarDocumentoAdmision('admissionDocumentInput', selectedAdmissionId);

            if (minioId !== undefined) {
                //console.log("PDF de prueba:", minioId);
                //console.log("Resultado de la promesa:", minioId);
                await admissionService.update(selectedAdmissionId, {
                    document_minio_id: minioId.toString()
                });
                SwalManager.success({ text: "Resultados guardados exitosamente" });
            } else {
                console.error("No se obtuvo un resultado válido.");
            }
        } catch (error) {
            console.error("Error al guardar el archivo:", error);
        } finally {
            setShowAttachFileModal(false);
            onReload && onReload()
        }
    }

    const seeDocument = async (minioId: string) => {
        if (minioId) {
            //@ts-ignore
            const url = await getFileUrl(minioId);
            window.open(url, '_blank');
            return;
        }

        SwalManager.error({
            title: 'Error',
            text: 'No se pudo visualizar el documento adjunto.'
        })
    }

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
        onFilter()
    }, [selectedAdmittedBy, selectedPatient, selectedEntity, selectedDate])

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
                            Filtrar admisiones
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
                                                    setSelectedDate(e.value)
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
                                                    setSelectedAdmittedBy(e.value)
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
                                                    setPatientSearch(e.value)
                                                }}
                                                onSelect={(e) => {
                                                    setSelectedPatient(e.value)
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
                                                    setSelectedEntity(e.value)
                                                }}
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
            <div className="card mb-3">
                <div className="card-body">
                    <div className="d-flex justify-content-end">
                        <button
                            className="btn btn-primary me-2"
                            onClick={() => {
                                exportToExcel({
                                    data: tableItems, // Pasamos la factura como un array de un elemento
                                    fileName: `Admisiones`,
                                    excludeColumns: ["id"], // Excluimos campos que no queremos mostrar
                                })
                            }}
                        >
                            <i className="fa-solid fa-file-excel me-2"></i>
                            Exportar a Excel
                        </button>
                    </div>
                    <CustomPRTable
                        columns={columns}
                        data={tableItems}
                        lazy
                        first={first}
                        rows={rows}
                        totalRecords={totalRecords}
                        loading={loading}
                        onPage={onPage}
                        onSearch={onSearch}
                        onReload={onReload}
                    >
                    </CustomPRTable>
                </div>
            </div>
            <CustomFormModal
                formId='updateAdmissionAuthorization'
                title='Actualizar información de autorización'
                show={showUpdateAuthorizationModal}
                onHide={() => setShowUpdateAuthorizationModal(false)}
            >
                <UpdateAdmissionAuthorizationForm formId='updateAdmissionAuthorization' admissionId={selectedAdmissionId} />
            </CustomFormModal>
            <CustomModal
                title='Subir documento adjunto'
                show={showAttachFileModal}
                onHide={() => setShowAttachFileModal(false)}
                footerTemplate={<>
                    <input
                        type="file"
                        accept=".pdf"
                        id="admissionDocumentInput"
                    />
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
                </>}
            >
                <p>Por favor, seleccione un archivo PDF.</p>
            </CustomModal>
            <CustomModal
                title='Cargar y visualizar resultados de examenes'
                show={showUploadAndVisualizeResultsModal}
                onHide={() => setShowUploadAndVisualizeResultsModal(false)}
            >
                <KoneksiUploadAndVisualizeExamResultsModal admissionId={selectedAdmissionId} />
            </CustomModal>
        </>
    )
};

