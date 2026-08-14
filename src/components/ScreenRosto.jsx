// src/components/ScreenRosto.jsx
import { useState } from "react";
import PropTypes from "prop-types";

const ROSTOS = [
  {
    id: "oval", nome: "Oval",
    dica: "Aceita quase todos os estilos — considere-se sortudo.",
    svg: <ellipse cx="40" cy="44" rx="24" ry="32" stroke="var(--gold)" strokeWidth="1.5" fill="none" />,
  },
  {
    id: "quadrado", nome: "Quadrado",
    dica: "Textura e camadas no topo alongam o visual.",
    svg: <rect x="16" y="14" width="48" height="52" rx="10" ry="10" stroke="var(--gold)" strokeWidth="1.5" fill="none" />,
  },
  {
    id: "redondo", nome: "Redondo",
    dica: "Volume no alto e laterais mais curtas definem o rosto.",
    svg: <circle cx="40" cy="40" r="28" stroke="var(--gold)" strokeWidth="1.5" fill="none" />,
  },
  {
    id: "triangular", nome: "Triângulo",
    dica: "Volume no topo equilibra a testa mais larga.",
    svg: <path d="M40 10 L66 70 L14 70 Z" stroke="var(--gold)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />,
  },
  {
    id: "losango", nome: "Diamante",
    dica: "Franja lateral suaviza as maçãs proeminentes.",
    svg: <path d="M40 10 L66 40 L40 70 L14 40 Z" stroke="var(--gold)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />,
  },
  {
    id: "oblongo", nome: "Retângulo",
    dica: "Laterais com textura e topo sem muito volume harmonizam.",
    svg: <rect x="20" y="8" width="40" height="64" rx="8" ry="8" stroke="var(--gold)" strokeWidth="1.5" fill="none" />,
  },
];

const TIPOS_CABELO = [
  { id: "liso", nome: "Liso", emoji: "〜", desc: "Sem ondas, cabelo reto" },
  { id: "ondulado", nome: "Ondulado", emoji: "≋", desc: "Ondas suaves naturais" },
  { id: "crespo", nome: "Crespo", emoji: "﹏", desc: "Cachos definidos" },
  { id: "afro", nome: "Afro", emoji: "✦", desc: "Volume natural, Black" },
];

