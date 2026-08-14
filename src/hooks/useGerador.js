// src/hooks/useGerador.js
import { useCallback, useRef } from "react";
import { useAppStore } from "../store/useAppStore";
import { gerarCorte, ApiError } from "../lib/api";
import { filtrarCortes, buscarSimilares } from "../data/estilos";

const MAX_PARALELO = 1;     // serializa: Gemini free tier tem RPM baixo
const MAX_TENTATIVAS = 3;     // tentativas antes de mostrar erro (com retry manual)
const DELAY_RETRY_MS = 4000;  // espera padrão entre tentativas (erros não-429)
const GAP_ENTRE_REQ = 1500;  // intervalo mínimo entre chamadas consecutivas
const MAX_ESPERA_MS = 30000; // teto de espera por tentativa (evita travar a UI)

let _contadorId = 0;
function novoId() { return `r_${Date.now()}_${++_contadorId}`; }
const esperar = (ms) => new Promise(res => setTimeout(res, ms));

// Semáforo com espaçamento: no máx `max` em paralelo E um intervalo
// mínimo (`gap`) entre o início de cada chamada, evitando rajadas
// que estouram o rate limit do Gemini.
function criarSemaforo(max, gap = 0) {
  let rodando = 0;
  let ultimoInicio = 0;
  const fila = [];
  const proximo = () => {
    if (fila.length === 0 || rodando >= max) return;
    const agora = Date.now();
    const espera = Math.max(0, ultimoInicio + gap - agora);
    if (espera > 0) {
      setTimeout(proximo, espera);
      return;
    }
    rodando++;
    ultimoInicio = Date.now();
    const { fn, resolve, reject } = fila.shift();
    fn().then(resolve).catch(reject).finally(() => { rodando--; proximo(); });
    proximo();
  };
  return (fn) => new Promise((resolve, reject) => {
    fila.push({ fn, resolve, reject });
    proximo();
  });
}

