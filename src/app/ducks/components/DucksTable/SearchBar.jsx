import React from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { COLORS } from "../../constants/ducks";

export const SearchBar = ({ value, onChange }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
      <TextField
        placeholder="Digite o que você procura"
        variant="outlined"
        size="small"
        fullWidth
        value={value}
        onChange={onChange}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: COLORS.accent.primary }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          input: { color: COLORS.text.primary },
          label: { color: COLORS.text.secondary },
          backgroundColor: COLORS.background.secondary,
          borderRadius: 1,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: COLORS.accent.primary,
          },
        }}
      />
    </Box>
  );
};