// src/components/ScreenLogin.jsx
import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";

export default function ScreenLogin({ onLogin }) {
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function handleSubmit(e) {
    e?.preventDefault();
    const n = nome.trim();
    if (!n) { setErro("Digite seu nome para continuar."); return; }
    setErro("");
    onLogin({ id: `u_${Date.now()}`, nome: n });
  }

  return (
    <div style={s.root}>
      <style>{css}</style>

      {/* Fundo atmosférico em camadas */}
      <div style={s.bg}>
        <div style={s.bgMesh} />
        <div style={s.bgOrb1} />
        <div style={s.bgOrb2} />
        <div style={s.bgOrb3} />
        <div style={s.bgNoise} />
      </div>

      {/* Grade ornamental de fundo */}
      <svg style={s.bgGrid} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="lg-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(201,168,76,0.04)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lg-grid)" />
      </svg>

      {/* Ornamentos de canto */}
      <svg style={s.ornTL} viewBox="0 0 120 120" fill="none">
        <path d="M10 10 L10 60" stroke="rgba(201,168,76,0.25)" strokeWidth="1" />
        <path d="M10 10 L60 10" stroke="rgba(201,168,76,0.25)" strokeWidth="1" />
        <circle cx="10" cy="10" r="3" fill="rgba(201,168,76,0.4)" />
      </svg>
      <svg style={s.ornTR} viewBox="0 0 120 120" fill="none">
        <path d="M110 10 L110 60" stroke="rgba(201,168,76,0.25)" strokeWidth="1" />
        <path d="M110 10 L60 10" stroke="rgba(201,168,76,0.25)" strokeWidth="1" />
        <circle cx="110" cy="10" r="3" fill="rgba(201,168,76,0.4)" />
      </svg>
      <svg style={s.ornBL} viewBox="0 0 120 120" fill="none">
        <path d="M10 110 L10 60" stroke="rgba(201,168,76,0.25)" strokeWidth="1" />
        <path d="M10 110 L60 110" stroke="rgba(201,168,76,0.25)" strokeWidth="1" />
        <circle cx="10" cy="110" r="3" fill="rgba(201,168,76,0.4)" />
      </svg>
      <svg style={s.ornBR} viewBox="0 0 120 120" fill="none">
        <path d="M110 110 L110 60" stroke="rgba(201,168,76,0.25)" strokeWidth="1" />
        <path d="M110 110 L60 110" stroke="rgba(201,168,76,0.25)" strokeWidth="1" />
        <circle cx="110" cy="110" r="3" fill="rgba(201,168,76,0.4)" />
      </svg>

      {/* Linha horizontal decorativa */}
      <div style={s.lineTop} />
      <div style={s.lineBot} />

      {/* Card central */}
      <div style={s.card} className="sl-card">
        {/* Glow interno do card */}
        <div style={s.cardGlow} />

        {/* Logo */}
        <div style={s.logoWrap}>
          <svg style={s.logoSvg} viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="#C9A84C" strokeWidth="1.2" strokeDasharray="4 3" />
            <path d="M20 20 L32 38 L44 20" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="20" cy="20" r="4" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
            <circle cx="44" cy="20" r="4" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
            <line x1="32" y1="38" x2="32" y2="48" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <p style={s.tagline}>BARBEARIA</p>
        <h1 style={s.titulo}>BRAVOS</h1>
        <div style={s.divider} />
        <p style={s.subtitulo}>Visualize seu próximo corte antes de entrar na cadeira.</p>

        {/* Form */}
        <div style={s.form}>
          <div style={s.inputWrap}>
            <label style={s.label} htmlFor="nome-input">SEU NOME</label>
            <input
              id="nome-input"
              ref={inputRef}
              type="text"
              value={nome}
              onChange={e => { setNome(e.target.value); setErro(""); }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="Como devemos te chamar?"
              style={{
                ...s.input,
                borderColor: focused ? "#C9A84C" : erro ? "#E57373" : "rgba(201,168,76,0.15)",
                boxShadow: focused
                  ? "0 0 0 4px rgba(201,168,76,0.12), 0 0 24px rgba(201,168,76,0.18)"
                  : "0 0 0 0 rgba(201,168,76,0)",
              }}
              maxLength={40}
              autoComplete="name"
            />
          </div>

          {erro && <p style={s.erro}>{erro}</p>}

          <button
            onClick={handleSubmit}
            disabled={!nome.trim()}
            className="sl-btn"
            style={{
              ...s.btn,
              opacity: nome.trim() ? 1 : 0.35,
              cursor: nome.trim() ? "pointer" : "not-allowed",
            }}
          >
            <span>ENTRAR</span>
            <ArrowRight />
          </button>
        </div>

        <div style={s.rodapeWrap}>
          <div style={s.rodapeLine} />
          <p style={s.rodape}>Experiência 100% local &amp; gratuita</p>
          <div style={s.rodapeLine} />
        </div>
      </div>

      {/* Estatísticas decorativas (fundo) */}
      <div style={s.statsRow}>
        {["847 cortes gerados", "IA em tempo real", "Sem cadastro"].map((t, i) => (
          <div key={i} style={s.statItem}>
            <span style={s.statDot}>◆</span>
            <span style={s.statText}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

ScreenLogin.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

function ArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

const css = `
  .sl-card {
    animation: sl-enter 0.7s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes sl-enter {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .sl-btn:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 32px rgba(201,168,76,0.35) !important;
  }
  .sl-btn:not(:disabled):active {
    transform: translateY(0px);
  }
  .sl-btn {
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
  }
  .sl-btn::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transform: skewX(-20deg);
    transition: none;
  }
  .sl-btn:not(:disabled):hover::after {
    animation: sl-shine 0.5s ease forwards;
  }
  @keyframes sl-shine {
    to { left: 150%; }
  }
`;

const s = {
  root: {
    minHeight: "100dvh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 20px",
    background: "#08080A",
    position: "relative",
    overflow: "hidden",
  },
  // Fundo
  bg: { position: "absolute", inset: 0, pointerEvents: "none" },
  bgMesh: {
    position: "absolute", inset: 0,
    background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 50% 100%, rgba(120,90,30,0.05) 0%, transparent 60%)",
  },
  bgOrb1: {
    position: "absolute", top: "-200px", right: "-150px",
    width: "600px", height: "600px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 65%)",
  },
  bgOrb2: {
    position: "absolute", bottom: "-150px", left: "-100px",
    width: "500px", height: "500px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 65%)",
  },
  bgOrb3: {
    position: "absolute", top: "50%", left: "50%",
    transform: "translate(-50%,-50%)",
    width: "900px", height: "900px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(201,168,76,0.025) 0%, transparent 55%)",
  },
  bgNoise: {
    position: "absolute", inset: 0,
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
    opacity: 0.4,
  },
  bgGrid: {
    position: "absolute", inset: 0, width: "100%", height: "100%",
    pointerEvents: "none",
  },
  // Ornamentos de canto
  ornTL: { position: "absolute", top: 16, left: 16, width: 80, height: 80, pointerEvents: "none" },
  ornTR: { position: "absolute", top: 16, right: 16, width: 80, height: 80, pointerEvents: "none" },
  ornBL: { position: "absolute", bottom: 16, left: 16, width: 80, height: 80, pointerEvents: "none" },
  ornBR: { position: "absolute", bottom: 16, right: 16, width: 80, height: 80, pointerEvents: "none" },
  // Linhas horizontais
  lineTop: {
    position: "absolute", top: "12%", left: "5%", right: "5%",
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.08), transparent)",
    pointerEvents: "none",
  },
  lineBot: {
    position: "absolute", bottom: "12%", left: "5%", right: "5%",
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.08), transparent)",
    pointerEvents: "none",
  },
  // Card
  card: {
    background: "rgba(14,14,16,0.85)",
    border: "1px solid rgba(201,168,76,0.14)",
    borderRadius: "20px",
    padding: "52px 48px",
    width: "100%",
    maxWidth: "480px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 40px 120px rgba(0,0,0,0.7), inset 0 1px 0 rgba(201,168,76,0.08)",
    backdropFilter: "blur(24px)",
    position: "relative",
    zIndex: 1,
  },
  cardGlow: {
    position: "absolute", top: 0, left: "50%",
    transform: "translateX(-50%)",
    width: "60%", height: "2px",
    background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)",
    borderRadius: "0 0 4px 4px",
  },
  // Logo
  logoWrap: { marginBottom: "20px" },
  logoSvg: { width: "68px", height: "68px" },
  tagline: {
    fontSize: "9px", letterSpacing: "7px",
    color: "#C9A84C", marginBottom: "6px",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
  },
  titulo: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: "italic", fontWeight: 400,
    fontSize: "clamp(40px, 8vw, 56px)",
    color: "#F0EDE8", letterSpacing: "8px",
    margin: "0 0 18px", lineHeight: 1,
  },
  divider: {
    width: "36px", height: "1px",
    background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
    marginBottom: "14px", opacity: 0.8,
  },
  subtitulo: {
    fontSize: "13px", color: "rgba(240,237,232,0.45)",
    textAlign: "center", lineHeight: 1.7,
    maxWidth: "290px", marginBottom: "36px",
    fontFamily: "'DM Sans', sans-serif",
  },
  // Form
  form: { width: "100%", display: "flex", flexDirection: "column", gap: "14px" },
  inputWrap: { display: "flex", flexDirection: "column", gap: "8px" },
  label: {
    fontSize: "9px", letterSpacing: "3.5px",
    color: "#C9A84C", fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
  },
  input: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(201,168,76,0.15)",
    borderRadius: "12px",
    padding: "15px 18px",
    fontSize: "15px", color: "#F0EDE8",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.3s ease, box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)",
    width: "100%",
  },
  erro: {
    fontSize: "12px", color: "#E57373",
    textAlign: "center", marginTop: "-4px",
    fontFamily: "'DM Sans', sans-serif",
  },
  btn: {
    display: "flex", alignItems: "center",
    justifyContent: "center", gap: "10px",
    background: "#C9A84C", color: "#08080A",
    border: "none", borderRadius: "12px",
    padding: "16px 24px",
    fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "3px", fontWeight: 700,
    width: "100%",
  },
  rodapeWrap: {
    display: "flex", alignItems: "center",
    gap: "12px", marginTop: "28px", width: "100%",
  },
  rodapeLine: { flex: 1, height: "1px", background: "rgba(201,168,76,0.1)" },
  rodape: {
    fontSize: "10px", color: "rgba(240,237,232,0.28)",
    letterSpacing: "1px", whiteSpace: "nowrap",
    fontFamily: "'DM Sans', sans-serif",
  },
  // Stats
  statsRow: {
    position: "absolute", bottom: "28px",
    left: "50%", transform: "translateX(-50%)",
    display: "flex", alignItems: "center", gap: "28px",
    zIndex: 1, pointerEvents: "none",
  },
  statItem: { display: "flex", alignItems: "center", gap: "7px" },
  statDot: { fontSize: "6px", color: "rgba(201,168,76,0.4)" },
  statText: {
    fontSize: "10px", color: "rgba(240,237,232,0.2)",
    letterSpacing: "1px", fontFamily: "'DM Sans', sans-serif",
    whiteSpace: "nowrap",
  },
};
