// src/components/ScreenEstilo.jsx
import { useState, useEffect, useRef } from "react";

const ESTILOS = [
  {
    id: "classico", nome: "Clássico", desc: "Atemporais, sempre impecáveis.", emoji: "🎩",
    color: "#C9A84C", rgb: "201,168,76", glow: "rgba(201,168,76,0.18)",
    bg: "radial-gradient(ellipse at 60% 0%, rgba(201,168,76,0.09) 0%, transparent 60%), radial-gradient(ellipse at 20% 100%, rgba(120,90,30,0.06) 0%, transparent 50%)",
    mood: "Elegância atemporal",
  },
  {
    id: "moderno", nome: "Moderno", desc: "Fade preciso, acabamento urbano.", emoji: "⚡",
    color: "#4CA8C9", rgb: "76,168,201", glow: "rgba(76,168,201,0.18)",
    bg: "radial-gradient(ellipse at 80% 20%, rgba(76,168,201,0.1) 0%, transparent 55%), radial-gradient(ellipse at 10% 80%, rgba(30,80,120,0.08) 0%, transparent 50%)",
    mood: "Urbano e preciso",
  },
  {
    id: "casual", nome: "Casual", desc: "Descomplicado, fácil de manter.", emoji: "🌿",
    color: "#6AB04C", rgb: "106,176,76", glow: "rgba(106,176,76,0.16)",
    bg: "radial-gradient(ellipse at 40% 10%, rgba(106,176,76,0.08) 0%, transparent 55%), radial-gradient(ellipse at 70% 90%, rgba(50,100,30,0.06) 0%, transparent 50%)",
    mood: "Natural e descomplicado",
  },
  {
    id: "ousado", nome: "Ousado", desc: "Textura, personalidade forte.", emoji: "🔥",
    color: "#E85C2A", rgb: "232,92,42", glow: "rgba(232,92,42,0.2)",
    bg: "radial-gradient(ellipse at 70% 5%, rgba(232,92,42,0.12) 0%, transparent 55%), radial-gradient(ellipse at 15% 85%, rgba(150,40,10,0.08) 0%, transparent 50%)",
    mood: "Intenso e marcante",
  },
  {
    id: "executivo", nome: "Executivo", desc: "Profissional, sóbrio, impecável.", emoji: "💼",
    color: "#8B9CC9", rgb: "139,156,201", glow: "rgba(139,156,201,0.18)",
    bg: "radial-gradient(ellipse at 50% 0%, rgba(139,156,201,0.08) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(60,80,140,0.06) 0%, transparent 50%)",
    mood: "Autoridade e precisão",
  },
  {
    id: "street", nome: "Street", desc: "Cultura urbana, identidade forte.", emoji: "🛹",
    color: "#B44CC9", rgb: "180,76,201", glow: "rgba(180,76,201,0.18)",
    bg: "radial-gradient(ellipse at 30% 5%, rgba(180,76,201,0.1) 0%, transparent 55%), radial-gradient(ellipse at 90% 80%, rgba(100,30,140,0.07) 0%, transparent 50%)",
    mood: "Street culture vibes",
  },
];

const SERVICOS = [
  { id: "cabelo", nome: "Cabelo", desc: "Só o cabelo", icon: "💇" },
  { id: "barba", nome: "Barba", desc: "Só a barba", icon: "🧔" },
  { id: "ambos", nome: "Combo", desc: "Cabelo + barba", icon: "✨" },
];

