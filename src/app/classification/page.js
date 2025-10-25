"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid as Grid,
  Button,
  Chip,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { Layout } from "../../components/Layout/Layout";
import { useRouter, useSearchParams } from "next/navigation";
import { buscarPatos, buscarClassificacaoPato } from "../../lib/apiClient";

function ClassificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ducks, setDucks] = useState([]);
  const [selectedDuck, setSelectedDuck] = useState("");
  const [loading, setLoading] = useState(false);
  const [mission, setMission] = useState(null);

  const formatCurrency = (v) => {
    const n = Number(v);
    if (Number.isNaN(n)) return "-";
    return '₽ ' + new Intl.NumberFormat("pt-BR").format(n);
  };
  const toNumber = (v) => {
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  };

  // Load ducks and preselect
  useEffect(() => {
    (async () => {
      try {
        const list = await buscarPatos();
        const rows = Array.isArray(list) ? list : [];
        setDucks(rows);
        const preselect = searchParams.get("id");
        if (preselect && rows.find((d) => String(d.id) === String(preselect))) {
          setSelectedDuck(String(preselect));
        } else {
          setSelectedDuck("");
        }
      } catch {
        setDucks([]);
        setSelectedDuck("");
      }
    })();
  }, [searchParams]);

  useEffect(() => {
    if (!selectedDuck) {
      setMission(null);
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const data = await buscarClassificacaoPato(selectedDuck);
        setMission(data);
      } catch {
        setMission(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedDuck]);

  const riscoNum = useMemo(() => toNumber(mission?.risco) ?? 0, [mission]);
  const ganhoCientificoNum = useMemo(() => toNumber(mission?.ganhoCientifico) ?? 0, [mission]);
  const ganhoParanormalNum = useMemo(() => toNumber(mission?.ganhoParanormal) ?? 0, [mission]);
  const distanciaNum = useMemo(() => toNumber(mission?.distancia) ?? 0, [mission]);

  const riscoColor = useMemo(() => (riscoNum >= 70 ? "#FF6B6B" : riscoNum >= 40 ? "#FFA500" : "#00E0B7"), [riscoNum]);

  const selectedDuckObj = useMemo(() => ducks.find((d) => String(d.id) === String(selectedDuck)), [ducks, selectedDuck]);
  const isCaptured = !!selectedDuckObj?.capturado;

  const handleDuckChange = (e) => {
    setSelectedDuck(e.target.value);
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

        <Box sx={{ mb: 4 }}>
          <FormControl fullWidth sx={{ maxWidth: 480 }}>
            <InputLabel>Pato Primordial</InputLabel>
            <Select value={selectedDuck} onChange={handleDuckChange} label="Pato Primordial">
              <MenuItem value="">Selecione o pato primordial</MenuItem>
              {ducks.map((d) => (
                <MenuItem key={d.id} value={String(d.id)}>
                  {`Pato #${d.id}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#FFFFFF" }}>
              Missão de Captura
            </Typography>
            <Card sx={{ position: 'relative', backgroundColor: "#1A2C2C", border: "1px solid #00E0B7", mb: 3 }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) rotate(-7deg)',
                  backgroundColor: 'rgba(0, 224, 183, 0.9)',
                  color: '#1A2C2C',
                  px: 4,
                  py: 2,
                  fontWeight: 'bold',
                  fontSize: 24,
                  zIndex: 10,
                  borderRadius: 2,
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  pointerEvents: 'none',
                  opacity: !loading && isCaptured ? 1 : 0,
                  transition: (!loading && isCaptured) ? 'opacity ease-in-out 0.3s' : 'opacity 0s',
                }}
              >
                CAPTURADO!
              </Box>
              <CardContent sx={{ opacity: isCaptured ? 0.5 : 1, transition: (!loading && isCaptured) ? 'opacity 0.3s' : 'opacity 0s' }}>
                {loading ? (
                  <Box sx={{ py: 2 }}>
                    <LinearProgress sx={{ color: "#00E0B7" }} />
                  </Box>
                ) : mission ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="body1" sx={{ color: "#B0B0B0" }}>
                      Defesa Recomendada: <strong style={{ color: "#FFFFFF" }}>{mission.defesaRecomendada || "-"}</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#B0B0B0" }}>
                      Arma Recomendada: <strong style={{ color: "#FFFFFF" }}>{mission.armaRecomendada || "-"}</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#B0B0B0" }}>
                      Abordagem Recomendada: <strong style={{ color: "#FFFFFF" }}>{mission.abordagemRecomendada || "-"}</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#B0B0B0" }}>
                      Tamanho Necessário de Rede: <strong style={{ color: "#FFFFFF" }}>{mission.tamanhoRedeNecessaria || "-"}</strong>
                    </Typography>
                    <Typography variant="h5" sx={{ color: "#B0B0B0", mt: 2 }}>
                      Custo Estimado: <strong style={{ color: "#FF6B6B" }}>{formatCurrency(mission.custo)}</strong>
                    </Typography>
                    <Typography variant="h5" sx={{ color: "#B0B0B0" }}>
                      Distância do Alvo: <strong style={{ color: "#00E0B7" }}>{distanciaNum ? `${distanciaNum.toFixed(1)} km`.replace(".", ",") : "-"}</strong>
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: "#B0B0B0" }}>
                    Selecione um pato para ver a classificação.
                  </Typography>
                )}
              </CardContent>
            </Card>

            <Button
              variant="contained"
              onClick={() => router.push(selectedDuck ? `/drone-control?id=${selectedDuck}` : "/drone-control")}
              disabled={isCaptured || !selectedDuck}
              sx={{ backgroundColor: isCaptured ? "#2A3C3C" : "#00E0B7", color: isCaptured ? "#777" : "#0A1C1C", "&:hover": { backgroundColor: isCaptured ? "#2A3C3C" : "#00B894" }}}
            >
              Capturar
            </Button>
          </Grid>

          {/* Métricas (direita) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#FFFFFF" }}>
              Classificação
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Card sx={{ backgroundColor: "#1A2C2C", border: "1px solid #00E0B7" }}>
                <CardContent>
                  <Typography variant="body1" sx={{ color: "#FFFFFF", mb: 1 }}>
                    Nível de Risco da Operação
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <LinearProgress variant="determinate" value={Math.max(0, Math.min(100, riscoNum))} sx={{ height: 10, borderRadius: 6, backgroundColor: "#2A3C3C", "& .MuiLinearProgress-bar": { backgroundColor: riscoColor } }} />
                    </Box>
                    <Chip label={`${(riscoNum ?? 0).toFixed(0)}%`} sx={{ backgroundColor: riscoColor, color: riscoNum < 70 ? "#0A1C1C" : "#FFFFFF", fontWeight: "bold" }} />
                  </Box>
                </CardContent>
              </Card>
              <Card sx={{ backgroundColor: "#1A2C2C", border: "1px solid #00E0B7" }}>
                <CardContent>
                  <Typography variant="body1" sx={{ color: "#FFFFFF", mb: 1 }}>
                    Potencial de Ganho Científico
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <LinearProgress variant="determinate" value={Math.max(0, Math.min(100, ganhoCientificoNum))} sx={{ height: 10, borderRadius: 6, backgroundColor: "#2A3C3C", "& .MuiLinearProgress-bar": { backgroundColor: "#00E0B7" } }} />
                    </Box>
                    <Chip label={`${(ganhoCientificoNum ?? 0).toFixed(0)}%`} sx={{ backgroundColor: "#00E0B7", color: "#0A1C1C", fontWeight: "bold" }} />
                  </Box>
                </CardContent>
              </Card>
              <Card sx={{ backgroundColor: "#1A2C2C", border: "1px solid #00E0B7" }}>
                <CardContent>
                  <Typography variant="body1" sx={{ color: "#FFFFFF", mb: 1 }}>
                    Potencial de Conhecimento Paranormal
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <LinearProgress variant="determinate" value={Math.max(0, Math.min(100, ganhoParanormalNum))} sx={{ height: 10, borderRadius: 6, backgroundColor: "#2A3C3C", "& .MuiLinearProgress-bar": { backgroundColor: "#9B59B6" } }} />
                    </Box>
                    <Chip label={`${(ganhoParanormalNum ?? 0).toFixed(0)}%`} sx={{ backgroundColor: "#9B59B6", color: "#FFFFFF", fontWeight: "bold" }} />
                  </Box>
                </CardContent>
              </Card>
            </Box>
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
