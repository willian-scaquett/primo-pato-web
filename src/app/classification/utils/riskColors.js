export const getRiskColor = (risco) => {
  if (risco >= 70) return "#FF6B6B";
  if (risco >= 40) return "#FFA500";
  return "#00E0B7";
};