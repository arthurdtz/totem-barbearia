// =====================================================
// BRAVOS BARBEARIA — Global Store (Zustand)
// src/store/useAppStore.js
// =====================================================

import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

export const TELAS = {
  IDLE: "idle",
  FOTO: "foto",
  SERVICO: "servico",
  ROSTO: "rosto",
  ESTILO: "estilo",
  LOADING: "loading",
  RESULTADO: "resultado",
};

export const PROGRESSO_TELA = {
  idle: 0,
  foto: 20,
  servico: 40,
  rosto: 60,
  estilo: 80,
  loading: 90,
  resultado: 100,
};

export const useAppStore = create(
  subscribeWithSelector(
    persist(
      (set, get) => ({

        // ── NAVEGAÇÃO ──────────────────────────────────────────
        tela: TELAS.IDLE,
        telasVisitadas: [],

        irPara: (tela) =>
          set((s) => ({
            tela,
            telasVisitadas: s.telasVisitadas.includes(tela)
              ? s.telasVisitadas
              : [...s.telasVisitadas, tela],
          })),

        voltarTela: () => {
          const ordem = [
            TELAS.IDLE,
            TELAS.FOTO,
            TELAS.SERVICO,
            TELAS.ROSTO,
            TELAS.ESTILO,
          ];
          const atual = get().tela;
          const idx = ordem.indexOf(atual);
          if (idx > 0) set({ tela: ordem[idx - 1] });
        },

        // ── SESSÃO ATUAL ───────────────────────────────────────
        // tipoCabelo: "liso" | "ondulado" | "cacheado" | "crespo" | "afro" | null
        sessao: {
          id: null,
          fotoBase64: null,
          fotoPreview: null,
          servico: null,
          rosto: null,
          estilo: null,
          tipoCabelo: null,
        },

        setSessao: (campos) =>
          set((s) => ({
            sessao: { ...s.sessao, ...campos },
          })),

        // ── RESULTADOS ─────────────────────────────────────────
        resultados: [],
        gerandoIds: [],

        adicionarResultados: (lista) =>
          set((s) => ({
            resultados: [...s.resultados, ...lista],
          })),

        atualizarResultado: (id, campos) =>
          set((s) => ({
            resultados: s.resultados.map((r) =>
              r.id === id ? { ...r, ...campos } : r
            ),
          })),

        setGerandoIds: (ids) => set({ gerandoIds: ids }),

        iniciarGeracao: (ids) =>
          set((s) => ({
            gerandoIds: [...new Set([...s.gerandoIds, ...ids])],
          })),

        finalizarGeracao: (id) =>
          set((s) => ({
            gerandoIds: s.gerandoIds.filter((i) => i !== id),
          })),

        // ── FAVORITOS ─────────────────────────────────────────
        favoritos: [],

        toggleFavorito: (resultado) => {
          const { favoritos } = get();
          const jaExiste = favoritos.some((f) => f.id === resultado.id);
          if (jaExiste) {
            set({ favoritos: favoritos.filter((f) => f.id !== resultado.id) });
          } else {
            set({
              favoritos: [
                ...favoritos,
                {
                  id: resultado.id,
                  corte: resultado.corte,
                  imagemBase64: resultado.imagemBase64,
                  salvoEm: Date.now(),
                },
              ],
            });
          }
        },

        isFavorito: (id) => get().favoritos.some((f) => f.id === id),

        removerFavorito: (id) =>
          set((s) => ({
            favoritos: s.favoritos.filter((f) => f.id !== id),
          })),

        // ── CURTIDAS ──────────────────────────────────────────
        historicoCurtidas: [],

        registrarCurtida: (corteId) =>
          set((s) => ({
            historicoCurtidas: s.historicoCurtidas.includes(corteId)
              ? s.historicoCurtidas
              : [...s.historicoCurtidas, corteId],
          })),

        // ── UI STATE ──────────────────────────────────────────
        modal: null,
        drawerFavoritosAberto: false,
        loadingTexto: "Analisando seu rosto...",

        abrirModal: (resultado) => set({ modal: resultado }),
        fecharModal: () => set({ modal: null }),

        toggleDrawerFavoritos: () =>
          set((s) => ({
            drawerFavoritosAberto: !s.drawerFavoritosAberto,
          })),

        setLoadingTexto: (texto) => set({ loadingTexto: texto }),

        // ── USUÁRIO ───────────────────────────────────────────
        usuario: null,
        setUsuario: (usuario) => set({ usuario }),
        logout: () => set({ usuario: null }),

        // ── RESET ─────────────────────────────────────────────
        reiniciar: () =>
          set(() => ({
            tela: TELAS.IDLE,
            telasVisitadas: [],
            sessao: {
              id: null,
              fotoBase64: null,
              fotoPreview: null,
              servico: null,
              rosto: null,
              estilo: null,
              tipoCabelo: null,
            },
            resultados: [],
            gerandoIds: [],
            modal: null,
            drawerFavoritosAberto: false,
          })),

      }),

      {
        name: "bravos-storage",
        partialize: (state) => ({
          favoritos: state.favoritos,
          usuario: state.usuario,
          historicoCurtidas: state.historicoCurtidas,
        }),
        version: 1,
      }
    )
  )
);

// ─── SELETORES ────────────────────────────────────────────────
export const selTela             = (s) => s.tela;
export const selSessao           = (s) => s.sessao;
export const selResultados       = (s) => s.resultados;
export const selGerandoIds       = (s) => s.gerandoIds;
export const selFavoritos        = (s) => s.favoritos;
export const selModal            = (s) => s.modal;
export const selUsuario          = (s) => s.usuario;
export const selLoadingTexto     = (s) => s.loadingTexto;
export const selDrawerFavoritos  = (s) => s.drawerFavoritosAberto;
export const selHistoricoCurtidas = (s) => s.historicoCurtidas;

// ─── HOOKS DERIVADOS ──────────────────────────────────────────
export const useProgresso = () =>
  useAppStore((s) => PROGRESSO_TELA[s.tela] ?? 0);

export const useContadorGerando = () =>
  useAppStore((s) => s.gerandoIds.length);

export const useFavoritosOrdenados = () =>
  useAppStore((s) => [...s.favoritos].sort((a, b) => b.salvoEm - a.salvoEm));

export const useIsFavorito = (id) =>
  useAppStore((s) => s.favoritos.some((f) => f.id === id));
