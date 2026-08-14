// =====================================================
// BRAVOS BARBEARIA — Cliente de API
// src/lib/api.js
//
// Todas as chamadas HTTP passam por aqui.
// Facilita: troca de base URL, auth headers, logs.
// =====================================================

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

// Timeout padrão para geração de imagem (Gemini pode levar ~60s)
const TIMEOUT_GERACAO = 120_000;
const TIMEOUT_PADRAO = 10_000;

// ─── UTILITÁRIO INTERNO ───────────────────────────────────────

async function fetchComTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) {
      let mensagem = `HTTP ${res.status}`;
      let resetEm;
      let semCota = false;
      try {
        const corpo = await res.json();
        mensagem = corpo.erro ?? corpo.error?.message ?? mensagem;
        resetEm = corpo.resetEm;
        semCota = !!corpo.semCota;
      } catch {
        // res não era JSON, mantém mensagem genérica
      }
      throw new ApiError(mensagem, res.status, resetEm, semCota);
    }

    return res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") throw new ApiError("Tempo esgotado. Tente novamente.", 408);
    throw err;
  }
}

// ─── CLASSE DE ERRO CUSTOMIZADA ───────────────────────────────

export class ApiError extends Error {
  constructor(mensagem, status = 500, resetEm = null, semCota = false) {
    super(mensagem);
    this.name = "ApiError";
    this.status = status;
    this.resetEm = resetEm; // segundos sugeridos para retry (429 transitório)
    this.semCota = semCota; // true = créditos/cota esgotados (não recuperável)
  }
}

// ─── ENDPOINTS ────────────────────────────────────────────────

/**
 * Gera um corte aplicado na foto do usuário.
 *
 * @param {Object} params
 * @param {string} params.fotoBase64      - Imagem do usuário (sem prefixo data:)
 * @param {Object} params.corte           - Objeto Corte do catálogo
 * @param {string} params.rosto           - Formato do rosto
 * @param {string} params.estilo          - Vibe escolhida
 * @param {string} params.servico         - "cabelo" | "barba" | "ambos"
 * @returns {Promise<{ imagemBase64: string }>}
 */
export async function gerarCorte({ fotoBase64, corte, rosto, estilo, servico }) {
  return fetchComTimeout(
    `${BASE_URL}/api/gerar-corte`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fotoBase64, corte, rosto, estilo, servico }),
    },
    TIMEOUT_GERACAO
  );
}

/**
 * Gera uma variação de um corte específico.
 * O backend usa `variationSeed` para criar prompts diferentes
 * mas temáticamente coerentes com o corte base.
 *
 * @param {Object} params
 * @param {string} params.fotoBase64
 * @param {Object} params.corteBase       - Corte "pai" que o usuário gostou
 * @param {number} params.variationSeed   - 1, 2 ou 3 (define qual variação)
 * @param {string} params.rosto
 * @param {string} params.estilo
 * @param {string} params.servico
 * @returns {Promise<{ imagemBase64: string }>}
 */
export async function gerarVariacao({
  fotoBase64,
  corteBase,
  variationSeed,
  rosto,
  estilo,
  servico,
}) {
  return fetchComTimeout(
    `${BASE_URL}/api/gerar-variacao`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fotoBase64, corteBase, variationSeed, rosto, estilo, servico }),
    },
    TIMEOUT_GERACAO
  );
}

/**
 * Login / criação de conta simples por nome.
 *
 * @param {string} nome
 * @returns {Promise<{ usuario: { id: string, nome: string } }>}
 */
export async function login(nome) {
  return fetchComTimeout(
    `${BASE_URL}/api/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    },
    TIMEOUT_PADRAO
  );
}

/**
 * Health check do servidor.
 * @returns {Promise<{ status: string, modelo: string }>}
 */
export async function healthCheck() {
  return fetchComTimeout(`${BASE_URL}/`, {}, TIMEOUT_PADRAO);
}

// ─── FAVORITOS ────────────────────────────────────────────────

/**
 * Busca todos os favoritos de um usuário.
 * @param {string} usuarioId
 * @returns {Promise<{ favoritos: Array }>}
 */
export async function buscarFavoritos(usuarioId) {
  return fetchComTimeout(
    `${BASE_URL}/api/favoritos/${usuarioId}`,
    {},
    TIMEOUT_PADRAO
  );
}

/**
 * Salva um item nos favoritos.
 * @param {string} usuarioId
 * @param {{ id, imagemBase64, corteNome, origemId, rosto, estilo, criadoEm }} item
 * @returns {Promise<{ ok: boolean, duplicata?: boolean }>}
 */
export async function salvarFavorito(usuarioId, item) {
  return fetchComTimeout(
    `${BASE_URL}/api/favoritos/${usuarioId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    },
    TIMEOUT_PADRAO
  );
}

/**
 * Remove um item dos favoritos.
 * @param {string} usuarioId
 * @param {string} itemId
 * @returns {Promise<{ ok: boolean }>}
 */
export async function removerFavorito(usuarioId, itemId) {
  return fetchComTimeout(
    `${BASE_URL}/api/favoritos/${usuarioId}/${itemId}`,
    { method: "DELETE" },
    TIMEOUT_PADRAO
  );
}
