import React from 'react';
import { Box, Typography } from '@mui/material';
import { getBarColor } from '../utils/formatters';

export const BatteryIndicator = ({ battery }) => {
  const color = getBarColor(battery);
  
  return (
    <Box sx={{ flex: 1, ml: 2 }}>
      <Typography variant="body2" sx={{ color: '#FFFFFF', mb: 0.5 }}>
        Bateria
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ 
          position: 'relative', 
          width: '60px', 
          height: '28px',
          border: `2px solid ${color}`,
          borderRadius: '4px',
          backgroundColor: '#2A3C3C',
          display: 'flex',
          alignItems: 'center',
          padding: '2px'
        }}>
          <Box sx={{
            position: 'absolute',
            right: '-6px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '4px',
            height: '12px',
            backgroundColor: color,
            borderRadius: '0 2px 2px 0'
          }} />
          <Box sx={{
            width: `${battery}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: '2px',
            transition: 'width 0.3s ease, background-color 0.3s ease'
          }} />
        </Box>
      </Box>
    </Box>
  );
};