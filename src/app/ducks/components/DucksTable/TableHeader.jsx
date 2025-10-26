import React from "react";
import { TableHead, TableRow, TableCell, TableSortLabel } from "@mui/material";
import { TABLE_COLUMNS, COLORS } from "../../constants/ducks";

export const TableHeader = ({ orderBy, orderDirection, onSort }) => {
  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: COLORS.background.secondary }}>
        {TABLE_COLUMNS.map((col) => (
          <TableCell
            key={col.id}
            sortDirection={orderBy === col.id ? orderDirection : false}
            sx={{
              color: COLORS.text.primary,
              fontWeight: "bold",
              borderBottom: `1px solid ${COLORS.accent.primary}`,
              cursor: "pointer",
            }}
            onClick={() => onSort(col.id)}
          >
            <TableSortLabel
              active={orderBy === col.id}
              direction={orderBy === col.id ? orderDirection : "asc"}
              sx={{
                color: `${COLORS.text.primary} !important`,
                "&.Mui-active": { color: `${COLORS.accent.primary} !important` },
              }}
            >
              {col.label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell
          sx={{
            color: COLORS.text.primary,
            fontWeight: "bold",
            borderBottom: `1px solid ${COLORS.accent.primary}`,
          }}
        >
          AÇÕES
        </TableCell>
      </TableRow>
    </TableHead>
  );
};