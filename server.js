// =====================================================
// SERVIDOR BRAVOS BARBEARIA — v2.0
// Novidades: persistência JSON, rate limiting,
// variationContext, endpoint de favoritos completo
// Rode com: node server.js  (requer Node 18+)
// =====================================================

import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── CONFIG ──────────────────────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || " ";
const GEMINI_MODEL = "gemini-2.5-flash-image";
const DB_PATH = path.join(__dirname, "db.json");
const PORT = process.env.PORT || 3001;

// Temperature dinâmica:
// - geração inicial → 0.25 (máxima fidelidade facial)
// - variação de corte → 0.55 (mais criatividade, mesmo rosto)
const TEMP_INICIAL = 0.25;
const TEMP_VARIACAO = 0.55;

// Rate limiting: máximo de requests por janela de tempo
const RATE_WINDOW_MS = 60_000; // 1 minuto
const RATE_MAX_REQ = 10;     // máx 10 gerações por minuto por IP

// ─── PERSISTÊNCIA ────────────────────────────────────────────
// db.json estrutura:
// { usuarios: [...], favoritos: { [usuarioId]: [...] } }

function lerDB() {
  try {
    if (!fs.existsSync(DB_PATH)) return { usuarios: [], favoritos: {} };
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch {
    return { usuarios: [], favoritos: {} };
  }
}

function salvarDB(db) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (e) {
    console.error("Erro ao salvar db.json:", e.message);
  }
}

// ─── RATE LIMITER IN-PROCESS ─────────────────────────────────
// Mapa: IP → [timestamp, timestamp, ...]
// Sem biblioteca externa — funciona para até ~100 usuários
const ratemap = new Map();

function checkRateLimit(ip) {
  const agora = Date.now();
  const janela = agora - RATE_WINDOW_MS;
  const hits = (ratemap.get(ip) ?? []).filter(t => t > janela);
  if (hits.length >= RATE_MAX_REQ) {
    const resetEm = Math.ceil((hits[0] + RATE_WINDOW_MS - agora) / 1000);
    return { bloqueado: true, resetEm };
  }
  hits.push(agora);
  ratemap.set(ip, hits);
  return { bloqueado: false };
}

// Limpa o mapa a cada 5 minutos para não vazar memória
setInterval(() => {
  const corte = Date.now() - RATE_WINDOW_MS;
  for (const [ip, hits] of ratemap) {
    const filtrado = hits.filter(t => t > corte);
    if (filtrado.length === 0) ratemap.delete(ip);
    else ratemap.set(ip, filtrado);
  }
}, 5 * 60_000);

// ─── APP ─────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json({ limit: "25mb" }));

// ─── HELPERS DE IMAGEM ───────────────────────────────────────
function normalizarBase64(valor) {
  if (typeof valor !== "string") return null;
  const match = valor.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (match) return { mimeType: match[1], data: match[2].trim() };
  return { mimeType: "image/jpeg", data: valor.trim() };
}

function extrairImagem(data) {
  const partes = data?.candidates?.[0]?.content?.parts ?? [];
  for (const parte of partes) {
    const inline = parte.inline_data ?? parte.inlineData;
    const mimeType = inline?.mime_type ?? inline?.mimeType;
    const imageData = inline?.data;
    if (mimeType?.startsWith("image/") && imageData) return { mimeType, imageData };
  }
  return null;
}

