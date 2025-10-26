import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

export const RecommendationsCard = ({ classification }) => {
  return (
    <Card sx={{ backgroundColor: '#1A2C2C', border: '1px solid #00E0B7', mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>Recomendações</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ color: '#B0B0B0', mb: 1 }}>Defesa</Typography>
            <Chip 
              label={classification?.defesaRecomendada || '-'} 
              sx={{ backgroundColor: '#2A3C3C', color: '#FFFFFF', border: '1px solid #00E0B7' }} 
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: '#B0B0B0', mb: 1 }}>Arma</Typography>
            <Chip 
              label={classification?.armaRecomendada || '-'} 
              sx={{ backgroundColor: '#2A3C3C', color: '#FFFFFF', border: '1px solid #00E0B7' }} 
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: '#B0B0B0', mb: 1 }}>Tamanho da Rede</Typography>
            <Chip 
              label={classification?.tamanhoRedeNecessaria || '-'} 
              sx={{ backgroundColor: '#2A3C3C', color: '#FFFFFF', border: '1px solid #00E0B7' }} 
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: '#B0B0B0', mb: 1 }}>Abordagem</Typography>
            <Chip 
              label={classification?.abordagemRecomendada || '-'} 
              sx={{ backgroundColor: '#2A3C3C', color: '#FFFFFF', border: '1px solid #00E0B7' }} 
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};