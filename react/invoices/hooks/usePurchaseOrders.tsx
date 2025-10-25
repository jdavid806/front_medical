import { useState, useEffect } from 'react';
import PurchaseOrderService from '../../../services/api/classes/purchaseOrderService';
import { DataTableStateEvent } from 'primereact/datatable';

export const usePurchaseOrders = (getCustomFilters?: () => any) => {
    const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
    const [loadingPurchaseOrders, setLoadingPurchaseOrders] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [first, setFirst] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState<string | null>(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null | undefined>(null);

    const fetchPurchaseOrders = async (perPage: number, page = 1, _search: string | null = null) => {
        try {
            setLoadingPurchaseOrders(true);

            const service = new PurchaseOrderService()
            const data = await service.filter({
                per_page: perPage,
                page: page,
                search: _search || "",
                ...getCustomFilters?.(),
                ...getSort()
            });

            setPurchaseOrders(
                data.data
            );
            setTotalRecords(data.total);
        } catch (error) {
            console.error(error);
        }
        finally {
            setLoadingPurchaseOrders(false);
        }
    };

    const getSort = () => {
        const direction = sortOrder === 1 ? '' : '-';
        return {
            sort: `${direction}${sortField}`
        }
    };

    const handleSortChange = (ev: DataTableStateEvent) => {
        setSortField(ev.sortField);
        setSortOrder(ev.sortOrder);
    };

    const handlePageChange = (page: DataTableStateEvent) => {
        const calculatedPage = Math.floor(page.first / page.rows) + 1
        setFirst(page.first);
        setPerPage(page.rows);
        setCurrentPage(calculatedPage);
    };

    const handleSearchChange = (_search: string) => {
        setSearch(_search);
        fetchPurchaseOrders(perPage, currentPage, _search);
    };

    const refresh = () => fetchPurchaseOrders(perPage, currentPage, search);

    useEffect(() => {
        fetchPurchaseOrders(perPage, currentPage, search);
    }, [perPage, currentPage, search, sortField, sortOrder]);

    return {
        purchaseOrders,
        fetchPurchaseOrders,
        handlePageChange,
        handleSortChange,
        handleSearchChange,
        refresh,
        totalRecords,
        first,
        perPage,
        loadingPurchaseOrders,
        sortField,
        sortOrder
    };
};