'use client';

import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Layout } from '../../components/Layout/Layout';
import { useSearchParams } from 'next/navigation';
import { useDucks } from './hooks/useDucks';
import { useClassification } from './hooks/useClassification';
import { useGameState } from './hooks/useGameState';
import { MetricsCard } from './components/MetricsCard';
import { RecommendationsCard } from './components/RecommendationsCard';
import { StatusBar } from './components/StatusBar';
import { BatteryIndicator } from './components/BatteryIndicator';
import { NoiseCancellerIndicator } from './components/NoiseCancellerIndicator';
import { PhaseReady } from './components/phases/PhaseReady';
import { PhaseTraveling } from './components/phases/PhaseTraveling';
import { PhaseChoice } from './components/phases/PhaseChoice';
import { ResultCard } from './components/ResultCard';
import { DEFENSES, WEAPONS, NETS } from './constants/options';
import { PHASES, BATTERY_COST } from './constants/gameConfig';
import { normalizeCode } from './utils/normalizers';
import { 
  calculateTravelTime, 
  calculateReturnTravelTime, 
  calculateFuelConsumption 
} from './utils/calculations';
import { formatDistance } from './utils/formatters';

function DroneControlContent() {
  const searchParams = useSearchParams();
  const { ducks, selectedDuck, setSelectedDuck, refreshDucks } = useDucks(searchParams);
  const { classification, loading } = useClassification(selectedDuck);
  const gameState = useGameState();
  
  const phaseTimerRef = useRef(null);
  const fuelTimerRef = useRef(null);
  const batteryTimerRef = useRef(null);
  const travelIntervalRef = useRef(null);
  const prevDuckRef = useRef('');

  const recommendedDefense = useMemo(() => normalizeCode(classification?.defesaRecomendada), [classification]);
  const recommendedWeapon = useMemo(() => normalizeCode(classification?.armaRecomendada), [classification]);
  const recommendedNet = useMemo(() => normalizeCode(classification?.tamanhoRedeNecessaria), [classification]);
  const recommendedApproach = useMemo(() => normalizeCode(classification?.abordagemRecomendada), [classification]);

  const currentDistance = useMemo(() => {
    if (!classification) return 0;
    const inBattle = gameState.phase === PHASES.CHOOSE_DEFENSE || 
                     gameState.phase === PHASES.CHOOSE_WEAPON || 
                     gameState.phase === PHASES.CHOOSE_NET;
    if (inBattle) return 0;
    return (classification.distancia - (gameState.travelProgress / 100 * classification.distancia));
  }, [classification, gameState.phase, gameState.travelProgress]);

  const clearAllTimers = () => {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    if (fuelTimerRef.current) clearInterval(fuelTimerRef.current);
    if (batteryTimerRef.current) clearInterval(batteryTimerRef.current);
    if (travelIntervalRef.current) clearInterval(travelIntervalRef.current);
  };

  const endGame = (win, msg) => {
    clearAllTimers();
    gameState.setResult(win ? 'victory' : 'defeat');
    gameState.setMessage(msg);
    gameState.setPhase(PHASES.FINISHED);
    gameState.setStarted(false);
  };

  const damageOnError = (customMessage) => {
    gameState.setLife((hp) => {
      const damage = classification ? Math.max(50 * (classification.risco / 100), 1) : 25;
      const nhp = Math.max(0, hp - damage);
      if (nhp <= 0) endGame(false, customMessage || 'Dano crítico! O drone foi destruído!');
      return nhp;
    });
  };

  const consumeBattery = (amount) => {
    gameState.setBattery((b) => {
      const next = Math.max(0, b - amount);
      if (next <= 0) {
        endGame(false, 'Bateria esgotada! O drone foi perdido!');
      }
      return next;
    });
  };

  useEffect(() => {
    if (!gameState.started || gameState.phase === PHASES.READY || gameState.phase === PHASES.FINISHED) {
      clearAllTimers();
      return;
    }
    
    if (fuelTimerRef.current) clearInterval(fuelTimerRef.current);
    if (batteryTimerRef.current) clearInterval(batteryTimerRef.current);
    
    let fuelPerTick;
    let batteryPerTick;
    
    if (gameState.phase === PHASES.TRAVELING_TO || gameState.phase === PHASES.RETURNING) {
      const distance = classification?.distancia || 10;
      const efficiency = gameState.phase === PHASES.RETURNING 
        ? (classification?.rendimentoCombustivelVolta || 10)
        : (classification?.rendimentoCombustivelIda || 10);
      
      const travelTime = gameState.phase === PHASES.RETURNING 
        ? calculateReturnTravelTime(distance)
        : calculateTravelTime(distance);
      
      const tripFuelConsumption = calculateFuelConsumption(distance, efficiency);
      fuelPerTick = tripFuelConsumption / travelTime;
      batteryPerTick = 1.5;
      
    } else if (gameState.phase === PHASES.CHOOSE_DEFENSE || 
               gameState.phase === PHASES.CHOOSE_WEAPON || 
               gameState.phase === PHASES.CHOOSE_NET) {
      fuelPerTick = 1;
      
      let noiseCancellerDrain = 0;
      if (recommendedApproach === 'FURTIVO') {
        noiseCancellerDrain = 2;
      } else if (recommendedApproach === 'COMEDIDO') {
        noiseCancellerDrain = 1;
      }
      
      batteryPerTick = 0.7 + noiseCancellerDrain;
    }
    
    fuelTimerRef.current = setInterval(() => {
      gameState.setFuel((f) => {
        const next = Math.max(0, f - fuelPerTick);
        if (next <= 0) {
          clearAllTimers();
          endGame(false, 'Combustível esgotado!');
        }
        return next;
      });
    }, 1000);

    batteryTimerRef.current = setInterval(() => {
      gameState.setBattery((b) => {
        const next = Math.max(0, b - batteryPerTick);
        if (next <= 0) {
          clearAllTimers();
          endGame(false, 'Bateria esgotada! O drone foi perdido!');
        }
        return next;
      });
    }, 1000);
    
    return () => {
      if (fuelTimerRef.current) clearInterval(fuelTimerRef.current);
      if (batteryTimerRef.current) clearInterval(batteryTimerRef.current);
    };
  }, [gameState.started, gameState.phase, gameState.runId, classification, recommendedApproach]);

  useEffect(() => {
    if (selectedDuck !== prevDuckRef.current && gameState.started) {
      clearAllTimers();
      gameState.reset();
      gameState.setStarted(false);
    }
    prevDuckRef.current = selectedDuck;
  }, [selectedDuck, gameState.started]);

  const handleStartProtocol = () => {
    if (gameState.phase !== PHASES.READY) return;
    gameState.setPhase(PHASES.TRAVELING_TO);
    gameState.setTravelProgress(0);
    gameState.setMessage('Drone viajando até a localização do pato primordial...');
    
    const distance = classification?.distancia || 10;
    const travelTime = Math.max(2, Math.min(6, distance / 100));
    
    travelIntervalRef.current = setInterval(() => {
      gameState.setTravelProgress(prev => {
        const next = prev + (100 / (travelTime * 10));
        if (next >= 100) {
          clearInterval(travelIntervalRef.current);
          gameState.setPhase(PHASES.CHOOSE_DEFENSE);
          gameState.setMessage('Pato avistado! Prepare-se para a peleja!');
          gameState.setTravelProgress(0);
          gameState.setNoiseCancellerActive(true);
        }
        return Math.min(100, next);
      });
    }, 100);
  };

  const handleDefenseChoice = (code) => {
    if (gameState.phase !== PHASES.CHOOSE_DEFENSE) return;
    const correct = code === recommendedDefense;
    
    consumeBattery(BATTERY_COST.DEFENSE);
    
    if (!correct) {
      if (recommendedApproach === 'COMBATIVO') {
        damageOnError('Dano crítico! O drone foi destruído!');
        gameState.setMessage('Defesa incorreta! O pato ataca.');
      } else {
        gameState.setMessage('Defesa incorreta! O pato não nos notou, mas cuidado com a bateria!');
      }
    } else {
      gameState.setMessage('Defesa escolhida com sucesso!');
      gameState.setPhase(PHASES.CHOOSE_WEAPON);
    }
  };

  const handleWeaponChoice = (code) => {
    if (gameState.phase !== PHASES.CHOOSE_WEAPON) return;
    const correct = code === recommendedWeapon;
    
    consumeBattery(BATTERY_COST.WEAPON);
    
    if (!correct) {
      damageOnError('Dano crítico! O drone foi destruído!');
      gameState.setMessage(`Arma ineficaz! O pato${recommendedApproach !== 'COMBATIVO' ? ', em meio aos seus sonhos de hibernação,' : ''} contra-ataca.`);
    } else {
      gameState.setMessage('Ataque efetivo. Vamos conseguir capturar o pato!');
      gameState.setPhase(PHASES.CHOOSE_NET);
    }
  };

  const handleNetChoice = (code) => {
    if (gameState.phase !== PHASES.CHOOSE_NET) return;
    const correct = code === recommendedNet;
    
    consumeBattery(BATTERY_COST.NET);
    
    if (!correct) {
      damageOnError('Dano crítico! O drone foi perdido!');
      gameState.setMessage(`Rede inadequada! O pato${recommendedApproach !== 'COMBATIVO' ? ', em meio aos seus sonhos de hibernação,' : ''} contra-ataca.`);
    } else {
      gameState.setMessage('Rede lançada com sucesso! O pato foi capturado!');
      gameState.setPhase(PHASES.RETURNING);
      gameState.setTravelProgress(0);
      gameState.setNoiseCancellerActive(false);
      
      const distance = classification?.distancia || 10;
      const travelTime = calculateReturnTravelTime(distance);
      
      travelIntervalRef.current = setInterval(() => {
        gameState.setTravelProgress(prev => {
          const next = prev + (100 / (travelTime * 10));
          if (next >= 100) {
            clearInterval(travelIntervalRef.current);
            
            gameState.setFuel(currentFuel => {
              if (currentFuel <= 0) {
                endGame(false, 'Combustível esgotado! O Drone foi perdido.');
              } else {
                gameState.setBattery(currentBattery => {
                  if (currentBattery <= 0) {
                    endGame(false, 'Bateria esgotada! O Drone foi perdido.');
                  } else {
                    finishMission(true);
                  }
                  return currentBattery;
                });
              }
              return currentFuel;
            });
            gameState.setTravelProgress(0);
          }
          return Math.min(100, next);
        });
      }, 100);
    }
  };

  const finishMission = async (success) => {
    const win = gameState.life > 0 && gameState.fuel > 0 && gameState.battery > 0 && success;
    
    if (win) {
      endGame(true, 'Sucesso! Pato Capturado!');
      try {
        const idToCapture = selectedDuck;
        const { capturarPato } = await import('../../lib/apiClient');
        if (idToCapture) await capturarPato(idToCapture);
      } catch {}
      await refreshDucks();
    } else {
      endGame(false, 'Ataque Falhou! Drone destruído!');
    }
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1, color: "#FFFFFF" }}>
          Missão de Captura
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "#B0B0B0" }}>
          Controle drones a distância e capture patos primordiais.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
          <FormControl sx={{ minWidth: 260 }}>
            <InputLabel>Pato Alvo</InputLabel>
            <Select 
              value={selectedDuck} 
              onChange={(e) => setSelectedDuck(e.target.value)} 
              label="Pato Alvo"
            >
              {ducks.map((d) => (
                <MenuItem key={d.id} value={String(d.id)}>{`Pato #${d.id}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button 
            variant="contained" 
            onClick={gameState.start} 
            disabled={!classification || loading || ducks.length === 0 || !selectedDuck || gameState.started} 
          >
            Iniciar Missão
          </Button>
          {loading && <Typography sx={{ color: '#B0B0B0' }}>Carregando análise…</Typography>}
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <MetricsCard classification={classification} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <RecommendationsCard classification={classification} />
          </Grid>
        </Grid>

        {gameState.started && (
          <Card sx={{ 
            backgroundColor: '#1A2C2C', 
            border: '1px solid #00E0B7', 
            mb: 3, 
            position: 'relative', 
            minHeight: '445px' 
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <StatusBar label="Integridade do Drone" value={gameState.life} />
                <StatusBar 
                  label={`Combustível (rendendo ${classification ? `${formatDistance(gameState.phase < PHASES.RETURNING ? classification.rendimentoCombustivelIda : classification.rendimentoCombustivelVolta)} km/L` : ''})`} 
                  value={gameState.fuel} 
                />
                <BatteryIndicator battery={gameState.battery} />
                <Box sx={{ flex: 1, ml: 2 }}>
                  <Typography variant="body2" sx={{ color: '#FFFFFF', mb: 0.5 }}>Distância</Typography>
                  <Chip 
                    label={classification ? `${formatDistance(currentDistance)} km` : '-'} 
                    sx={{ backgroundColor: '#2A3C3C', color: '#FFFFFF', border: '1px solid #00E0B7' }} 
                  />
                </Box>
              </Box>

              <NoiseCancellerIndicator 
                active={gameState.noiseCancellerActive} 
                approach={recommendedApproach} 
              />

              {gameState.phase === PHASES.READY && (
                <PhaseReady onStart={handleStartProtocol} />
              )}
              
              {gameState.phase === PHASES.TRAVELING_TO && (
                <PhaseTraveling progress={gameState.travelProgress} isReturn={false} />
              )}
              
              {gameState.phase === PHASES.CHOOSE_DEFENSE && (
                <PhaseChoice
                  title="O MELHOR ATAQUE É UMA DEFESA FORTE!"
                  text="Antes de atacarmos, escolha a melhor DEFESA contra o pato alvo."
                  options={DEFENSES}
                  onChoose={handleDefenseChoice}
                />
              )}
              
              {gameState.phase === PHASES.CHOOSE_WEAPON && (
                <PhaseChoice
                  title="A MELHOR DEFESA É ATACAR COM MAIS FORÇA!"
                  text="Escolha a ARMA que será mais eficiente contra o pato alvo"
                  options={WEAPONS}
                  onChoose={handleWeaponChoice}
                />
              )}
              
              {gameState.phase === PHASES.CHOOSE_NET && (
                <PhaseChoice
                  title="ESTAMOS QUASE LÁ!"
                  text="O pato está quase no papo, mas precisamos trazê-lo para a base. Prepare a rede do TAMANHO adequado para sua captura."
                  options={NETS}
                  onChoose={handleNetChoice}
                />
              )}
              
              {gameState.phase === PHASES.RETURNING && (
                <PhaseTraveling progress={gameState.travelProgress} isReturn={true} />
              )}

              {!!gameState.message && (
                <Typography variant="body2" sx={{ bottom: 0, color: '#B0B0B0', mt: 2, textAlign: 'center' }}>
                  {gameState.message}
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {gameState.result && (
          <ResultCard 
            result={gameState.result} 
            life={gameState.life} 
            battery={gameState.battery} 
            onRetry={gameState.start} 
          />
        )}
      </Box>
    </Layout>
  );
}

function LoadingFallback() {
  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#00E0B7' }} />
      </Box>
    </Layout>
  );
}

function DroneControlPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DroneControlContent />
    </Suspense>
  );
}

export default DroneControlPage;