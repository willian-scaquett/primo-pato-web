"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  TablePagination,
  Tooltip,
  TextField,
  TableSortLabel,
  InputAdornment,
} from "@mui/material";
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Layout } from "../../components/Layout/Layout";
import { buscarPatos, apagarPato } from "../../lib/apiClient";
import { useRouter } from "next/navigation";

function DucksPage() {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("id");
  const [orderDirection, setOrderDirection] = useState("desc");

  const load = async () => {
    setLoading(true);
    try {
      const data = await buscarPatos();
      const arr = Array.isArray(data) ? data : [];
      setRows(arr);
    } catch (e) {
      setSnack({ open: true, message: e.message || "Falha ao carregar patos", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleEdit = (id) => router.push(`/ducks/${id}/edit`);
  const handleView = (id) => router.push(`/classification?id=${id}`);
  const handleDelete = (id) => setConfirm({ open: true, id });

  const doDelete = async () => {
    const id = confirm.id;
    try {
      await apagarPato(id);
      setSnack({ open: true, message: "Pato excluído com sucesso.", severity: "success" });
      setConfirm({ open: false, id: null });
      load();
    } catch (e) {
      setSnack({ open: true, message: e.message || "Falha ao excluir pato.", severity: "error" });
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredRows = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return rows.filter((duck) =>
      [duck.id, duck.numeroSerieDrone, duck.pais, duck.estado, duck.cidade, duck.capturado ? "Sim" : "Não"]
        .join(" ")
        .toLowerCase()
        .includes(term.toLowerCase())
    );
  }, [rows, searchTerm]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      if (aValue === undefined || bValue === undefined) return 0;

      if (typeof aValue === "number" && typeof bValue === "number") {
        return orderDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return orderDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [filteredRows, orderBy, orderDirection]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1, color: "#FFFFFF" }}>
          Controle de Patos
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "#B0B0B0" }}>
          Visualize, edite ou apague as informações dos patos primordiais cadastrados.
        </Typography>

        {/* Busca */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
      <TextField
        placeholder="Digite o que você procura"
        variant="outlined"
        size="small"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: "#00E0B7" }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          input: { color: "#FFFFFF" },
          label: { color: "#B0B0B0" },
          backgroundColor: "#2A3C3C",
          borderRadius: 1,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#00E0B7",
          },
        }}
      />
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "#1A2C2C",
            border: "1px solid #00E0B7",
            borderRadius: "12px",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#2A3C3C" }}>
                {[
                  { id: "id", label: "ID" },
                  { id: "numeroSerieDrone", label: "DRONE" },
                  { id: "cidade", label: "LOCAL" },
                  { id: "capturado", label: "CAPTURADO" },
                ].map((col) => (
                  <TableCell
                    key={col.id}
                    sortDirection={orderBy === col.id ? orderDirection : false}
                    sx={{
                      color: "#FFFFFF",
                      fontWeight: "bold",
                      borderBottom: "1px solid #00E0B7",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSort(col.id)}
                  >
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? orderDirection : "asc"}
                      sx={{
                        color: "#FFFFFF !important",
                        "&.Mui-active": { color: "#00E0B7 !important" },
                      }}
                    >
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: "bold",
                    borderBottom: "1px solid #00E0B7",
                  }}
                >
                  AÇÕES
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedRows.map((duck) => (
                <TableRow
                  key={duck.id}
                  sx={{
                    "&:hover": { backgroundColor: "#2A3C3C" },
                    borderBottom: "1px solid #00E0B7",
                  }}
                >
                  {/* ID */}
                  <TableCell sx={{ color: "#FFFFFF", borderBottom: "1px solid #00E0B7" }}>
                    <Tooltip
                      title={
                        <>
                          Altura: {duck.altura?.toString().replace(".", ",")} cm <br />
                          Peso: {duck.peso?.toString().replace(".", ",")} g <br />
                          Nº de mutações: {duck.quantidadeMutacoes} <br />
                          Frequência cardíaca: {duck.bpm ? `${duck.bpm} bpm` : "-"} <br />
                          Estado de hibernação: {duck.estadoHibernacao} <br />
                          Super-poder:{" "}
                          {duck.nomeSuperPoder
                            ? `${duck.nomeSuperPoder} - ${duck.tipoSuperPoder}`
                            : "-"}
                        </>
                      }
                    >
                      <span>#{duck.id}</span>
                    </Tooltip>
                  </TableCell>

                  {/* Drone */}
                  <TableCell sx={{ color: "#FFFFFF", borderBottom: "1px solid #00E0B7" }}>
                    <Tooltip
                      title={
                        <>
                          Nº de série: {duck.numeroSerieDrone} <br />
                          Modelo: {duck.modeloDrone} <br />
                          Fabricante: {duck.fabricanteDrone} <br />
                          País: {duck.paisDrone}
                        </>
                      }
                    >
                      <span>
                        <Chip
                          label={
                            duck.numeroSerieDrone
                              ? duck.numeroSerieDrone.length > 20
                                ? `${duck.numeroSerieDrone.substring(0, 16)}...`
                                : duck.numeroSerieDrone
                              : "-"
                          }
                          sx={{
                            backgroundColor: "#00E0B7",
                            color: "#0A1C1C",
                            fontWeight: "bold",
                          }}
                        />
                      </span>
                    </Tooltip>
                  </TableCell>

                  {/* Local */}
                  <TableCell sx={{ color: "#FFFFFF", borderBottom: "1px solid #00E0B7" }}>
                    <Tooltip
                      title={
                        <>
                          Latitude: {duck.latitude?.toString().replace(".", ",")} <br />
                          Longitude: {duck.longitude?.toString().replace(".", ",")} <br />
                          Precisão do GPS: {duck.precisao?.toString().replace(".", ",")} m <br />
                          Endereço: {duck.endereco} <br />
                          Ponto de referência: {duck.pontoReferencia || "-"}
                        </>
                      }
                    >
                      <span>
                        {[duck.cidade, duck.estado, duck.pais]
                          .filter(Boolean)
                          .join(" / ") || "-"}
                      </span>
                    </Tooltip>
                  </TableCell>

                  {/* Capturado */}
                  <TableCell sx={{ color: "#FFFFFF", borderBottom: "1px solid #00E0B7" }}>
                    <Chip
                      label={duck.capturado ? "Sim" : "Não"}
                      sx={{
                        backgroundColor: duck.capturado ? "#00E0B7" : "#FF6B6B",
                        color: duck.capturado ? "#0A1C1C" : "#FFFFFF",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>

                  {/* Ações */}
                  <TableCell sx={{ borderBottom: "1px solid #00E0B7" }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Ver classificação">
                        <span>
                          <IconButton size="small" onClick={() => handleView(duck.id)} sx={{ color: "#00E0B7" }}>
                            <ViewIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                      
                      <Tooltip title="Editar">
                        <span>
                          <IconButton size="small" onClick={() => handleEdit(duck.id)} sx={{ color: "#FFFFFF" }}>
                            <EditIcon />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title="Apagar">
                        <span>
                          <IconButton size="small" onClick={() => handleDelete(duck.id)} sx={{ color: "#FF6B6B" }}>
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

              {!loading && sortedRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} sx={{ color: "#B0B0B0", textAlign: "center", py: 4 }}>
                    Nenhum pato encontrado.
                  </TableCell>
                </TableRow>
              )}
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} sx={{ color: "#B0B0B0", textAlign: "center", py: 4 }}>
                    Carregando...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={sortedRows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            labelRowsPerPage="Registros por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
            }
            sx={{
              color: "#FFFFFF",
              borderTop: "1px solid #00E0B7",
              backgroundColor: "#1A2C2C",
              ".MuiTablePagination-select": { color: "#FFFFFF" },
              ".MuiTablePagination-selectIcon": { color: "#00E0B7" },
              ".MuiTablePagination-actions button": {
                color: "#00E0B7",
                "&.Mui-disabled": { color: "#666666" },
              },
              ".MuiTablePagination-displayedRows": { color: "#B0B0B0" },
            }}
          />
        </TableContainer>

        <Dialog open={confirm.open} onClose={() => setConfirm({ open: false, id: null })}>
          <DialogContent>
            Tem certeza que deseja apagar o pato #{confirm.id}?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirm({ open: false, id: null })}>Cancelar</Button>
            <Button color="error" variant="contained" onClick={doDelete}>
              Apagar
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnack((s) => ({ ...s, open: false }))}
            severity={snack.severity}
            sx={{ width: "100%" }}
          >
            {snack.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
}

export default DucksPage;
