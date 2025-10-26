import { useState, useMemo, useCallback } from "react";
import { getSearchableText, sortComparator } from "../utils/ducksUtils";
import { DEFAULT_ROWS_PER_PAGE } from "../constants/ducks";

export const useDucksTable = (rows) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("id");
  const [orderDirection, setOrderDirection] = useState("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  const handleSort = useCallback((property) => {
    setOrderDirection((prev) => 
      orderBy === property && prev === "asc" ? "desc" : "asc"
    );
    setOrderBy(property);
  }, [orderBy]);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;
    const term = searchTerm.toLowerCase();
    return rows.filter((duck) => getSearchableText(duck).includes(term));
  }, [rows, searchTerm]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => 
      sortComparator(a, b, orderBy, orderDirection)
    );
  }, [filteredRows, orderBy, orderDirection]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, page, rowsPerPage]);

  return {
    searchTerm,
    setSearchTerm,
    orderBy,
    orderDirection,
    page,
    rowsPerPage,
    handleSort,
    handleChangePage,
    handleChangeRowsPerPage,
    filteredRows,
    sortedRows,
    paginatedRows,
  };
};