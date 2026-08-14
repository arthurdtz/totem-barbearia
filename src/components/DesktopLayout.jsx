// src/components/DesktopLayout.jsx
// ─────────────────────────────────────────────────────────────
// Wrapper de layout desktop.
// No mobile: transparente — renderiza children direto.
// No desktop (≥900px): divide a tela em duas colunas:
//   · Esquerda — painel fixo com branding, step indicator e dica
//   · Direita  — conteúdo interativo (children)
// Não altera a lógica interna de nenhuma tela.
// ─────────────────────────────────────────────────────────────

import PropTypes from "prop-types";

const STEPS = [
  { num: 1, label: "Foto", desc: "Envie uma selfie de frente" },
  { num: 2, label: "Rosto", desc: "Informe seu formato de rosto" },
  { num: 3, label: "Estilo", desc: "Escolha a vibe e o tipo de cabelo" },
];

const STEP_MAP = {
  foto: 1,
  rosto: 2,
  estilo: 3,
  resultado: null,
};

export default function DesktopLayout({ tela, children }) {
  const stepAtual = STEP_MAP[tela] ?? null;

  return (
    <>
      <style>{css}</style>
      <div className="dl-root">
        {/* ── Painel esquerdo: branding ── */}
        <aside className="dl-aside">
          <div className="dl-aside__inner">
            {/* Logo */}
            <div className="dl-logo">
              <svg className="dl-logo__svg" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="#C9A84C" strokeWidth="1.2" strokeDasharray="4 3" />
                <path d="M20 20 L32 38 L44 20" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="20" cy="20" r="4" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
                <circle cx="44" cy="20" r="4" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
                <line x1="32" y1="38" x2="32" y2="48" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div>
                <p className="dl-logo__sub">BARBEARIA</p>
                <h1 className="dl-logo__nome">BRAVOS</h1>
              </div>
            </div>

            {/* Tagline */}
            <p className="dl-tagline">
              Visualize seu próximo corte antes de sentar na cadeira.
            </p>

            {/* Step indicator — só nas telas de fluxo */}
            {stepAtual && (
              <div className="dl-steps">
                {STEPS.map((s, i) => {
                  const status =
                    s.num < stepAtual ? "done" :
                      s.num === stepAtual ? "active" : "pending";
                  return (
                    <div key={s.num} className={`dl-step dl-step--${status}`}>
                      <div className="dl-step__bullet">
                        {status === "done" ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#08080A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <span>{s.num}</span>
                        )}
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`dl-step__line dl-step__line--${status === "done" ? "done" : "pending"}`} />
                      )}
                      <div className="dl-step__text">
                        <span className="dl-step__label">{s.label}</span>
                        <span className="dl-step__desc">{s.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Detalhe decorativo */}
            <div className="dl-detalhe">
              <div className="dl-detalhe__line" />
              <span className="dl-detalhe__text">IA + Artesanato</span>
              <div className="dl-detalhe__line" />
            </div>
          </div>

          {/* Ornamentos de fundo */}
          <div className="dl-aside__orb dl-aside__orb--top" />
          <div className="dl-aside__orb dl-aside__orb--bot" />
        </aside>

        {/* ── Painel direito: conteúdo ── */}
        <main className="dl-main">
          {children}
        </main>
      </div>
    </>
  );
}

DesktopLayout.propTypes = {
  tela: PropTypes.oneOf(["foto", "rosto", "estilo", "resultado"]).isRequired,
  children: PropTypes.node.isRequired,
};


// ── CSS ───────────────────────────────────────────────────────
const css = `
/* Mobile: wrapper invisível */
.dl-root {
  display: contents;
}
.dl-aside { display: none; }
.dl-main  { display: contents; }

/* Desktop: duas colunas */
@media (min-width: 900px) {
  .dl-root {
    display: grid !important;
    grid-template-columns: 360px 1fr;
    min-height: 100dvh;
    width: 100%;
  }

  .dl-aside {
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100dvh;
    background: #0D0D0F;
    border-right: 1px solid rgba(201,168,76,0.12);
    overflow: hidden;
    z-index: 10;
  }

  .dl-aside__inner {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding: 52px 44px;
    height: 100%;
  }

  /* Orbs decorativos */
  .dl-aside__orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: 1;
  }
  .dl-aside__orb--top {
    top: -160px; right: -160px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%);
  }
  .dl-aside__orb--bot {
    bottom: -120px; left: -120px;
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%);
  }

  /* Logo */
  .dl-logo {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .dl-logo__svg {
    width: 52px;
    height: 52px;
    flex-shrink: 0;
  }
  .dl-logo__sub {
    font-size: 9px;
    letter-spacing: 5px;
    color: #C9A84C;
    font-family: 'Cormorant Garamond', 'Georgia', serif;
    margin: 0 0 2px;
  }
  .dl-logo__nome {
    font-size: 28px;
    font-family: 'Cormorant Garamond', 'Georgia', serif;
    font-style: italic;
    font-weight: 400;
    letter-spacing: 5px;
    color: #F0EDE8;
    margin: 0;
    line-height: 1;
  }

  /* Tagline */
  .dl-tagline {
    font-size: 14px;
    color: rgba(240,237,232,0.45);
    line-height: 1.7;
    font-family: 'DM Sans', sans-serif;
    max-width: 240px;
  }

  /* Steps */
  .dl-steps {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .dl-step {
    display: grid;
    grid-template-columns: 28px 1fr;
    grid-template-rows: auto auto;
    column-gap: 16px;
    row-gap: 0;
  }
  .dl-step__bullet {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    flex-shrink: 0;
    grid-row: 1;
    grid-column: 1;
    transition: all 0.3s;
  }
  .dl-step--done   .dl-step__bullet { background: #C9A84C; color: #08080A; }
  .dl-step--active .dl-step__bullet { background: rgba(201,168,76,0.15); border: 1.5px solid #C9A84C; color: #C9A84C; }
  .dl-step--pending .dl-step__bullet { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: rgba(240,237,232,0.3); }

  .dl-step__line {
    width: 1.5px;
    height: 28px;
    margin: 4px auto;
    grid-row: 2;
    grid-column: 1;
    border-radius: 2px;
    transition: background 0.3s;
  }
  .dl-step__line--done    { background: #C9A84C; }
  .dl-step__line--pending { background: rgba(255,255,255,0.08); }

  .dl-step__text {
    grid-row: 1;
    grid-column: 2;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-top: 4px;
  }
  .dl-step__label {
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.3s;
  }
  .dl-step--done    .dl-step__label { color: rgba(201,168,76,0.7); }
  .dl-step--active  .dl-step__label { color: #F0EDE8; }
  .dl-step--pending .dl-step__label { color: rgba(240,237,232,0.3); }

  .dl-step__desc {
    font-size: 11px;
    color: rgba(240,237,232,0.3);
    font-family: 'DM Sans', sans-serif;
    line-height: 1.4;
  }
  .dl-step--active .dl-step__desc { color: rgba(240,237,232,0.5); }

  /* Detalhe decorativo */
  .dl-detalhe {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: auto;
  }
  .dl-detalhe__line {
    flex: 1;
    height: 1px;
    background: rgba(201,168,76,0.15);
  }
  .dl-detalhe__text {
    font-size: 10px;
    letter-spacing: 2px;
    color: rgba(201,168,76,0.4);
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }

  /* Painel direito */
  .dl-main {
    display: block !important;
    overflow-y: auto;
    min-height: 100dvh;
  }

  /* Telas dentro do painel direito ocupam 100% */
  .dl-main > * {
    min-height: 100dvh;
  }
}
`;
