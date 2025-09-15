import React, { useEffect, useState } from "react";
import { CustomPRTable, CustomPRTableColumnProps } from "../components/CustomPRTable";
import { ResolveRequestForm } from "../general-request/components/ResolveRequestForm";
import { SwalManager } from "../../services/alertManagerImported";
import { CustomModal } from "../components/CustomModal";
import { useAdmissions } from "./hooks/useAdmissions";
import { admissionService } from "../../services/api";
import { formatDate } from "../../services/utilidades";

interface TableItem {
    id: string;
    admittedBy: string;
    patientName: string;
    reason: string;
    requestId: string;
    requestableId: string;
    requestedBy: string;
    requestedAt: string;
}

export const AdmissionsPendingCancellation = () => {
    const { admissions, fetchAdmissions, loading, totalRecords } = useAdmissions();

    const [mappedClinicalRecords, setMappedClinicalRecords] = useState<TableItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState<string | null>(null);
    const [showResolveRequestModal, setShowResolveRequestModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<string>("");

    useEffect(() => {
        setMappedClinicalRecords(admissions.map((item: any) => {
            const requestedBy: any = item.latest_pending_cancellation_request?.requested_by;
            const requestedByName = `${requestedBy?.first_name || ''} ${requestedBy?.middle_name || ''} ${requestedBy?.last_name || ''} ${requestedBy?.second_last_name || ''}`.trim();

            return {
                id: item.id,
                admittedBy: `${item.user.first_name || ''} ${item.user.middle_name || ''} ${item.user.last_name || ''} ${item.user.second_last_name || ''}`,
                patientName: `${item.patient.first_name || ''} ${item.patient.middle_name || ''} ${item.patient.last_name || ''} ${item.patient.second_last_name || ''}`,
                reason: item.latest_pending_cancellation_request?.notes || "--",
                requestableId: item.latest_pending_cancellation_request?.requestable_id.toString() || "",
                requestId: item.latest_pending_cancellation_request?.id.toString() || "",
                requestedBy: requestedByName || "--",
                requestedAt: formatDate(item.latest_pending_cancellation_request?.created_at) || "--"
            };
        }));
    }, [admissions]);

    const openResolveRequestModal = (requestId: string) => {

        if (!requestId) {
            SwalManager.error({ text: "No ha sido posible obtener la solicitud", title: "Error" });
            return;
        };
        setSelectedRequestId(requestId);
        setShowResolveRequestModal(true);
    };

    const handlePageChange = (page) => {
        const calculatedPage = Math.floor(page.first / page.rows) + 1
        setFirst(page.first);
        setPerPage(page.rows);
        setCurrentPage(calculatedPage);
        fetchAdmissions({
            per_page: page.rows,
            page: calculatedPage,
            search: search ?? "",
            hasLatestPendingCancellationRequest: "1"
        });
    };

    const handleSearchChange = (_search: string) => {

        setSearch(_search);
        fetchAdmissions({
            per_page: perPage,
            page: currentPage,
            search: _search,
            hasLatestPendingCancellationRequest: "1"
        });
    };

    const refresh = () => fetchAdmissions({
        per_page: perPage,
        page: currentPage,
        search: search ?? "",
        hasLatestPendingCancellationRequest: "1"
    });

    const handleSave = (data: any) => {
        setShowResolveRequestModal(false);
        refresh();
    };

    const openRequestable = async (requestableId: string) => {
        const admission = await admissionService.get(requestableId);
        //@ts-ignore
        generateInvoice(admission.appointment_id);
    };

    const columns: CustomPRTableColumnProps[] = [
        { field: "admittedBy", header: "Admitido por" },
        { field: "patientName", header: "Paciente" },
        { field: "requestedBy", header: "Solicitado por" },
        { field: "requestedAt", header: "Solicitado el" },
        { field: "reason", header: "Razón de la anulación" },
        {
            field: "", header: "", body: (rowData: TableItem) => <>
                <button className="btn btn-link" onClick={() => openRequestable(rowData.requestableId)}>
                    <i
                        className="fs-7 fa-solid fa-eye cursor-pointer"
                        title="Ver historia clinica"
                    ></i>
                </button>
                <button className="btn btn-link" onClick={() => openResolveRequestModal(rowData.requestId)}>
                    <i
                        className="fs-7 fa-solid fa-file-signature cursor-pointer"
                        title="Resolver solicitud"
                    ></i>
                </button>
            </>
        },
    ];

    return (
        <>
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
            >
            </CustomPRTable>
            <CustomModal
                show={showResolveRequestModal}
                onHide={() => setShowResolveRequestModal(false)}
                title="Resolver solicitud">
                <ResolveRequestForm
                    requestId={selectedRequestId}
                    onSave={handleSave}
                />
            </CustomModal>
        </>
    );
}