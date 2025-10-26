export const formatCurrency = (v) => {
  const n = Number(v);
  if (Number.isNaN(n)) return "-";
  return '₽ ' + new Intl.NumberFormat("pt-BR").format(n);
};

export const toNumber = (v) => {
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

export const formatDistance = (distancia) => {
  if (!distancia) return "-";
  return `${distancia.toFixed(1)} km`.replace(".", ",");
};