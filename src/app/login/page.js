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
import { loginUsuario } from "../../lib/apiClient";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!email || !password) {
      setSnack({ open: true, message: "Informe e-mail e senha.", severity: "error" });
      return;
    }
    setSubmitting(true);
    try {
      // Swagger indica login com 'usuario' e 'senha'
      const payload = { usuario: email, senha: password };
      const data = await loginUsuario(payload);
      // API retorna token; armazenar e redirecionar
      const token = (typeof data === 'string') ? data : (data?.token || data?.accessToken || data);
      if (token) {
        sessionStorage.setItem("auth_token", String(token));
      }
      setSnack({ open: true, message: "Login realizado com sucesso.", severity: "success" });
      setTimeout(() => router.push("/dashboard"), 500);
    } catch (err) {
      setSnack({ open: true, message: err.message || "Falha no login.", severity: "error" });
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
                  mb: 1,
                }}
              >
                PRIMO PATO
              </Typography>
              <Typography variant="h6" sx={{ color: "#00E0B7", fontWeight: 500 }}>
                Sistema de Monitoramento
              </Typography>
            </Box>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  py: 1.5,
                  mb: 2,
                  backgroundColor: "#00E0B7",
                  "&:hover": { backgroundColor: "#00B894" },
                }}
                disabled={submitting}
              >
                {submitting ? "Entrando..." : "ENTRAR"}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "#B0B0B0" }}>
                  Não tem uma conta? {" "}
                  <Link href="/register" sx={{ color: "#00E0B7", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                    Crie uma
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

export default LoginPage;
