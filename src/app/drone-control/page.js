'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
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
import { buscarPatos, buscarClassificacaoPato } from '../../lib/apiClient';

function DroneControlContent() {
  const searchParams = useSearchParams();

  const [ducks, setDucks] = useState([]);
  const [selectedDuck, setSelectedDuck] = useState('');
  const [classification, setClassification] = useState(null);
  const [loading, setLoading] = useState(false);

  const [started, setStarted] = useState(false);
  const [life, setLife] = useState(100);
  const [fuel, setFuel] = useState(100);
  const [battery, setBattery] = useState(100);
  const [phase, setPhase] = useState(0);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const [travelProgress, setTravelProgress] = useState(0);
  const phaseTimerRef = useRef(null);
  const fuelTimerRef = useRef(null);
  const batteryTimerRef = useRef(null);
  const travelIntervalRef = useRef(null);
  const [runId, setRunId] = useState(0);

  const normalizeCode = (str) => {
    if (!str) return '';
    const noAccents = str
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toUpperCase();
    const tokens = noAccents.replace(/[^A-Z0-9]+/g, ' ').trim().split(/\s+/);
    const stop = new Set(['DE', 'DA', 'DO', 'DAS', 'DOS']);
    const filtered = tokens.filter((t) => t && !stop.has(t));
    return filtered.join('_');
  };

  const DEFENSES = [
    { code: 'REVESTIMENTO_HIDROFOBICO', label: 'Revestimento Hidrofóbico' },
    { code: 'CERAMICA_REFRATARIA', label: 'Cerâmica Refratária' },
    { code: 'ISOLAMENTO_GRAFENO', label: 'Isolamento Grafeno' },
    { code: 'CAMPO_TERMORREGULADOR_ADAPTATIVO', label: 'Campo Termorregulador Adaptativo' },
    { code: 'RADAR_INERCIAL_PREVISIVO', label: 'Radar Inercial Previsivo' },
    { code: 'SENSOR_QUANTICO_FENDAS', label: 'Sensor Quântico de Fendas' },
    { code: 'ALHO', label: 'Alho' },
    { code: 'ESCUDO_ADAPTATIVO_IA', label: 'Escudo Adaptativo com IA' },
    { code: 'NENHUMA', label: 'Não precisa!' },
  ];

  const WEAPONS = [
    { code: 'CAPSULA_CONGELAMENTO', label: 'Cápsula de Congelamento' },
    { code: 'AGUA_BENTA', label: 'Água Benta' },
    { code: 'RAIO_LASER', label: 'Raio Laser' },
    { code: 'ONDA_CHOQUE', label: 'Onda de Choque' },
    { code: 'MISSIL_TELEGUIADO', label: 'Míssil Teleguiado' },
  ];

  const NETS = [
    { code: 'PEQUENA', label: 'Pequena' },
    { code: 'MEDIA', label: 'Média' },
    { code: 'GRANDE', label: 'Grande' },
    { code: 'EXTRA_GRANDE', label: 'Extra Grande' },
    { code: 'GIGANTE', label: 'Gigante' },
  ];

  const riscoNum = useMemo(() => (classification ? Number(classification.risco) || 0 : 0), [classification]);
  const riscoColor = riscoNum >= 70 ? '#FF6B6B' : riscoNum >= 40 ? '#FFA500' : '#00E0B7';

  const recommendedDefense = useMemo(() => normalizeCode(classification?.defesaRecomendada), [classification]);
  const recommendedWeapon = useMemo(() => normalizeCode(classification?.armaRecomendada), [classification]);
  const recommendedNet = useMemo(() => normalizeCode(classification?.tamanhoRedeNecessaria), [classification]);

  useEffect(() => {
    (async () => {
      try {
        const list = await buscarPatos({ capturado: false });
        const rows = Array.isArray(list) ? list : [];
        setDucks(rows);
        const pre = searchParams.get('id');
        const exists = pre && rows.find((d) => String(d.id) === String(pre));
        setSelectedDuck(exists ? String(pre) : '');
        if (!exists) setClassification(null);
      } catch {
        setDucks([]);
        setSelectedDuck('');
        setClassification(null);
      }
    })();
  }, [searchParams]);

  useEffect(() => {
    if (!selectedDuck) {
      setClassification(null);
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const data = await buscarClassificacaoPato(selectedDuck);
        setClassification(data);
      } catch {
        setClassification(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedDuck]);

  useEffect(() => {
    if (!started || phase === 1 || phase === 5) {
      if (fuelTimerRef.current) {
        clearInterval(fuelTimerRef.current);
        fuelTimerRef.current = null;
      }
      if (batteryTimerRef.current) {
        clearInterval(batteryTimerRef.current);
        batteryTimerRef.current = null;
      }
      return;
    }
    
    if (fuelTimerRef.current) clearInterval(fuelTimerRef.current);
    if (batteryTimerRef.current) clearInterval(batteryTimerRef.current);
    
    let perTick;
    let batteryPerTick;
    
    if (phase === 1.5 || phase === 4.5) {
      const distance = classification?.distancia || 10;
      const travelTime = Math.max(3, Math.min(10, distance / 10));
      const fuelConsumption = Math.min(30, distance / 2);
      perTick = fuelConsumption / travelTime * (classification && phase === 4.5 ? classification.rendimentoCombustivelIda / classification.rendimentoCombustivelVolta : 1);
      batteryPerTick = 0.5;
    } else if (phase === 2 || phase === 3 || phase === 4) {
      perTick = 1;
      batteryPerTick = 0.3;
    }
    
    fuelTimerRef.current = setInterval(() => {
      setFuel((f) => {
        const next = Math.max(0, f - perTick);
        if (next <= 0) {
          clearInterval(fuelTimerRef.current);
          clearInterval(batteryTimerRef.current);
          endGame(false, 'Combustível esgotado!');
        }
        return next;
      });
    }, 1000);

    batteryTimerRef.current = setInterval(() => {
      setBattery((b) => {
        const next = Math.max(0, b - batteryPerTick);
        if (next <= 0) {
          clearInterval(fuelTimerRef.current);
          clearInterval(batteryTimerRef.current);
          endGame(false, 'Bateria esgotada! O drone foi perdido!');
        }
        return next;
      });
    }, 1000);
    
    return () => {
      if (fuelTimerRef.current) clearInterval(fuelTimerRef.current);
      if (batteryTimerRef.current) clearInterval(batteryTimerRef.current);
    };
  }, [started, phase, runId, classification]);

  const endGame = (win, msg) => {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    if (fuelTimerRef.current) clearInterval(fuelTimerRef.current);
    if (batteryTimerRef.current) clearInterval(batteryTimerRef.current);
    if (travelIntervalRef.current) clearInterval(travelIntervalRef.current);
    setResult(win ? 'victory' : 'defeat');
    setMessage(msg);
    setPhase(5);
    setStarted(false);
  };

  const resetGameState = () => {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    if (fuelTimerRef.current) clearInterval(fuelTimerRef.current);
    if (batteryTimerRef.current) clearInterval(batteryTimerRef.current);
    if (travelIntervalRef.current) clearInterval(travelIntervalRef.current);
    setResult(null);
    setMessage('');
    setLife(100);
    setFuel(100);
    setBattery(100);
    setPhase(1);
    setTravelProgress(0);
  };

  const startGame = () => {
    if (!classification) return;
    resetGameState();
    setRunId((x) => x + 1);
    setStarted(true);
  };

  useEffect(() => {
    if (!selectedDuck) return;
    if (started) {
      resetGameState();
      setStarted(false);
    }
  }, [selectedDuck, started]);

  const handleStartProtocol = () => {
    if (phase !== 1) return;
    setPhase(1.5);
    setTravelProgress(0);
    setMessage('Drone viajando até a localização do pato primordial...');
    
    const distance = classification?.distancia || 10;
    const travelTime = Math.max(2, Math.min(6, distance / 10));
    
    travelIntervalRef.current = setInterval(() => {
      setTravelProgress(prev => {
        const next = prev + (100 / (travelTime * 10));
        if (next >= 100) {
          clearInterval(travelIntervalRef.current);
          setPhase(2);
          setMessage('Pato avistado! Prepare-se para o ataque!');
          setTravelProgress(0);
        }
        return Math.min(100, next);
      });
    }, 100);
  };

  const damageOnError = (customMessage) => {
    setLife((hp) => {
      const nhp = Math.max(0, hp - (classification ? Math.max(50 * (classification.risco / 100), 1) : 25));
      if (nhp <= 0) endGame(false, customMessage || 'Dano crítico! O drone foi destruído!');
      return nhp;
    });
  };

  const chooseDefense = (code) => {
    if (phase !== 2) return;
    const correct = code === recommendedDefense;
    
    setBattery((b) => {
      const next = Math.max(0, b - 5);
      if (next <= 0) {
        endGame(false, 'Bateria esgotada! O drone foi perdido!');
      }
      return next;
    });
    
    if (!correct) {
      damageOnError('Dano crítico! O drone foi destruído!');
      setMessage('Defesa incorreta! O pato ataca.');
    } else {
      setMessage('Defesa escolhida com sucesso!');
      setPhase(3);
    }
  };

  const chooseWeapon = (code) => {
    if (phase !== 3) return;
    const correct = code === recommendedWeapon;
    
    setBattery((b) => {
      const next = Math.max(0, b - 5);
      if (next <= 0) {
        endGame(false, 'Bateria esgotada! O drone foi perdido!');
      }
      return next;
    });
    
    if (!correct) {
      damageOnError('Dano crítico! O drone foi destruído!');
      setMessage('Arma ineficaz! O pato contra-ataca.');
    } else {
      setMessage('Ataque efetivo. Vamos conseguir neutralizar o pato!');
      setPhase(4);
    }
  };

  const chooseNet = (code) => {
    if (phase !== 4) return;
    const correct = code === recommendedNet;
    
    setBattery((b) => {
      const next = Math.max(0, b - 5);
      if (next <= 0) {
        endGame(false, 'Bateria esgotada! O drone foi perdido!');
      }
      return next;
    });
    
    if (!correct) {
      damageOnError('Dano crítico! O drone foi perdido!');
      setMessage('Rede inadequada! O pato contra-ataca.');
    } else {
      setMessage('Rede lançada com sucesso! O pato foi capturado!');
      setPhase(4.5);
      setTravelProgress(0);
      
      const distance = classification?.distancia || 10;
      const travelTime = Math.max(3, Math.min(10, distance / 10));
      
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
                    finishEvaluation(true);
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

  const finishEvaluation = async (lastHitSuccess) => {
    const win = life > 0 && fuel > 0 && battery > 0 && lastHitSuccess;
    if (win) {
      endGame(true, 'Sucesso! Pato Capturado!');
      try {
        const idToCapture = selectedDuck;
        const { capturarPato } = await import('../../lib/apiClient');
        if (idToCapture) await capturarPato(idToCapture);
      } catch {}
      try {
        const updated = await buscarPatos({ capturado: false });
        const rows = Array.isArray(updated) ? updated : [];
        setDucks(rows);
        if (!rows.find((d) => String(d.id) === String(selectedDuck))) {
          setSelectedDuck(rows[0] ? String(rows[0].id) : '');
        }
      } catch {}
    } else {
      endGame(false, 'Ataque Falhou! Drone destruído!');
    }
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1, color: "#FFFFFF" }}>
          DRONE CONTROL
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "#B0B0B0" }}>
          Controle drones e capture patos a distância.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
          <FormControl sx={{ minWidth: 260 }}>
            <InputLabel>Pato Alvo</InputLabel>
            <Select value={selectedDuck} onChange={(e) => setSelectedDuck(e.target.value)} label="Pato Alvo">
              {ducks.map((d) => (
                <MenuItem key={d.id} value={String(d.id)}>{`Pato #${d.id}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={startGame} disabled={!classification || loading || ducks.length === 0 || !selectedDuck} sx={{ backgroundColor: '#00E0B7', color: '#0A1C1C','&:hover': { backgroundColor: '#00B894', color: '#0A1C1C' } }}>
            Iniciar Missão
          </Button>
          {loading && <Typography sx={{ color: '#B0B0B0' }}>Carregando análise…</Typography>}
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ backgroundColor: '#1A2C2C', border: '1px solid #00E0B7', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>Métricas</Typography>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" sx={{ color: '#FFFFFF', mb: 0.5 }}>Risco da Missão de Captura</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LinearProgress variant="determinate" value={Math.max(0, Math.min(100, riscoNum))} sx={{ flexGrow: 1, height: 10, borderRadius: 6, backgroundColor: '#2A3C3C', '& .MuiLinearProgress-bar': { backgroundColor: riscoColor } }} />
                    <Chip label={`${(riscoNum || 0).toFixed(0)}%`} sx={{ backgroundColor: riscoColor, color: riscoNum > 70 ? '#FFFFFF' : '#0A1C1C', fontWeight: 'bold' }} />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip label={`Ganho Científico: ${classification?.ganhoCientifico ?? '-'}${classification?.ganhoCientifico ? '%' : ''}`} sx={{ backgroundColor: '#00E0B7', color: '#0A1C1C', fontWeight: 'bold' }} />
                  <Chip label={`Ganho Paranormal: ${classification?.ganhoParanormal ?? '-'}${classification?.ganhoParanormal ? '%' : ''}`} sx={{ backgroundColor: '#9B59B6', color: '#FFFFFF', fontWeight: 'bold' }} />
                  <Chip label={`Distância: ${classification ? `${new Intl.NumberFormat("pt-BR").format(Number(classification.distancia || 0).toFixed(2))} km` : '-'}`} sx={{ backgroundColor: '#2A3C3C', color: '#FFFFFF', border: '1px solid #00E0B7' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ backgroundColor: '#1A2C2C', border: '1px solid #00E0B7', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>Recomendações</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#B0B0B0' }}>Defesa Recomendada</Typography>
                    <Chip label={classification?.defesaRecomendada || '-'} sx={{ backgroundColor: '#2A3C3C', color: '#FFFFFF', border: '1px solid #00E0B7' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#B0B0B0' }}>Arma Recomendada</Typography>
                    <Chip label={classification?.armaRecomendada || '-'} sx={{ backgroundColor: '#2A3C3C', color: '#FFFFFF', border: '1px solid #00E0B7' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#B0B0B0' }}>Tamanho da Rede</Typography>
                    <Chip label={classification?.tamanhoRedeNecessaria || '-'} sx={{ backgroundColor: '#2A3C3C', color: '#FFFFFF', border: '1px solid #00E0B7' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {started && (
          <Card sx={{ backgroundColor: '#1A2C2C', border: '1px solid #00E0B7', mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ flex: 2, mr: 2 }}>
                  <Typography variant="body2" sx={{ color: '#FFFFFF', mb: 0.5 }}>Integridade do Drone</Typography>
                  <LinearProgress variant="determinate" value={life} sx={{ height: 10, borderRadius: 6, backgroundColor: '#2A3C3C', '& .MuiLinearProgress-bar': { backgroundColor: life > 50 ? '#00E0B7' : '#FF6B6B' } }} />
                </Box>
                <Box sx={{ flex: 2, ml: 2, mr: 2 }}>
                  <Typography variant="body2" sx={{ color: '#FFFFFF', mb: 0.5 }}>Combustível</Typography>
                  <LinearProgress variant="determinate" value={fuel} sx={{ height: 10, borderRadius: 6, backgroundColor: '#2A3C3C', '& .MuiLinearProgress-bar': { backgroundColor: fuel > 20 ? '#00E0B7' : '#FF6B6B' } }} />
                </Box>
                <Box sx={{ flex: 1, ml: 2 }}>
                  <Typography variant="body2" sx={{ color: '#FFFFFF', mb: 0.5 }}>Bateria</Typography>
                  <Chip label={`${battery.toFixed(0)}%`} sx={{ backgroundColor: battery > 20 ? '#FFA500' : '#FF6B6B', color: '#FFFFFF', fontWeight: 'bold' }} />
                </Box>
                <Box sx={{ flex: 1, ml: 2 }}>
                  <Typography variant="body2" sx={{ color: '#FFFFFF', mb: 0.5 }}>Rendimento</Typography>
                  <Chip label={classification ? `${new Intl.NumberFormat("pt-BR").format(Number(phase < 4.5 ? classification.rendimentoCombustivelIda : classification.rendimentoCombustivelVolta).toFixed(2))} km/L` : '-'} sx={{ backgroundColor: '#2A3C3C', color: '#FFFFFF', border: '1px solid #00E0B7' }} />
                </Box>
                <Box sx={{ flex: 1, ml: 2 }}>
                  <Typography variant="body2" sx={{ color: '#FFFFFF', mb: 0.5 }}>Distância a percorrer</Typography>
                  <Chip label={classification ? `${new Intl.NumberFormat("pt-BR").format(Number((classification.distancia - (travelProgress / 100 * classification.distancia)) * !(phase === 2 || phase === 3 || phase === 4) ).toFixed(2))} km` : '-'} sx={{ backgroundColor: '#2A3C3C', color: '#FFFFFF', border: '1px solid #00E0B7' }} />
                </Box>  
              </Box>

              {phase === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
                    DRONE PREPARADO!
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B0B0B0', mb: 2 }}>
                    O combustível e a bateria também são consumidos durante a fase de batalha. Portanto, seja rápido!
                    <br/><br/><strong>Boa sorte!</strong>
                  </Typography>
                  <Button variant="contained" onClick={handleStartProtocol} sx={{ color: '#0A1C1C', backgroundColor: '#00E0B7', '&:hover': { backgroundColor: '#00B894' } }}>
                    Iniciar viagem
                  </Button>
                </Box>
              )}
              {phase === 1.5 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
                    DRONE EM TRÂNSITO
                  </Typography>
                  <Box sx={{ mb: 1, width: '100%', maxWidth: 400 }}>
                    <Typography variant="body2" sx={{ color: '#FFFFFF', mb: 0.5 }}>
                      Progresso da Viagem
                    </Typography>
                    <LinearProgress variant="determinate" value={travelProgress} sx={{ height: 10, borderRadius: 6, backgroundColor: '#2A3C3C', '& .MuiLinearProgress-bar': { backgroundColor: '#00E0B7' } }} />
                  </Box>
                </Box>
              )}
              {phase === 2 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
                    O MELHOR ATAQUE É UMA DEFESA FORTE!
                    <br/><br/>
                    Antes de atacarmos, escolha a melhor DEFESA contra o pato alvo.
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                    {DEFENSES.map((d) => (
                      <Button key={d.code} variant="outlined" onClick={() => chooseDefense(d.code)} sx={{ borderColor: '#00E0B7', color: '#00E0B7' }}>
                        {d.label}
                      </Button>
                    ))}
                  </Box>
                </Box>
              )}
              {phase === 3 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
                    A MELHOR DEFESA É ATACAR COM MAIS FORÇA!
                    <br/><br/>
                    Escolha a ARMA que será mais eficiente contra o pato alvo
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                    {WEAPONS.map((w) => (
                      <Button key={w.code} variant="outlined" onClick={() => chooseWeapon(w.code)} sx={{ borderColor: '#00E0B7', color: '#00E0B7' }}>
                        {w.label}
                      </Button>
                    ))}
                  </Box>
                </Box>
              )}
              {phase === 4 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
                    ESTAMOS QUASE LÁ!
                    <br/><br/>
                    O pato está quase no papo, mas precisamos trazê-lo para a base. Prepare a rede de TAMANHO ideal para sua captura.
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                    {NETS.map((n) => (
                      <Button key={n.code} variant="outlined" onClick={() => chooseNet(n.code)} sx={{ borderColor: '#00E0B7', color: '#00E0B7' }}>
                        {n.label}
                      </Button>
                    ))}
                  </Box>
                </Box>
              )}
              {phase === 4.5 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
                    DRONE RETORNANDO À BASE
                  </Typography>
                  <Box sx={{ mb: 1, width: '100%', maxWidth: 400 }}>
                    <Typography variant="body2" sx={{ color: '#FFFFFF', mb: 0.5 }}>
                      Espero que o combustível seja suficiente...
                    </Typography>
                    <LinearProgress variant="determinate" value={travelProgress} sx={{ height: 10, borderRadius: 6, backgroundColor: '#2A3C3C', '& .MuiLinearProgress-bar': { backgroundColor: '#00E0B7' } }} />
                  </Box>
                </Box>
              )}
              {!!message && (
                <Typography variant="body2" sx={{ color: '#B0B0B0', mt: 2, textAlign: 'center' }}>
                  {message}
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {result && (
          <Card sx={{ backgroundColor: '#1A2C2C', border: '1px solid #00E0B7', mb: 3 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: result === 'victory' ? '#00E0B7' : '#FF6B6B', fontWeight: 'bold', mb: 2 }}>
                {result === 'victory' ? 'Missão concluída com sucesso!' : life <= 0 ? 'A missão falhou. O pato primordial destruiu o drone...' : battery <= 0 ? 'A missão falhou. A bateria acabou e o drone foi perdido...' : 'A missão falhou. O combustível acabou e o drone foi perdido...'}
              </Typography>
              {result === 'defeat' && (
                <Button variant="contained" onClick={startGame} sx={{ color:'#0A1C1C', backgroundColor: '#00E0B7', '&:hover': { backgroundColor: '#00B894' } }}>
                  Tentar novamente
                </Button>
              )}
              {result === 'victory' && (
                <Typography variant="body1" sx={{ color: '#FFFFFF', mb: 2 }}>
                  Obrigado por capturar o <strong>PATO!!!</strong>
                  <br/>Seu esforço é de grande valia para nossas pesquisas.
                </Typography>
              )}
            </CardContent>
          </Card>
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