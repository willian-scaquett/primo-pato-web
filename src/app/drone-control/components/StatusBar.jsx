import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { getBarColor } from '../utils/formatters';

export const StatusBar = ({ label, value }) => (
  <Box sx={{ flex: 3, mr: 2 }}>
    <Typography variant="body2" sx={{ color: '#FFFFFF', mb: 0.5 }}>
      {label}
    </Typography>
    <LinearProgress 
      variant="determinate" 
      value={value} 
      sx={{ 
        height: 10, 
        borderRadius: 6, 
        backgroundColor: '#2A3C3C', 
        '& .MuiLinearProgress-bar': { 
          backgroundColor: getBarColor(value) 
        } 
      }} 
    />
  </Box>
);