"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Layout } from "../../components/Layout/Layout";
import {
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { Icon } from "@iconify/react";
import { buscarEstatisticasPatos, eu } from "../../lib/apiClient";
import { Bar, BarChart, Cell, LabelList, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [capturedCounter, setCapturedCounter] = useState(0);
  const [notCapturedCounter, setNotCapturedCounter] = useState(0);
  const [ducksTotal, setDucksTotal] = useState(0);
  const [scientificAvg, setScientificAvg] = useState(0);
  const [paranormalAvg, setParanormalAvg] = useState(0);
  const [userName, setUserName] = useState("");

useEffect(() => {
  buscarEstatisticasPatos()
    .then((response) => {
      setCapturedCounter(response?.quantidadeCapturado);
      setNotCapturedCounter(response?.quantidadeNaoCapturado);
      setDucksTotal(response?.quantidadeCapturado + response?.quantidadeNaoCapturado);
      setScientificAvg(response?.porcentagemGanhoCientifico);
      setParanormalAvg(response?.porcentagemGanhoParanormal);
    })
    .finally(() => setLoading(false));
  eu().then((response) => setUserName(response.message))
}, []);

  const features = [
    {
      title: "Registro de Dados",
      description: "Registre dados de patos primordiais coletados por drones",
      icon: <Icon icon="mdi:content-save-plus" width="40" height="40" color="#00E0B7" style={{ display: 'inline-block' }} />,
      href: "/data-registration",
    },
    {
      title: "Controle de Patos",
      description: "Gerencie e manipule os patos primordiais cadastrados.",
      icon: <Icon icon="mdi:duck" width="40" height="40" color="#00E0B7" style={{ display: 'inline-block' }} />,
      href: "/ducks",
    },
    {
      title: "Classificação",
      description: "Verifique a estatísticas sobre os patos primordiais cadastrados.",
      icon: <AssessmentIcon sx={{ fontSize: 40, color: "#00E0B7" }} />,
      href: "/classification",
    },
    {
      title: "Missão de Captura",
      description: "Capture os patos primordiais com os equipamentos recomendados.",
      icon: <Icon icon="mdi:target-arrow" width="40" height="40" color="#00E0B7" style={{ display: 'inline-block' }} />,
      href: "/drone-control",
    },
  ];

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{ mb: 2, textAlign: "center" }}
        >
          Bem-vindo(a), {userName?.split(" ")[0]}
        </Typography>
        <Typography
          variant="h6"
          sx={{ mb: 6, color: "#B0B0B0", textAlign: "center" }}
        >
          Sistema de monitoramento, classificação e captura de
          patos primordiais para pesquisa
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                component="a"
                href={feature.href}
                sx={{
                  display: "flex",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 32px rgba(0, 224, 183, 0.2)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 3 }}>
                  <Box sx={{ mb: 2, minHeight: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Paper
          elevation={3}
          sx={{
            mt: 6,
            p: 3,
            borderRadius: 2,
            height: { xs: "auto", md: 460 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 3, textAlign: "center", color: "#00E0B7" }}
          >
            Métricas de Captura
          </Typography>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "stretch",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box
              sx={{
                flex: { xs: 1, md: 2 },
                minHeight: { xs: 400, md: "auto" },
                height: { xs: 400, md: "auto" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {loading ? (
                <CircularProgress sx={{ color: "#00E0B7" }} />
              ) : ducksTotal === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "#B0B0B0",
                    textAlign: "center",
                  }}
                >
                  <Icon
                    icon="mdi:duck-off"
                    width="64"
                    height="64"
                    color="#555"
                    style={{ marginBottom: 12 }}
                  />
                  <Typography variant="h6">Nenhum pato primordial cadastrado ainda :(</Typography>
                  <Typography variant="body2">
                    Vá registrar e capturar os patos! O mundo conta com sua ajuda!
                  </Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={328}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Patos capturados", value: capturedCounter },
                        { name: "Patos não capturados", value: notCapturedCounter },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      <Cell fill="#00E0B7" />
                      <Cell fill="#FFA500" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}

              {!loading && (
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    width: "100%",
                    textAlign: "center",
                    color: "#B0B0B0",
                  }}
                >
                  Total de patos registrados: <strong>{ducksTotal}</strong>
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 3,
              }}
            >
            <Card
                sx={{
                  flex: 1,
                  background: "rgba(0, 224, 183, 0.1)",
                  border: "1px solid #00E0B7",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 1,
                }}
            >
                <Typography variant="h6" sx={{ color: "#00E0B7", mb: 1 }}>
                  Média de Ganho Científico
                </Typography>
                <ResponsiveContainer width="95%" height={100}>
                  <BarChart
                    data={[
                      {
                        name: "Ganho Científico",
                        valor: Math.round(scientificAvg || 0),
                      },
                    ]}
                    layout="vertical"
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  >
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis type="category" dataKey="name" hide />
                    <Bar dataKey="valor" fill="#00E0B7" radius={[5, 5, 5, 5]}>
                      <LabelList
                        dataKey="valor"
                        position="insideCenter"
                        fill="#0A1C1C;"
                        fontWeight="bold"
                        formatter={(value) => value ? `${value}%` : ''}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card
                sx={{
                  flex: 1,
                  background: "rgba(155, 89, 182, 0.1)",
                  border: "1px solid #9B59B6",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 1,
                }}
              >
                <Typography variant="h6" sx={{ color: "#9B59B6", mb: 1 }}>
                  Média de Ganho Paranormal
                </Typography>
                <ResponsiveContainer width="95%" height={100}>
                  <BarChart
                    data={[
                      {
                        name: "Ganho Paranormal",
                        valor: Math.round(paranormalAvg || 0),
                      },
                    ]}
                    layout="vertical"
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  >
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis type="category" dataKey="name" hide />
                    <Bar dataKey="valor" fill="#9B59B6" radius={[5, 5, 5, 5]}>
                      <LabelList
                        dataKey="valor"
                        position="insideRight"
                        fill="#0A1C1C"
                        fontWeight="bold"
                        formatter={(value) => value ? `${value}%` : ''}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
}

export default DashboardPage;