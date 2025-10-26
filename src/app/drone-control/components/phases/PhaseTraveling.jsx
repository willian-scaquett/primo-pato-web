import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

export const PhaseTraveling = ({ progress, isReturn }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      textAlign: 'center' 
    }}>
      <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
        {isReturn ? 'DRONE RETORNANDO À BASE' : 'DRONE EM TRÂNSITO'}
      </Typography>
      <Box sx={{ mb: 1, width: '100%', maxWidth: 400 }}>
        <Typography variant="body2" sx={{ color: '#FFFFFF', mb: 0.5 }}>
          {isReturn 
            ? 'Espero que o combustível e a bateria sejam suficientes...' 
            : 'Progresso da Viagem'
          }
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 10, 
            borderRadius: 6, 
            backgroundColor: '#2A3C3C', 
            '& .MuiLinearProgress-bar': { 
              backgroundColor: '#00E0B7' 
            } 
          }} 
        />
      </Box>
    </Box>
  );
};