// src/components/ScreenFoto.jsx
// ─────────────────────────────────────────────────────────────
// Tela de captura de foto.
// Duas opções: tirar com webcam ou fazer upload de arquivo.
// Converte para base64 e repassa via onFoto().
// ─────────────────────────────────────────────────────────────

import PropTypes from "prop-types";
import { useState, useRef, useCallback, useEffect } from "react";

const MAX_DIM = 1024; // px — redimensiona para não estourar a API
const JPEG_Q = 0.88;

// ── Utilitário: redimensiona + converte para JPEG base64 ──────
function processarImagem(arquivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", JPEG_Q));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(arquivo);
  });
}

export default function ScreenFoto({ onFoto, onVoltar }) {
  const [modo, setModo] = useState("escolha"); // "escolha" | "webcam" | "preview"
  const [preview, setPreview] = useState(null);
  const [streamAtivo, setStreamAtivo] = useState(false);
  const [espelhado, setEspelhado] = useState(true);
  const [erro, setErro] = useState("");
  const [capturando, setCapturando] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileRef = useRef(null);

  // Para a stream ao desmontar ou mudar de modo
  const pararStream = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setStreamAtivo(false);
  }, []);

  useEffect(() => () => pararStream(), [pararStream]);

  // Abre webcam
  useEffect(() => () => pararStream(), [pararStream]);

  // Quando modo vira "webcam", o <video> já está no DOM — conecta o stream
  useEffect(() => {
    if (modo === "webcam" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => { });
      setStreamAtivo(true);
    }
  }, [modo]);

  // Abre webcam — só guarda o stream; o useEffect acima conecta ao <video>
  async function abrirWebcam() {
    setErro("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setModo("webcam"); // <video> monta → useEffect dispara → srcObject atribuído
    } catch {
      setErro("Câmera não disponível. Verifique as permissões do navegador.");
    }
  }

  // Captura frame do vídeo
  function capturarFoto() {
    if (!videoRef.current) return;
    setCapturando(true);
    const v = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    const ctx = canvas.getContext("2d");
    if (espelhado) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(v, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg", JPEG_Q);
    pararStream();
    setPreview(base64);
    setModo("preview");
    setCapturando(false);
  }

  // Upload de arquivo
  async function handleUpload(e) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    if (!arquivo.type.startsWith("image/")) {
      setErro("Selecione uma imagem (JPG, PNG, WebP).");
      return;
    }
    setErro("");
    try {
      const base64 = await processarImagem(arquivo);
      setPreview(base64);
      setModo("preview");
    } catch {
      setErro("Não foi possível processar a imagem.");
    }
  }

  function recomecar() {
    setPreview(null);
    setErro("");
    setModo("escolha");
  }

  function confirmar() {
    if (preview) onFoto(preview);
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div style={s.root}>
      <div style={s.bgGlow} />

      {/* Header */}
      <header style={s.header}>
        <button style={s.voltarBtn} onClick={onVoltar}>
          <ChevronLeft /> <span>Voltar</span>
        </button>
        <div style={s.stepBadge}>1 / 3</div>
      </header>

      <div style={s.content}>
        <div style={s.tituloWrap}>
          <p style={s.etapa}>ETAPA 1</p>
          <h2 style={s.titulo}>Sua Foto</h2>
          <p style={s.desc}>Tire uma selfie ou faça upload de uma foto de frente, com boa iluminação.</p>
        </div>

        {/* Escolha inicial */}
        {modo === "escolha" && (
          <div style={s.opcoes}>
            <button style={s.opcaoBtn} onClick={abrirWebcam}>
              <span style={s.opcaoIcone}><CameraIcon /></span>
              <span style={s.opcaoTitulo}>Usar Câmera</span>
              <span style={s.opcaoDesc}>Tire uma selfie agora</span>
            </button>

            <div style={s.ou}>ou</div>

            <button style={s.opcaoBtn} onClick={() => fileRef.current?.click()}>
              <span style={s.opcaoIcone}><UploadIcon /></span>
              <span style={s.opcaoTitulo}>Fazer Upload</span>
              <span style={s.opcaoDesc}>JPG, PNG ou WebP</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleUpload} />
          </div>
        )}

        {/* Webcam */}
        {modo === "webcam" && (
          <div style={s.webcamWrap}>
            <div style={s.videoFrame}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ ...s.video, transform: espelhado ? "scaleX(-1)" : "none" }}
                onCanPlay={() => setStreamAtivo(true)}
              />
              {/* Guia oval */}
              <div style={s.ovalGuide} />
            </div>

            <div style={s.webcamControls}>
              <button style={s.btnSecundario} onClick={() => setEspelhado(e => !e)}>
                <MirrorIcon /> {espelhado ? "Direto" : "Espelhar"}
              </button>
              <button
                style={{ ...s.btnCaptura, ...(capturando ? s.btnDisabled : {}) }}
                onClick={capturarFoto}
                disabled={!streamAtivo || capturando}
              >
                <span style={s.capturaBolha} />
              </button>
              <button style={s.btnSecundario} onClick={() => { pararStream(); setModo("escolha"); }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Preview / confirmação */}
        {modo === "preview" && preview && (
          <div style={s.previewWrap}>
            <div style={s.previewFrame}>
              <img src={preview} alt="Sua foto" style={s.previewImg} />
            </div>
            <p style={s.previewDica}>
              Boa iluminação e fundo neutro melhoram muito o resultado. ✦
            </p>
            <div style={s.previewBtns}>
              <button style={s.btnSecundario} onClick={recomecar}>
                <RotateIcon /> Tentar outra
              </button>
              <button style={s.btnPrimario} onClick={confirmar}>
                Usar esta <ArrowRight />
              </button>
            </div>
          </div>
        )}

        {erro && <p style={s.erro}>{erro}</p>}
      </div>
    </div>
  );
}

