// =====================================================
// BRAVOS BARBEARIA — Hook de Webcam
// src/hooks/useWebcam.js
//
// Isola toda a lógica de câmera fora do App.jsx.
// Funcionalidades:
//  - Iniciar/parar stream
//  - Tirar foto (canvas → base64)
//  - Upload de arquivo como alternativa à câmera
//  - Limpar foto atual
// =====================================================

import { useRef, useCallback, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";

// Resolução ideal para o Gemini (não precisa ser 4K)
const CAM_CONFIG = {
  width: { ideal: 720 },
  height: { ideal: 960 },
  facingMode: "user",
};

export function useWebcam() {
  const videoRef    = useRef(null);
  const streamRef   = useRef(null);
  const { sessao, setSessao } = useAppStore();

  // ── INICIAR CÂMERA ─────────────────────────────────────────
  const iniciarCam = useCallback(async () => {
    // Evita iniciar se já tem stream ativo
    if (streamRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: CAM_CONFIG,
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("[Webcam] Falha ao acessar câmera:", err);
      // Retorna o tipo de erro para a tela poder mostrar mensagem adequada
      if (err.name === "NotAllowedError") throw new Error("Permissão negada");
      if (err.name === "NotFoundError") throw new Error("Câmera não encontrada");
      throw new Error("Erro ao acessar câmera");
    }
  }, []);

  // ── PARAR CÂMERA ───────────────────────────────────────────
  const pararCam = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Para câmera automaticamente quando o componente desmonta
  useEffect(() => {
    return () => pararCam();
  }, [pararCam]);

  // ── TIRAR FOTO ─────────────────────────────────────────────
  const tirarFoto = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width  = video.videoWidth  || 720;
    canvas.height = video.videoHeight || 960;

    const ctx = canvas.getContext("2d");

    // Espelha de volta (o vídeo fica espelhado para parecer um espelho;
    // mas a imagem enviada para a IA deve ser o rosto real, não espelhado)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const dataURL = canvas.toDataURL("image/jpeg", 0.88);

    setSessao({
      fotoPreview:  dataURL,
      fotoBase64:   dataURL.split(",")[1],
    });

    pararCam();
  }, [setSessao, pararCam]);

  // ── UPLOAD DE ARQUIVO ──────────────────────────────────────
  /**
   * Alternativa à câmera: usuário faz upload de uma foto.
   * Converte o File para base64 e atualiza o store.
   */
  const uploadFoto = useCallback(
    (file) => {
      if (!file) return;

      // Valida tipo
      if (!file.type.startsWith("image/")) {
        console.error("[Webcam] Arquivo não é imagem:", file.type);
        return;
      }

      // Valida tamanho (máx 10MB)
      if (file.size > 10 * 1024 * 1024) {
        console.error("[Webcam] Arquivo muito grande:", file.size);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = e.target.result;

        // Redimensiona se necessário antes de mandar para a IA
        redimensionarImagem(dataURL, 720, 960).then((resized) => {
          setSessao({
            fotoPreview:  resized,
            fotoBase64:   resized.split(",")[1],
          });
        });
      };
      reader.readAsDataURL(file);
    },
    [setSessao]
  );

  // ── LIMPAR FOTO ────────────────────────────────────────────
  const limparFoto = useCallback(() => {
    setSessao({ fotoPreview: null, fotoBase64: null });
  }, [setSessao]);

  return {
    videoRef,
    fotoPreview: sessao.fotoPreview,
    temFoto: !!sessao.fotoPreview,
    iniciarCam,
    pararCam,
    tirarFoto,
    uploadFoto,
    limparFoto,
  };
}

// ─── UTILITÁRIO: REDIMENSIONAR IMAGEM ─────────────────────────
/**
 * Redimensiona uma imagem mantendo o aspecto, sem ultrapassar
 * maxW x maxH. Retorna uma nova data URL JPEG.
 */
async function redimensionarImagem(dataURL, maxW, maxH) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ratio  = Math.min(maxW / img.width, maxH / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };
    img.src = dataURL;
  });
}
