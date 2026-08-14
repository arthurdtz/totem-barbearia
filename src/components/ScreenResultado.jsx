// src/components/ScreenResultado.jsx
import LoadingCinematografico from "./LoadingCinematografico";
import { useState, useEffect, useCallback, useRef } from "react";
import CardCorte from "./CardCorte";
import FavoritosDrawer from "./FavoritosDrawer";
import BeforeAfterSlider from "./BeforeAfterSlider";
import ExportShare from "./ExportShare";
import { salvarFavorito, removerFavorito, buscarFavoritos } from "../lib/api";

const IconHeart = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconShuffle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" /><line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);
const IconHistory = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-3.45" />
  </svg>
);

// ── Frases emocionais por estilo ──────────────────────────────
const FRASES_HERO = {
  classico: ["Esse corte ficou atemporal.", "Elegância que nunca sai de moda.", "Impecável do começo ao fim."],
  moderno: ["Esse fade ficou absurdo.", "Linhas limpas. Resultado limpo.", "Urbano e preciso demais."],
  casual: ["Natural e sem esforço. Perfeito.", "Descomplicado, mas marcante.", "Esse estilo combina muito com você."],
  ousado: ["Esse ficou muito forte.", "Personalidade em cada detalhe.", "Esse corte é você no nível máximo."],
  executivo: ["Autoridade e estilo numa só versão.", "Esse corte passou confiança.", "Profissional e marcante."],
  street: ["Esse estilo ficou muito autêntico.", "Street culture no seu melhor.", "Identidade forte demais."],
};

function getFraseHero(estilo, corteNome) {
  const frases = FRASES_HERO[estilo] ?? ["Esse corte ficou incrível.", "Combina muito com você.", "Resultado premium."];
  return frases[Math.floor(Math.random() * frases.length)];
}

// ── Helpers ───────────────────────────────────────────────────
function agruparPorOrigem(cards) {
  const raiz = cards.filter(c => !c.origemId);
  return raiz.map(r => ({
    origem: r,
    variacoes: cards.filter(c => c.origemId === r.id),
  }));
}

