import React, { useEffect, useState } from "react";
import { useRequests } from "../hooks/useRequests";
import { GeneralRequestDto } from "../../models/models";
import { CustomPRTable, CustomPRTableColumnProps } from "../../components/CustomPRTable";
import { formatDate } from "../../../services/utilidades";
import { generalRequestStateColors, generalRequestStates } from "../../../services/commons";

interface TableItem {
    id: string;
    reason: string;
    requestId: string;
    requestedBy: string;
    requestedAt: string;
    solvedBy: string;
    solvedAt: string;
    resolutionNotes: string;
    description: string;
    status: string;
}

export const SolvedRequestsTable = () => {
    const { requests, fetchRequests, loading, totalRecords } = useRequests();

    const [mappedRequests, setMappedRequests] = useState<TableItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState<string | null>(null);

    const getDescription = (requestableType: string, type: string) => {
        const map = {
            "clinical_record": {
                "cancellation": "Cancelación de historia clinica",
            },
            "admission": {
                "cancellation": "Cancelación de factura",
            }
        };

        return map[requestableType][type];
    }

    useEffect(() => {
        setMappedRequests(requests.map((item: GeneralRequestDto) => {
            const requestedBy: any = item.requested_by;
            const requestedByName = `${requestedBy?.first_name || ''} ${requestedBy?.middle_name || ''} ${requestedBy?.last_name || ''} ${requestedBy?.second_last_name || ''}`.trim();

            const resolvedBy: any = item.resolved_by;
            const resolvedByName = `${resolvedBy?.first_name || ''} ${resolvedBy?.middle_name || ''} ${resolvedBy?.last_name || ''} ${resolvedBy?.second_last_name || ''}`.trim();

            return {
                id: item.id.toString(),
                reason: item.notes || "--",
                requestId: item.id.toString() || "",
                requestedBy: requestedByName || "--",
                requestedAt: formatDate(item.created_at) || "--",
                solvedBy: resolvedByName || "--",
                solvedAt: item.resolved_at || "--",
                resolutionNotes: item.resolution_notes || "--",
                description: getDescription(item.requestable_type, item.type),
                status: item.status
            };
        }));
    }, [requests]);

    const handlePageChange = (page) => {
        console.log(page);
        const calculatedPage = Math.floor(page.first / page.rows) + 1
        setFirst(page.first);
        setPerPage(page.rows);
        setCurrentPage(calculatedPage);
        fetchRequests({
            per_page: page.rows,
            page: calculatedPage,
            search: search ?? ""
        });
    };

    const handleSearchChange = (_search: string) => {
        console.log(_search);

        setSearch(_search);
        fetchRequests({
            per_page: perPage,
            page: currentPage,
            search: _search
        });
    };

    const refresh = () => fetchRequests({
        per_page: perPage,
        page: currentPage,
        search: search ?? ""
    });

    const columns: CustomPRTableColumnProps[] = [
        { field: "description", header: "Tipo de solicitud" },
        { field: "requestedBy", header: "Solicitado por" },
        { field: "requestedAt", header: "Solicitado el" },
        { field: "reason", header: "Razón de la anulación" },
        { field: "solvedBy", header: "Resuelto por" },
        { field: "solvedAt", header: "Resuelto el" },
        { field: "resolutionNotes", header: "Observaciones" },
        {
            field: "status", header: "Estado", body: (data: TableItem) => {
                const color = generalRequestStateColors[data.status] || "secondary";
                const text = generalRequestStates[data.status] || "SIN ESTADO";
                return (<>
                    <span className={`badge badge-phoenix badge-phoenix-${color}`}>
                        {text}
                    </span>
                </>)
            }
        },
    ];

    return (
        <>

            <div
                className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
                style={{ minHeight: "400px" }}
            >
                <div className="card-body h-100 w-100 d-flex flex-column">
                    <CustomPRTable
                        columns={columns}
                        data={mappedRequests}
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

        </>
    );
}