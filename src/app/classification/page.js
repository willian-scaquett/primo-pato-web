"use client";

import React, { Suspense, useMemo } from "react";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import { Layout } from "../../components/Layout/Layout";
import { useRouter, useSearchParams } from "next/navigation";
import { useDucks } from "./hooks/useDucks";
import { useMission } from "./hooks/useMission";
import { DuckSelector } from "./components/DuckSelector";
import { MissionCard } from "./components/MissionCard";
import { ClassificationMetrics } from "./components/ClassificationMetrics";
import { toNumber } from "./utils/formatters";
import { getRiskColor } from "./utils/riskColors";

function ClassificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectId = searchParams.get("id");

  const { ducks, selectedDuck, setSelectedDuck } = useDucks(preselectId);
  const { mission, loading } = useMission(selectedDuck);

  const riscoNum = useMemo(() => toNumber(mission?.risco) ?? 0, [mission]);
  const ganhoCientificoNum = useMemo(() => toNumber(mission?.ganhoCientifico) ?? 0, [mission]);
  const ganhoParanormalNum = useMemo(() => toNumber(mission?.ganhoParanormal) ?? 0, [mission]);
  const distanciaNum = useMemo(() => toNumber(mission?.distancia) ?? 0, [mission]);
  const riscoColor = useMemo(() => getRiskColor(riscoNum), [riscoNum]);

  const selectedDuckObj = useMemo(
    () => ducks.find((d) => String(d.id) === String(selectedDuck)),
    [ducks, selectedDuck]
  );
  const isCaptured = !!selectedDuckObj?.capturado;

  const handleCapture = () => {
    router.push(selectedDuck ? `/drone-control?id=${selectedDuck}` : "/drone-control");
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1, color: "#FFFFFF" }}>
          Classificação
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "#B0B0B0" }}>
          Estatíisticas geradas a partir dos dados registrados de cada pato.
        </Typography>

        <DuckSelector
          ducks={ducks}
          selectedDuck={selectedDuck}
          onChange={setSelectedDuck}
        />

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <MissionCard
              loading={loading}
              mission={mission}
              isCaptured={isCaptured}
              distanciaNum={distanciaNum}
              selectedDuck={selectedDuck}
              onCapture={handleCapture}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <ClassificationMetrics
              riscoNum={riscoNum}
              ganhoCientificoNum={ganhoCientificoNum}
              ganhoParanormalNum={ganhoParanormalNum}
              riscoColor={riscoColor}
            />
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

function LoadingFallback() {
  return (
    <Layout>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress sx={{ color: "#00E0B7" }} />
      </Box>
    </Layout>
  );
}

function ClassificationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ClassificationContent />
    </Suspense>
  );
}

export default ClassificationPage;