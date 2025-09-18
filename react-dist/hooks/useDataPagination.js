import { useState, useEffect } from "react";
export const useDataPagination = ({
  fetchFunction,
  defaultPerPage = 10,
  defaultPage = 1,
  mapper,
  getCustomFilters
}) => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(defaultPage);
  const [first, setFirst] = useState(0);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [search, setSearch] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [data, setData] = useState([]);
  const fetchData = async (page = currentPage, _perPage = perPage, _search = search) => {
    console.log("fetchData", page, _perPage, _search);
    try {
      setLoading(true);
      const filters = typeof getCustomFilters === 'function' ? getCustomFilters() : {};
      const response = await fetchFunction({
        per_page: _perPage,
        page: page,
        search: _search || "",
        ...filters
      });
      console.log("response", response);
      const items = response.data || [];
      const transformedData = mapper ? items.map(mapper) : items;
      setData(transformedData);
      setTotalRecords(response.total || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = pageEvent => {
    const calculatedPage = Math.floor(pageEvent.first / pageEvent.rows) + 1;
    setFirst(pageEvent.first);
    setPerPage(pageEvent.rows);
    setCurrentPage(calculatedPage);
    fetchData(calculatedPage, pageEvent.rows, search);
  };
  const handleSearchChange = _search => {
    setSearch(_search);
    setCurrentPage(1);
    setFirst(0);
    fetchData(1, perPage, _search);
  };
  const refresh = () => fetchData(currentPage, perPage, search);
  useEffect(() => {
    fetchData(defaultPage, defaultPerPage);
  }, []);
  return {
    data,
    loading,
    currentPage,
    first,
    perPage,
    totalRecords,
    search,
    fetchData,
    handlePageChange,
    handleSearchChange,
    refresh,
    setSearch,
    setCurrentPage,
    setPerPage
  };
};