import React from 'react';
import { Card, CardContent, Typography, LinearProgress, Box, Chip } from '@mui/material';
import { getRiskColor, formatDistance } from '../utils/formatters';

export const MetricsCard = ({ classification }) => {
  const riscoNum = classification ? Number(classification.risco) || 0 : 0;
  const riscoColor = getRiskColor(riscoNum);

  return (
    <Card sx={{ backgroundColor: '#1A2C2C', border: '1px solid #00E0B7', mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 4 }}>Métricas</Typography>
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ color: '#FFFFFF', mb: 0.5 }}>
            Risco da Missão de Captura
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={Math.max(0, Math.min(100, riscoNum))} 
              sx={{ 
                flexGrow: 1, 
                height: 10, 
                borderRadius: 6, 
                backgroundColor: '#2A3C3C', 
                '& .MuiLinearProgress-bar': { backgroundColor: riscoColor } 
              }} 
            />
            <Chip 
              label={`${(riscoNum || 0).toFixed(0)}%`} 
              sx={{ 
                backgroundColor: riscoColor, 
                color: riscoNum > 70 ? '#FFFFFF' : '#0A1C1C', 
                fontWeight: 'bold' 
              }} 
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={`Ganho Científico: ${classification?.ganhoCientifico ?? '-'}${classification?.ganhoCientifico !== undefined ? '%' : ''}`} 
            sx={{ backgroundColor: '#00E0B7', color: '#0A1C1C', fontWeight: 'bold' }} 
          />
          <Chip 
            label={`Ganho Paranormal: ${classification?.ganhoParanormal ?? '-'}${classification?.ganhoParanormal !== undefined ? '%' : ''}`} 
            sx={{ backgroundColor: '#9B59B6', color: '#FFFFFF', fontWeight: 'bold' }} 
          />
          <Chip 
            label={`Distância: ${classification ? `${formatDistance(classification.distancia)} km` : '-'}`} 
            sx={{ backgroundColor: '#2A3C3C', color: '#FFFFFF', border: '1px solid #00E0B7' }} 
          />
        </Box>
      </CardContent>
    </Card>
  );
};