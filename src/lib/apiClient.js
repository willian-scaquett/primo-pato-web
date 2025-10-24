const API_BASE = "http://130.107.74.13:8080";

/**
 * Gera headers padrão para requisições, incluindo Authorization se houver token
 */
function getHeaders(includeAuth = true) {
  const headers = { "Content-Type": "application/json" };
  if (includeAuth && typeof window !== "undefined") {
    const token = sessionStorage.getItem("auth_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Faz fetch com parsing automático e tratamento de erros
 */
async function fetchJson(url, options = {}, includeAuth = true) {
  const res = await fetch(url, { ...options, headers: getHeaders(includeAuth) });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      typeof data === "string"
        ? data
        : (data && (data.message || data.error)) || "Erro na requisição";
    throw new Error(message);
  }

  return data;
}

// ========================== API PATO ==========================
export function cadastrarPato(payload) {
  return fetchJson(`${API_BASE}/pato/cadastrar`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function atualizarPato(payloadComId) {
  return fetchJson(`${API_BASE}/pato/editar/${payloadComId.id}`, {
    method: "PUT",
    body: JSON.stringify(payloadComId),
  });
}

export function apagarPato(id) {
  return fetchJson(`${API_BASE}/pato/apagar/${id}`, { method: "DELETE" });
}

export function buscarPatos(filtros = {}) {
  const query = new URLSearchParams(filtros).toString();
  return fetchJson(`${API_BASE}/pato${query ? `?${query}` : ""}`);
}

export function buscarPatoPorId(id) {
  return fetchJson(`${API_BASE}/pato/${id}`);
}

export function capturarPato(id) {
  return fetchJson(`${API_BASE}/pato/capturar/${id}`, { method: "PUT" });
}

export function buscarClassificacaoPato(idPato) {
  return fetchJson(`${API_BASE}/missaoinfo/${idPato}`);
}

export function buscarEstadosHibernacao() {
  return fetchJson(`${API_BASE}/pato/estadohibernacao`);
}

// ========================== API USUÁRIO ==========================
export function cadastrarUsuario(payload) {
  return fetchJson(`${API_BASE}/usuario/cadastrar`, {
    method: "POST",
    body: JSON.stringify(payload),
  }, false); // cadastro de usuário não precisa de token
}

export function loginUsuario(payload) {
  return fetchJson(`${API_BASE}/usuario/login`, {
    method: "POST",
    body: JSON.stringify(payload),
  }, false);
}

// ========================== API PAÍSES ==========================
export function buscarPaises() {
  return fetchJson(`${API_BASE}/pais`);
}

// ========================== API DRONE ==========================
export function buscarFabricantes(idPais) {
  return fetchJson(`${API_BASE}/drone/pais/${idPais}/fabricante`);
}

export function buscarModelos(idFabricante) {
  return fetchJson(`${API_BASE}/drone/fabricante/${idFabricante}/modelo`);
}

export function buscarNumerosDeSerie(idModelo) {
  return fetchJson(`${API_BASE}/drone/modelo/${idModelo}/numeroSerie`);
}

// ========================== API SUPER PODER ==========================
export function buscarTiposSuperPoderes() {
  return fetchJson(`${API_BASE}/superpoder/tipo`);
}

export function buscaSuperPoderes(tipoSuperPoder) {
  return fetchJson(`${API_BASE}/superpoder/tipo/${tipoSuperPoder}`);
}