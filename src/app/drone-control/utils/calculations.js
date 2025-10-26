export const calculateTravelTime = (distance) => {
  return Math.max(4, Math.min(6, 4 + (distance / 20000) * 2));
};

export const calculateReturnTravelTime = (distance) => {
  return Math.max(3, Math.min(10, distance / 10));
};

export const calculateFuelConsumption = (distance, efficiency) => {
  const efficiencyScore = 300 / efficiency;
  return Math.min(30, 10 + Math.log10(efficiencyScore + 1) * 14);
};