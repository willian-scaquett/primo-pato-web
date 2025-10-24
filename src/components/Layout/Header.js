"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import {
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";

function Header({
  title = "PRIMO PATO",
  showNavigation = true,
  onLogout,
}) {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", mr: 4 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, color: (t) => t.palette.text.primary }}>
            <Button color="inherit" href="/dashboard">
              {title}
            </Button>
          </Typography>
        </Box>

        {/* Navigation */}
        {showNavigation && (
          <Box sx={{ display: "flex", gap: 2, mr: "auto" }}>
            <Button color="inherit" href="/data-registration">
              Registrar
            </Button>
            <Button color="inherit" href="/ducks">
              Controle
            </Button>
            <Button color="inherit" href="/classification">
              Classificar
            </Button>
            <Button color="inherit" href="/drone-control">
              Capturar
            </Button>
          </Box>
        )}

        {/* Right side controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {onLogout && (
            <Button color="inherit" onClick={onLogout} startIcon={<ExitToAppIcon />}>Logout</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export { Header };
