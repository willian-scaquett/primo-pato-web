"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { Layout } from "../../components/Layout/Layout";
import {
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { Icon } from "@iconify/react";

function DashboardPage() {
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
      </Box>
    </Layout>
  );
}

export default DashboardPage;