"use client";

import React, { useEffect, useCallback, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { Layout } from "../../components/Layout/Layout";
import { useDucks } from "./hooks/useDucks";
import { useDucksTable } from "./hooks/useDucksTable";
import { SearchBar } from "./components/DucksTable/SearchBar";
import { DucksTable } from "./components/DucksTable/DucksTable";
import { DeleteConfirmDialog } from "./components/Dialogs/DeleteConfirmDialog";
import { SnackbarNotification } from "./components/Feedback/SnackbarNotification";
import { COLORS } from "./constants/ducks";

function DucksPage() {
  const router = useRouter();
  const { rows, loading, snack, loadDucks, deleteDuck, closeSnack } = useDucks();
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const {
    searchTerm,
    setSearchTerm,
    orderBy,
    orderDirection,
    page,
    rowsPerPage,
    handleSort,
    handleChangePage,
    handleChangeRowsPerPage,
    sortedRows,
    paginatedRows,
  } = useDucksTable(rows);

  useEffect(() => {
    loadDucks();
  }, [loadDucks]);

  const handleEdit = useCallback((id) => {
    router.push(`/ducks/${id}/edit`);
  }, [router]);

  const handleView = useCallback((id) => {
    router.push(`/classification?id=${id}`);
  }, [router]);

  const handleDeleteClick = useCallback((id) => {
    setConfirm({ open: true, id });
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    const success = await deleteDuck(confirm.id);
    if (success) {
      setConfirm({ open: false, id: null });
      loadDucks();
    }
  }, [confirm.id, deleteDuck, loadDucks]);

  const handleDeleteCancel = useCallback(() => {
    setConfirm({ open: false, id: null });
  }, []);

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1, color: COLORS.text.primary }}>
          Controle de Patos
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: COLORS.text.secondary }}>
          Visualize, edite ou apague as informações dos patos primordiais cadastrados.
        </Typography>

        <SearchBar 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />

        <DucksTable
          rows={rows}
          loading={loading}
          sortedRows={sortedRows}
          paginatedRows={paginatedRows}
          orderBy={orderBy}
          orderDirection={orderDirection}
          page={page}
          rowsPerPage={rowsPerPage}
          onSort={handleSort}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDeleteClick}
        />

        <DeleteConfirmDialog
          open={confirm.open}
          duckId={confirm.id}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />

        <SnackbarNotification
          open={snack.open}
          message={snack.message}
          severity={snack.severity}
          onClose={closeSnack}
        />
      </Box>
    </Layout>
  );
}

export default DucksPage;