// ─── PROMPT ──────────────────────────────────────────────────
// variationContext: quando presente, instrui a IA a variar
// aspectos específicos mantendo o DNA do corte pai.
function montarPrompt(corte, servico, rosto, estilo, variationContext = null) {
  const restricaoServico =
    servico === "barba"
      ? "ALTERAR: somente a barba e o bigode. NÃO ALTERAR: cabelo, sobrancelhas, cílios."
      : servico === "cabelo"
        ? "ALTERAR: somente o cabelo. NÃO ALTERAR: barba, bigode, sobrancelhas, cílios."
        : "ALTERAR: cabelo E barba/bigode conforme o estilo solicitado.";

  // Bloco extra apenas para variações — diz à IA o que variar
  const blocoVariacao = variationContext
    ? `
== VARIATION INSTRUCTIONS ==
This is a variation request based on a style the user liked.
Parent style: "${variationContext.nomeOrigem}"
What to vary: ${variationContext.variationHint ?? "vary length, texture, and finishing details"}
Keep the core identity of the style recognizable, but make this variation meaningfully different from the parent.
Do NOT simply copy the parent — explore the adjacent creative space.`
    : "";

  return `You are a professional barbershop visualization AI. Your task is strictly hair and beard editing — NOT face editing.

== HAIRSTYLE TO APPLY ==
Style name: "${corte.nome}"
Technical description: ${corte.descricaoPrompt}
Face shape to optimize for: ${rosto}
Lifestyle vibe: ${estilo}
Service scope: ${restricaoServico}
${blocoVariacao}

== FACE PRESERVATION — CRITICAL RULES (NEVER VIOLATE) ==
1. FACE IDENTITY: The person's face must be 100% identical — same bone structure, skin tone, skin texture, freckles, moles, scars, and unique features.
2. EYES: Iris color, shape, size, eye spacing — all unchanged. No whitening or enhancement.
3. NOSE: Shape, width, tip — unchanged.
4. LIPS & MOUTH: Shape, size, lip color — unchanged.
5. EARS: Visible ear shape — unchanged.
6. EYEBROWS: Color and thickness — unchanged (unless service includes beard area).
7. SKIN: Tone, texture, pores — unchanged. No smoothing, no whitening, no beautification.
8. AGE: Do not make the person look younger or older.
9. EXPRESSION & POSE: Head angle, facial expression, gaze direction — unchanged.
10. BACKGROUND & LIGHTING: Background, shadows, color temperature, ambient light — all unchanged.
11. CLOTHING & NECK: Collar, shirt, jacket — unchanged.
12. IMAGE QUALITY: Same resolution and camera angle as input — no cropping or zooming.

== OUTPUT REQUIREMENT ==
Return ONLY the edited photo with the new hairstyle/beard applied. Photorealistic result. No text, no labels, no watermarks, no composite images — just the single edited portrait photo.`;
}

// ─── LOGIN ───────────────────────────────────────────────────
app.post("/api/login", (req, res) => {
  const { nome } = req.body;
  if (!nome?.trim()) return res.status(400).json({ erro: "Nome obrigatório" });

  const db = lerDB();
  let usuario = db.usuarios.find(u => u.nome === nome.trim());
  if (!usuario) {
    usuario = { id: `u_${Date.now()}`, nome: nome.trim(), criadoEm: new Date().toISOString() };
    db.usuarios.push(usuario);
    if (!db.favoritos[usuario.id]) db.favoritos[usuario.id] = [];
    salvarDB(db);
  }
  return res.json({ usuario });
});

// ─── FAVORITOS ───────────────────────────────────────────────
// GET  /api/favoritos/:usuarioId         → lista todos
// POST /api/favoritos/:usuarioId         → adiciona um
// DELETE /api/favoritos/:usuarioId/:itemId → remove um

app.get("/api/favoritos/:usuarioId", (req, res) => {
  const db = lerDB();
  const lista = db.favoritos[req.params.usuarioId] ?? [];
  return res.json({ favoritos: lista });
});

app.post("/api/favoritos/:usuarioId", (req, res) => {
  const { usuarioId } = req.params;
  // Payload esperado do frontend:
  // { id, imagemBase64, corteNome, origemId, rosto, estilo, criadoEm }
  const item = req.body;

  if (!item?.id || !item?.imagemBase64)
    return res.status(400).json({ erro: "id e imagemBase64 são obrigatórios" });

  const db = lerDB();
  if (!db.favoritos[usuarioId]) db.favoritos[usuarioId] = [];

  // Evita duplicata pelo id
  const jaExiste = db.favoritos[usuarioId].some(f => f.id === item.id);
  if (jaExiste) return res.json({ ok: true, duplicata: true });

  db.favoritos[usuarioId].unshift({ ...item, savedAt: new Date().toISOString() });

  // Mantém no máximo 50 favoritos por usuário
  if (db.favoritos[usuarioId].length > 50)
    db.favoritos[usuarioId] = db.favoritos[usuarioId].slice(0, 50);

  salvarDB(db);
  return res.json({ ok: true });
});

app.delete("/api/favoritos/:usuarioId/:itemId", (req, res) => {
  const { usuarioId, itemId } = req.params;
  const db = lerDB();
  if (!db.favoritos[usuarioId]) return res.json({ ok: true });

  db.favoritos[usuarioId] = db.favoritos[usuarioId].filter(f => f.id !== itemId);
  salvarDB(db);
  return res.json({ ok: true });
});

