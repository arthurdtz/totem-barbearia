// src/components/ExportShare.jsx
// ─────────────────────────────────────────────────────────────
// Montagem + compartilhamento da imagem final.
//   • Usa <canvas> para compor: imagem gerada + logo BRAVOS +
//     nome do corte + frase emocional.
//   • Botão "Salvar foto"  → baixa o canvas como PNG.
//   • Botão "Compartilhar" → Web Share API (mobile/totem); faz
//     fallback para download quando não houver suporte.
//   • Pode ser usado no Hero Card e no Lightbox.
//
// Props:
//   imagemSrc   – string  (imagem gerada, base64/url) — obrigatória
//   corteNome   – string
//   frase       – string  (frase emocional)
//   variante    – "inline" | "compact"  (estilo dos botões)
// ─────────────────────────────────────────────────────────────

import PropTypes from "prop-types";
import { useState, useCallback, useRef } from "react";

// Dimensões do card de export (formato story / 4:5)
const CW = 1080;
const CH = 1350;

// Carrega uma imagem garantindo CORS quando possível
function carregarImagem(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// Desenha texto com fonte e quebra automática simples
function desenharTextoCentrado(ctx, texto, x, y, maxWidth, lineHeight) {
    const palavras = texto.split(" ");
    let linha = "";
    const linhas = [];
    for (const p of palavras) {
        const teste = linha ? `${linha} ${p}` : p;
        if (ctx.measureText(teste).width > maxWidth && linha) {
            linhas.push(linha);
            linha = p;
        } else {
            linha = teste;
        }
    }
    if (linha) linhas.push(linha);

    linhas.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
    return linhas.length;
}

// Monta o canvas e devolve { canvas, blob }
async function montarCanvas({ imagemSrc, corteNome, frase }) {
    const canvas = document.createElement("canvas");
    canvas.width = CW;
    canvas.height = CH;
    const ctx = canvas.getContext("2d");

    // Fundo
    ctx.fillStyle = "#08080A";
    ctx.fillRect(0, 0, CW, CH);

    // Área da imagem (com moldura)
    const pad = 60;
    const imgX = pad;
    const imgY = pad;
    const imgW = CW - pad * 2;
    const imgH = 820;

    try {
        const img = await carregarImagem(imagemSrc);
        // cover: recorta mantendo proporção
        const ratio = Math.max(imgW / img.width, imgH / img.height);
        const dw = img.width * ratio;
        const dh = img.height * ratio;
        const dx = imgX + (imgW - dw) / 2;
        const dy = imgY + (imgH - dh) / 2;

        ctx.save();
        roundRect(ctx, imgX, imgY, imgW, imgH, 28);
        ctx.clip();
        ctx.drawImage(img, dx, dy, dw, dh);
        // gradiente inferior para integrar com o fundo
        const grad = ctx.createLinearGradient(0, imgY + imgH - 240, 0, imgY + imgH);
        grad.addColorStop(0, "rgba(8,8,10,0)");
        grad.addColorStop(1, "rgba(8,8,10,0.85)");
        ctx.fillStyle = grad;
        ctx.fillRect(imgX, imgY + imgH - 240, imgW, 240);
        ctx.restore();
    } catch {
        // se a imagem falhar, segue só com fundo
    }

    // Moldura dourada sutil
    ctx.strokeStyle = "rgba(201,168,76,0.35)";
    ctx.lineWidth = 2;
    roundRect(ctx, imgX, imgY, imgW, imgH, 28);
    ctx.stroke();

    // ── Bloco de texto ──
    const cx = CW / 2;
    let cursorY = imgY + imgH + 90;

    // Tagline
    ctx.textAlign = "center";
    ctx.fillStyle = "#C9A84C";
    ctx.font = "600 26px 'DM Sans', Arial, sans-serif";
    ctx.letterSpacing = "8px";
    ctx.fillText("B A R B E A R I A", cx, cursorY);

    // Logo / nome marca
    cursorY += 80;
    ctx.fillStyle = "#F0EDE8";
    ctx.font = "italic 700 84px 'Cormorant Garamond', Georgia, serif";
    ctx.letterSpacing = "10px";
    ctx.fillText("BRAVOS", cx, cursorY);

    // Linha divisória dourada
    cursorY += 36;
    ctx.strokeStyle = "rgba(201,168,76,0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 60, cursorY);
    ctx.lineTo(cx + 60, cursorY);
    ctx.stroke();

    // Nome do corte
    if (corteNome) {
        cursorY += 70;
        ctx.fillStyle = "#E8C97A";
        ctx.font = "600 46px 'Cormorant Garamond', Georgia, serif";
        ctx.letterSpacing = "1px";
        desenharTextoCentrado(ctx, corteNome, cx, cursorY, CW - 160, 56);
    }

    // Frase emocional
    if (frase) {
        cursorY += 64;
        ctx.fillStyle = "rgba(240,237,232,0.6)";
        ctx.font = "italic 30px 'DM Sans', Arial, sans-serif";
        ctx.letterSpacing = "0px";
        desenharTextoCentrado(ctx, `"${frase}"`, cx, cursorY, CW - 200, 40);
    }

    // reset letterSpacing
    ctx.letterSpacing = "0px";

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 0.95));
    return { canvas, blob };
}

