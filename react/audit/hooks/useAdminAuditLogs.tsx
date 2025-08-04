import { useState, useEffect } from 'react';
import { auditLogService } from '../../../services/api';

export const useAdminAuditLogs = (getCustomFilters?: () => any) => {
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState<string | null>(null);
    const [totalRecords, setTotalRecords] = useState(0);

    const fetchAuditLogs = async (perPage: number, page = 1, _search: string | null = null) => {
        try {
            setLoading(true);

            const data = await auditLogService.getPaginatedForAdmin({
                per_page: perPage,
                page: page,
                search: _search || "",
                ...getCustomFilters?.(),
            });

            setAuditLogs(
                data.data
            );
            setTotalRecords(data.total);
        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        console.log(page);
        const calculatedPage = Math.floor(page.first / page.rows) + 1
        setFirst(page.first);
        setPerPage(page.rows);
        setCurrentPage(calculatedPage);
        fetchAuditLogs(page.rows, calculatedPage, search);
    };

    const handleSearchChange = (_search: string) => {
        console.log(_search);
        setSearch(_search);
        fetchAuditLogs(perPage, currentPage, _search);
    };

    const refresh = () => fetchAuditLogs(perPage, currentPage, search);

    useEffect(() => {
        fetchAuditLogs(perPage);
    }, []);

    return {
        auditLogs,
        fetchAuditLogs,
        handlePageChange,
        handleSearchChange,
        refresh,
        totalRecords,
        first,
        perPage,
        loading
    };
};