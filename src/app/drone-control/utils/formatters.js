export const formatDistance = (value) => {
  return new Intl.NumberFormat("pt-BR").format(Number(value || 0).toFixed(2));
};

export const getRiskColor = (risk) => {
  if (risk >= 70) return '#FF6B6B';
  if (risk >= 40) return '#FFA500';
  return '#00E0B7';
};

export const getBarColor = (value) => {
  if (value > 40) return '#00E0B7';
  if (value > 25) return '#FFA500';
  return '#FF6B6B';
};