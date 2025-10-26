import React from 'react';
import { Box, Typography } from '@mui/material';

export const NoiseCancellerIndicator = ({ active, approach }) => {
  const isActive = active && (approach === 'FURTIVO' || approach === 'COMEDIDO');
  const color = isActive ? '#00E0B7' : '#FF6B6B';
  
  return (
    <Box sx={{ 
      position: 'absolute', 
      bottom: 16, 
      right: 16,
      backgroundColor: '#0A1C1C',
      border: '1px solid #2A3C3C',
      borderRadius: 1,
      padding: '8px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: 1
    }}>
      <Box sx={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: `0 0 8px ${color}`
      }} />
      <Typography variant="body2" sx={{ color, fontSize: '0.875rem' }}>
        Cancelador de Ruídos {active && approach === 'FURTIVO' ? '(Modo Turbo)' : ''}
      </Typography>
    </Box>
  );
};