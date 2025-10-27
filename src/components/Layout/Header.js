"use client";

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  ExitToApp as ExitToAppIcon,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import Image from "next/image";
import { eu, mudarSenha, apagarUsuario } from "../../lib/apiClient";

function Header({ showNavigation = true, onLogout }) {

  const [anchorNav, setAnchorNav] = useState(null);
  const [anchorUser, setAnchorUser] = useState(null);
  const [accountExpanded, setAccountExpanded] = useState(false);
  const [userName, setUserName] = useState("U");

  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnack = (message, severity = "success") =>
    setSnack({ open: true, message, severity });

  const handleSnackClose = () =>
    setSnack((prev) => ({ ...prev, open: false }));

  const handleOpenNavMenu = (event) => setAnchorNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorNav(null);

  const handleOpenUserMenu = (event) => setAnchorUser(event.currentTarget);
  const handleCloseUserMenu = () => {
    setAnchorUser(null);
    setAccountExpanded(false);
  };

  useEffect(() => {
    eu().then((response) => setUserName(response.message));
  }, []);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword)
      return showSnack("Preencha todos os campos.", "warning");
    if (newPassword !== confirmPassword)
      return showSnack("As novas senhas não coincidem.", "error");

    try {
      setLoading(true);
      await mudarSenha({ senhaAtual: currentPassword, senhaNova: newPassword });
      showSnack("Senha alterada com sucesso!");
      setOpenPasswordDialog(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      showSnack("Erro ao mudar senha. Verifique os dados e tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await apagarUsuario();
      showSnack("Conta apagada com sucesso!");
      if (onLogout) onLogout();
    } catch {
      showSnack("Erro ao apagar conta. Tente novamente.", "error");
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", mr: 4 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 0, color: (t) => t.palette.text.primary }}
            >
              <Button color="inherit" href="/dashboard">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={36}
                  height={36}
                  priority
                />
              </Button>
            </Typography>
          </Box>

          {showNavigation && (
            <>
              <Box
                sx={{ display: { xs: "none", md: "flex" }, gap: 2, mr: "auto" }}
              >
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
                <Button color="inherit" href="/about">
                  Sobre
                </Button>
              </Box>

              <Box sx={{ display: { xs: "flex", md: "none" }, mr: "auto" }}>
                <IconButton color="inherit" onClick={handleOpenNavMenu}>
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorNav}
                  open={Boolean(anchorNav)}
                  onClose={handleCloseNavMenu}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                >
                  <MenuItem component="a" href="/data-registration">
                    Registrar
                  </MenuItem>
                  <MenuItem component="a" href="/ducks">
                    Controle
                  </MenuItem>
                  <MenuItem component="a" href="/classification">
                    Classificar
                  </MenuItem>
                  <MenuItem component="a" href="/drone-control">
                    Capturar
                  </MenuItem>
                  <MenuItem component="a" href="/about">
                    Sobre
                  </MenuItem>
                </Menu>
              </Box>
            </>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: "#00E0B7", color: "#0A1C1C" }}>
                {userName?.substring(0, 1)}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorUser}
              open={Boolean(anchorUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={() => setAccountExpanded((prev) => !prev)}>
                Minha Conta
                {accountExpanded ? (
                  <ExpandLess sx={{ ml: "auto" }} />
                ) : (
                  <ExpandMore sx={{ ml: "auto" }} />
                )}
              </MenuItem>

              <Collapse in={accountExpanded} timeout="auto" unmountOnExit>
                <Box sx={{ pl: 4 }}>
                  <MenuItem onClick={() => setOpenPasswordDialog(true)}>
                    Mudar Senha
                  </MenuItem>
                  <MenuItem onClick={() => setOpenDeleteDialog(true)}>
                    Apagar Conta
                  </MenuItem>
                </Box>
              </Collapse>

              {onLogout && (
                <MenuItem onClick={onLogout}>
                  <ExitToAppIcon fontSize="small" sx={{ mr: 1 }} /> Logout
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
      >
        <DialogTitle>Mudar Senha</DialogTitle>
        <DialogContent>
          <TextField
            label="Senha Atual"
            type="password"
            fullWidth
            margin="dense"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            label="Nova Senha"
            type="password"
            fullWidth
            margin="dense"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirmar Nova Senha"
            type="password"
            fullWidth
            margin="dense"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            sx={{
              backgroundColor: "#00E0B7",
              color: "#0A1C1C",
              "&:hover": { backgroundColor: "#00bfa1" },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          Vai mesmo apagar a conta? :( Todos os seus patos serão perdidos. Que história
          sobre salvar o mundo você contará para os seus netos?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            sx={{
              backgroundColor: "#FF6B6B",
              color: "#fff",
              "&:hover": { backgroundColor: "#ff4c4c" },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "SIM!"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackClose}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export { Header };