export default function ScreenEstilo({ onEstilo, onVoltar }) {
  const [estiloId, setEstiloId] = useState(null);
  const [servicoId, setServicoId] = useState("cabelo");
  const [mood, setMood] = useState("Escolha uma vibe");
  const [atmColor, setAtmColor] = useState("#C9A84C");
  const [atmRgb, setAtmRgb] = useState("201,168,76");
  const [atmBg, setAtmBg] = useState("");
  const particlesRef = useRef(null);

  const podeAvancar = !!estiloId;

  function selectEstilo(id) {
    setEstiloId(id);
    const e = ESTILOS.find(x => x.id === id);
    setMood(e.mood);
    setAtmColor(e.color);
    setAtmRgb(e.rgb);
    setAtmBg(e.bg);
    spawnParticles(e.color);
  }

  function spawnParticles(color) {
    const container = particlesRef.current;
    if (!container) return;
    for (let i = 0; i < 12; i++) {
      const p = document.createElement("div");
      p.style.cssText = `
        position:absolute;
        width:${4 + Math.random() * 4}px;
        height:${4 + Math.random() * 4}px;
        border-radius:50%;
        background:${color};
        left:${Math.random() * 100}%;
        top:${30 + Math.random() * 60}%;
        pointer-events:none;
        opacity:0;
        animation: bv-particle ${0.8 + Math.random() * 0.8}s ${Math.random() * 0.3}s ease-out both;
      `;
      container.appendChild(p);
      setTimeout(() => p.remove(), 1400);
    }
  }

  function confirmar() {
    if (!podeAvancar) return;
    onEstilo({ estilo: estiloId, servico: servicoId });
  }

  return (
    <div style={{ ...s.root, position: "relative" }}>
      {/* Keyframes injetados */}
      <style>{`
        @keyframes bv-particle {
          0%   { opacity:0; transform: scale(0) translateY(0); }
          40%  { opacity:0.9; transform: scale(1) translateY(-30px); }
          100% { opacity:0; transform: scale(0.5) translateY(-60px); }
        }
        @keyframes bv-shine {
          to { transform: translateX(100%); }
        }
        .bv-egrid { perspective: 1000px; }
        .bv-ecard {
          transform-style: preserve-3d;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), border-color 0.3s, background 0.3s, box-shadow 0.3s;
        }
        .bv-ecard:hover {
          transform: translateY(-3px) rotateX(4deg) rotateY(-5deg) scale(1.02);
        }
        .bv-ecard:active { transform: translateY(-1px) rotateX(2deg) rotateY(-2deg) scale(0.99); }
        .bv-scard:hover { opacity: 0.85; }
        .bv-btn-gerar:not(:disabled) {
          animation: bv-pulse 2s ease-in-out infinite;
        }
        .bv-btn-gerar:not(:disabled):hover {
          transform: translateY(-1px); opacity: 0.92;
          animation: none;
        }
        .bv-btn-gerar:not(:disabled):hover::after {
          animation: bv-shine 0.6s ease forwards;
        }
        @keyframes bv-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(var(--atm-pulse), 0.45); }
          50%      { box-shadow: 0 0 0 12px rgba(var(--atm-pulse), 0); }
        }
      `}</style>

      {/* Background atmosférico */}
      <div style={{ ...s.atm, background: atmBg }} />

      {/* Partículas */}
      <div ref={particlesRef} style={s.particles} />

      {/* Header */}
      <header style={s.header}>
        <button style={s.voltarBtn} onClick={onVoltar}>
          <ChevronLeft /> <span>Voltar</span>
        </button>
        <span style={{ ...s.stepBadge, color: atmColor }}>ETAPA 3 / 3</span>
      </header>

      <div style={s.content}>
        {/* Título */}
        <div style={s.tituloWrap}>
          <p style={{ ...s.etapa, color: atmColor }}>ETAPA 3</p>
          <h2 style={s.titulo}>Seu Estilo</h2>
          <p style={s.subdesc}>Escolha a vibe que representa você.</p>
          {/* Mood tag */}
          <div style={{
            ...s.moodTag,
            background: `rgba(${atmRgb},0.12)`,
            border: `1px solid rgba(${atmRgb},0.25)`,
            color: atmColor,
          }}>
            <span>✦</span> {mood}
          </div>
        </div>

        {/* Seção estilos */}
        <section style={s.secao}>
          <p style={{ ...s.secaoLabel, color: atmColor }}>VIBE</p>
          <div style={s.estiloGrid} className="bv-egrid">
            {ESTILOS.map(e => {
              const ativo = estiloId === e.id;
              return (
                <button
                  key={e.id}
                  className="bv-ecard"
                  onClick={() => selectEstilo(e.id)}
                  style={{
                    ...s.estiloCard,
                    borderColor: ativo ? atmColor : "rgba(201,168,76,0.12)",
                    background: ativo ? "rgba(17,17,19,0.85)" : "rgba(17,17,19,0.7)",
                    boxShadow: ativo ? `0 0 20px ${ESTILOS.find(x => x.id === e.id)?.glow}` : "none",
                    transition: "all 0.3s",
                  }}
                >
                  <span style={s.emoji}>{e.emoji}</span>
                  <span style={s.estiloNome}>{e.nome}</span>
                  <span style={s.estiloDesc}>{e.desc}</span>
                  {ativo && (
                    <span style={{ ...s.check, background: atmColor }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Seção serviço */}
        <section style={s.secao}>
          <p style={{ ...s.secaoLabel, color: atmColor }}>SERVIÇO</p>
          <div style={s.servicoRow}>
            {SERVICOS.map(sv => {
              const ativo = servicoId === sv.id;
              return (
                <button
                  key={sv.id}
                  className="bv-scard"
                  onClick={() => setServicoId(sv.id)}
                  style={{
                    ...s.servicoCard,
                    borderColor: ativo ? atmColor : "rgba(201,168,76,0.12)",
                    background: ativo ? `rgba(${atmRgb},0.06)` : "rgba(17,17,19,0.7)",
                  }}
                >
                  <span style={{
                    ...s.servicoIcon,
                    background: ativo ? `rgba(${atmRgb},0.15)` : "rgba(201,168,76,0.08)",
                  }}>{sv.icon}</span>
                  <span style={s.servicoNome}>{sv.nome}</span>
                  <span style={s.servicoDesc}>{sv.desc}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Rodapé */}
        <div style={s.rodape}>
          {!estiloId && (
            <p style={s.aviso}>Selecione uma vibe para continuar</p>
          )}
          <button
            className="bv-btn-gerar"
            disabled={!podeAvancar}
            onClick={confirmar}
            style={{
              ...s.btnGerar,
              background: podeAvancar ? atmColor : "#C9A84C",
              opacity: podeAvancar ? 1 : 0.3,
              cursor: podeAvancar ? "pointer" : "not-allowed",
              "--atm-pulse": atmRgb,
            }}
          >
            <SparkIcon />
            Gerar Meus Cortes
          </button>
          <p style={s.rodapeInfo}>A IA vai criar sugestões personalizadas para você</p>
        </div>
      </div>
    </div>
  );
}

// ── Ícones ────────────────────────────────────────────────────
function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

// ── Estilos ───────────────────────────────────────────────────
const s = {
  root: {
    minHeight: "100dvh",
    display: "flex",
    flexDirection: "column",
    background: "var(--dark)",
    overflow: "hidden",
  },
  atm: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    transition: "background 0.8s cubic-bezier(0.4,0,0.2,1)",
    zIndex: 0,
  },
  particles: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 1,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 22px 16px",
    borderBottom: "1px solid rgba(201,168,76,0.1)",
    position: "relative",
    zIndex: 2,
    flexShrink: 0,
  },
  voltarBtn: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    background: "none",
    border: "none",
    color: "rgba(240,237,232,0.45)",
    fontSize: "13px",
    cursor: "pointer",
  },
  stepBadge: {
    fontSize: "11px",
    letterSpacing: "2.5px",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "20px 22px 36px",
    gap: "20px",
    overflowY: "auto",
    position: "relative",
    zIndex: 2,
  },
  tituloWrap: {
    textAlign: "center",
  },
  etapa: {
    fontSize: "9px",
    letterSpacing: "4px",
    marginBottom: "6px",
    textTransform: "uppercase",
  },
  titulo: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: "italic",
    fontSize: "32px",
    fontWeight: 400,
    color: "#F0EDE8",
    margin: "0 0 6px",
    lineHeight: 1,
  },
  subdesc: {
    fontSize: "12px",
    color: "rgba(240,237,232,0.42)",
    lineHeight: 1.5,
    marginBottom: "10px",
  },
  moodTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "10px",
    letterSpacing: "1px",
    transition: "all 0.5s ease",
    minHeight: "24px",
  },
  secao: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  secaoLabel: {
    fontSize: "9px",
    letterSpacing: "4px",
    textTransform: "uppercase",
  },
  estiloGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  estiloCard: {
    background: "rgba(17,17,19,0.7)",
    border: "1px solid rgba(201,168,76,0.12)",
    borderRadius: "14px",
    padding: "13px 14px",
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    backdropFilter: "blur(8px)",
    position: "relative",
  },
  emoji: {
    fontSize: "20px",
    lineHeight: 1,
    marginBottom: "3px",
  },
  estiloNome: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "15px",
    fontWeight: 600,
    color: "#F0EDE8",
  },
  estiloDesc: {
    fontSize: "10px",
    color: "rgba(240,237,232,0.42)",
    lineHeight: 1.4,
  },
  check: {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "8px",
    color: "#08080A",
    fontWeight: "bold",
  },
  servicoRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "8px",
  },
  servicoCard: {
    background: "rgba(17,17,19,0.7)",
    border: "1px solid rgba(201,168,76,0.12)",
    borderRadius: "12px",
    padding: "12px 6px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
    transition: "border-color 0.2s, background 0.2s",
    backdropFilter: "blur(8px)",
  },
  servicoIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    transition: "background 0.3s",
  },
  servicoNome: {
    fontSize: "11px",
    color: "#F0EDE8",
    letterSpacing: "1px",
    fontWeight: 500,
  },
  servicoDesc: {
    fontSize: "9px",
    color: "rgba(240,237,232,0.38)",
    textAlign: "center",
  },
  rodape: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
    marginTop: "auto",
  },
  aviso: {
    fontSize: "12px",
    color: "rgba(240,237,232,0.38)",
    fontStyle: "italic",
  },
  btnGerar: {
    width: "100%",
    padding: "15px 24px",
    border: "none",
    borderRadius: "12px",
    color: "#08080A",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "15px",
    fontWeight: 600,
    letterSpacing: "1.5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "opacity 0.2s, transform 0.15s, background 0.5s",
    position: "relative",
    overflow: "hidden",
  },
  rodapeInfo: {
    fontSize: "10px",
    color: "rgba(240,237,232,0.3)",
    textAlign: "center",
    fontStyle: "italic",
  },
};
