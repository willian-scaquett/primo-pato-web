## 🦆 PRIMO PATO WEB — Sistema de Monitoramento de Patos Primordiais


## 🚀 Começando

### Pré‑requisitos
- Node.js 18+ (recomendado 20+)
- npm 8+ (ou pnpm/yarn/bun, se preferir)

### Instalação e execução
```bash
# instalar dependências
npm install

# executar em desenvolvimento (Turbopack)
npm run dev

# lint
npm run lint
```

Abra `http://localhost:8080` no navegador. A aplicação redireciona para `‎/login` por padrão.


## 🧰 Tecnologias e versões
- Next.js: 15.5.6 (App Router)
- React: 19.1.0 / React DOM: 19.1.0
- MUI: 7.3.4 + Emotion (^11.14.x)
- Leaflet: 1.9.4 / React‑Leaflet: 5.0.0
- ESLint: ^9


### ✨ Destaques
- Mapa interativo (Leaflet/React-Leaflet) com geocodificação reversa (Nominatim) e pontos turísticos (Overpass)
- Fluxo completo: Login → Dashboard → Registro/Consulta → Classificação → Mini‑game de Captura
- Proteção de URLs no cliente via `sessionStorage` + redirecionamentos
- Consumo de API externa com token Bearer


## 🔐 Autenticação e Autorização
- Login em `‎/login` usando `loginUsuario` → token retornado é salvo em `sessionStorage` como `auth_token`.
- Páginas públicas: `‎/login`, `‎/register`. Todas as demais exigem token.
- Proteção de URL no cliente: `components/Layout/Layout.js` verifica o token a cada navegação e redireciona para `‎/login` quando ausente.
- Logout: Remove o token e leva para `‎/login`.


## 🚫 Bloqueio de URL (guard)
- Implementado no cliente via `useEffect` no `Layout`.
- Redireciona usuários não autenticados ao entrar em rotas privadas (deep link) e ao navegar entre páginas.
- A rota raiz `‎/` também redireciona para `‎/login` (`src/app/page.js`).


## 🗺️ Mapa Interativo
- Componente: `components/Map/SelectableMap.js` (React‑Leaflet + Leaflet)
- Tiles: OpenStreetMap (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`)
- Geocodificação reversa: Nominatim (`https://nominatim.openstreetmap.org/reverse`)
- Pontos turísticos próximos: Overpass API (busca museus, atrações, monumentos, praças, parques etc.)
- Uso no formulário: ao clicar no mapa, latitude/longitude são preenchidos e, se possível, cidade, país e ponto turístico mais relevante são sugeridos.


## 🔗 Integração com API Externa
Base atual: `http://130.107.74.13:8080`

Funções principais (`src/lib/apiClient.js`):
- `cadastrarUsuario(payload)` → `POST /usuario/cadastrar`
- `loginUsuario(payload)` → `POST /usuario/login` (retorna token)
- `buscarPatos(filtros?)` → `GET /pato`
- `cadastrarPato(payload)` → `POST /pato/cadastrar`
- `apagarPato(id)` → `DELETE /pato/apagar/{id}`
- `atualizarPato(payloadComId)` → `PUT /pato/editar/{id}`
- `buscarPatoPorId(id)` → `GET /pato/{id}`
- `capturarPato(id)` → `PUT /pato/capturar/{id}`
- `buscarClassificacaoPato(id)` → `GET /missaoinfo/{id}`
- `buscarPaises()` → `GET /pais`

Autorização: quando presente, o token é enviado em `Authorization: Bearer <token>`.


## 🧭 Páginas e Fluxos
- `‎/login` — autenticação com e‑mail e senha; salva token; link para cadastro.
- `‎/register` — cria usuário (nome, e‑mail, senha/confirmar).
- `‎/dashboard` — visão geral com cartões de acesso às áreas principais.
- `‎/data-registration` — formulário completo para registrar patos:
  - Dados do drone (nº de série, modelo, fabricante, país)
  - Medidas (altura/peso)
  - Localização (cidade, país, latitude, longitude, ponto turístico)
  - Precisão (slider)
  - Estado de hibernação e campos condicionais (BPM, superpoder)
  - Mapa fixo para preencher automaticamente a localização
- `‎/ducks` — listagem com ações: editar, ver classificação e excluir (com confirmação).
- `‎/ducks/[id]/edit` — edição dos dados do pato; mesmo layout do formulário com pré‑preenchimento.
- `‎/classification` — seleciona um pato e exibe classificação (defesa/arma/rede recomendadas, custo, risco, ganhos, distância). Botão “Capturar pato” direciona para o mini‑game.
- `‎/drone-control` — mini‑game de captura baseado nas recomendações da classificação; sucesso marca o pato como capturado na API e atualiza a lista de não capturados.


## 🎨 Tema e UI
- Tema dark personalizado (MUI) com paleta teal, ajustes em `Button`, `TextField`, `Card`, `AppBar` etc.
- Provider central: `src/theme/ThemeProvider.js` com `CssBaseline`.
- Navegação superior em `components/Layout/Header.js` com acesso rápido às áreas do app e ação de logout.


## ☁️ Implantação na Vercel

- Produção: `https://primo-pato-web.vercel.app`
