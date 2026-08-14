// src/components/FavoritosDrawer.jsx
// ─────────────────────────────────────────────────────────────
// Gaveta lateral de favoritos.
//
// Props:
//   aberto        – boolean
//   onFechar      – fn()
//   favoritos     – array de { id, imagemBase64, corteNome,
//                   origemId, rosto, estilo, savedAt }
//   onRemover     – fn(id)
//   onVariar      – fn(itemFavorito) → dispara geração de variações
//   carregando    – boolean (buscando favoritos da API)
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from "react";

// ── Ícones inline ─────────────────────────────────────────────
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const IconShuffle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);

const IconHeart = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────
function formatarData(iso) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
    }).format(new Date(iso));
  } catch { return ""; }
}

// ── Componente ────────────────────────────────────────────────
export default function FavoritosDrawer({
  aberto      = false,
  onFechar    = () => {},
  favoritos   = [],
  onRemover   = () => {},
  onVariar    = () => {},
  carregando  = false,
}) {
  // Controla qual item tem o menu de ações aberto (hover/tap)
  const [itemAtivo, setItemAtivo] = useState(null);
  // Confirmação de remoção — guarda o id
  const [confirmando, setConfirmando] = useState(null);
  // Referência para fechar ao clicar fora
  const drawerRef = useRef(null);
  // Previne scroll do body quando aberto
  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [aberto]);

  // ESC fecha
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onFechar(); };
    if (aberto) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aberto, onFechar]);

  const handleRemover = useCallback((id) => {
    if (confirmando === id) {
      onRemover(id);
      setConfirmando(null);
      setItemAtivo(null);
    } else {
      setConfirmando(id);
      // Auto-cancela confirmação após 3s
      setTimeout(() => setConfirmando(prev => prev === id ? null : prev), 3000);
    }
  }, [confirmando, onRemover]);

  const handleVariar = useCallback((item) => {
    setItemAtivo(null);
    onVariar(item);
    onFechar(); // fecha o drawer e volta para a tela de resultado
  }, [onVariar, onFechar]);

  return (
    <>
      <style>{drawerStyles}</style>

      {/* Backdrop */}
      <div
        className={`fd-backdrop ${aberto ? "fd-backdrop--visible" : ""}`}
        onClick={onFechar}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        className={`fd-drawer ${aberto ? "fd-drawer--open" : ""}`}
        aria-label="Favoritos"
        role="complementary"
      >
        {/* ── Header ── */}
        <header className="fd-header">
          <div className="fd-header__left">
            <span className="fd-header__icon"><IconHeart /></span>
            <div>
              <h2 className="fd-header__title">Favoritos</h2>
              <p className="fd-header__count">
                {favoritos.length === 0
                  ? "nenhum salvo ainda"
                  : `${favoritos.length} corte${favoritos.length > 1 ? "s" : ""} salvos`}
              </p>
            </div>
          </div>
          <button className="fd-close" onClick={onFechar} aria-label="Fechar favoritos">
            <IconX />
          </button>
        </header>

        {/* ── Corpo ── */}
        <div className="fd-body">

          {/* Estado de carregamento */}
          {carregando && (
            <div className="fd-loading">
              <div className="fd-spinner" />
              <span>Carregando favoritos…</span>
            </div>
          )}

          {/* Estado vazio */}
          {!carregando && favoritos.length === 0 && (
            <div className="fd-empty">
              <div className="fd-empty__icon">
                <IconHeart />
              </div>
              <p className="fd-empty__title">Nada salvo ainda</p>
              <p className="fd-empty__sub">
                Quando você favoritar um corte,<br />ele aparece aqui.
              </p>
            </div>
          )}

          {/* Grid de favoritos */}
          {!carregando && favoritos.length > 0 && (
            <div className="fd-grid">
              {favoritos.map((item, i) => (
                <FavoritoCard
                  key={item.id}
                  item={item}
                  index={i}
                  ativo={itemAtivo === item.id}
                  confirmando={confirmando === item.id}
                  onAtivar={() => setItemAtivo(prev => prev === item.id ? null : item.id)}
                  onRemover={() => handleRemover(item.id)}
                  onVariar={() => handleVariar(item)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Footer — dica de uso ── */}
        {!carregando && favoritos.length > 0 && (
          <footer className="fd-footer">
            <p>Toque em um corte para ver as ações</p>
          </footer>
        )}
      </aside>
    </>
  );
}

// ── Sub-componente: card individual dentro do drawer ──────────
function FavoritoCard({ item, index, ativo, confirmando, onAtivar, onRemover, onVariar }) {
  const delay = `${index * 60}ms`;

  return (
    <div
      className={`fd-card ${ativo ? "fd-card--active" : ""}`}
      style={{ "--fd-delay": delay }}
      onClick={onAtivar}
    >
      {/* Imagem */}
      <div className="fd-card__img-wrap">
        <img
          className="fd-card__img"
          src={item.imagemBase64}
          alt={item.corteNome}
          loading="lazy"
        />

        {/* Overlay de ações — aparece ao ativar */}
        <div className="fd-card__overlay">
          <button
            className={`fd-card__action fd-card__action--remove ${confirmando ? "confirming" : ""}`}
            onClick={(e) => { e.stopPropagation(); onRemover(); }}
            title={confirmando ? "Confirmar remoção" : "Remover"}
            aria-label={confirmando ? "Confirmar remoção" : "Remover dos favoritos"}
          >
            <IconTrash />
            <span>{confirmando ? "Confirmar?" : ""}</span>
          </button>

          <button
            className="fd-card__action fd-card__action--vary"
            onClick={(e) => { e.stopPropagation(); onVariar(); }}
            title="Gerar variações"
            aria-label="Gerar variações deste corte"
          >
            <IconShuffle />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="fd-card__info">
        <span className="fd-card__nome">{item.corteNome}</span>
        <span className="fd-card__data">{formatarData(item.savedAt)}</span>
      </div>
    </div>
  );
}

// ── Estilos ───────────────────────────────────────────────────
const drawerStyles = `
  /* ── Tokens ── */
  .fd-drawer, .fd-backdrop {
    --gold:       #C9A84C;
    --gold-light: #E8C97A;
    --dark:       #0A0A0B;
    --surface:    #111113;
    --surface2:   #1A1A1D;
    --surface3:   #222226;
    --border:     rgba(201,168,76,0.15);
    --text:       #F0EDE8;
    --text-muted: rgba(240,237,232,0.4);
    --radius:     14px;
    --w:          360px;
  }

  /* ── Backdrop ── */
  .fd-backdrop {
    position: fixed;
    inset: 0;
    z-index: 400;
    background: rgba(0,0,0,0);
    pointer-events: none;
    transition: background 0.35s ease;
  }

  .fd-backdrop--visible {
    background: rgba(0,0,0,0.65);
    pointer-events: all;
    backdrop-filter: blur(4px);
  }

  /* ── Drawer ── */
  .fd-drawer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 500;
    width: min(var(--w), 100vw);
    background: var(--surface);
    border-left: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.38s cubic-bezier(0.22,1,0.36,1);
    box-shadow: -8px 0 48px rgba(0,0,0,0.6);
  }

  .fd-drawer--open {
    transform: translateX(0);
  }

  /* ── Header ── */
  .fd-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 20px 20px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .fd-header__left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .fd-header__icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: rgba(224,82,82,0.12);
    border: 1px solid rgba(224,82,82,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #e05252;
    flex-shrink: 0;
  }

  .fd-header__icon svg { width: 18px; height: 18px; }

  .fd-header__title {
    font-family: "Georgia", serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
    margin: 0 0 2px;
    line-height: 1;
  }

  .fd-header__count {
    font-size: 11px;
    color: var(--text-muted);
    margin: 0;
    letter-spacing: 0.02em;
  }

  .fd-close {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: var(--surface2);
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .fd-close svg { width: 16px; height: 16px; }

  .fd-close:hover {
    color: var(--text);
    border-color: rgba(255,255,255,0.25);
    background: var(--surface3);
  }

  /* ── Body ── */
  .fd-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  .fd-body::-webkit-scrollbar { width: 4px; }
  .fd-body::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 2px;
  }

  /* ── Loading ── */
  .fd-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    height: 200px;
    color: var(--text-muted);
    font-size: 13px;
  }

  .fd-spinner {
    width: 32px;
    height: 32px;
    border: 2px solid rgba(201,168,76,0.15);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: fd-spin 0.8s linear infinite;
  }

  @keyframes fd-spin { to { transform: rotate(360deg); } }

  /* ── Empty state ── */
  .fd-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    height: 280px;
    text-align: center;
    padding: 20px;
  }

  .fd-empty__icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(224,82,82,0.08);
    border: 1px solid rgba(224,82,82,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(224,82,82,0.35);
    margin-bottom: 4px;
  }

  .fd-empty__icon svg { width: 24px; height: 24px; }

  .fd-empty__title {
    font-family: "Georgia", serif;
    font-size: 16px;
    color: var(--text);
    margin: 0;
  }

  .fd-empty__sub {
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.6;
    margin: 0;
  }

  /* ── Grid ── */
  .fd-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  /* ── Card individual ── */
  .fd-card {
    border-radius: var(--radius);
    background: var(--surface2);
    border: 1px solid var(--border);
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;

    opacity: 0;
    transform: translateY(10px);
    animation: fd-enter 0.4s ease var(--fd-delay) forwards;
  }

  @keyframes fd-enter {
    to { opacity: 1; transform: translateY(0); }
  }

  .fd-card:hover,
  .fd-card--active {
    border-color: rgba(201,168,76,0.4);
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }

  .fd-card__img-wrap {
    position: relative;
    aspect-ratio: 3/4;
    overflow: hidden;
  }

  .fd-card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
  }

  .fd-card:hover .fd-card__img,
  .fd-card--active .fd-card__img {
    transform: scale(1.04);
  }

  /* Overlay de ações */
  .fd-card__overlay {
    position: absolute;
    inset: 0;
    background: rgba(10,10,11,0.72);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    opacity: 0;
    transition: opacity 0.22s ease;
  }

  .fd-card--active .fd-card__overlay,
  .fd-card:hover .fd-card__overlay {
    opacity: 1;
  }

  .fd-card__action {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(20,20,22,0.8);
    color: var(--text);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .fd-card__action svg { width: 16px; height: 16px; }

  .fd-card__action--remove:hover,
  .fd-card__action--remove.confirming {
    background: rgba(224,82,82,0.2);
    border-color: rgba(224,82,82,0.5);
    color: #e05252;
    width: auto;
    border-radius: 20px;
    padding: 0 12px;
    gap: 6px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .fd-card__action--remove span {
    display: none;
    white-space: nowrap;
  }

  .fd-card__action--remove.confirming span,
  .fd-card__action--remove:hover span {
    display: inline;
  }

  .fd-card__action--vary:hover {
    background: rgba(201,168,76,0.2);
    border-color: rgba(201,168,76,0.5);
    color: var(--gold-light);
  }

  /* Info abaixo da imagem */
  .fd-card__info {
    padding: 8px 10px 10px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .fd-card__nome {
    font-size: 12px;
    font-weight: 600;
    color: var(--text);
    font-family: "Georgia", serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .fd-card__data {
    font-size: 10px;
    color: var(--text-muted);
    letter-spacing: 0.02em;
  }

  /* ── Footer ── */
  .fd-footer {
    padding: 12px 20px 20px;
    border-top: 1px solid var(--border);
    flex-shrink: 0;
    text-align: center;
  }

  .fd-footer p {
    font-size: 11px;
    color: var(--text-muted);
    margin: 0;
    letter-spacing: 0.03em;
  }

  /* ── Mobile: drawer vira bottom sheet ── */
  @media (max-width: 480px) {
    .fd-drawer {
      top: auto;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      max-height: 92dvh;
      border-left: none;
      border-top: 1px solid var(--border);
      border-radius: 20px 20px 0 0;
      transform: translateY(100%);
      transition: transform 0.38s cubic-bezier(0.22,1,0.36,1);
      box-shadow: 0 -8px 48px rgba(0,0,0,0.6);
    }

    .fd-drawer--open {
      transform: translateY(0);
    }

    .fd-header {
      padding-top: 16px;
    }

    /* Alça visual no topo do sheet mobile */
    .fd-header::before {
      content: "";
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 36px;
      height: 4px;
      border-radius: 2px;
      background: rgba(255,255,255,0.15);
    }
  }
`;
