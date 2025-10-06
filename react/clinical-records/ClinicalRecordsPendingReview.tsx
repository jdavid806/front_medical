import React, { useEffect, useState } from "react";
import { PatientClinicalRecordDto } from "../models/models";
import { CustomPRTable, CustomPRTableColumnProps } from "../components/CustomPRTable";
import { SwalManager } from "../../services/alertManagerImported";
import { formatDate } from "../../services/utilidades";
import { Dialog } from "primereact/dialog";
import { useClinicalRecordsPendingReview } from "./hooks/useClinicalRecordsPendingReview";
import { ResolveClinicalRecordReviewRequestForm } from "../general-request/components/ResolveClinicalRecordReviewRequestForm";
import { VerifySupervisorForm } from "../users/VerifySupervisorForm";
import { usePRToast } from "../hooks/usePRToast";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";

interface TableItem {
    id: string;
    clinicalRecordName: string;
    patientName: string;
    doctorName: string;
    reason: string;
    requestId: string;
    requestableId: string;
    requestedBy: string;
    requestedAt: string;
}

export const ClinicalRecordsPendingReview = () => {
    const { clinicalRecords, fetchClinicalRecords, loading, totalRecords } = useClinicalRecordsPendingReview();
    const { showErrorToast, toast } = usePRToast()

    const [mappedClinicalRecords, setMappedClinicalRecords] = useState<TableItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState<string | null>(null);
    const [showResolveRequestModal, setShowResolveRequestModal] = useState(false);
    const [showVerifySupervisorModal, setShowVerifySupervisorModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<string>("");

    useEffect(() => {
        setMappedClinicalRecords(clinicalRecords.map((item: PatientClinicalRecordDto) => {
            const requestedBy: any = item.latest_pending_review_request?.requested_by;
            const requestedByName = `${requestedBy?.first_name || ''} ${requestedBy?.middle_name || ''} ${requestedBy?.last_name || ''} ${requestedBy?.second_last_name || ''}`.trim();

            return {
                id: item.id,
                clinicalRecordName: item.clinical_record_type.name || "--",
                patientName: `${item.patient.first_name || ''} ${item.patient.middle_name || ''} ${item.patient.last_name || ''} ${item.patient.second_last_name || ''}`.trim(),
                doctorName: `${item.created_by_user.first_name || ''} ${item.created_by_user.middle_name || ''} ${item.created_by_user.last_name || ''} ${item.created_by_user.second_last_name || ''}`.trim(),
                reason: item.latest_pending_review_request?.notes || "--",
                requestableId: item.latest_pending_review_request?.requestable_id.toString() || "",
                requestId: item.latest_pending_review_request?.id.toString() || "",
                requestedBy: requestedByName || "--",
                requestedAt: formatDate(item.latest_pending_review_request?.created_at) || "--"
            };
        }));
    }, [clinicalRecords]);

    const handlePageChange = (page) => {
        console.log(page);
        const calculatedPage = Math.floor(page.first / page.rows) + 1
        setFirst(page.first);
        setPerPage(page.rows);
        setCurrentPage(calculatedPage);
        fetchClinicalRecords({
            per_page: page.rows,
            page: calculatedPage,
            search: search ?? "",
            hasLatestPendingReviewRequest: "1"
        });
    };

    const handleSearchChange = (_search: string) => {
        console.log(_search);

        setSearch(_search);
        fetchClinicalRecords({
            per_page: perPage,
            page: currentPage,
            search: _search,
            hasLatestPendingReviewRequest: "1"
        });
    };

    const refresh = () => fetchClinicalRecords({
        per_page: perPage,
        page: currentPage,
        search: search ?? "",
        hasLatestPendingReviewRequest: "1"
    });

    const handleSave = (data: any) => {
        console.log(data);
        setShowResolveRequestModal(false);
        refresh();
    };

    const openRequestable = (requestableId: string) => {
        //@ts-ignore
        crearDocumento(requestableId, "Impresion", "Consulta", "Completa", "Historia Clinica");
    };

    const openVerifySupervisorModal = (requestId: string) => {
        setSelectedRequestId(requestId);
        setShowVerifySupervisorModal(true);
    };

    const columns: CustomPRTableColumnProps[] = [
        { field: "clinicalRecordName", header: "Historia Clinica" },
        { field: "patientName", header: "Paciente" },
        { field: "doctorName", header: "Doctor(a)" },
        { field: "requestedBy", header: "Solicitado por" },
        { field: "requestedAt", header: "Solicitado el" },
        {
            field: "", header: "", body: (rowData: TableItem) => <>
                <button className="btn btn-link" onClick={() => openRequestable(rowData.requestableId)}>
                    <i
                        className="fs-7 fa-solid fa-eye cursor-pointer"
                        title="Ver historia clinica"
                    ></i>
                </button>
                <button className="btn btn-link" onClick={() => openVerifySupervisorModal(rowData.requestId)}>
                    <i
                        className="fs-7 fa-solid fa-file-signature cursor-pointer"
                        title="Resolver solicitud"
                    ></i>
                </button>
            </>
        },
    ];

    const handleVerifySupervisor = (result: boolean) => {
        if (!result) {
            showErrorToast({
                title: "Error de verificación",
                message: "No ha sido posible verificar la identidad del supervisor"
            });
            return;
        }
        setShowVerifySupervisorModal(false);
        setShowResolveRequestModal(true);
    };

    return (
        <>
            <Toast ref={toast} />
            <div
                className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
                style={{ minHeight: "400px" }}
            >
                <div className="card-body h-100 w-100 d-flex flex-column">
                    <CustomPRTable
                        columns={columns}
                        data={mappedClinicalRecords}
                        lazy
                        first={first}
                        rows={perPage}
                        totalRecords={totalRecords}
                        loading={loading}
                        onPage={handlePageChange}
                        onSearch={handleSearchChange}
                        onReload={refresh}
                    />
                </div>
            </div>

            <Dialog
                visible={showVerifySupervisorModal}
                onHide={() => setShowVerifySupervisorModal(false)}
                header="Verificar supervisor">
                <VerifySupervisorForm onVerify={handleVerifySupervisor} />
            </Dialog>

            <Dialog
                visible={showResolveRequestModal}
                onHide={() => setShowResolveRequestModal(false)}
                header="Resolver solicitud">

                <Divider />
                <ResolveClinicalRecordReviewRequestForm
                    requestId={selectedRequestId}
                    onSave={handleSave}
                />
            </Dialog>
        </>
    );
}