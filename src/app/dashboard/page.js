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
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from "@mui/icons-material";
import { Icon } from "@iconify/react";
import { buscarEstatisticasPatos } from "../../lib/apiClient";

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [capturedCounter, setCapturedCounter] = useState(0);
  const [notCapturedCounter, setNotCapturedCounter] = useState(0);
  const [ducksTotal, setDucksTotal] = useState(0);

  useEffect(() => {
    buscarEstatisticasPatos().then((list) => {
      list.map((l) => {
        if (l.capturado) {
          setCapturedCounter(l.quantidade);
        } else {
          setNotCapturedCounter(l.quantidade);
        }
        setDucksTotal(ducksTotal + l.quantidade)
      });
    }).finally(setLoading(false));
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
          Bem-vindo ao Primo Pato
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
            borderRadius: 2
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 3, textAlign: "center", color: "#00E0B7" }}
          >
            Métricas de Captura
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: "#00E0B7" }} />
            </Box>
          ) : (
            <Grid 
              container 
              spacing={3} 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              {[ 
                { count: capturedCounter, label: 'Patos Capturados', icon: <CheckCircleIcon sx={{ fontSize: 48, color: "#00E0B7", mb: 1 }} />, color: '#00E0B7', bg: 'rgba(0, 224, 183, 0.1)', border: '#00E0B7' },
                { count: notCapturedCounter, label: 'Patos Não Capturados', icon: <WarningIcon sx={{ fontSize: 48, color: "#FFA500", mb: 1 }} />, color: '#FFA500', bg: 'rgba(255, 107, 107, 0.1)', border: '#FFA500' },
                { count: ducksTotal, label: 'Total de Patos', icon: <InfoIcon sx={{ fontSize: 48, color: "#FFFFFF", mb: 1 }} />, color: '#fff', bg: 'rgba(255, 255, 255, 0.05)', border: '#B0B0B0' }
              ].map((stat, index) => (
                <Grid 
                  item 
                  xs={12} 
                  md={4} 
                  key={index} 
                  sx={{ display: 'flex', justifyContent: 'center' }} 
                >
                  <Card
                    sx={{
                      textAlign: "center",
                      background: stat.bg,
                      border: `1px solid ${stat.border}`,
                      width: '100%',
                      minWidth: 250,
                      mr: 0.5,
                      ml: 0.5
                    }}
                  >
                    <CardContent>
                      {stat.icon}
                      <Typography variant="h4" sx={{ color: stat.color, mb: 1 }}>
                        {stat.count}
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#B0B0B0" }}>
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Box>
    </Layout>
  );
}

export default DashboardPage;