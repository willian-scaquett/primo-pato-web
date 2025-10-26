import React from "react";
import {
  Table,
  TableBody,
  TableContainer,
  Paper,
  TablePagination,
} from "@mui/material";
import { COLORS, ROWS_PER_PAGE_OPTIONS } from "../../constants/ducks";
import { TableHeader } from "./TableHeader";
import { DuckRow } from "./DuckRow";
import { EmptyState } from "./EmptyState";

export const DucksTable = ({
  rows,
  loading,
  sortedRows,
  paginatedRows,
  orderBy,
  orderDirection,
  page,
  rowsPerPage,
  onSort,
  onChangePage,
  onChangeRowsPerPage,
  onEdit,
  onView,
  onDelete,
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: COLORS.background.primary,
        border: `1px solid ${COLORS.accent.primary}`,
        borderRadius: "12px",
      }}
    >
      <Table>
        <TableHeader
          orderBy={orderBy}
          orderDirection={orderDirection}
          onSort={onSort}
        />

        <TableBody>
          {paginatedRows.map((duck) => (
            <DuckRow
              key={duck.id}
              duck={duck}
              onEdit={onEdit}
              onView={onView}
              onDelete={onDelete}
            />
          ))}

          <EmptyState loading={loading} hasResults={sortedRows.length > 0} />
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={sortedRows.length}
        page={page}
        onPageChange={onChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onChangeRowsPerPage}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        labelRowsPerPage="Registros por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
        }
        sx={{
          color: COLORS.text.primary,
          borderTop: `1px solid ${COLORS.accent.primary}`,
          backgroundColor: COLORS.background.primary,
          ".MuiTablePagination-select": { color: COLORS.text.primary },
          ".MuiTablePagination-selectIcon": { color: COLORS.accent.primary },
          ".MuiTablePagination-actions button": {
            color: COLORS.accent.primary,
            "&.Mui-disabled": { color: COLORS.text.disabled },
          },
          ".MuiTablePagination-displayedRows": { color: COLORS.text.secondary },
        }}
      />
    </TableContainer>
  );
};
