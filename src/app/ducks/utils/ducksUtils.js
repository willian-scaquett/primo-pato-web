export const truncateText = (text, maxLength = 20) => {
  if (!text) return "-";
  return text.length > maxLength ? `${text.substring(0, maxLength - 4)}...` : text;
};

export const formatLocation = (duck) => {
  return [duck.cidade, duck.estado, duck.pais].filter(Boolean).join(" / ") || "-";
};

export const getSearchableText = (duck) => {
  return [
    duck.id,
    duck.numeroSerieDrone,
    duck.pais,
    duck.estado,
    duck.cidade,
    duck.capturado ? "Sim" : "Não",
  ].join(" ").toLowerCase();
};

export const sortComparator = (a, b, orderBy, orderDirection) => {
  const aValue = a[orderBy];
  const bValue = b[orderBy];
  
  if (aValue === undefined || bValue === undefined) return 0;

  let comparison = 0;
  if (typeof aValue === "number" && typeof bValue === "number") {
    comparison = aValue - bValue;
  } else {
    comparison = String(aValue).localeCompare(String(bValue));
  }

  return orderDirection === "asc" ? comparison : -comparison;
};

export const formatDuckTooltip = (duck) => (
  <>
    Altura: {duck.altura?.toString().replace(".", ",")} cm <br />
    Peso: {duck.peso?.toString().replace(".", ",")} g <br />
    Nº de mutações: {duck.quantidadeMutacoes} <br />
    Frequência cardíaca: {duck.bpm ? `${duck.bpm} bpm` : "-"} <br />
    Estado de hibernação: {duck.estadoHibernacao} <br />
    Super-poder:{" "}
    {duck.nomeSuperPoder ? `${duck.nomeSuperPoder} - ${duck.tipoSuperPoder}` : "-"}
  </>
);

export const formatDroneTooltip = (duck) => (
  <>
    Nº de série: {duck.numeroSerieDrone} <br />
    Modelo: {duck.modeloDrone} <br />
    Fabricante: {duck.fabricanteDrone} <br />
    País: {duck.paisDrone}
  </>
);

export const formatLocationTooltip = (duck) => (
  <>
    Latitude: {duck.latitude?.toString().replace(".", ",")} <br />
    Longitude: {duck.longitude?.toString().replace(".", ",")} <br />
    Precisão do GPS: {duck.precisao?.toString().replace(".", ",")} m <br />
    Endereço: {duck.endereco} <br />
    Ponto de referência: {duck.pontoReferencia || "-"}
  </>
);