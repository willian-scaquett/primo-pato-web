import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

export const ResultCard = ({ result, life, battery, onRetry }) => (
  <Card sx={{
    backgroundColor: '#1A2C2C',
    border: '1px solid #00E0B7',
    mb: 3,
    minHeight: '445px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <CardContent sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    }}>
      <Typography variant="h5" sx={{
        color: result === 'victory' ? '#00E0B7' : '#FF6B6B',
        fontWeight: 'bold',
        mb: 2,
      }}>
        {result === 'victory'
          ? 'Missão concluída com sucesso!'
          : life <= 0
          ? 'A missão falhou. O pato primordial destruiu o drone...'
          : battery <= 0
          ? 'A missão falhou. A bateria acabou e o drone foi perdido...'
          : 'A missão falhou. O combustível acabou e o drone foi perdido...'}
      </Typography>

      {result === 'defeat' && (
        <Button variant="contained" onClick={onRetry} sx={{
          color: '#0A1C1C',
          backgroundColor: '#00E0B7',
          '&:hover': { backgroundColor: '#00B894' },
        }}>
          Tentar novamente
        </Button>
      )}

      {result === 'victory' && (
        <Typography variant="body1" sx={{ color: '#FFFFFF', mb: 2 }}>
          Obrigado por capturar o <strong>PATO!!!</strong>
          <br />
          Seu esforço é de grande valia para nossas pesquisas.
        </Typography>
      )}
    </CardContent>
  </Card>
);