// src/components/BeforeAfterSlider.jsx
// ─────────────────────────────────────────────────────────────
// Slider Antes/Depois — implementação correta com clip-path.
//
// Técnica: ambas as imagens ficam em position:absolute, inset:0,
// cobrindo TODO o stage. O lado ANTES usa `clip-path: inset(0 X% 0 0)`
// onde X = 100 - pos. Assim nenhuma imagem se move — só o recorte muda.
//
// Props:
//   antesSrc  – string  (foto original, base64/url)
//   depoisSrc – string  (imagem gerada, base64/url)
//   corteNome – string  (opcional, legenda)
//   compact   – boolean (sem header/hint, para usar inline no card)
// ─────────────────────────────────────────────────────────────

import { useState, useRef, useCallback, useEffect } from "react";

export default function BeforeAfterSlider({
  antesSrc,
  depoisSrc,
  corteNome = "",
  compact = false,
}) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  // Animação de entrada: handle desliza de 65→50 ao montar
  useEffect(() => {
    const t1 = setTimeout(() => setPos(65), 200);
    const t2 = setTimeout(() => setPos(50), 700);
    const t3 = setTimeout(() => setMounted(true), 750);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const calcPos = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    const pct = Math.max(2, Math.min(98, ((clientX - left) / width) * 100));
    setPos(pct);
  }, []);

  // Mouse
  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
    calcPos(e.clientX);
  }, [calcPos]);

  useEffect(() => {
    if (!dragging) return;
    const move = (e) => calcPos(e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging, calcPos]);

  // Touch
  const onTouchStart = useCallback((e) => {
    setDragging(true);
    if (e.touches[0]) calcPos(e.touches[0].clientX);
  }, [calcPos]);
  const onTouchMove = useCallback((e) => {
    e.preventDefault();
    if (e.touches[0]) calcPos(e.touches[0].clientX);
  }, [calcPos]);
  const onTouchEnd = useCallback(() => setDragging(false), []);

  // Teclado
  const onKeyDown = useCallback((e) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(2, p - 3));
    if (e.key === "ArrowRight") setPos((p) => Math.min(98, p + 3));
  }, []);

  if (!antesSrc || !depoisSrc) return null;

  // clip-path correto: a imagem ANTES é cortada a partir de `pos`% para a direita
  const clipAntes = `inset(0 ${100 - pos}% 0 0)`;
  const clipDepois = `inset(0 0 0 ${pos}%)`;

  return (
    <div className={`bas-wrap ${compact ? "bas-wrap--compact" : ""}`}>
      <style>{styles}</style>

      {!compact && (
        <div className="bas-header">
          <span className="bas-header__line" />
          <span className="bas-header__title">Antes &amp; Depois</span>
          <span className="bas-header__line" />
        </div>
      )}

      {/* Stage */}
      <div
        ref={containerRef}
        className={`bas-stage ${dragging ? "is-dragging" : ""} ${mounted ? "is-ready" : ""}`}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* DEPOIS — base, sempre visível */}
        <img
          className="bas-img"
          src={depoisSrc}
          alt="Depois"
          draggable={false}
          style={{ clipPath: clipDepois }}
        />

        {/* ANTES — recortado pelo clip */}
        <img
          className="bas-img"
          src={antesSrc}
          alt="Antes"
          draggable={false}
          style={{ clipPath: clipAntes }}
        />

        {/* Labels */}
        <span className="bas-label bas-label--antes">ANTES</span>
        <span className="bas-label bas-label--depois">DEPOIS</span>

        {/* Divisor visual (linha) */}
        <div className="bas-divider" style={{ left: `${pos}%` }} />

        {/* Handle arrastável */}
        <div
          className="bas-handle"
          style={{ left: `${pos}%` }}
          role="slider"
          tabIndex={0}
          aria-label="Comparar antes e depois"
          aria-valuenow={Math.round(pos)}
          aria-valuemin={2}
          aria-valuemax={98}
          onKeyDown={onKeyDown}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>

      {!compact && (
        <p className="bas-hint">
          {corteNome && <strong>{corteNome}</strong>}
          Arraste para comparar
        </p>
      )}
    </div>
  );
}

