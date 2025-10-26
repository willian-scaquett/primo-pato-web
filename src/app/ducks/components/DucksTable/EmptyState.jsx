import React from "react";
import { TableRow, TableCell } from "@mui/material";
import { COLORS } from "../../constants/ducks";

export const EmptyState = ({ loading, hasResults }) => {
  if (loading) {
    return (
      <TableRow>
        <TableCell 
          colSpan={5} 
          sx={{ color: COLORS.text.secondary, textAlign: "center", py: 4 }}
        >
          Carregando...
        </TableCell>
      </TableRow>
    );
  }

  if (!hasResults) {
    return (
      <TableRow>
        <TableCell 
          colSpan={5} 
          sx={{ color: COLORS.text.secondary, textAlign: "center", py: 4 }}
        >
          Nenhum pato encontrado.
        </TableCell>
      </TableRow>
    );
  }

  return null;
};
