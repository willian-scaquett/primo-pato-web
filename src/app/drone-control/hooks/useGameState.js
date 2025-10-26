import { useState } from 'react';
import { PHASES } from '../constants/gameConfig';

export const useGameState = () => {
  const [started, setStarted] = useState(false);
  const [life, setLife] = useState(100);
  const [fuel, setFuel] = useState(100);
  const [battery, setBattery] = useState(100);
  const [phase, setPhase] = useState(PHASES.READY);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const [travelProgress, setTravelProgress] = useState(0);
  const [runId, setRunId] = useState(0);
  const [noiseCancellerActive, setNoiseCancellerActive] = useState(false);

  const reset = () => {
    setResult(null);
    setMessage('');
    setLife(100);
    setFuel(100);
    setBattery(100);
    setPhase(PHASES.READY);
    setTravelProgress(0);
    setNoiseCancellerActive(false);
  };

  const start = () => {
    reset();
    setStarted(true);
    setRunId((x) => x + 1);
  };

  return {
    started,
    setStarted,
    life,
    setLife,
    fuel,
    setFuel,
    battery,
    setBattery,
    phase,
    setPhase,
    message,
    setMessage,
    result,
    setResult,
    travelProgress,
    setTravelProgress,
    runId,
    noiseCancellerActive,
    setNoiseCancellerActive,
    reset,
    start,
  };
};
