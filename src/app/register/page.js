"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import { Layout } from "../../components/Layout/Layout";
import { useRouter } from "next/navigation";
import { cadastrarUsuario } from "../../lib/apiClient";

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const router = useRouter();

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!formData.fullName || !formData.email || !formData.password) {
      setSnack({ open: true, message: "Preencha nome, e-mail e senha.", severity: "error" });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setSnack({ open: true, message: "As senhas não conferem.", severity: "error" });
      return;
    }
    setSubmitting(true);
    try {
      // Schema baseado no swagger do usuário: nome, email, senha
      const payload = {
        nome: formData.fullName,
        usuario: formData.email,
        senha: formData.password,
      };
      await cadastrarUsuario(payload);
      setSnack({ open: true, message: "Usuário cadastrado com sucesso.", severity: "success" });
      setTimeout(() => router.push("/login"), 800);
    } catch (err) {
      setSnack({ open: true, message: err.message || "Falha ao cadastrar usuário.", severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout showHeader={false} noPadding noScroll>
      {/* Background full-viewport fixed */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          backgroundImage: 'url("/pato-bkg.jpeg")',
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      {/* Overlay para contraste fixo dark */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: "linear-gradient(135deg, rgba(10,28,28,0.5) 0%, rgba(26,44,44,0.5) 100%)",
        }}
      />

      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 400,
            backgroundColor: "rgba(26,44,44,0.72)",
            border: "1px solid #00E0B7",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 224, 183, 0.1)",
            position: "relative",
            zIndex: 1,
            backdropFilter: "saturate(120%) blur(4px)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Title */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  color: "#FFFFFF",
                  mb: 2,
                }}
              >
                Crie sua Conta
              </Typography>
              <Typography variant="body1" sx={{ color: "#B0B0B0" }}>
                Junte-se à missão e comece a monitorar os patos primordiais.
              </Typography>
            </Box>

            {/* Registration Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Nome Completo"
                value={formData.fullName}
                onChange={handleChange("fullName")}
                margin="normal"
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Endereço de e-mail"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                margin="normal"
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Senha"
                type="password"
                value={formData.password}
                onChange={handleChange("password")}
                margin="normal"
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Confirmar Senha"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange("confirmPassword")}
                margin="normal"
                required
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ py: 1.5, mb: 2, backgroundColor: "#00E0B7", "&:hover": { backgroundColor: "#00B894" } }}
                disabled={submitting}
              >
                {submitting ? "Enviando..." : "Registrar"}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "#B0B0B0" }}>
                  Já tem uma conta? {" "}
                  <Link href="/login" sx={{ color: "#00E0B7", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                    Entrar aqui
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnack(s => ({ ...s, open: false }))} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
}

export default RegisterPage;
