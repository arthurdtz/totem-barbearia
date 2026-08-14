// src/components/LoadingCinematografico.jsx
// Overlay fullscreen que aparece enquanto todos os cards estão pending.
// Recebe: fotoBase64, estilo, onDismiss (chamado quando sumir)

import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const MENSAGENS = [
  "Analisando estrutura facial...",
  "Detectando formato do rosto...",
  "Calibrando fade ideal...",
  "Equilibrando proporções...",
  "Testando estilos modernos...",
  "Ajustando textura e volume...",
  "Gerando variações premium...",
  "Finalizando detalhes...",
];

const STEPS = [
  "Análise facial",
  "Seleção do estilo",
  "Geração da imagem",
];

export default function LoadingCinematografico({ fotoBase64, visivel }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [progresso, setProgresso] = useState(0);

  // Rotaciona mensagens a cada 2.2s
  useEffect(() => {
    if (!visivel) return;
    const t = setInterval(() => {
      setMsgIdx(i => (i + 1) % MENSAGENS.length);
    }, 2200);
    return () => clearInterval(t);
  }, [visivel]);

  // Avança steps
  useEffect(() => {
    if (!visivel) return;
    const t1 = setTimeout(() => setStepIdx(1), 3000);
    const t2 = setTimeout(() => setStepIdx(2), 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [visivel]);

  // Progresso fake (0→90% em ~15s — o real é quando cards chegam)
  useEffect(() => {
    if (!visivel) { setProgresso(0); return; }
    setProgresso(0);
    const intervalo = 300;
    const incremento = 90 / (15000 / intervalo);
    const t = setInterval(() => {
      setProgresso(p => Math.min(p + incremento, 90));
    }, intervalo);
    return () => clearInterval(t);
  }, [visivel]);

  if (!visivel) return null;

  return (
    <>
      <style>{css}</style>
      <div className="lc-root">

        {/* Fundo com foto desfocada */}
        {fotoBase64 && (
          <div
            className="lc-bg-foto"
            style={{ backgroundImage: `url(${fotoBase64})` }}
          />
        )}
        <div className="lc-bg-overlay" />

        {/* Partículas */}
        <div className="lc-particles">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="lc-particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              opacity: 0.3 + Math.random() * 0.4,
            }} />
          ))}
        </div>

        {/* Conteúdo central */}
        <div className="lc-center">

          {/* Foto com ring */}
          {fotoBase64 && (
            <div className="lc-foto-wrap">
              <div className="lc-ring lc-ring--outer" />
              <div className="lc-ring lc-ring--inner" />
              <img className="lc-foto" src={fotoBase64} alt="Sua foto" />
              <div className="lc-foto-glow" />
            </div>
          )}

          {/* Logo */}
          <div className="lc-logo">
            <span className="lc-logo__bravos">BRAVOS</span>
            <span className="lc-logo__ia">IA</span>
          </div>

          {/* Mensagem dinâmica */}
          <p className="lc-mensagem" key={msgIdx}>
            {MENSAGENS[msgIdx]}
          </p>

          {/* Barra de progresso */}
          <div className="lc-progress-wrap">
            <div className="lc-progress-bar">
              <div className="lc-progress-fill" style={{ width: `${progresso}%` }} />
              <div className="lc-progress-glow" style={{ left: `${progresso}%` }} />
            </div>
            <span className="lc-progress-pct">{Math.round(progresso)}%</span>
          </div>

          {/* Steps */}
          <div className="lc-steps">
            {STEPS.map((s, i) => (
              <div key={i} className={`lc-step ${i <= stepIdx ? "lc-step--done" : ""} ${i === stepIdx ? "lc-step--active" : ""}`}>
                <div className="lc-step__dot">
                  {i < stepIdx ? "✓" : i === stepIdx ? <span className="lc-step__pulse" /> : null}
                </div>
                <span className="lc-step__label">{s}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Rodapé */}
        <p className="lc-rodape">Isso pode levar até 30 segundos</p>
      </div>
    </>
  );
}

LoadingCinematografico.propTypes = {
  fotoBase64: PropTypes.string,
  visivel: PropTypes.bool.isRequired,
};