// Retângulo arredondado (compatível sem ctx.roundRect)
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

export default function ExportShare({
    imagemSrc,
    corteNome = "",
    frase = "",
    variante = "inline",
}) {
    const [estado, setEstado] = useState("idle"); // idle | montando | ok | erro
    const cacheBlob = useRef(null);

    const gerarBlob = useCallback(async () => {
        if (cacheBlob.current) return cacheBlob.current;
        const { blob } = await montarCanvas({ imagemSrc, corteNome, frase });
        cacheBlob.current = blob;
        return blob;
    }, [imagemSrc, corteNome, frase]);

    const nomeArquivo = `bravos-${(corteNome || "corte")
        .replace(/\s+/g, "-")
        .toLowerCase()}.png`;

    const handleSalvar = useCallback(async (e) => {
        e?.stopPropagation();
        try {
            setEstado("montando");
            const blob = await gerarBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = nomeArquivo;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 1500);
            setEstado("ok");
            setTimeout(() => setEstado("idle"), 1800);
        } catch {
            setEstado("erro");
            setTimeout(() => setEstado("idle"), 2000);
        }
    }, [gerarBlob, nomeArquivo]);

    const handleCompartilhar = useCallback(async (e) => {
        e?.stopPropagation();
        try {
            setEstado("montando");
            const blob = await gerarBlob();
            const file = new File([blob], nomeArquivo, { type: "image/png" });

            const dados = {
                title: "BRAVOS Barbearia",
                text: corteNome ? `Meu próximo corte: ${corteNome} ✂️` : "Meu próximo corte na BRAVOS ✂️",
            };

            // Web Share API com arquivo (mobile/totem moderno)
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ ...dados, files: [file] });
                setEstado("idle");
                return;
            }
            // Share só texto
            if (navigator.share) {
                await navigator.share(dados);
                setEstado("idle");
                return;
            }
            // Fallback: baixa a imagem
            await handleSalvar();
        } catch (err) {
            // usuário cancelou o share não é erro real
            if (err?.name === "AbortError") { setEstado("idle"); return; }
            setEstado("erro");
            setTimeout(() => setEstado("idle"), 2000);
        }
    }, [gerarBlob, nomeArquivo, corteNome, handleSalvar]);

    if (!imagemSrc) return null;

    const ocupado = estado === "montando";

    return (
        <div className={`es-wrap es-wrap--${variante}`} onClick={(e) => e.stopPropagation()}>
            <style>{styles}</style>

            <button
                className="es-btn es-btn--save"
                onClick={handleSalvar}
                disabled={ocupado}
                title="Salvar foto"
            >
                {ocupado ? (
                    <span className="es-spinner" />
                ) : estado === "ok" ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
                        strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                )}
                <span>{estado === "ok" ? "Salvo!" : "Salvar foto"}</span>
            </button>

            <button
                className="es-btn es-btn--share"
                onClick={handleCompartilhar}
                disabled={ocupado}
                title="Compartilhar"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span>Compartilhar</span>
            </button>
        </div>
    );
}
ExportShare.propTypes = {
    imagemSrc: PropTypes.string.isRequired,
    corteNome: PropTypes.string,
    frase: PropTypes.string,
    variante: PropTypes.oneOf(["inline", "compact"]),
};

const styles = `
  .es-wrap {
    display: flex;
    gap: 10px;
    width: 100%;
  }
  .es-wrap--compact { gap: 8px; }

  .es-btn {
    display: flex; align-items: center; justify-content: center;
    gap: 8px;
    flex: 1;
    padding: 13px 16px;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    border: 1px solid transparent;
  }
  .es-wrap--compact .es-btn { padding: 10px 12px; font-size: 12px; }

  .es-btn svg { width: 17px; height: 17px; flex-shrink: 0; }

  .es-btn:disabled { opacity: 0.7; cursor: wait; }
  .es-btn:not(:disabled):active { transform: scale(0.97); }

  .es-btn--save {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.14);
    color: #F0EDE8;
  }
  .es-btn--save:not(:disabled):hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.25);
    transform: translateY(-1px);
  }

  .es-btn--share {
    background: linear-gradient(135deg, #C9A84C, #E8C97A);
    color: #08080A;
    box-shadow: 0 4px 18px rgba(201,168,76,0.25);
  }
  .es-btn--share:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 26px rgba(201,168,76,0.4);
  }

  .es-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(8,8,10,0.25);
    border-top-color: #08080A;
    border-radius: 50%;
    animation: es-spin 0.7s linear infinite;
  }
  .es-btn--save .es-spinner {
    border-color: rgba(240,237,232,0.25);
    border-top-color: #F0EDE8;
  }
  @keyframes es-spin { to { transform: rotate(360deg); } }
`;
