export const normalizeCode = (str) => {
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