ScreenFoto.propTypes = {
  onFoto: PropTypes.func.isRequired,
  onVoltar: PropTypes.func.isRequired,
};

// ── Ícones inline ─────────────────────────────────────────────
function CameraIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}
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
function RotateIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3" />
    </svg>
  );
}
function MirrorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21" /><path d="M7 6l-5 6 5 6" /><path d="M17 6l5 6-5 6" />
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
    position: "relative",
    overflow: "hidden",
  },
  bgGlow: {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 65%)",
    pointerEvents: "none",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px",
    borderBottom: "1px solid var(--border)",
    position: "relative",
    zIndex: 2,
  },
  voltarBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
    transition: "color 0.2s",
  },
  stepBadge: {
    fontSize: "11px",
    letterSpacing: "2px",
    color: "var(--gold)",
    fontFamily: "'Georgia', serif",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "32px 24px 40px",
    gap: "28px",
    position: "relative",
    zIndex: 1,
  },
  tituloWrap: {
    textAlign: "center",
  },
  etapa: {
    fontSize: "10px",
    letterSpacing: "4px",
    color: "var(--gold)",
    marginBottom: "8px",
    fontFamily: "'Georgia', serif",
  },
  titulo: {
    fontSize: "clamp(28px, 6vw, 40px)",
    fontFamily: "'Georgia', serif",
    fontStyle: "italic",
    fontWeight: "400",
    color: "var(--text)",
    marginBottom: "10px",
  },
  desc: {
    fontSize: "13px",
    color: "var(--text-muted)",
    lineHeight: 1.6,
    maxWidth: "320px",
    margin: "0 auto",
  },
  opcoes: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0",
    width: "100%",
    maxWidth: "360px",
  },
  opcaoBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    width: "100%",
    padding: "24px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    cursor: "pointer",
    transition: "border-color 0.2s, background 0.2s",
  },
  opcaoIcone: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "rgba(201,168,76,0.08)",
    marginBottom: "4px",
  },
  opcaoTitulo: {
    fontSize: "14px",
    color: "var(--text)",
    fontFamily: "'Georgia', serif",
    fontWeight: "600",
  },
  opcaoDesc: {
    fontSize: "12px",
    color: "var(--text-muted)",
  },
  ou: {
    fontSize: "12px",
    color: "var(--text-muted)",
    letterSpacing: "2px",
    padding: "16px 0",
    fontFamily: "'Georgia', serif",
    fontStyle: "italic",
  },
  webcamWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    width: "100%",
    maxWidth: "480px",
  },
  videoFrame: {
    position: "relative",
    width: "100%",
    aspectRatio: "4/3",
    borderRadius: "16px",
    overflow: "hidden",
    background: "#000",
    border: "1px solid var(--border)",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  ovalGuide: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "55%",
    height: "80%",
    border: "2px dashed rgba(201,168,76,0.4)",
    borderRadius: "50% 50% 45% 45%",
    pointerEvents: "none",
  },
  webcamControls: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  btnCaptura: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "var(--gold)",
    border: "4px solid var(--surface)",
    outline: "2px solid var(--gold)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.15s",
    flexShrink: 0,
  },
  capturaBolha: {
    display: "block",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    background: "#fff",
  },
  btnSecundario: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "10px 16px",
    fontSize: "12px",
    color: "var(--text-muted)",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
    transition: "color 0.2s",
  },
  previewWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    width: "100%",
    maxWidth: "400px",
  },
  previewFrame: {
    width: "100%",
    aspectRatio: "3/4",
    maxHeight: "400px",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid var(--border)",
  },
  previewImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  previewDica: {
    fontSize: "12px",
    color: "var(--text-muted)",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 1.5,
  },
  previewBtns: {
    display: "flex",
    gap: "12px",
    width: "100%",
  },
  btnPrimario: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    background: "var(--gold)",
    color: "#08080A",
    border: "none",
    borderRadius: "10px",
    padding: "14px 20px",
    fontSize: "12px",
    letterSpacing: "2px",
    fontFamily: "'Georgia', serif",
    fontWeight: "700",
    cursor: "pointer",
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  erro: {
    fontSize: "13px",
    color: "#E57373",
    textAlign: "center",
    maxWidth: "300px",
  },
};