export default function ScreenRosto({ onRosto, onVoltar }) {
  const [formato, setFormato] = useState(null);
  const [tipoCabelo, setTipoCabelo] = useState(null);

  const podeAvancar = !!formato && !!tipoCabelo;

  function confirmar() {
    if (podeAvancar) onRosto({ formato, tipoCabelo });
  }

  return (
    <div style={s.root}>
      <div style={s.bgGlow} />

      {/* Header */}
      <header style={s.header}>
        <button style={s.voltarBtn} onClick={onVoltar}>
          <ChevronLeft /> <span>Voltar</span>
        </button>
        <div style={s.stepBadge}>2 / 3</div>
      </header>

      <div style={s.content}>
        {/* Título */}
        <div style={s.tituloWrap}>
          <p style={s.etapa}>ETAPA 2</p>
          <h2 style={s.titulo}>Formato do Rosto</h2>
          <p style={s.desc}>
            Escolha o formato mais próximo do seu e o tipo de cabelo. Isso ajuda a IA a sugerir cortes que valorizam sua estrutura.
          </p>
        </div>

        {/* Grid formatos */}
        <div style={s.grid}>
          {ROSTOS.map(r => {
            const ativo = formato === r.id;
            return (
              <button
                key={r.id}
                style={{ ...s.card, ...(ativo ? s.cardAtivo : {}) }}
                onClick={() => setFormato(r.id)}
              >
                <svg viewBox="0 0 80 80" style={s.svgRosto} xmlns="http://www.w3.org/2000/svg">
                  {r.svg}
                  {ativo && <>
                    <circle cx="28" cy="32" r="2" fill="rgba(201,168,76,0.5)" />
                    <circle cx="52" cy="32" r="2" fill="rgba(201,168,76,0.5)" />
                    <line x1="28" y1="52" x2="52" y2="52" stroke="rgba(201,168,76,0.3)" strokeWidth="1" strokeDasharray="3 2" />
                  </>}
                </svg>
                <span style={s.nomeRosto}>{r.nome}</span>
                {ativo && <span style={s.dica}>{r.dica}</span>}
                {ativo && (
                  <span style={s.checkmark}><CheckIcon /></span>
                )}
              </button>
            );
          })}
        </div>

        {!formato && (
          <p style={s.dicaGlobal}>
            Não tem certeza? <strong style={{ color: "var(--gold)" }}>Oval</strong> funciona para a maioria.
          </p>
        )}

        {/* Seção tipo de cabelo */}
        <section style={s.secaoTipo}>
          <p style={s.secaoLabel}>TIPO DE CABELO</p>
          <div style={s.tipoGrid}>
            {TIPOS_CABELO.map(t => {
              const ativo = tipoCabelo === t.id;
              return (
                <button
                  key={t.id}
                  style={{ ...s.tipoCard, ...(ativo ? s.tipoCardAtivo : {}) }}
                  onClick={() => setTipoCabelo(t.id)}
                >
                  <span style={s.tipoEmoji}>{t.emoji}</span>
                  <span style={s.tipoNome}>{t.nome}</span>
                  <span style={s.tipoDesc}>{t.desc}</span>
                  {ativo && <span style={s.checkmarkTipo}><CheckIcon /></span>}
                </button>
              );
            })}
          </div>
        </section>

        {/* Botão avançar */}
        <div style={s.rodape}>
          {!podeAvancar && (
            <p style={s.aviso}>
              {!formato ? "Selecione o formato do rosto" : "Selecione o tipo de cabelo"}
            </p>
          )}
          <button
            style={{ ...s.btnAvancar, ...(!podeAvancar ? s.btnDisabled : {}) }}
            disabled={!podeAvancar}
            onClick={confirmar}
          >
            Próximo: Estilo <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

ScreenRosto.propTypes = {
  onRosto: PropTypes.func.isRequired,
  onVoltar: PropTypes.func.isRequired,
};

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#08080A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const s = {
  root: {
    minHeight: "100dvh",
    display: "flex",
    flexDirection: "column",
    background: "var(--dark)",
    position: "relative",
    overflow: "hidden",
  },
  bgGlow: {
    position: "absolute", top: 0, left: "50%",
    transform: "translateX(-50%)",
    width: "700px", height: "400px",
    background: "radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  header: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px",
    borderBottom: "1px solid var(--border)",
    position: "relative", zIndex: 2,
  },
  voltarBtn: {
    display: "flex", alignItems: "center", gap: "6px",
    background: "none", border: "none",
    color: "var(--text-muted)", fontSize: "13px", cursor: "pointer",
  },
  stepBadge: {
    fontSize: "11px", letterSpacing: "2px", color: "var(--gold)",
  },
  content: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", padding: "28px 20px 40px",
    gap: "20px", position: "relative", zIndex: 1, overflowY: "auto",
  },
  tituloWrap: { textAlign: "center" },
  etapa: {
    fontSize: "10px", letterSpacing: "4px",
    color: "var(--gold)", marginBottom: "8px",
  },
  titulo: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: "italic", fontWeight: 400,
    fontSize: "clamp(26px, 6vw, 38px)",
    color: "var(--text)", marginBottom: "10px",
  },
  desc: {
    fontSize: "13px", color: "var(--text-muted)",
    lineHeight: 1.6, maxWidth: "360px", margin: "0 auto",
  },
  grid: {
    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px", width: "100%", maxWidth: "480px",
  },
  card: {
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: "6px",
    padding: "14px 8px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "14px", cursor: "pointer",
    transition: "border-color 0.2s, background 0.2s",
    position: "relative", minHeight: "120px",
  },
  cardAtivo: {
    borderColor: "var(--gold)",
    background: "rgba(201,168,76,0.06)",
  },
  svgRosto: { width: "56px", height: "56px", flexShrink: 0 },
  nomeRosto: {
    fontSize: "11px", letterSpacing: "1px",
    color: "var(--text)", textTransform: "uppercase",
  },
  dica: {
    fontSize: "10px", color: "var(--text-muted)",
    textAlign: "center", lineHeight: 1.4,
    padding: "2px 4px 0", fontStyle: "italic",
  },
  checkmark: {
    position: "absolute", top: "8px", right: "8px",
    width: "18px", height: "18px", borderRadius: "50%",
    background: "var(--gold)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  dicaGlobal: {
    fontSize: "12px", color: "var(--text-muted)",
    textAlign: "center", fontStyle: "italic",
  },
  // Tipo de cabelo
  secaoTipo: {
    width: "100%", maxWidth: "480px",
    display: "flex", flexDirection: "column", gap: "10px",
  },
  secaoLabel: {
    fontSize: "9px", letterSpacing: "4px",
    color: "var(--gold)", textTransform: "uppercase",
  },
  tipoGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px",
  },
  tipoCard: {
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: "5px",
    padding: "14px 6px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "12px", cursor: "pointer",
    transition: "border-color 0.2s, background 0.2s",
    position: "relative",
  },
  tipoCardAtivo: {
    borderColor: "var(--gold)",
    background: "rgba(201,168,76,0.06)",
  },
  tipoEmoji: {
    fontSize: "20px", lineHeight: 1,
    color: "var(--gold)", fontWeight: "bold",
  },
  tipoNome: {
    fontSize: "11px", color: "var(--text)",
    letterSpacing: "0.5px", fontWeight: 500,
  },
  tipoDesc: {
    fontSize: "9px", color: "var(--text-muted)",
    textAlign: "center", lineHeight: 1.3,
  },
  checkmarkTipo: {
    position: "absolute", top: "6px", right: "6px",
    width: "16px", height: "16px", borderRadius: "50%",
    background: "var(--gold)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  aviso: {
    fontSize: "12px", color: "var(--text-muted)",
    fontStyle: "italic", textAlign: "center",
  },
  rodape: {
    width: "100%", maxWidth: "480px",
    marginTop: "auto", paddingTop: "4px",
    display: "flex", flexDirection: "column", gap: "8px",
  },
  btnAvancar: {
    display: "flex", alignItems: "center",
    justifyContent: "center", gap: "10px",
    width: "100%", background: "var(--gold)",
    color: "#08080A", border: "none",
    borderRadius: "10px", padding: "15px 24px",
    fontSize: "12px", letterSpacing: "2px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700, cursor: "pointer",
    transition: "opacity 0.2s",
  },
  btnDisabled: { opacity: 0.35, cursor: "not-allowed" },
};
