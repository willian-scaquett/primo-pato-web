import React from "react";
import { Box, Card, CardContent, Typography, LinearProgress, Button } from "@mui/material";
import { formatCurrency, formatDistance } from "../utils/formatters";
import { Icon } from "@iconify/react";

export const MissionCard = ({
  loading,
  mission,
  isCaptured,
  distanciaNum,
  selectedDuck,
  onCapture
}) => {
  return (
    <>
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
                Distância do Alvo: <strong style={{ color: "#00E0B7" }}>{formatDistance(distanciaNum)}</strong>
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
        onClick={onCapture}
        disabled={isCaptured || !selectedDuck}
        startIcon={<Icon icon="mdi:target-arrow"/>}
      >
        Capturar
      </Button>
    </>
  );
};