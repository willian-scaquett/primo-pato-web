"use client";

import React, { useState } from "react";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Shield as ShieldIcon,
  GraphicEq as GraphicEqIcon,
  GpsFixed as GpsFixedIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
  WarningAmber as WarningAmberIcon,
  CropFree as CropFreeIcon,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import { Layout } from "../../components/Layout/Layout";

export default function About() {
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const SectionCard = ({ id, icon, title, description, children }) => (
    <Card
      sx={{
        mb: 2,
        background: "#112626",
        border: "1px solid rgba(0,224,183,0.2)",
        borderRadius: 2,
        transition: "0.3s",
        "&:hover": { boxShadow: "0 0 20px rgba(0,224,183,0.1)" },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => toggleExpand(id)}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {icon}
            <Box>
              <Typography variant="h6" sx={{ color: "#00E0B7" }}>
                {title}
              </Typography>
              <Typography sx={{ color: "#B0B0B0", fontSize: "0.9rem" }}>
                {description}
              </Typography>
            </Box>
          </Box>
          <IconButton sx={{ color: "#00E0B7" }}>
            {expanded === id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={expanded === id}>
          <Box sx={{ mt: 2, color: "#ccc" }}>{children}</Box>
        </Collapse>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <Box sx={{ backgroundColor: "#0A1C1C", color: "#fff", minHeight: "100vh", py: 6 }}>
        <Box sx={{ maxWidth: 1000, mx: "auto", px: 2 }}>
          <Typography
            variant="h3"
            align="center"
            sx={{ mb: 2, color: "#00E0B7", fontWeight: "bold" }}
          >
            Classificação dos Patos Primordiais
          </Typography>
          <Typography
            align="center"
            sx={{ mb: 6, color: "#B0B0B0", fontSize: "1.1rem" }}
          >
            Entenda como as classificações dos patos e as estratégias de missão de captura são montadas
          </Typography>

          <SectionCard
            id="defesa"
            icon={<ShieldIcon sx={{ color: "#00E0B7" }} />}
            title="Defesa do Drone"
            description="Como escolhemos a proteção adequada para cada missão"
          >
            <Typography sx={{ color: "#ccc" }}>
              Cada tipo de super-poder conhecido possui sua defesa específica. Se o pato não tem super-poder registrado,
              significa que ele não atacou o primeiro drone de reconhecimento e está hibernando.
            </Typography>
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, background: "#0F2323" }}>
                    <Typography sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
                        Defesa para cada super-poder:
                    </Typography>
                    <List dense>
                        {[
                            "Água - Revestimento Hidrofóbico (₽500) - Blindemos o drone da água.",
                            "Fogo - Cerâmica Refratária (₽800) - Melhor proteger o drone das chamas.",
                            "Eletricidade - Isolamento de Grafeno (₽1000) - Isolemos o drone da eletricidade externa, para evitar curtos circuitos.",
                            "Calor - Campo Termorregulador Adaptativo (₽1200) - Um visão de calor ou algo do gênero? Temos um regulador de temperatura que conseguirá proteger o drone das mais elevadas temperaturas.",
                            "Velocidade - Radar Inercial Previsivo (₽2000) - Se o bicho é rápido, precisamos prever onde ele estará para evitar seus ataques.",
                            "Teletransporte - Sensor Quântico de Fendas (₽5000) - Precisamos descobrir quando o pato abrirá fendas no espaço-tempo.",
                            "Psíquico - Nenhuma (₽0) - Como um ataque psíquico afetaria uma máquina sem psique? O casco padrão do drone aguenta o serviço.",
                            "Sobrenatural - Alho (₽2) - Se funciona com vampiros, funcionará com patos assombração.",
                            "Outro - Escudo adaptativo com IA (₽20000) - Se não sabemos o tipo do poder dele, torcemos para nossa IA descobrir minimamente como."
                        ].map((t) => (
                        <ListItem key={t} sx={{ py: 0 }}>
                            <ListItemText
                            primary={t}
                            primaryTypographyProps={{ sx: { color: "#B0B0B0" } }}
                            />
                        </ListItem>
                        ))}
                    </List>
                </Paper>
            </Grid>
            <Paper
              sx={{
                p: 2,
                mt: 2,
                background: "rgba(0, 224, 183, 0.08)",
                borderLeft: "4px solid #00E0B7",
              }}
            >
              <Typography sx={{ color: "#B0B0B0" }}>
                Se não acordamos o pato da sua hibernação (função do cancelador de ruídos do drone),
                não será necessária uma defesa específica para a missão de captura.
              </Typography>
            </Paper>
          </SectionCard>

          <SectionCard
            id="combustivel"
            icon={<SpeedIcon sx={{ color: "#00E0B7" }} />}
            title="Desempenho do Combustível"
            description="Como o peso do pato afeta o consumo após a captura"
          >
            <Typography sx={{ color: "#ccc" }}>
              A cada 1000 gramas (1kg) do pato, o combustível do drone rende 1km/L a menos.
            </Typography>
            <Paper
              sx={{
                p: 2,
                mt: 2,
                background: "rgba(0, 224, 183, 0.08)",
                borderLeft: "4px solid #00E0B7",
              }}
            >
              <Typography sx={{ color: "#B0B0B0", fontFamily: "monospace" }}>
                Desempenho = 300 km/L - (Peso do Pato / 1000)
              </Typography>
            </Paper>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "#00E0B7" }}>
                Exemplos:
              </Typography>
              <Typography sx={{ color: "#B0B0B0" }}>Pato de 2kg → 298 km/L</Typography>
              <Typography sx={{ color: "#B0B0B0" }}>Pato de 50kg → 250 km/L</Typography>
              <Typography sx={{ color: "#B0B0B0" }}>Pato de 85kg → 215 km/L</Typography>
            </Box>
          </SectionCard>

          <SectionCard
            id="ganhos"
            icon={<PsychologyIcon sx={{ color: "#00E0B7" }} />}
            title="Ganhos Científico e Paranormal"
            description="Quando o pato está  em transe ou desperto, os ganhos de conhecimento científico e paranormais
            são multiplicados por 1,5 ou 2, respectivamente, devido ao nível de atividade de seu organismo."
          >
            <Paper
              sx={{
                p: 2,
                background: "rgba(0, 224, 183, 0.08)",
                borderLeft: "4px solid #00E0B7",
              }}
            >
              <Typography sx={{ color: "#00E0B7", mb: 1 }}>Ganho Científico:</Typography>
              <Typography sx={{ color: "#ccc" }}>
                Quanto mais mutações, mais sequencialmente de DNA temos, logo, mais ganho científico.
              </Typography>
              <Typography
                sx={{
                  color: "#B0B0B0",
                  mt: 1,
                  fontFamily: "monospace",
                  background: "#0A1C1C",
                  p: 1,
                  borderRadius: 1,
                }}
              >
                Ganho Científico = Quantidade de Mutações × Potencializador do Estado de Hibernação
              </Typography>
            </Paper>

            <Paper
              sx={{
                mt: 2,
                p: 2,
                background: "rgba(155, 89, 182, 0.08)",
                borderLeft: "4px solid #9B59B6",
              }}
            >
                <Typography sx={{ color: "#9B59B6", mb: 1 }}>Ganho Paranormal:</Typography>
                <Typography sx={{ color: "#ccc" }}>
                Um pato com super-poderes? Alguns podem até possuir um fator biológico envolvido. Já outros servirão de base para as pesquisas sobre fenômenos paranormais.
                </Typography>
                <Typography
                sx={{
                    color: "#B0B0B0",
                    mt: 1,
                    fontFamily: "monospace",
                    background: "#0A1C1C",
                    p: 1,
                    borderRadius: 1,
                }}
                >
                Ganho Paranormal = Ganho Base do Tipo de Super-Poder × Potencializador do Estado de Hibernação
                </Typography>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, background: "#0F2323" }}>
                        <Typography sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
                            Ganho de conhecimento por super-poder:
                        </Typography>
                        <List dense>
                            {[
                                "• Água: 5 - Um pato tacando água é estranho, mas nada que ofereça grandes ganhos em conhecimento paranormal.",
                                "• Fogo: 7 - Ganho paranormal aumenta, mas ainda é baixo, porque o fogo ainda é um elemento da natureza.",
                                "• Eletricidade: 3 - Ganho paranormal baixo, pois animais controlando eletricidade já é algo conhecido pela ciência.",
                                "• Calor: 10 - Ganho paranormal aumenta, pois visão de valor só existe em HQs.",
                                "• Velocidade: 4 - Ganho paranormal baixo, porque velocidade elevada em animais é algo conhecido pela ciência.",
                                "• Teletransporte: 25 - Ganho paranormal alto. Onde você já viu um pato abrindo fendas quânticas?",
                                "• Psíquico: 30 - Ganho paranormal alto, pois o cara é o Professor Xavier dos patos.",
                                "• Sobrenatural: 50 - Ganho paranormal altíssimo. É UM PATO ASSOMBRAÇÃO!",
                                "• Outro: 20 - Ganho paranormal considerável, pois se trata de um tipo de poder diferente dos conhecidos até então."
                            ].map((t) => (
                            <ListItem key={t} sx={{ py: 0 }}>
                                <ListItemText
                                primary={t}
                                primaryTypographyProps={{ sx: { color: "#B0B0B0" } }}
                                />
                            </ListItem>
                            ))}
                        </List>
                    </Paper>
              </Grid>
            </Paper>
          </SectionCard>

          <SectionCard
            id="arma"
            icon={<GpsFixedIcon sx={{ color: "#00E0B7" }} />}
            title="Escolha da Arma"
            description="Qual arma é a ideial de acordo com as características do pato primordial"
          >
            <Stack spacing={2}>
              {[
                ["Cápsula de Congelamento (₽ 350)", "Para patos hibernando profundamente. Não precisaremos de velocidade para atacá-lo, tampouco poder de fogo. Basta congelá-lo."],
                ["Água Benta (₽ 10)", "Se funciona com vampiros, funcionará também com um pato assombração."],
                ["Onda de Choque (₽ 900)", "Para patos com teletransporte ou super velocidade. Deslocamento é sua maior virtude. Como lidar com isso? Atingindo a maior área possível com uma onda de choque"],
                ["Míssil Teleguiado (₽ 750)", "Quando o super-poder não envolve fatores sobrenaturais ou teletransporte e velocidade, acertá-lo não será difícl. Porém, por ter um super-poder, melhor garantir um bom poder de fogo."],
                ["Raio Laser (₽ 400)", "A arma padrão do drone deve bastar para pato em transe."],
              ].map(([title, text]) => (
                <Paper key={title} sx={{ p: 2, background: "#0F2323", borderLeft: "4px solid #00E0B7" }}>
                  <Typography sx={{ color: "#00E0B7", fontWeight: 600 }}>{title}</Typography>
                  <Typography sx={{ color: "#ccc" }}>{text}</Typography>
                </Paper>
              ))}
            </Stack>
          </SectionCard>

          <SectionCard
            id="abordagem"
            icon={<GraphicEqIcon sx={{ color: "#00E0B7" }} />}
            title="Tipo de Abordagem"
            description="Como decidimos o nível de discrição da missão"
          >
            <Typography sx={{ color: "#ccc" }}>
              A abordagem é determinada pelo estado de hibernação e pela frequência cardíaca do pato.
              O cancelador de ruídos é responsável por silenciar o drone, porém, consome sua bateria.
            </Typography>

            <Stack spacing={2} sx={{ mt: 2 }}>
              {[
                ["Furtivo", "Pato hibernando ou em transe com BPM > 200", "Cancelador de ruídos no modo turbo. Há grandes chances do pato acordar. Não façamos barulho algum."],
                ["Comedido", "Pato hibernando ou em transe com BPM ≤ 200", "Cancelador de ruídos ligado. Ele hiberna e seu coração bate lentamente. Ruídos leves são toleráveis."],
                ["Combativo", "Pato desperto", "Cancelador de ruídos desligado. O pato está desperto! Precisamos dedicar toda a energia do drone para o combate."],
              ].map(([tipo, cond, desc]) => (
                <Paper key={tipo} sx={{ p: 2, background: "#0F2323", borderLeft: "4px solid #00E0B7" }}>
                  <Typography sx={{ color: "#00E0B7", fontWeight: 600 }}>{tipo}</Typography>
                  <Typography sx={{ color: "#ccc" }}>
                    <strong>Quando:</strong> {cond}
                  </Typography>
                  <Typography sx={{ color: "#B0B0B0" }}>{desc}</Typography>
                </Paper>
              ))}
            </Stack>

            <Paper sx={{ mt: 2, p: 2, background: "#112626" }}>
              <Typography sx={{ color: "#B0B0B0" }}>
                <strong>Referência:</strong> A frequência cardíaca de um pato em repouso varia geralmente entre 130 e 230 bpm
              </Typography>
            </Paper>
          </SectionCard>

          <SectionCard
            id="rede"
            icon={<CropFreeIcon sx={{ color: "#00E0B7" }} />}
            title="Tamanho da Rede"
            description="Como escolhemos o tamanho correto da rede de captura"
          >
            <Typography sx={{ color: "#ccc" }}>
              Sem segredos. É como escolher uma roupa: precisa caber, mas não pode ser larga demais (ele poderia escapar pelos buraquinhos).
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {[
                ["Pequena - ₽ 100", "Altura: 0 - 1000 cm"],
                ["Média - ₽ 200", "Altura: 1000 - 2000 cm"],
                ["Grande - ₽ 300", "Altura: 2000 - 5000 cm"],
                ["Extra Grande - ₽ 500", "Altura: 5000 - 10000 cm"],
                ["Gigante - ₽ 1000", "Altura: > 10000 cm"],
              ].map(([t, s], i) => (
                <Grid item xs={12} md={i < 4 ? 6 : 12} key={t}>
                  <Paper sx={{ p: 2, background: "#0F2323", border: "1px solid rgba(0,224,183,0.25)" }}>
                    <Typography sx={{ color: "#00E0B7", fontWeight: 600 }}>{t}</Typography>
                    <Typography sx={{ color: "#B0B0B0" }}>{s}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </SectionCard>

          <SectionCard
            id="risco"
            icon={<WarningAmberIcon sx={{ color: "#00E0B7" }} />}
            title="Cálculo de Risco"
            description="Como avaliamos o perigo de cada missão"
          >
            <Typography sx={{ color: "#ccc" }}>
              O super-poder e o tipo de hibernação são o que definem o risco.
              O quão ativo está o seu organismo potencializa esse valor.
            </Typography>

            <Paper
              sx={{
                p: 2,
                mt: 2,
                background: "rgba(255, 152, 0, 0.06)",
                borderLeft: "4px solid #FF9800",
              }}
            >
              <Typography
                sx={{
                  color: "#FFCC80",
                  fontFamily: "monospace",
                  mb: 1.5,
                }}
              >
                Risco = (Risco do Super-Poder + Risco da Hibernação) × Potencializador BPM
              </Typography>
              <Typography sx={{ color: "#FFECB3" }}>
                <strong>Potencializador BPM:</strong> (BPM % 130) / 100
              </Typography>
              <Typography sx={{ color: "#FFE0B2", fontSize: "0.85rem", mt: 1 }}>
                Base de referência: 130 bpm (frequência cardíaca mínima em repouso)
              </Typography>
            </Paper>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, background: "#0F2323" }}>
                  <Typography sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
                    Risco por estado de hibernação:
                  </Typography>
                  <List dense>
                    {[
                        "• Desperto: 25 - Dorme como um bebê",
                        "• Em Transe: 10 - Sabe aquele cochilo depois do almoço? É nesse estado de ação que o pato se encontra",
                        "• Hibernação: 5 - Acordado e pronto para destruir nossos drones"].map((t) => (
                      <ListItem key={t} sx={{ py: 0 }}>
                        <ListItemText
                          primary={t}
                          primaryTypographyProps={{ sx: { color: "#B0B0B0" } }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, background: "#0F2323" }}>
                  <Typography sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
                    Risco por super-poder:
                  </Typography>
                  <List dense>
                    {[
                        "• Água: 20 - Risco baixo, pois as tecnologias para se blindar esquipamentos eletrônicos de água são conhecidas.",
                        "• Fogo: 30 - Risco médio, pois pode derreter alguns equipamentos ou sujar sensores com fuligem.",
                        "• Eletricidade: 40 - Risco alto pela chance de algum componente eletrônico ser afetado.",
                        "• Calor: 40 - Risco alto pela chance de componentes eletrônicos serem derretidos.",
                        "• Velocidade: 50 - Risco alto, pois será díficil acertar os ataques e ele deve bater com força (f = m x a).",
                        "• Teletransporte: 50 - Risco alto por ser difícil acertá-lo e fácil de sofrer ataques.",
                        "• Psíquico: 0 - Risco nulo, pois como um ataque psíquico afetaria uma máquina sem psique?",
                        "• Sobrenatural: 10 - Risco baixíssimo, pois drones não tem alma para ser assombradas.",
                        "• Outro: 75 - Risco altíssimo, pois não sabemos o que está por vir."
                    ].map((t) => (
                      <ListItem key={t} sx={{ py: 0 }}>
                        <ListItemText
                          primary={t}
                          primaryTypographyProps={{ sx: { color: "#B0B0B0" } }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </SectionCard>

          {/* Footer */}
          <Paper
            sx={{
              mt: 6,
              p: 3,
              background: "#112626",
              border: "1px solid rgba(0,224,183,0.2)",
              textAlign: "center",
            }}
          >
            <Typography sx={{ color: "#B0B0B0" }}>
              <strong style={{ color: "#00E0B7" }}>Importante:</strong> Todas as decisões são baseadas em análise preditiva e No conhecimento que acumulamos sobre os patos primordiais até agora.
            </Typography>
            <Typography sx={{ color: "#777", mt: 1, fontSize: "0.9rem" }}>
              Erros podem ser cometidos. Ainda temos muito o que aprender sobre esses estranhos seres penados. QUACK!
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Layout>
  );
}
