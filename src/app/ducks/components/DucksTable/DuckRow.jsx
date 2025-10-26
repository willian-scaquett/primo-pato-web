import React from "react";
import { TableRow, TableCell, Box, Chip, Tooltip, IconButton } from "@mui/material";
import {
  Edit as EditIcon,
  Assessment as ViewIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { COLORS } from "../../constants/ducks";
import {
  formatDuckTooltip,
  formatDroneTooltip,
  formatLocationTooltip,
  truncateText,
  formatLocation,
} from "../../utils/ducksUtils";

const TooltipCell = ({ tooltip, children }) => (
  <TableCell sx={{ color: COLORS.text.primary, borderBottom: `1px solid ${COLORS.accent.primary}` }}>
    <Tooltip title={tooltip}>
      <span>{children}</span>
    </Tooltip>
  </TableCell>
);

const ActionButton = ({ icon: Icon, onClick, color, tooltip }) => (
  <Tooltip title={tooltip}>
    <span>
      <IconButton size="small" onClick={onClick} sx={{ color }}>
        <Icon />
      </IconButton>
    </span>
  </Tooltip>
);

export const DuckRow = ({ duck, onEdit, onView, onDelete }) => {
  return (
    <TableRow
      sx={{
        "&:hover": { backgroundColor: COLORS.background.secondary },
        borderBottom: `1px solid ${COLORS.accent.primary}`,
      }}
    >
      <TooltipCell tooltip={formatDuckTooltip(duck)}>
        #{duck.id}
      </TooltipCell>

      <TooltipCell tooltip={formatDroneTooltip(duck)}>
        <Chip
          label={truncateText(duck.numeroSerieDrone, 20)}
          sx={{
            backgroundColor: COLORS.accent.primary,
            color: COLORS.background.dark,
            fontWeight: "bold",
          }}
        />
      </TooltipCell>

      <TooltipCell tooltip={formatLocationTooltip(duck)}>
        {formatLocation(duck)}
      </TooltipCell>

      <TooltipCell>
        <Chip
          label={duck.capturado ? "Sim" : "Não"}
          sx={{
            backgroundColor: duck.capturado 
              ? COLORS.accent.primary 
              : COLORS.accent.danger,
            color: duck.capturado 
              ? COLORS.background.dark 
              : COLORS.text.primary,
            fontWeight: "bold",
          }}
        />
      </TooltipCell>

      <TableCell sx={{ borderBottom: `1px solid ${COLORS.accent.primary}` }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <ActionButton
            icon={ViewIcon}
            onClick={() => onView(duck.id)}
            color={COLORS.accent.primary}
            tooltip="Ver classificação"
          />
          <ActionButton
            icon={EditIcon}
            onClick={() => onEdit(duck.id)}
            color={COLORS.text.primary}
            tooltip="Editar"
          />
          <ActionButton
            icon={DeleteIcon}
            onClick={() => onDelete(duck.id)}
            color={COLORS.accent.danger}
            tooltip="Apagar"
          />
        </Box>
      </TableCell>
    </TableRow>
  );
};