import React from "react";
import { Typography, Box } from "@mui/material";
import { MetricCard } from "./MetricCard";

export const ClassificationMetrics = ({
  riscoNum,
  ganhoCientificoNum,
  ganhoParanormalNum,
  riscoColor
}) => {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 2, color: "#FFFFFF" }}>
        Classificação
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <MetricCard
          title="Nível de Risco da Operação"
          value={riscoNum}
          color={riscoColor}
          chipTextColor={riscoNum < 70 ? "#0A1C1C" : "#FFFFFF"}
        />
        <MetricCard
          title="Potencial de Ganho Científico"
          value={ganhoCientificoNum}
          color="#00E0B7"
        />
        <MetricCard
          title="Potencial de Conhecimento Paranormal"
          value={ganhoParanormalNum}
          color="#9B59B6"
          chipTextColor="#FFFFFF"
        />
      </Box>
    </>
  );
};