// ─── GERAÇÃO DE CORTE ────────────────────────────────────────
app.post("/api/gerar-corte", async (req, res) => {
  // Rate limiting por IP
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ?? req.socket.remoteAddress ?? "unknown";
  const rate = checkRateLimit(ip);
  if (rate.bloqueado) {
    return res.status(429).json({
      erro: `Muitas gerações. Aguarde ${rate.resetEm}s e tente novamente.`,
      resetEm: rate.resetEm,
    });
  }

  try {
    const {
      fotoBase64,
      corte,
      rosto = "não informado",
      estilo = "não informado",
      servico = "cabelo",
      variationContext = null,   // { nomeOrigem, variationHint } | null
    } = req.body;

    // Validações
    const img = normalizarBase64(fotoBase64);
    if (!img?.data) return res.status(400).json({ erro: "Foto não enviada" });
    if (!corte?.nome) return res.status(400).json({ erro: "Corte inválido" });
    if (!corte?.descricaoPrompt) return res.status(400).json({ erro: "descricaoPrompt ausente" });
    if (!/^image\/(jpeg|jpg|png|webp)$/i.test(img.mimeType))
      return res.status(400).json({ erro: "Formato inválido (use jpeg/png/webp)" });

    // Temperature dinâmica: variação usa mais criatividade
    const temperature = variationContext ? TEMP_VARIACAO : TEMP_INICIAL;
    const prompt = montarPrompt(corte, servico, rosto, estilo, variationContext);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const tipo = variationContext ? `variação de "${variationContext.nomeOrigem}"` : "inicial";

    console.log(`[${new Date().toLocaleTimeString()}] ▶ ${tipo} → "${corte.nome}" | temp: ${temperature} | ip: ${ip}`);

    const resposta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: img.mimeType, data: img.data } },
            { text: prompt }
          ]
        }],
        generationConfig: {
          responseModalities: ["IMAGE"],
          temperature,
        }
      }),
      signal: AbortSignal.timeout(120_000),
    });

    const data = await resposta.json();

    if (!resposta.ok || data.error) {
      console.error("Erro Gemini:", data.error ?? data);
      const statusErro = resposta.status || data.error?.code || 500;
      const msgErro = data.error?.message ?? "";

      // Diferencia créditos/cota esgotados (NÃO recuperável por retry)
      // de rate limit transitório por minuto (recuperável).
      const semCota = statusErro === 429 &&
        /credit|billing|depleted|quota|exhausted/i.test(msgErro);

      // Só extrai resetEm quando há RetryInfo real (rate limit por minuto)
      let resetEm;
      if (statusErro === 429 && !semCota) {
        const detalhes = data.error?.details ?? [];
        const retryInfo = detalhes.find(d =>
          (d["@type"] ?? "").includes("RetryInfo")
        );
        const match = String(retryInfo?.retryDelay ?? "").match(/(\d+)/);
        resetEm = match ? Number(match[1]) : 30; // fallback 30s
      }

      return res.status(statusErro).json({
        erro: semCota
          ? "Créditos da IA esgotados. Configure o billing no Google AI Studio."
          : (msgErro || "Erro ao chamar Gemini"),
        ...(semCota ? { semCota: true } : {}),
        ...(resetEm != null ? { resetEm } : {}),
      });
    }

    const imagemGerada = extrairImagem(data);

    if (!imagemGerada) {
      const partes = data.candidates?.[0]?.content?.parts ?? [];
      const textos = partes.map(p => p.text).filter(Boolean).join("\n");
      const motivo = data.candidates?.[0]?.finishReason ?? "desconhecido";
      console.error("Gemini não retornou imagem:", { motivo, textos });
      return res.status(500).json({ erro: "Gemini não retornou imagem", detalhe: textos || motivo });
    }

    console.log(`[${new Date().toLocaleTimeString()}] ✔ Pronto: "${corte.nome}"`);

    return res.json({
      imagemBase64: `data:${imagemGerada.mimeType};base64,${imagemGerada.imageData}`,
    });

  } catch (erro) {
    console.error("Erro interno:", erro);
    return res.status(500).json({ erro: erro.message ?? "Erro interno" });
  }
});

// ─── HEALTH CHECK ─────────────────────────────────────────────
app.get("/", (_req, res) => {
  const db = lerDB();
  res.json({
    status: "ok",
    modelo: GEMINI_MODEL,
    usuarios: db.usuarios.length,
    totalFavoritos: Object.values(db.favoritos).reduce((a, b) => a + b.length, 0),
  });
});

// ─── START ────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  🔥 Servidor Bravos v2 rodando em :${PORT}`);
  console.log(`  🤖 Modelo: ${GEMINI_MODEL}`);
  console.log(`  🔑 API Key: ${GEMINI_API_KEY === " " ? "⚠️  NÃO CONFIGURADA" : "✔ configurada"}`);
  console.log(`  💾 DB: ${DB_PATH}`);
  console.log(`  🚦 Rate limit: ${RATE_MAX_REQ} req/${RATE_WINDOW_MS / 1000}s por IP`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
});
