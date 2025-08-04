import { useState, useEffect } from 'react';
import { auditLogService } from "../../../services/api/index.js";
export const useAuditLogs = getCustomFilters => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [first, setFirst] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const fetchAuditLogs = async (perPage, page = 1, _search = null) => {
    try {
      setLoading(true);
      const data = await auditLogService.getPaginated({
        per_page: perPage,
        page: page,
        search: _search || "",
        ...getCustomFilters?.()
      });
      setAuditLogs(data.data);
      setTotalRecords(data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = page => {
    console.log(page);
    const calculatedPage = Math.floor(page.first / page.rows) + 1;
    setFirst(page.first);
    setPerPage(page.rows);
    setCurrentPage(calculatedPage);
    fetchAuditLogs(page.rows, calculatedPage, search);
  };
  const handleSearchChange = _search => {
    console.log(_search);
    setSearch(_search);
    fetchAuditLogs(perPage, currentPage, _search);
  };
  const refresh = () => fetchAuditLogs(perPage, currentPage, search);
  useEffect(() => {
    console.log("xddddd");
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