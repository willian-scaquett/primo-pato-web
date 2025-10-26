import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export const PhaseReady = ({ onStart }) => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    textAlign: 'center' 
  }}>
    <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
      DRONE PREPARADO!
    </Typography>
    <Typography variant="body2" sx={{ color: '#B0B0B0', mb: 2, maxWidth: '750px' }}>
      <strong>Lembre-se:</strong><br/><br/>
      -Durante a fase de batalha, combustível e bateria continuam sendo consumidos.<br/>
      -Cada escolha sua fará o drone manipular seus equipamentos e consumirá um pouco mais da bateria.<br/>
      -Em caso de patos em transe ou hibernação profunda, nossos drones se utilizam de um cancelador
       de ruídos para evitar despertá-los (porém ele consome bateria)<br/>
      -O peso do pato influencia diretamente no rendimento do combustível.<br/>
      -Apesar dos motores dos drones serem altamente eficientes, com seus tanques em 4 dimensões
       praticamente infinitos, nosso combustível não é infinito (e é caro!). Portanto, abastecemos
       apenas o necessário (acreditamos em suas habilidades)
      <br/><br/><strong>Boa sorte!</strong>
    </Typography>
    <Button 
      variant="contained" 
      onClick={onStart} 
    >
      Iniciar viagem
    </Button>
  </Box>
);