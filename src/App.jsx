// src/App.jsx
import { useCallback, useEffect } from "react";
import {
  useAppStore,
  TELAS,
  selTela,
  selSessao,
  selResultados,
  selUsuario,
} from "./store/useAppStore";
import { useGerador } from "./hooks/useGerador";
import ScreenLogin from "./components/ScreenLogin";
import ScreenFoto from "./components/ScreenFoto";
import ScreenRosto from "./components/ScreenRosto";
import ScreenEstilo from "./components/ScreenEstilo";
import ScreenResultado from "./components/ScreenResultado";
import DesktopLayout from "./components/DesktopLayout";

const ATM_MAP = {
  classico: { color: '#C9A84C', rgb: '201,168,76', glow: 'rgba(201,168,76,0.18)' },
  moderno: { color: '#4CA8C9', rgb: '76,168,201', glow: 'rgba(76,168,201,0.18)' },
  casual: { color: '#6AB04C', rgb: '106,176,76', glow: 'rgba(106,176,76,0.16)' },
  ousado: { color: '#E85C2A', rgb: '232,92,42', glow: 'rgba(232,92,42,0.2)' },
  executivo: { color: '#8B9CC9', rgb: '139,156,201', glow: 'rgba(139,156,201,0.18)' },
  street: { color: '#B44CC9', rgb: '180,76,201', glow: 'rgba(180,76,201,0.18)' },
};

function useAtmosfera() {
  const estilo = useAppStore(s => s.sessao.estilo);
  useEffect(() => {
    const atm = ATM_MAP[estilo] ?? ATM_MAP.classico;
    const r = document.documentElement.style;
    r.setProperty('--atm-color', atm.color);
    r.setProperty('--atm-rgb', atm.rgb);
    r.setProperty('--atm-glow', atm.glow);
  }, [estilo]);
}

export default function App() {
  useAtmosfera();

  const tela = useAppStore(selTela);
  const sessao = useAppStore(selSessao);
  const usuario = useAppStore(selUsuario);
  const cards = useAppStore(selResultados);

  const irPara = useAppStore(s => s.irPara);
  const setSessao = useAppStore(s => s.setSessao);
  const setUsuario = useAppStore(s => s.setUsuario);
  const reiniciar = useAppStore(s => s.reiniciar);

  const { gerarBatchInicial, gerarVariacoes, regenerarCard } = useGerador();

  const handleLogin = useCallback((novoUsuario) => {
    setUsuario(novoUsuario);
    irPara(TELAS.FOTO);
  }, [setUsuario, irPara]);

  const handleFoto = useCallback((fotoBase64) => {
    setSessao({ fotoBase64, fotoPreview: fotoBase64 });
    irPara(TELAS.ROSTO);
  }, [setSessao, irPara]);

  const handleRosto = useCallback(({ formato, tipoCabelo }) => {
    setSessao({ rosto: formato, tipoCabelo });
    irPara(TELAS.ESTILO);
  }, [setSessao, irPara]);

  // ScreenEstilo agora retorna { estilo, servico, tipoCabelo }
  const handleEstilo = useCallback(({ estilo, servico, tipoCabelo }) => {
    setSessao({ estilo, servico, tipoCabelo });
    irPara(TELAS.RESULTADO);
    gerarBatchInicial({
      fotoBase64: sessao.fotoBase64,
      rosto: sessao.rosto,
      estilo,
      servico,
      tipoCabelo,
    });
  }, [setSessao, irPara, gerarBatchInicial, sessao]);

  const handleGerarVariacoes = useCallback((cardOrigem) => {
    gerarVariacoes(cardOrigem);
  }, [gerarVariacoes]);

  const handleReiniciar = useCallback(() => {
    reiniciar();
    irPara(TELAS.FOTO);
  }, [reiniciar, irPara]);

  return (
    <>
      <style>{globalStyles}</style>

      {tela === TELAS.IDLE && (
        <ScreenLogin onLogin={handleLogin} />
      )}

      {tela !== TELAS.IDLE && (
        <DesktopLayout tela={tela}>
          {tela === TELAS.FOTO && (
            <ScreenFoto
              onFoto={handleFoto}
              onVoltar={() => irPara(TELAS.IDLE)}
            />
          )}

          {tela === TELAS.ROSTO && (
            <ScreenRosto
              onRosto={handleRosto}
              onVoltar={() => irPara(TELAS.FOTO)}
            />
          )}

          {tela === TELAS.ESTILO && (
            <ScreenEstilo
              onEstilo={handleEstilo}
              onVoltar={() => irPara(TELAS.ROSTO)}
            />
          )}

          {tela === TELAS.RESULTADO && (
            <ScreenResultado
              usuario={usuario}
              fotoBase64={sessao.fotoBase64}
              rosto={sessao.rosto}
              estilo={sessao.estilo}
              servico={sessao.servico}
              tipoCabelo={sessao.tipoCabelo}
              cards={cards}
              onGerarVariacoes={handleGerarVariacoes}
              onRetry={regenerarCard}
              onReiniciar={handleReiniciar}
            />
          )}
        </DesktopLayout>
      )}
    </>
  );
}

const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

:root {
  --gold:       #C9A84C;
  --gold-light: #E8C97A;
  --dark:       #08080A;
  --surface:    #111113;
  --surface2:   #1A1A1D;
  --border:     rgba(201,168,76,0.14);
  --text:       #F0EDE8;
  --text-muted: rgba(240,237,232,0.42);
  --radius:     16px;
  --atm-color:  #C9A84C;
  --atm-rgb:    201,168,76;
  --atm-glow:   rgba(201,168,76,0.15);
}

html, body, #root {
  height: 100%;
  min-height: 100dvh;
}

body {
  background: #08080A;
  color: #F0EDE8;
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

button { font-family: inherit; cursor: pointer; }
img    { max-width: 100%; display: block; }

* {
  scrollbar-width: thin;
  scrollbar-color: rgba(201,168,76,0.2) transparent;
}
*::-webkit-scrollbar { width: 4px; height: 4px; }
*::-webkit-scrollbar-thumb {
  background: rgba(201,168,76,0.2);
  border-radius: 2px;
}

::selection {
  background: rgba(201,168,76,0.25);
  color: #F0EDE8;
}

#root > * { animation: app-fade 0.3s ease; }

@keyframes app-fade {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Layout desktop gerenciado pelo DesktopLayout.jsx */
@media (min-width: 640px) {
  body { background: #040405; }
}

/* Resultado em desktop: grid maior */
@media (min-width: 900px) {
  .sr-grid { grid-template-columns: repeat(4, 1fr) !important; }
  .sr-main { max-width: 1100px !important; padding: 40px 48px 80px !important; margin: 0 auto !important; }
  .sr-nav  { padding: 16px 48px !important; }
  .sr-context { padding: 14px 48px !important; }
}
@media (min-width: 640px) and (max-width: 899px) {
  .sr-grid { grid-template-columns: repeat(3, 1fr) !important; }
  .sr-main { padding: 32px 32px 64px !important; }
}
`;
