import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export const DuckSelector = ({ ducks, selectedDuck, onChange }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <FormControl fullWidth sx={{ maxWidth: 480 }}>
        <InputLabel>Pato Primordial</InputLabel>
        <Select
          value={selectedDuck}
          onChange={(e) => onChange(e.target.value)}
          label="Pato Primordial"
        >
          <MenuItem value="">Selecione o pato primordial</MenuItem>
          {ducks.map((d) => (
            <MenuItem key={d.id} value={String(d.id)}>
              {`Pato #${d.id}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};