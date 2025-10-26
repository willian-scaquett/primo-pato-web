'use client';

import React, { Suspense, useEffect, useMemo, useRef, useCallback } from 'react';
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

  const {
    phase,
    started,
    runId,
    travelProgress,
    life,
    fuel,
    battery,
    noiseCancellerActive,
    message,
    result,
    setResult,
    setMessage,
    setPhase,
    setStarted,
    setLife,
    setBattery,
    setFuel,
    reset,
    setTravelProgress,
    setNoiseCancellerActive,
    start
  } = gameState;

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
    const inBattle = phase === PHASES.CHOOSE_DEFENSE || 
                     phase === PHASES.CHOOSE_WEAPON || 
                     phase === PHASES.CHOOSE_NET;
    if (inBattle) return 0;
    return (classification.distancia - (travelProgress / 100 * classification.distancia));
  }, [classification, phase, travelProgress]);

  const clearAllTimers = () => {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    if (fuelTimerRef.current) clearInterval(fuelTimerRef.current);
    if (batteryTimerRef.current) clearInterval(batteryTimerRef.current);
    if (travelIntervalRef.current) clearInterval(travelIntervalRef.current);
  };

  const endGame = useCallback((win, msg) => {
    clearAllTimers();
    setResult(win ? 'victory' : 'defeat');
    setMessage(msg);
    setPhase(PHASES.FINISHED);
    setStarted(false);
  }, [setResult, setMessage, setPhase, setStarted]);

  const damageOnError = (customMessage) => {
    setLife((hp) => {
      const damage = classification ? Math.max(50 * (classification.risco / 100), 1) : 25;
      const nhp = Math.max(0, hp - damage);
      if (nhp <= 0) endGame(false, customMessage || 'Dano crítico! O drone foi destruído!');
      return nhp;
    });
  };

  const consumeBattery = (amount) => {
    setBattery((b) => {
      const next = Math.max(0, b - amount);
      if (next <= 0) {
        endGame(false, 'Bateria esgotada! O drone foi perdido!');
      }
      return next;
    });
  };

  useEffect(() => {
    if (!started || phase === PHASES.READY || phase === PHASES.FINISHED) {
      clearAllTimers();
      return;
    }
    
    if (fuelTimerRef.current) clearInterval(fuelTimerRef.current);
    if (batteryTimerRef.current) clearInterval(batteryTimerRef.current);
    
    let fuelPerTick;
    let batteryPerTick;
    
    if (phase === PHASES.TRAVELING_TO || phase === PHASES.RETURNING) {
      const distance = classification?.distancia || 10;
      const efficiency = phase === PHASES.RETURNING 
        ? (classification?.rendimentoCombustivelVolta || 10)
        : (classification?.rendimentoCombustivelIda || 10);
      
      const travelTime = phase === PHASES.RETURNING 
        ? calculateReturnTravelTime(distance)
        : calculateTravelTime(distance);
      
      const tripFuelConsumption = calculateFuelConsumption(distance, efficiency);
      fuelPerTick = tripFuelConsumption / travelTime;
      batteryPerTick = 1.5;
      
    } else if (phase === PHASES.CHOOSE_DEFENSE || 
               phase === PHASES.CHOOSE_WEAPON || 
               phase === PHASES.CHOOSE_NET) {
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
      setFuel((f) => {
        const next = Math.max(0, f - fuelPerTick);
        if (next <= 0) {
          clearAllTimers();
          endGame(false, 'Combustível esgotado!');
        }
        return next;
      });
    }, 1000);

    batteryTimerRef.current = setInterval(() => {
      setBattery((b) => {
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
  }, [started, phase, runId, classification, recommendedApproach, endGame, setFuel, setBattery]);

  useEffect(() => {
    if (selectedDuck !== prevDuckRef.current && started) {
      clearAllTimers();
      reset();
      setStarted(false);
    }
    prevDuckRef.current = selectedDuck;
  }, [selectedDuck, started, reset, setStarted]);

  const handleStartProtocol = () => {
    if (phase !== PHASES.READY) return;
    setPhase(PHASES.TRAVELING_TO);
    setTravelProgress(0);
    setMessage('Drone viajando até a localização do pato primordial...');
    
    const distance = classification?.distancia || 10;
    const travelTime = Math.max(2, Math.min(6, distance / 100));
    
    travelIntervalRef.current = setInterval(() => {
      setTravelProgress(prev => {
        const next = prev + (100 / (travelTime * 10));
        if (next >= 100) {
          clearInterval(travelIntervalRef.current);
          setPhase(PHASES.CHOOSE_DEFENSE);
          setMessage('Pato avistado! Prepare-se para a peleja!');
          setTravelProgress(0);
          setNoiseCancellerActive(true);
        }
        return Math.min(100, next);
      });
    }, 100);
  };

  const handleDefenseChoice = (code) => {
    if (phase !== PHASES.CHOOSE_DEFENSE) return;
    console.log(code);
    console.log(recommendedDefense);
    const correct = code === recommendedDefense;
    
    consumeBattery(BATTERY_COST.DEFENSE);
    
    if (!correct) {
      if (recommendedApproach === 'COMBATIVO') {
        damageOnError('Dano crítico! O drone foi destruído!');
        setMessage('Defesa incorreta! O pato ataca.');
      } else {
        setMessage('Defesa incorreta! O pato não nos notou, mas cuidado com a bateria!');
      }
    } else {
      setMessage('Defesa escolhida com sucesso!');
      setPhase(PHASES.CHOOSE_WEAPON);
    }
  };

  const handleWeaponChoice = (code) => {
    if (phase !== PHASES.CHOOSE_WEAPON) return;
    const correct = code === recommendedWeapon;
    
    consumeBattery(BATTERY_COST.WEAPON);
    
    if (!correct) {
      damageOnError('Dano crítico! O drone foi destruído!');
      setMessage(`Arma ineficaz! O pato${recommendedApproach !== 'COMBATIVO' ? ', em meio aos seus sonhos de hibernação,' : ''} contra-ataca.`);
    } else {
      setMessage('Ataque efetivo. Vamos conseguir capturar o pato!');
      setPhase(PHASES.CHOOSE_NET);
    }
  };

  const handleNetChoice = (code) => {
    if (phase !== PHASES.CHOOSE_NET) return;
    const correct = code === recommendedNet;
    
    consumeBattery(BATTERY_COST.NET);
    
    if (!correct) {
      damageOnError('Dano crítico! O drone foi perdido!');
      setMessage(`Rede inadequada! O pato${recommendedApproach !== 'COMBATIVO' ? ', em meio aos seus sonhos de hibernação,' : ''} contra-ataca.`);
    } else {
      setMessage('Rede lançada com sucesso! O pato foi capturado!');
      setPhase(PHASES.RETURNING);
      setTravelProgress(0);
      setNoiseCancellerActive(false);
      
      const distance = classification?.distancia || 10;
      const travelTime = calculateReturnTravelTime(distance);
      
      travelIntervalRef.current = setInterval(() => {
        setTravelProgress(prev => {
          const next = prev + (100 / (travelTime * 10));
          if (next >= 100) {
            clearInterval(travelIntervalRef.current);
            
            setFuel(currentFuel => {
              if (currentFuel <= 0) {
                endGame(false, 'Combustível esgotado! O Drone foi perdido.');
              } else {
                setBattery(currentBattery => {
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
            setTravelProgress(0);
          }
          return Math.min(100, next);
        });
      }, 100);
    }
  };

  const finishMission = async (success) => {
    const win = life > 0 && fuel > 0 && battery > 0 && success;
    
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
            onClick={start} 
            disabled={!classification || loading || ducks.length === 0 || !selectedDuck || started} 
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

        {started && (
          <Card sx={{ 
            backgroundColor: '#1A2C2C', 
            border: '1px solid #00E0B7', 
            mb: 3, 
            position: 'relative', 
            minHeight: '445px' 
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <StatusBar label="Integridade do Drone" value={life} />
                <StatusBar 
                  label={`Combustível (rendendo ${classification ? `${formatDistance(phase < PHASES.RETURNING ? classification.rendimentoCombustivelIda : classification.rendimentoCombustivelVolta)} km/L` : ''})`} 
                  value={fuel} 
                />
                <BatteryIndicator battery={battery} />
                <Box sx={{ flex: 1, ml: 2 }}>
                  <Typography variant="body2" sx={{ color: '#FFFFFF', mb: 0.5 }}>Distância</Typography>
                  <Chip 
                    label={classification ? `${formatDistance(currentDistance)} km` : '-'} 
                    sx={{ backgroundColor: '#2A3C3C', color: '#FFFFFF', border: '1px solid #00E0B7' }} 
                  />
                </Box>
              </Box>

              <NoiseCancellerIndicator 
                active={noiseCancellerActive} 
                approach={recommendedApproach} 
              />

              {phase === PHASES.READY && (
                <PhaseReady onStart={handleStartProtocol} />
              )}
              
              {phase === PHASES.TRAVELING_TO && (
                <PhaseTraveling progress={travelProgress} isReturn={false} />
              )}
              
              {phase === PHASES.CHOOSE_DEFENSE && (
                <PhaseChoice
                  title="O MELHOR ATAQUE É UMA DEFESA FORTE!"
                  text="Antes de atacarmos, escolha a melhor DEFESA contra o pato alvo."
                  options={DEFENSES}
                  onChoose={handleDefenseChoice}
                />
              )}
              
              {phase === PHASES.CHOOSE_WEAPON && (
                <PhaseChoice
                  title="A MELHOR DEFESA É ATACAR COM MAIS FORÇA!"
                  text="Escolha a ARMA que será mais eficiente contra o pato alvo"
                  options={WEAPONS}
                  onChoose={handleWeaponChoice}
                />
              )}
              
              {phase === PHASES.CHOOSE_NET && (
                <PhaseChoice
                  title="ESTAMOS QUASE LÁ!"
                  text="O pato está quase no papo, mas precisamos trazê-lo para a base. Prepare a rede do TAMANHO adequado para sua captura."
                  options={NETS}
                  onChoose={handleNetChoice}
                />
              )}
              
              {phase === PHASES.RETURNING && (
                <PhaseTraveling progress={travelProgress} isReturn={true} />
              )}

              {!!message && (
                <Typography variant="body2" sx={{ bottom: 0, color: '#B0B0B0', mt: 2, textAlign: 'center' }}>
                  {message}
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {result && (
          <ResultCard 
            result={result} 
            life={life} 
            battery={battery} 
            onRetry={start} 
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