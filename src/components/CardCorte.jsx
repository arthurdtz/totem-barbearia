// src/components/CardCorte.jsx
// ─────────────────────────────────────────────────────────────
// Card principal de resultado. Estados possíveis:
//   "pending"  → skeleton animado
//   "loading"  → imagem chegando (spinner overlay)
//   "done"     → imagem pronta, ações visíveis
//   "error"    → falha com botão de retry
//
// Props:
//   card           – objeto do store { id, status, imagemBase64,
//                    corteNome, origemId, corteObj, ... }
//   isFavorito     – boolean
//   onFavoritar    – fn(card)
//   onVariar       – fn(card)  → "gerar mais como esse"
//   onRetry        – fn(card)
//   onVerDetalhe   – fn(card)  → abre modal/fullscreen
//   index          – número (0,1,2…) para stagger da animação
// ─────────────────────────────────────────────────────────────

import PropTypes from "prop-types";
import { useState, useRef, useEffect, useCallback } from "react";

// ── Ícones inline (sem dependência extra) ────────────────────
const IconHeart = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"}
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

IconHeart.propTypes = {
  filled: PropTypes.bool,
};

const IconShuffle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);

const IconZoom = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

const IconRefresh = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

// ── Componente ───────────────────────────────────────────────
export default function CardCorte({
  card,
  isFavorito = false,
  onFavoritar = () => { },
  onVariar = () => { },
  onRetry = () => { },
  onVerDetalhe = () => { },
  index = 0,
}) {
  const { status, imagemBase64, origemId } = card;
  // Suporta tanto o formato do store (card.corte.nome) quanto legado (card.corteNome)
  const corteNome = card.corte?.nome ?? card.corteNome ?? "";
  const corteObj = card.corte ?? card.corteObj ?? null;

  // Animação de entrada em cascata baseada no index
  const entryDelay = `${index * 120}ms`;

  // Controle do heart-burst ao favoritar
  const [heartBurst, setHeartBurst] = useState(false);
  // Shake lateral do botão variar
  const [varyShake, setVaryShake] = useState(false);
  // Controle do press longo no mobile (abre ações)
  const [acoesMobile, setAcoesMobile] = useState(false);
  const pressTimer = useRef(null);
  // Imagem carregada no <img>
  const [imgLoaded, setImgLoaded] = useState(false);

  // Reseta o imgLoaded quando a imagem muda
  useEffect(() => { setImgLoaded(false); }, [imagemBase64]);

  const handleFavoritar = useCallback((e) => {
    e.stopPropagation();
    if (!isFavorito) {
      setHeartBurst(true);
      setTimeout(() => setHeartBurst(false), 700);
    }
    onFavoritar(card);
  }, [card, isFavorito, onFavoritar]);

  const handleVariar = useCallback((e) => {
    e.stopPropagation();
    setVaryShake(true);
    setTimeout(() => setVaryShake(false), 500);
    setAcoesMobile(false);
    onVariar(card);
  }, [card, onVariar]);

  // Long press no mobile: 500ms segurando abre o menu de ações
  const handleTouchStart = () => {
    pressTimer.current = setTimeout(() => setAcoesMobile(true), 500);
  };
  const handleTouchEnd = () => {
    clearTimeout(pressTimer.current);
  };

  // Badge de variação
  const isVariacao = !!origemId;

  return (
    <>
      <style>{cardStyles}</style>

      <article
        className="bc-card"
        data-status={status}
        style={{ "--entry-delay": entryDelay }}
        onClick={() => status === "success" && onVerDetalhe(card)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchEnd}
      >

        {/* ── SKELETON ── */}
        {status === "pending" && (
          <div className="bc-skeleton">
            <div className="bc-skeleton__shimmer" />
            <div className="bc-skeleton__label" />
            <div className="bc-skeleton__sub" />
          </div>
        )}

        {/* ── IMAGEM + OVERLAY ── */}
        {(status === "loading" || status === "success" || status === "error") && (
          <div className="bc-img-wrap">

            {/* Imagem real */}
            {imagemBase64 && (
              <img
                className="bc-img"
                src={imagemBase64}
                alt={corteNome}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                style={{ opacity: imgLoaded ? 1 : 0 }}
              />
            )}

            {/* Spinner enquanto imagem não carregou no <img> */}
            {status === "loading" && (
              <div className="bc-spinner-wrap">
                <div className="bc-spinner" />
              </div>
            )}

            {/* Gradiente inferior + info */}
            {status === "success" && imgLoaded && (
              <div className="bc-overlay">
                <div className="bc-info">
                  <div className="bc-info__row">
                    <span className="bc-nome">{corteNome}</span>
                    {isVariacao && (
                      <span className="bc-badge">variação</span>
                    )}
                  </div>
                  {corteObj?.subtitulo && (
                    <span className="bc-sub">{corteObj.subtitulo}</span>
                  )}
                </div>

                {/* Ações desktop — sempre visíveis no hover */}
                <div className="bc-actions">
                  <button
                    className={`bc-btn bc-btn--heart ${isFavorito ? "active" : ""} ${heartBurst ? "burst" : ""}`}
                    onClick={handleFavoritar}
                    title={isFavorito ? "Remover favorito" : "Favoritar"}
                    aria-label={isFavorito ? "Remover favorito" : "Favoritar"}
                  >
                    <IconHeart filled={isFavorito} />
                    {heartBurst && <span className="bc-burst" />}
                    {heartBurst && (
                      <span className="bc-particles">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <span key={i} className="bc-particle" style={{ "--ang": `${i * 60}deg` }} />
                        ))}
                      </span>
                    )}
                  </button>

                  <button
                    className={`bc-btn bc-btn--vary ${varyShake ? "shake" : ""}`}
                    onClick={handleVariar}
                    title="Gerar mais como esse"
                    aria-label="Gerar variações"
                  >
                    <IconShuffle />
                  </button>
                </div>
              </div>
            )}

            {/* Estado de erro */}
            {status === "error" && (
              <div className="bc-error">
                <span className="bc-error__icon">{card.semCota ? "⏻" : "✕"}</span>
                <span className="bc-error__msg">
                  {card.erro ?? "Falha ao gerar"}
                </span>
                {!card.semCota && (
                  <button className="bc-btn bc-btn--retry" onClick={() => onRetry(card)}>
                    <IconRefresh />
                    <span>Tentar novamente</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── MENU MOBILE (long press) ── */}
        {acoesMobile && status === "success" && (
          <div className="bc-mobile-menu" onClick={() => setAcoesMobile(false)}>
            <div className="bc-mobile-menu__sheet" onClick={e => e.stopPropagation()}>
              <div className="bc-mobile-menu__handle" />
              <p className="bc-mobile-menu__title">{corteNome}</p>
              <button className="bc-mobile-menu__item" onClick={handleFavoritar}>
                <IconHeart filled={isFavorito} />
                {isFavorito ? "Remover dos favoritos" : "Salvar nos favoritos"}
              </button>
              <button className="bc-mobile-menu__item" onClick={handleVariar}>
                <IconShuffle />
                Gerar mais variações como esse
              </button>
              <button className="bc-mobile-menu__item" onClick={(e) => {
                e.stopPropagation();
                setAcoesMobile(false);
                onVerDetalhe(card);
              }}>
                <IconZoom />
                Ver em tela cheia
              </button>
              <button
                className="bc-mobile-menu__cancel"
                onClick={() => setAcoesMobile(false)}
              >Cancelar</button>
            </div>
          </div>
        )}
      </article>
    </>
  );
}

const corteShape = PropTypes.shape({
  nome: PropTypes.string,
  subtitulo: PropTypes.string,
});

CardCorte.propTypes = {
  card: PropTypes.shape({
    status: PropTypes.oneOf(["pending", "loading", "success", "error"]),
    imagemBase64: PropTypes.string,
    origemId: PropTypes.string,
    corteNome: PropTypes.string,
    corte: corteShape,
    corteObj: corteShape,
    semCota: PropTypes.bool,
    erro: PropTypes.string,
  }).isRequired,
  isFavorito: PropTypes.bool,
  onFavoritar: PropTypes.func,
  onVariar: PropTypes.func,
  onRetry: PropTypes.func,
  onVerDetalhe: PropTypes.func,
  index: PropTypes.number,
};

// ── CSS-in-JS (escopo isolado com prefixo bc-) ───────────────
const cardStyles = `
  /* Tokens locais */
  .bc-card {
    --gold:       #C9A84C;
    --gold-light: #E8C97A;
    --dark:       #0A0A0B;
    --surface:    #141416;
    --surface2:   #1C1C1F;
    --border:     rgba(201,168,76,0.18);
    --text:       #F0EDE8;
    --text-muted: rgba(240,237,232,0.45);
    --radius:     16px;
    --shadow:     0 8px 32px rgba(0,0,0,0.55);

    position: relative;
    border-radius: var(--radius);
    background: var(--surface);
    border: 1px solid var(--border);
    overflow: hidden;
    aspect-ratio: 3/4;
    cursor: pointer;

    /* Entrada em cascata */
    opacity: 0;
    transform: translateY(20px) scale(0.97);
    animation: bc-enter 0.5s cubic-bezier(0.22,1,0.36,1) var(--entry-delay) forwards;

    box-shadow: var(--shadow);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .bc-card:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow:
      0 16px 48px rgba(0,0,0,0.7),
      0 0 0 1px var(--gold),
      0 0 24px rgba(201,168,76,0.25);
  }

  @keyframes bc-enter {
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── SKELETON ── */
  .bc-skeleton {
    width: 100%;
    height: 100%;
    background: var(--surface2);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 20px;
    gap: 8px;
  }

  .bc-skeleton__shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      transparent 40%,
      rgba(201,168,76,0.06) 50%,
      transparent 60%
    );
    background-size: 200% 100%;
    animation: bc-shimmer 1.8s infinite;
  }

  @keyframes bc-shimmer {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }

  .bc-skeleton__label {
    height: 16px;
    width: 60%;
    border-radius: 8px;
    background: rgba(255,255,255,0.06);
  }

  .bc-skeleton__sub {
    height: 11px;
    width: 40%;
    border-radius: 8px;
    background: rgba(255,255,255,0.04);
  }

  /* ── IMAGEM ── */
  .bc-img-wrap {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .bc-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1);
    transform-origin: center 35%;
  }

  .bc-card:hover .bc-img {
    transform: scale(1.06);
  }

  /* ── SPINNER ── */
  .bc-spinner-wrap {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(10,10,11,0.6);
    backdrop-filter: blur(4px);
  }

  .bc-spinner {
    width: 36px;
    height: 36px;
    border: 2px solid rgba(201,168,76,0.2);
    border-top-color: #C9A84C;
    border-radius: 50%;
    animation: bc-spin 0.8s linear infinite;
  }

  @keyframes bc-spin {
    to { transform: rotate(360deg); }
  }

  /* ── OVERLAY (gradiente + info + ações) ── */
  .bc-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 14px;
    background: linear-gradient(
      to bottom,
      transparent 40%,
      rgba(10,10,11,0.95) 100%
    );
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  .bc-card:hover .bc-overlay,
  .bc-card:focus-within .bc-overlay {
    opacity: 1;
  }

  /* No mobile (touch), overlay sempre visível */
  @media (hover: none) {
    .bc-overlay { opacity: 1; }
    .bc-actions { opacity: 1 !important; }
  }

  /* Desktop: overlay aparece no hover — garante que funciona */
  @media (hover: hover) {
    .bc-card:hover .bc-overlay { opacity: 1; }
  }

  /* ── INFO ── */
  .bc-info {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .bc-info__row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .bc-nome {
    font-family: "Georgia", serif;
    font-size: 15px;
    font-weight: 600;
    color: #F0EDE8;
    letter-spacing: 0.01em;
    text-shadow: 0 1px 6px rgba(0,0,0,0.8);
  }

  .bc-badge {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--gold);
    border: 1px solid var(--gold);
    border-radius: 4px;
    padding: 2px 5px;
    opacity: 0.9;
  }

  .bc-sub {
    font-size: 11px;
    color: var(--text-muted);
    font-style: italic;
  }

  /* ── AÇÕES ── */
  .bc-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    align-self: flex-start;
  }

  .bc-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(10,10,11,0.65);
    backdrop-filter: blur(8px);
    color: #F0EDE8;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    padding: 0;
  }

  .bc-btn svg {
    width: 16px;
    height: 16px;
  }

  .bc-btn:hover {
    background: rgba(201,168,76,0.2);
    border-color: var(--gold);
    color: var(--gold-light);
    transform: scale(1.1);
  }

  .bc-btn:active { transform: scale(0.95); }

  /* Heart ativo */
  .bc-btn--heart.active {
    color: #e05252;
    border-color: rgba(224,82,82,0.4);
    background: rgba(224,82,82,0.15);
  }

  /* Heart burst */
  .bc-btn--heart.burst { animation: bc-heartpop 0.4s cubic-bezier(0.36,0.07,0.19,0.97); }

  @keyframes bc-heartpop {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.5); }
    70%  { transform: scale(0.9); }
    100% { transform: scale(1); }
  }

  .bc-burst {
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(224,82,82,0.5) 0%, transparent 70%);
    animation: bc-burst-anim 0.5s ease-out forwards;
    pointer-events: none;
  }

  @keyframes bc-burst-anim {
    0%   { opacity: 1; transform: scale(0.5); }
    100% { opacity: 0; transform: scale(2.5); }
  }

  /* Partículas douradas ao favoritar */
  .bc-particles {
    position: absolute;
    top: 50%; left: 50%;
    width: 0; height: 0;
    pointer-events: none;
  }
  .bc-particle {
    position: absolute;
    top: 0; left: 0;
    width: 5px; height: 5px;
    margin: -2.5px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--gold-light) 0%, var(--gold) 70%);
    box-shadow: 0 0 6px rgba(201,168,76,0.8);
    animation: bc-particle-fly 0.6s ease-out forwards;
  }
  @keyframes bc-particle-fly {
    0% {
      opacity: 1;
      transform: rotate(var(--ang)) translateX(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: rotate(var(--ang)) translateX(26px) scale(0.3);
    }
  }

  /* Shake lateral do botão variar */
  .bc-btn--vary.shake { animation: bc-shake 0.45s cubic-bezier(0.36,0.07,0.19,0.97); }
  @keyframes bc-shake {
    0%, 100% { transform: translateX(0); }
    15% { transform: translateX(-5px) rotate(-8deg); }
    30% { transform: translateX(5px) rotate(8deg); }
    45% { transform: translateX(-4px) rotate(-6deg); }
    60% { transform: translateX(4px) rotate(6deg); }
    75% { transform: translateX(-2px) rotate(-3deg); }
  }

  /* ── ERRO ── */
  .bc-error {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: rgba(10,10,11,0.88);
    padding: 20px;
  }

  .bc-error__icon {
    font-size: 28px;
    color: #e05252;
  }

  .bc-error__msg {
    font-size: 13px;
    color: var(--text-muted);
    text-align: center;
  }

  .bc-btn--retry {
    display: flex;
    align-items: center;
    gap: 6px;
    width: auto;
    height: auto;
    border-radius: 8px;
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    border-color: var(--border);
    background: var(--surface2);
    color: var(--gold-light);
  }

  .bc-btn--retry:hover {
    background: rgba(201,168,76,0.15);
    border-color: var(--gold);
    transform: none;
  }

  .bc-btn--retry svg { width: 13px; height: 13px; }

  /* ── MENU MOBILE (long press) ── */
  .bc-mobile-menu {
    position: fixed;
    inset: 0;
    z-index: 999;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: flex-end;
    animation: bc-fade-in 0.2s ease;
  }

  @keyframes bc-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .bc-mobile-menu__sheet {
    width: 100%;
    background: var(--surface);
    border-top: 1px solid var(--border);
    border-radius: 20px 20px 0 0;
    padding: 12px 20px 32px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    animation: bc-slide-up 0.3s cubic-bezier(0.22,1,0.36,1);
  }

  @keyframes bc-slide-up {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }

  .bc-mobile-menu__handle {
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: rgba(255,255,255,0.15);
    margin: 0 auto 14px;
  }

  .bc-mobile-menu__title {
    font-family: "Georgia", serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--text);
    padding: 0 4px 8px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 4px;
  }

  .bc-mobile-menu__item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 4px;
    background: none;
    border: none;
    color: var(--text);
    font-size: 15px;
    cursor: pointer;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    text-align: left;
    transition: color 0.15s;
  }

  .bc-mobile-menu__item svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: var(--gold);
  }

  .bc-mobile-menu__item:hover { color: var(--gold-light); }

  .bc-mobile-menu__cancel {
    margin-top: 8px;
    padding: 14px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: var(--surface2);
    color: var(--text-muted);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }

  .bc-mobile-menu__cancel:hover {
    color: var(--text);
    border-color: rgba(255,255,255,0.25);
  }
`;