const styles = `
  .bas-wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    animation: bas-enter 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes bas-enter {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .bas-wrap--compact { gap: 0; animation: none; }

  .bas-header {
    display: flex; align-items: center; gap: 12px;
  }
  .bas-header__line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent);
  }
  .bas-header__title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px; font-style: italic;
    color: #E8C97A; letter-spacing: 0.5px;
    white-space: nowrap;
  }

  /* ── Stage ── */
  .bas-stage {
    position: relative;
    width: 100%;
    /* aspect-ratio deve bater com o HeroCard (3/4) quando compact, livre quando standalone */
    overflow: hidden;
    cursor: ew-resize;
    user-select: none;
    touch-action: pan-y;
    border-radius: 18px;
    background: #111113;
    border: 1px solid rgba(201,168,76,0.18);
    box-shadow: 0 12px 40px rgba(0,0,0,0.45);
  }
  .bas-wrap:not(.bas-wrap--compact) .bas-stage {
    aspect-ratio: 3/4;
    max-height: 520px;
  }
  .bas-wrap--compact .bas-stage {
    /* ocupa todo o espaço do hero-card, sem forçar aspect-ratio próprio */
    position: absolute;
    inset: 0;
    border-radius: 0 !important;
    aspect-ratio: unset;
  }

  /* ── Imagens — ambas cobrem todo o stage, só o clip muda ── */
  .bas-img {
    position: absolute;
    inset: 0;
    width: 100%; height: 100%;
    object-fit: contain;
    object-position: center center;
    display: block;
    pointer-events: none;
    will-change: clip-path;
    background: #0a0a0b;
  }
  /* Transição suave só quando não está arrastando */
  .bas-stage.is-ready:not(.is-dragging) .bas-img {
    transition: clip-path 0.08s ease-out;
  }

  /* ── Labels ── */
  .bas-label {
    position: absolute;
    top: 14px;
    font-size: 10px; font-weight: 700;
    letter-spacing: 2px;
    padding: 5px 11px;
    border-radius: 20px;
    background: rgba(8,8,10,0.72);
    backdrop-filter: blur(8px);
    pointer-events: none;
    z-index: 4;
    transition: opacity 0.2s ease;
  }
  .bas-label--antes {
    left: 14px;
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(240,237,232,0.9);
  }
  .bas-label--depois {
    right: 14px;
    border: 1px solid rgba(201,168,76,0.45);
    color: #E8C97A;
  }

  /* ── Linha divisória ── */
  .bas-divider {
    position: absolute;
    top: 0; bottom: 0;
    width: 2px;
    transform: translateX(-50%);
    background: linear-gradient(
      to bottom,
      rgba(201,168,76,0.1),
      #C9A84C 30%,
      #E8C97A 50%,
      #C9A84C 70%,
      rgba(201,168,76,0.1)
    );
    box-shadow: 0 0 10px rgba(201,168,76,0.5);
    pointer-events: none;
    z-index: 3;
  }
  .bas-stage.is-ready:not(.is-dragging) .bas-divider {
    transition: left 0.08s ease-out;
  }

  /* ── Handle ── */
  .bas-handle {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 42px; height: 42px;
    border-radius: 50%;
    background: rgba(8,8,10,0.85);
    border: 2px solid #C9A84C;
    box-shadow: 0 0 0 3px rgba(201,168,76,0.15), 0 4px 18px rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
    cursor: ew-resize;
    z-index: 5;
    outline: none;
    color: #E8C97A;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    backdrop-filter: blur(6px);
  }
  .bas-handle svg { width: 13px; height: 13px; margin: 0 -2px; }
  .bas-stage.is-ready:not(.is-dragging) .bas-handle {
    transition: left 0.08s ease-out, box-shadow 0.2s ease;
  }
  .bas-stage.is-dragging .bas-handle,
  .bas-handle:focus-visible {
    box-shadow: 0 0 0 5px rgba(201,168,76,0.3), 0 4px 22px rgba(0,0,0,0.6);
    transform: translate(-50%, -50%) scale(1.1);
  }

  /* ── Hint ── */
  .bas-hint {
    text-align: center;
    font-size: 11px;
    color: rgba(240,237,232,0.38);
    margin: 0;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .bas-hint strong {
    color: #E8C97A;
    font-family: 'Cormorant Garamond', serif;
    font-size: 13px; font-weight: 600;
  }
  .bas-hint strong::after { content: '·'; margin-left: 6px; opacity: 0.4; }
`;
