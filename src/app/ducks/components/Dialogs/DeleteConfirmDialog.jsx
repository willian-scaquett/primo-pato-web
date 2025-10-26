import React from "react";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";

export const DeleteConfirmDialog = ({ open, duckId, onCancel, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogContent>
        Tem certeza que deseja apagar o pato #{duckId}?
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancelar</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Apagar
        </Button>
      </DialogActions>
    </Dialog>
  );
};