async function baixarImagem(base64, nome) {
  try {
    const res = await fetch(base64);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bravos-${nome.replace(/\s+/g, "-").toLowerCase()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch {
    const w = window.open();
    w.document.write(`<img src="${base64}" style="max-width:100%">`);
  }
}

// ── Hero Card ─────────────────────────────────────────────────
function HeroCard({ card, isFavorito, onFavoritar, onVariar, onVerDetalhe, estilo, fotoBase64 }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [frase] = useState(() => getFraseHero(estilo, card.corte?.nome));
  const [sliderAtivo, setSliderAtivo] = useState(false);
  const corteNome = card.corte?.nome ?? card.corteNome ?? "";
  const isPending = card.status === "pending";
  const isError = card.status === "error";
  const isSuccess = card.status === "success";
  const podeSlider = isSuccess && imgLoaded && !!fotoBase64;

  return (
    <>
      <style>{heroStyles}</style>
      <div className="hero-wrap">
        <div
          className="hero-card"
          onClick={() => !sliderAtivo && card.status === "success" && onVerDetalhe(card)}
        >

          {/* Skeleton */}
          {isPending && (
            <div className="hero-skeleton">
              <div className="hero-skeleton__shimmer" />
              <div className="hero-skeleton__label">
                <div className="hero-skeleton__line" style={{ width: "60%" }} />
                <div className="hero-skeleton__line" style={{ width: "40%" }} />
              </div>
            </div>
          )}

          {/* Imagem resultado — fica abaixo do slider quando ativo */}
          {card.imagemBase64 && !sliderAtivo && (
            <img
              className="hero-img"
              src={card.imagemBase64}
              alt={corteNome}
              onLoad={() => setImgLoaded(true)}
              style={{ opacity: imgLoaded ? 1 : 0 }}
            />
          )}

          {/* Slider Antes/Depois embutido no card */}
          {sliderAtivo && podeSlider && (
            <div className="hero-slider-wrap" onClick={e => e.stopPropagation()}>
              <BeforeAfterSlider
                antesSrc={fotoBase64}
                depoisSrc={card.imagemBase64}
                corteNome={corteNome}
                compact
              />
            </div>
          )}

          {/* Erro */}
          {isError && (
            <div className="hero-error">
              <span style={{ fontSize: 32, color: "#e05252" }}>✕</span>
              <span style={{ fontSize: 13, color: "rgba(240,237,232,0.5)" }}>Falha ao gerar</span>
            </div>
          )}

          {/* Overlay com info — oculto enquanto slider ativo */}
          {card.status === "success" && imgLoaded && !sliderAtivo && (
            <div className="hero-overlay">
              {/* Topo: selo */}
              <div className="hero-top">
                <div className="hero-selo">
                  <span className="hero-selo__star">✦</span>
                  Mais compatível com você
                </div>
                <div className="hero-score">98%</div>
              </div>

              {/* Rodapé: info + ações */}
              <div className="hero-bottom">
                <div className="hero-info">
                  <h3 className="hero-nome">{corteNome}</h3>
                  <p className="hero-frase">{frase}</p>
                </div>
                <div className="hero-actions">
                  <button
                    className={`hero-btn ${isFavorito ? "hero-btn--active" : ""}`}
                    onClick={e => { e.stopPropagation(); onFavoritar(card); }}
                    title={isFavorito ? "Remover favorito" : "Favoritar"}
                  >
                    <svg viewBox="0 0 24 24" fill={isFavorito ? "currentColor" : "none"}
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      width="20" height="20">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                  <button
                    className="hero-btn hero-btn--vary"
                    onClick={e => { e.stopPropagation(); onVariar(card); }}
                    title="Gerar variações"
                  >
                    <IconShuffle />
                    <span>Variações</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Botão toggle antes/depois — aparece no canto quando sucesso */}
          {podeSlider && (
            <button
              className={`hero-compare-btn ${sliderAtivo ? "is-active" : ""}`}
              onClick={e => { e.stopPropagation(); setSliderAtivo(v => !v); }}
              title={sliderAtivo ? "Ver resultado" : "Comparar antes/depois"}
            >
              {sliderAtivo ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="12" x2="21" y2="12" />
                  </svg>
                  Resultado
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                    <line x1="12" y1="2" x2="12" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  Antes/Depois
                </>
              )}
            </button>
          )}
        </div>

        {/* Compartilhamento abaixo do card */}
        {isSuccess && imgLoaded && (
          <div className="hero-extras">
            <ExportShare
              imagemSrc={card.imagemBase64}
              corteNome={corteNome}
              frase={frase}
              variante="inline"
            />
          </div>
        )}
      </div>
    </>
  );
}

const heroStyles = `
  .hero-wrap {
    width: 100%;
    animation: hero-enter 0.7s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes hero-enter {
    from { opacity: 0; transform: translateY(32px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .hero-card {
    position: relative;
    width: 100%;
    aspect-ratio: 3/4;
    max-height: 520px;
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    background: #111113;
    border: 1px solid rgba(201,168,76,0.2);
    box-shadow: 0 0 0 1px rgba(201,168,76,0.08), 0 32px 80px rgba(0,0,0,0.6);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .hero-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 0 1px rgba(201,168,76,0.2), 0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(201,168,76,0.08);
  }

  .hero-skeleton {
    position: absolute; inset: 0;
    background: #111113;
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 20px;
    overflow: hidden;
  }
  .hero-skeleton__shimmer {
    position: absolute; inset: 0;
    background: linear-gradient(110deg, transparent 20%, rgba(201,168,76,0.04) 50%, transparent 80%);
    background-size: 200% 100%;
    animation: hero-shimmer 1.8s linear infinite;
  }
  @keyframes hero-shimmer {
    to { background-position: -200% 0; }
  }
  .hero-skeleton__label { display: flex; flex-direction: column; gap: 8px; }
  .hero-skeleton__line {
    height: 14px; border-radius: 7px;
    background: rgba(255,255,255,0.06);
  }

  .hero-img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    transition: opacity 0.5s ease, transform 0.4s ease;
    display: block;
  }
  .hero-card:hover .hero-img { transform: scale(1.02); }

  .hero-error {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 10px;
    background: rgba(10,10,11,0.9);
  }

  .hero-overlay {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    justify-content: space-between;
    padding: 16px;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.5) 0%,
      transparent 30%,
      transparent 50%,
      rgba(0,0,0,0.85) 100%
    );
  }

  .hero-top {
    display: flex; align-items: center;
    justify-content: space-between;
  }
  .hero-selo {
    display: flex; align-items: center; gap: 5px;
    background: rgba(8,8,10,0.75);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(201,168,76,0.35);
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 11px; color: #C9A84C;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.5px;
    font-weight: 500;
  }
  .hero-selo__star { font-size: 8px; }
  .hero-score {
    background: rgba(201,168,76,0.15);
    border: 1px solid rgba(201,168,76,0.4);
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 12px; font-weight: 700;
    color: #C9A84C;
    font-family: 'DM Sans', sans-serif;
    backdrop-filter: blur(8px);
  }

  .hero-bottom {
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 12px;
  }
  .hero-info { display: flex; flex-direction: column; gap: 4px; flex: 1; }
  .hero-nome {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px; font-weight: 600;
    color: #F0EDE8; margin: 0;
    text-shadow: 0 2px 12px rgba(0,0,0,0.8);
    line-height: 1.1;
  }
  .hero-frase {
    font-size: 12px; color: rgba(240,237,232,0.65);
    margin: 0; font-style: italic;
    font-family: 'DM Sans', sans-serif;
    text-shadow: 0 1px 6px rgba(0,0,0,0.8);
  }

  .hero-actions { display: flex; gap: 8px; flex-shrink: 0; }
  .hero-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 14px;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(10,10,11,0.7);
    backdrop-filter: blur(8px);
    color: #F0EDE8; cursor: pointer;
    font-size: 12px; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .hero-btn svg { width: 18px; height: 18px; flex-shrink: 0; }
  .hero-btn:hover {
    background: rgba(201,168,76,0.2);
    border-color: #C9A84C; color: #E8C97A;
  }
  .hero-btn--active { color: #e05252; border-color: rgba(224,82,82,0.4); background: rgba(224,82,82,0.15); }
  .hero-btn--vary { color: #C9A84C; border-color: rgba(201,168,76,0.3); }
  .hero-btn--vary:hover { background: rgba(201,168,76,0.15); }

  /* Slider embutido no hero card */
  .hero-slider-wrap {
    position: absolute;
    inset: 0;
    z-index: 10;
    border-radius: 20px;
    overflow: hidden;
  }
  .hero-slider-wrap .bas-wrap {
    position: absolute;
    inset: 0;
    height: 100%;
  }
  .hero-slider-wrap .bas-stage {
    border-radius: 0 !important;
    border: none !important;
    box-shadow: none !important;
    height: 100% !important;
    max-height: none !important;
  }

  /* Botão toggle Antes/Depois */
  .hero-compare-btn {
    position: absolute;
    bottom: 14px; left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    display: flex; align-items: center; gap: 7px;
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid rgba(201,168,76,0.5);
    background: rgba(8,8,10,0.78);
    backdrop-filter: blur(10px);
    color: #E8C97A;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.15s;
    white-space: nowrap;
  }
  .hero-compare-btn:hover {
    background: rgba(201,168,76,0.18);
    border-color: #C9A84C;
    transform: translateX(-50%) translateY(-1px);
  }
  .hero-compare-btn.is-active {
    background: rgba(201,168,76,0.2);
    border-color: #E8C97A;
    color: #fff;
  }

  .hero-extras {
    margin-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
`;

// ── Componente principal ──────────────────────────────────────
export default function ScreenResultado({
  usuario,
  fotoBase64,
  rosto,
  estilo,
  servico,
  cards = [],
  onGerarVariacoes = () => { },
  onRetry = () => { },
  onReiniciar = () => { },
}) {
  const [favoritos, setFavoritos] = useState([]);
  const [favoritosIds, setFavoritosIds] = useState(new Set());
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [drawerAba, setDrawerAba] = useState("favoritos");
  const [carregandoFavs, setCarregandoFavs] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const variacaoRef = useRef(null);
  const todosPending = cards.length > 0 && cards.every(c => c.status === "pending");

  // Separa hero (primeiro card raiz) dos demais
  const cardsRaiz = cards.filter(c => !c.origemId);
  const heroCard = cardsRaiz[0] ?? null;
  const outrosCards = cardsRaiz.slice(1);

  useEffect(() => {
    if (!usuario?.id) return;
    setCarregandoFavs(true);
    buscarFavoritos(usuario.id)
      .then(({ favoritos: lista }) => {
        setFavoritos(lista ?? []);
        setFavoritosIds(new Set((lista ?? []).map(f => f.id)));
      })
      .catch(() => { })
      .finally(() => setCarregandoFavs(false));
  }, [usuario?.id]);

  useEffect(() => {
    if (cards.some(c => c.origemId) && variacaoRef.current) {
      setTimeout(() => variacaoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    }
  }, [cards.length]);

  const handleFavoritar = useCallback(async (card) => {
    if (!usuario?.id || card.status !== "success") return;
    const jaFavorito = favoritosIds.has(card.id);
    if (jaFavorito) {
      setFavoritosIds(prev => { const s = new Set(prev); s.delete(card.id); return s; });
      setFavoritos(prev => prev.filter(f => f.id !== card.id));
      try { await removerFavorito(usuario.id, card.id); } catch { }
    } else {
      const item = {
        id: card.id,
        imagemBase64: card.imagemBase64,
        corteNome: card.corte?.nome ?? card.corteNome ?? "",
        origemId: card.origemId ?? null,
        corteObj: card.corte ?? card.corteObj ?? null,
        rosto, estilo, servico,
        savedAt: new Date().toISOString(),
      };
      setFavoritosIds(prev => new Set([...prev, card.id]));
      setFavoritos(prev => [item, ...prev]);
      try { await salvarFavorito(usuario.id, item); } catch { }
    }
  }, [usuario?.id, favoritosIds, rosto, estilo, servico]);

  const handleRemoverFavorito = useCallback(async (id) => {
    setFavoritosIds(prev => { const s = new Set(prev); s.delete(id); return s; });
    setFavoritos(prev => prev.filter(f => f.id !== id));
    try { await removerFavorito(usuario?.id, id); } catch { }
  }, [usuario?.id]);

  const handleVariarFavorito = useCallback((itemFavorito) => {
    const cardSimulado = {
      id: itemFavorito.id,
      corte: itemFavorito.corteObj ?? { nome: itemFavorito.corteNome },
      origemId: itemFavorito.origemId,
      status: "success",
    };
    onGerarVariacoes(cardSimulado);
  }, [onGerarVariacoes]);

  const abrirDrawer = (aba) => { setDrawerAba(aba); setDrawerAberto(true); };

  const totalCards = cards.filter(c => c.status === "success").length;
  const temVariacoes = cards.some(c => c.origemId);
  const historico = cards.filter(c => c.status === "success");
  const grupos = agruparPorOrigem(cards);

  return (
    <>
      <style>{screenStyles}</style>
      <div className="sr-root">

        {/* Navbar */}
        <nav className="sr-nav">
          <button className="sr-nav__back" onClick={onReiniciar}>
            <IconArrowLeft /><span>Nova foto</span>
          </button>
          <div className="sr-nav__center">
            <span className="sr-nav__logo">BRAVOS</span>
            {totalCards > 0 && (
              <span className="sr-nav__count">{totalCards} gerado{totalCards > 1 ? "s" : ""}</span>
            )}
          </div>
          <div className="sr-nav__actions">
            {historico.length > 0 && (
              <button className="sr-nav__icon-btn" onClick={() => abrirDrawer("historico")} title="Histórico">
                <IconHistory />
              </button>
            )}
            <button
              className={`sr-nav__icon-btn ${favoritosIds.size > 0 ? "has-items" : ""}`}
              onClick={() => abrirDrawer("favoritos")}
              title={`Favoritos (${favoritosIds.size})`}
            >
              <IconHeart />
              {favoritosIds.size > 0 && <span className="sr-nav__badge">{favoritosIds.size}</span>}
            </button>
          </div>
        </nav>

        {/* Contexto */}
        <div className="sr-context">
          <div className="sr-context__foto-wrap">
            <img className="sr-context__foto" src={fotoBase64} alt="Sua foto" />
          </div>
          <div className="sr-context__info">
            <p className="sr-context__label">Sua sessão</p>
            <div className="sr-context__tags">
              {rosto && <span className="sr-tag">{rosto}</span>}
              {estilo && <span className="sr-tag">{estilo}</span>}
              {servico && <span className="sr-tag sr-tag--service">{servico}</span>}
            </div>
          </div>
        </div>

        <main className="sr-main">

          {/* Hero Card */}
          {heroCard && (
            <section className="sr-section">
              <HeroCard
                card={heroCard}
                isFavorito={favoritosIds.has(heroCard.id)}
                onFavoritar={handleFavoritar}
                onVariar={onGerarVariacoes}
                onVerDetalhe={setLightbox}
                estilo={estilo}
                fotoBase64={fotoBase64}
              />
            </section>
          )}

          {/* Outros cards */}
          {outrosCards.length > 0 && (
            <section className="sr-section">
              <div className="sr-section__header">
                <h2 className="sr-section__title">Outras sugestões</h2>
                <p className="sr-section__sub">Clique na imagem para ampliar</p>
              </div>
              <div className="sr-grid">
                {outrosCards.map((card, i) => (
                  <CardCorte
                    key={card.id} card={card} index={i}
                    isFavorito={favoritosIds.has(card.id)}
                    onFavoritar={handleFavoritar}
                    onVariar={onGerarVariacoes}
                    onRetry={onRetry}
                    onVerDetalhe={setLightbox}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Variações */}
          {temVariacoes && (
            <section className="sr-section sr-section--variacoes" ref={variacaoRef}>
              <div className="sr-section__header">
                <h2 className="sr-section__title">Variações</h2>
                <p className="sr-section__sub">Com base nos estilos que você explorou</p>
              </div>
              {grupos.filter(g => g.variacoes.length > 0).map(({ origem, variacoes }) => (
                <div key={`var-${origem.id}`} className="sr-variacao-grupo">
                  <div className="sr-variacao-grupo__label">
                    <span className="sr-variacao-grupo__dot" />
                    <span>Variações de <strong>{origem.corte?.nome ?? origem.corteNome}</strong></span>
                  </div>
                  <div className="sr-grid">
                    {variacoes.map((card, i) => (
                      <CardCorte
                        key={card.id} card={card} index={i}
                        isFavorito={favoritosIds.has(card.id)}
                        onFavoritar={handleFavoritar}
                        onVariar={onGerarVariacoes}
                        onRetry={onRetry}
                        onVerDetalhe={setLightbox}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {totalCards > 0 && (
            <div className="sr-cta">
              <p className="sr-cta__text">Não curtiu nenhum? Volte e tente um estilo diferente.</p>
              <button className="sr-cta__btn" onClick={onReiniciar}>
                <IconArrowLeft /> Começar de novo
              </button>
            </div>
          )}
        </main>

        <LoadingCinematografico
          visivel={todosPending}
          fotoBase64={fotoBase64}
          estilo={estilo}
        />

        <FavoritosDrawer
          aberto={drawerAberto}
          abaInicial={drawerAba}
          onFechar={() => setDrawerAberto(false)}
          favoritos={favoritos}
          historico={historico}
          onRemover={handleRemoverFavorito}
          onVariar={handleVariarFavorito}
          onVerDetalhe={setLightbox}
          carregando={carregandoFavs}
        />

        {lightbox && (
          <Lightbox
            card={lightbox}
            isFavorito={favoritosIds.has(lightbox.id)}
            onFavoritar={handleFavoritar}
            onVariar={onGerarVariacoes}
            onBaixar={baixarImagem}
            onFechar={() => setLightbox(null)}
            estilo={estilo}
          />
        )}
      </div>
    </>
  );
}

// ── Lightbox ──────────────────────────────────────────────────
function Lightbox({ card, isFavorito, onFavoritar, onVariar, onBaixar, onFechar, estilo }) {
  const corteNome = card.corte?.nome ?? card.corteNome ?? "";
  const [frase] = useState(() => getFraseHero(estilo, corteNome));

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onFechar(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onFechar]);

  return (
    <>
      <style>{lightboxStyles}</style>
      <div className="lb-root" onClick={onFechar}>
        <div className="lb-inner" onClick={e => e.stopPropagation()}>
          <img className="lb-img" src={card.imagemBase64} alt={corteNome} />
          <div className="lb-bar">
            <div className="lb-bar__info">
              <span className="lb-bar__nome">{corteNome}</span>
              {card.origemId && <span className="lb-bar__badge">variação</span>}
            </div>
            <div className="lb-bar__actions">
              <button
                className={`lb-btn ${isFavorito ? "lb-btn--active" : ""}`}
                onClick={() => onFavoritar(card)}
                title={isFavorito ? "Remover favorito" : "Favoritar"}
              >
                <svg viewBox="0 0 24 24" fill={isFavorito ? "currentColor" : "none"}
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
              <button className="lb-btn" onClick={() => { onVariar(card); onFechar(); }} title="Gerar variações">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" />
                  <polyline points="21 16 21 21 16 21" /><line x1="4" y1="4" x2="9" y2="9" />
                </svg>
              </button>
              <button className="lb-btn" onClick={() => onBaixar(card.imagemBase64, corteNome)} title="Baixar imagem">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            </div>
          </div>
          <button className="lb-close" onClick={onFechar}><IconX /></button>
        </div>

        {/* Compartilhamento dentro do lightbox */}
        <div className="lb-share" onClick={e => e.stopPropagation()}>
          <ExportShare
            imagemSrc={card.imagemBase64}
            corteNome={corteNome}
            frase={frase}
            variante="inline"
          />
        </div>
      </div>
    </>
  );
}

// ── Estilos ───────────────────────────────────────────────────
const screenStyles = `
  .sr-root {
    --gold: #C9A84C; --gold-light: #E8C97A; --dark: #08080A;
    --surface: #111113; --surface2: #1A1A1D;
    --border: rgba(201,168,76,0.14); --text: #F0EDE8;
    --text-muted: rgba(240,237,232,0.42); --radius: 16px;
    min-height: 100dvh; background: var(--dark);
    color: var(--text); font-family: 'DM Sans', sans-serif;
    display: flex; flex-direction: column;
  }
  .sr-nav {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px;
    background: rgba(8,8,10,0.88); backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }
  .sr-nav__back {
    display: flex; align-items: center; gap: 6px;
    background: none; border: none; color: var(--text-muted);
    font-size: 13px; cursor: pointer; padding: 6px 10px;
    border-radius: 8px; transition: all 0.2s; font-family: inherit;
  }
  .sr-nav__back svg { width: 16px; height: 16px; }
  .sr-nav__back:hover { color: var(--text); background: rgba(255,255,255,0.06); }
  .sr-nav__center { display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .sr-nav__logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 14px; font-weight: 400; letter-spacing: 5px;
    color: var(--gold); font-style: italic;
  }
  .sr-nav__count { font-size: 10px; color: var(--text-muted); letter-spacing: 1px; }
  .sr-nav__actions { display: flex; align-items: center; gap: 6px; }
  .sr-nav__icon-btn {
    position: relative; width: 36px; height: 36px; border-radius: 50%;
    border: 1px solid var(--border); background: var(--surface2);
    color: var(--text-muted); display: flex; align-items: center;
    justify-content: center; cursor: pointer; transition: all 0.2s;
  }
  .sr-nav__icon-btn svg { width: 16px; height: 16px; }
  .sr-nav__icon-btn:hover, .sr-nav__icon-btn.has-items {
    color: var(--gold); border-color: rgba(201,168,76,0.4);
    background: rgba(201,168,76,0.08);
  }
  .sr-nav__badge {
    position: absolute; top: -4px; right: -4px;
    min-width: 16px; height: 16px; border-radius: 8px;
    background: var(--gold); color: #08080A;
    font-size: 9px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    padding: 0 3px; border: 1.5px solid var(--dark);
  }
  .sr-context {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 20px; border-bottom: 1px solid var(--border);
    background: rgba(17,17,19,0.6);
  }
  .sr-context__foto-wrap {
    width: 40px; height: 40px; border-radius: 50%; overflow: hidden;
    border: 1.5px solid var(--border); flex-shrink: 0;
  }
  .sr-context__foto { width: 100%; height: 100%; object-fit: cover; display: block; }
  .sr-context__label {
    font-size: 9px; color: var(--text-muted); text-transform: uppercase;
    letter-spacing: 2px; margin: 0 0 5px;
  }
  .sr-context__tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .sr-tag {
    font-size: 11px; padding: 3px 8px; border-radius: 20px;
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text-muted); text-transform: capitalize;
  }
  .sr-tag--service { border-color: rgba(201,168,76,0.3); color: var(--gold); }
  .sr-main {
    flex: 1; padding: 20px 16px 48px;
    display: flex; flex-direction: column; gap: 32px;
    max-width: 680px; width: 100%; margin: 0 auto;
  }
  .sr-section { display: flex; flex-direction: column; gap: 0; }
  .sr-section__header { margin-bottom: 14px; }
  .sr-section__title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 400; font-style: italic;
    color: var(--text); margin: 0 0 3px;
  }
  .sr-section__sub { font-size: 11px; color: var(--text-muted); margin: 0; }
  .sr-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  @media (min-width: 480px) { .sr-grid { grid-template-columns: repeat(3, 1fr); } }
  .sr-section--variacoes { scroll-margin-top: 80px; }
  .sr-variacao-grupo { margin-bottom: 24px; }
  .sr-variacao-grupo__label {
    display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
    font-size: 12px; color: var(--text-muted);
  }
  .sr-variacao-grupo__label strong { color: var(--gold-light); font-family: 'Cormorant Garamond', serif; }
  .sr-variacao-grupo__dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }
  .sr-cta {
    text-align: center; padding: 28px 20px; border-top: 1px solid var(--border);
    display: flex; flex-direction: column; align-items: center; gap: 14px;
  }
  .sr-cta__text { font-size: 13px; color: var(--text-muted); margin: 0; }
  .sr-cta__btn {
    display: flex; align-items: center; gap: 8px; padding: 10px 20px;
    border-radius: 24px; border: 1px solid var(--border); background: var(--surface);
    color: var(--text-muted); font-size: 13px; font-weight: 500; cursor: pointer;
    transition: all 0.2s;
  }
  .sr-cta__btn svg { width: 15px; height: 15px; }
  .sr-cta__btn:hover { color: var(--text); border-color: rgba(255,255,255,0.2); background: var(--surface2); }
`;

const lightboxStyles = `
  .lb-root {
    position: fixed; inset: 0; z-index: 600;
    background: rgba(0,0,0,0.92); backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px; animation: lb-in 0.22s ease;
  }
  @keyframes lb-in { from { opacity: 0; } to { opacity: 1; } }
  .lb-inner {
    position: relative; max-width: 520px; width: 100%;
    animation: lb-scale 0.28s cubic-bezier(0.22,1,0.36,1);
  }
  @keyframes lb-scale { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .lb-img { width: 100%; border-radius: 16px; display: block; box-shadow: 0 24px 80px rgba(0,0,0,0.7); }
  .lb-bar {
    position: absolute; bottom: 0; left: 0; right: 0; padding: 14px 16px;
    background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%);
    border-radius: 0 0 16px 16px;
    display: flex; align-items: flex-end; justify-content: space-between; gap: 12px;
  }
  .lb-bar__info { display: flex; flex-direction: column; gap: 4px; }
  .lb-bar__nome { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; color: #F0EDE8; }
  .lb-bar__badge {
    font-size: 9px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    color: #C9A84C; border: 1px solid #C9A84C; border-radius: 4px; padding: 2px 5px; width: fit-content;
  }
  .lb-bar__actions { display: flex; gap: 8px; }
  .lb-btn {
    width: 38px; height: 38px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.15); background: rgba(10,10,11,0.7);
    backdrop-filter: blur(8px); color: #F0EDE8;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s;
  }
  .lb-btn svg { width: 16px; height: 16px; }
  .lb-btn:hover { background: rgba(201,168,76,0.2); border-color: #C9A84C; color: #E8C97A; transform: scale(1.1); }
  .lb-btn--active { color: #e05252; border-color: rgba(224,82,82,0.4); background: rgba(224,82,82,0.15); }
  .lb-close {
    position: absolute; top: -14px; right: -14px;
    width: 36px; height: 36px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.15); background: rgba(10,10,11,0.85);
    color: rgba(240,237,232,0.7); display: flex; align-items: center;
    justify-content: center; cursor: pointer; transition: all 0.2s;
  }
  .lb-close svg { width: 15px; height: 15px; }
  .lb-close:hover { color: #F0EDE8; border-color: rgba(255,255,255,0.3); }
  .lb-share { margin-top: 14px; }
`;