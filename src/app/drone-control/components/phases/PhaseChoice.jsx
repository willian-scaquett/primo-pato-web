import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export const PhaseChoice = ({ title, text, options, onChoose }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
    <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>{title}<br/><br/>{text}</Typography>
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
      {options.map((option) => (
        <Button 
          key={option.code} 
          variant="outlined" 
          onClick={() => onChoose(option.code)} 
          sx={{ borderColor: '#00E0B7', color: '#00E0B7' }}
        >
          {option.label}
        </Button>
      ))}
    </Box>
  </Box>
);