const css = `
  .lc-root {
    position: fixed;
    inset: 0;
    z-index: 500;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    animation: lc-in 0.5s ease both;
  }
  @keyframes lc-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Fundo */
  .lc-bg-foto {
    position: absolute; inset: 0;
    background-size: cover;
    background-position: center;
    filter: blur(40px) brightness(0.25) saturate(0.6);
    transform: scale(1.1);
  }
  .lc-bg-overlay {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at center, rgba(8,8,10,0.5) 0%, rgba(8,8,10,0.92) 70%);
  }

  /* Partículas */
  .lc-particles {
    position: absolute; inset: 0;
    pointer-events: none; overflow: hidden;
  }
  .lc-particle {
    position: absolute;
    bottom: -10px;
    border-radius: 50%;
    background: #C9A84C;
    animation: lc-float linear infinite;
  }
  @keyframes lc-float {
    0%   { transform: translateY(0) scale(1); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.8; }
    100% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
  }

  /* Centro */
  .lc-center {
    position: relative; z-index: 2;
    display: flex; flex-direction: column;
    align-items: center; gap: 24px;
    padding: 0 24px;
    max-width: 380px; width: 100%;
  }

  /* Foto */
  .lc-foto-wrap {
    position: relative;
    width: 110px; height: 110px;
    display: flex; align-items: center; justify-content: center;
  }
  .lc-ring {
    position: absolute; border-radius: 50%;
    border: 1.5px solid rgba(201,168,76,0.4);
  }
  .lc-ring--outer {
    inset: -14px;
    animation: lc-spin 3s linear infinite;
    border-top-color: #C9A84C;
    border-right-color: transparent;
  }
  .lc-ring--inner {
    inset: -6px;
    animation: lc-spin 2s linear infinite reverse;
    border-top-color: rgba(201,168,76,0.5);
    border-left-color: transparent;
  }
  @keyframes lc-spin {
    to { transform: rotate(360deg); }
  }
  .lc-foto {
    width: 110px; height: 110px;
    border-radius: 50%;
    object-fit: cover;
    display: block;
    animation: lc-zoom-slow 8s ease-in-out infinite alternate;
  }
  @keyframes lc-zoom-slow {
    from { transform: scale(1); }
    to   { transform: scale(1.06); }
  }
  .lc-foto-glow {
    position: absolute; inset: 0; border-radius: 50%;
    background: radial-gradient(circle, transparent 60%, rgba(201,168,76,0.15) 100%);
    animation: lc-pulse 2s ease-in-out infinite alternate;
  }
  @keyframes lc-pulse {
    from { opacity: 0.5; }
    to   { opacity: 1; }
  }

  /* Logo */
  .lc-logo {
    display: flex; align-items: baseline; gap: 8px;
  }
  .lc-logo__bravos {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic; font-size: 28px; font-weight: 400;
    color: #F0EDE8; letter-spacing: 6px;
  }
  .lc-logo__ia {
    font-size: 10px; font-weight: 700; letter-spacing: 3px;
    color: #C9A84C; font-family: 'DM Sans', sans-serif;
    border: 1px solid rgba(201,168,76,0.4);
    padding: 2px 6px; border-radius: 4px;
  }

  /* Mensagem */
  .lc-mensagem {
    font-size: 14px; color: rgba(240,237,232,0.65);
    text-align: center; letter-spacing: 0.5px;
    font-family: 'DM Sans', sans-serif;
    min-height: 22px;
    animation: lc-msg-fade 0.5s ease both;
  }
  @keyframes lc-msg-fade {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Progresso */
  .lc-progress-wrap {
    width: 100%;
    display: flex; align-items: center; gap: 10px;
  }
  .lc-progress-bar {
    flex: 1; height: 3px;
    background: rgba(255,255,255,0.07);
    border-radius: 2px; overflow: visible;
    position: relative;
  }
  .lc-progress-fill {
    height: 100%; border-radius: 2px;
    background: linear-gradient(90deg, rgba(201,168,76,0.6), #C9A84C);
    transition: width 0.3s ease;
  }
  .lc-progress-glow {
    position: absolute; top: 50%;
    transform: translate(-50%, -50%);
    width: 8px; height: 8px; border-radius: 50%;
    background: #C9A84C;
    box-shadow: 0 0 10px 4px rgba(201,168,76,0.5);
    transition: left 0.3s ease;
  }
  .lc-progress-pct {
    font-size: 11px; color: rgba(201,168,76,0.7);
    font-family: 'DM Sans', sans-serif;
    min-width: 32px; text-align: right;
  }

  /* Steps */
  .lc-steps {
    display: flex; gap: 20px; align-items: center;
  }
  .lc-step {
    display: flex; flex-direction: column;
    align-items: center; gap: 6px;
    opacity: 0.35; transition: opacity 0.4s;
  }
  .lc-step--done, .lc-step--active { opacity: 1; }
  .lc-step__dot {
    width: 22px; height: 22px; border-radius: 50%;
    border: 1.5px solid rgba(201,168,76,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; color: #C9A84C;
    background: rgba(201,168,76,0.06);
    transition: all 0.3s;
  }
  .lc-step--done .lc-step__dot {
    background: rgba(201,168,76,0.15);
    border-color: #C9A84C;
  }
  .lc-step--active .lc-step__dot {
    border-color: #C9A84C;
    box-shadow: 0 0 12px rgba(201,168,76,0.3);
  }
  .lc-step__pulse {
    width: 8px; height: 8px; border-radius: 50%;
    background: #C9A84C;
    animation: lc-pulse 1s ease-in-out infinite alternate;
    display: block;
  }
  .lc-step__label {
    font-size: 9px; letter-spacing: 1px;
    color: rgba(240,237,232,0.45);
    font-family: 'DM Sans', sans-serif;
    text-align: center; white-space: nowrap;
  }
  .lc-step--active .lc-step__label,
  .lc-step--done  .lc-step__label { color: rgba(240,237,232,0.75); }

  /* Rodapé */
  .lc-rodape {
    position: absolute; bottom: 28px;
    font-size: 11px; color: rgba(240,237,232,0.2);
    letter-spacing: 1px; font-family: 'DM Sans', sans-serif;
    z-index: 2;
  }
`;