export function useGerador() {
  const adicionarResultados = useAppStore(s => s.adicionarResultados);
  const atualizarResultado = useAppStore(s => s.atualizarResultado);
  const iniciarGeracao = useAppStore(s => s.iniciarGeracao);
  const finalizarGeracao = useAppStore(s => s.finalizarGeracao);
  const registrarCurtida = useAppStore(s => s.registrarCurtida);
  const sessao = useAppStore(s => s.sessao);

  const semaforo = useRef(criarSemaforo(MAX_PARALELO, GAP_ENTRE_REQ));

  const gerarUmCard = useCallback(async ({ resultadoId, fnGerar, tentativa = 1 }) => {
    try {
      const dados = await semaforo.current(fnGerar);
      atualizarResultado(resultadoId, {
        imagemBase64: dados.imagemBase64,
        status: "success",
        erro: null,
      });
    } catch (err) {
      const ehRateLimit = err instanceof ApiError && err.status === 429;
      const semCota = err instanceof ApiError && err.semCota;
      // Créditos esgotados e 4xx de cliente são permanentes: não adianta retry.
      const erroPermanente =
        semCota || (err instanceof ApiError && [400, 401, 403].includes(err.status));
      const podeRetry = tentativa < MAX_TENTATIVAS && !erroPermanente;

      if (podeRetry) {
        // Em 429, respeita o tempo sugerido pelo Gemini (resetEm em segundos),
        // mas com um teto para não travar a UI por minutos.
        const esperaBruta = ehRateLimit && err.resetEm
          ? (err.resetEm + 1) * 1000
          : DELAY_RETRY_MS * tentativa;
        const espera = Math.min(esperaBruta, MAX_ESPERA_MS);

        console.warn(`[Gerador] Retry ${tentativa} (${ehRateLimit ? "429" : "erro"}) em ${espera}ms → ${resultadoId}`);

        // Mantém o card em "pending" para a tela cinematográfica
        // continuar visível enquanto aguardamos a IA liberar.
        atualizarResultado(resultadoId, { status: "pending", erro: null });

        await esperar(espera);
        return gerarUmCard({ resultadoId, fnGerar, tentativa: tentativa + 1 });
      }

      console.error(`[Gerador] Erro definitivo ${resultadoId}:`, err.message);
      atualizarResultado(resultadoId, {
        status: "error",
        semCota,
        erro: semCota
          ? "Créditos da IA esgotados. Configure o billing no Google AI Studio."
          : ehRateLimit
            ? "Limite da IA atingido. Tente novamente em instantes."
            : (err.message ?? "Erro ao gerar imagem"),
      });
    } finally {
      finalizarGeracao(resultadoId);
    }
  }, [atualizarResultado, finalizarGeracao]);

  // ── Batch inicial — recebe dados direto (evita stale closure) ──
  const gerarBatchInicial = useCallback(({ fotoBase64, rosto, estilo, servico, tipoCabelo }) => {
    if (!fotoBase64) {
      console.error("[Gerador] fotoBase64 não recebida");
      return;
    }

    // Passa tipoCabelo para o filtro — retorna cortes compatíveis com a textura
    // 2 cortes no batch inicial (em vez de 3) para aliviar o rate limit do Gemini
    const cortes = filtrarCortes(servico, rosto, estilo, 2, tipoCabelo);

    const novosCards = cortes.map(corte => ({
      id: novoId(),
      corte,
      imagemBase64: null,
      status: "pending",
      erro: null,
      geradoEm: Date.now(),
      origemId: null,
    }));

    adicionarResultados(novosCards);
    iniciarGeracao(novosCards.map(r => r.id));

    novosCards.forEach(({ id, corte }) => {
      gerarUmCard({
        resultadoId: id,
        fnGerar: () => gerarCorte({
          fotoBase64,
          corte,
          rosto,
          estilo,
          servico,
          tipoCabelo,       // <-- novo campo enviado ao backend
          variationContext: null,
        }),
      });
    });
  }, [adicionarResultados, iniciarGeracao, gerarUmCard]);

  // ── Variações ───────────────────────────────────────────────
  const gerarVariacoes = useCallback((corteBase) => {
    const { fotoBase64, rosto, estilo, servico, tipoCabelo } = sessao;
    if (!fotoBase64) return;

    registrarCurtida(corteBase.corte?.id ?? corteBase.id);

    const similares = buscarSimilares(corteBase.corte ?? corteBase, 3);

    const novosCards = similares.map((corte) => ({
      id: novoId(),
      corte,
      imagemBase64: null,
      status: "pending",
      erro: null,
      geradoEm: Date.now(),
      origemId: corteBase.id,
    }));

    adicionarResultados(novosCards);
    iniciarGeracao(novosCards.map(r => r.id));

    setTimeout(() => {
      const el = document.getElementById(`card-${novosCards[0].id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    novosCards.forEach(({ id, corte }) => {
      gerarUmCard({
        resultadoId: id,
        fnGerar: () => gerarCorte({
          fotoBase64,
          corte,
          rosto,
          estilo,
          servico,
          tipoCabelo,
          variationContext: {
            nomeOrigem: corteBase.corte?.nome ?? corteBase.nome ?? "estilo base",
            variationHint: corteBase.corte?.variationHint ?? corteBase.variationHint,
          },
        }),
      });
    });
  }, [sessao, adicionarResultados, iniciarGeracao, registrarCurtida, gerarUmCard]);

  // ── Regenera card com erro ───────────────────────────────────
  const regenerarCard = useCallback((resultado) => {
    const { fotoBase64, rosto, estilo, servico, tipoCabelo } = sessao;
    if (!fotoBase64) return;

    atualizarResultado(resultado.id, { status: "pending", erro: null });
    iniciarGeracao([resultado.id]);

    gerarUmCard({
      resultadoId: resultado.id,
      fnGerar: () => gerarCorte({
        fotoBase64,
        corte: resultado.corte,
        rosto,
        estilo,
        servico,
        tipoCabelo,
        variationContext: null,
      }),
    });
  }, [sessao, atualizarResultado, iniciarGeracao, gerarUmCard]);

  return { gerarBatchInicial, gerarVariacoes, regenerarCard };
}
