// =====================================================
// BRAVOS BARBEARIA — Catálogo de Cortes
// src/data/estilos.js
// =====================================================

/**
 * @typedef {Object} Corte
 * @property {number}   id
 * @property {string}   nome
 * @property {string}   descricao
 * @property {string}   descricaoTecnica
 * @property {string}   descricaoPrompt    - Prompt técnico para a IA
 * @property {string[]} rostos             - Formatos de rosto compatíveis
 * @property {string[]} estilos            - Vibes compatíveis
 * @property {string[]} servicos
 * @property {string[]} tiposCabelo        - liso | ondulado | cacheado | crespo | afro
 * @property {string}   tag
 * @property {string[]} [similarIds]
 * @property {string}   [variationHint]
 */

export const ESTILOS_CORTE = [

  // ─────────────────────────────────────────────────────────────
  // DEGRADÊ / FADE — LISOS & ONDULADOS
  // ─────────────────────────────────────────────────────────────
  {
    id: 1,
    nome: "Degradê Alto com Franja",
    descricao: "Laterais bem marcadas e franja texturizada no topo.",
    descricaoTecnica: "Máquina 0 nas laterais, fade médio, tesoura no topo com franja lateral navalha.",
    descricaoPrompt: "high skin fade haircut, textured top with side fringe, sharp line up, urban modern barbershop style, photorealistic",
    rostos: ["oval", "quadrado"],
    estilos: ["moderno", "street"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado"],
    tag: "Tendência 2025",
    similarIds: [7, 17, 4],
    variationHint: "vary the fringe length, texture intensity, and fade height while keeping the urban character",
  },
  {
    id: 2,
    nome: "Undercut Clássico",
    descricao: "Topo comprido com laterais raspadas — elegante e versátil.",
    descricaoTecnica: "Máquina 1 nas laterais, topo pente e tesoura, pomada para definição.",
    descricaoPrompt: "classic undercut hairstyle, long top slicked back or styled, shaved sides, clean professional barbershop look, photorealistic",
    rostos: ["oval", "oblongo", "triangular"],
    estilos: ["executivo", "moderno"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado"],
    tag: "Clássico Moderno",
    similarIds: [12, 3, 6],
    variationHint: "vary the top length, parting direction (slicked back vs side part), and shave level",
  },
  {
    id: 3,
    nome: "Pompadour Moderno",
    descricao: "Volume no topo com fade limpo — presença e sofisticação.",
    descricaoTecnica: "Low fade nas laterais, topo volumoso com secador, acabamento com brilho.",
    descricaoPrompt: "modern pompadour haircut, voluminous top swept back, low fade sides, slick shine finish, bold masculine barbershop style, photorealistic",
    rostos: ["redondo", "quadrado", "oblongo"],
    estilos: ["executivo", "moderno"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado"],
    tag: "Premium",
    similarIds: [12, 2, 6],
    variationHint: "vary the volume height, fade level, and finish (matte vs glossy vs natural)",
  },
  {
    id: 4,
    nome: "Buzz Cut com Listra",
    descricao: "Máquina por todo o cabelo com detalhe geométrico na lateral.",
    descricaoTecnica: "Máquina 2 uniforme, detalhe navalha na lateral direita.",
    descricaoPrompt: "buzz cut with geometric razor detail line on side, clean minimal masculine haircut, sharp razor line, photorealistic",
    rostos: ["oval", "quadrado", "losango"],
    estilos: ["moderno", "street"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado", "cacheado"],
    tag: "Minimalista",
    similarIds: [17, 1, 11],
    variationHint: "vary the guard length (1 vs 2 vs 3), razor detail position and shape",
  },
  {
    id: 5,
    nome: "Texturizado Comprido",
    descricao: "Cabelo comprido com camadas e textura natural.",
    descricaoTecnica: "Tesoura em camadas, ponta navalha para textura, sem raspar laterais.",
    descricaoPrompt: "medium length textured layered haircut, natural waves, casual modern style, no fade, relaxed masculine look, photorealistic",
    rostos: ["oval", "triangular", "losango"],
    estilos: ["casual", "street"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado"],
    tag: "Natural",
    similarIds: [16, 2, 36],
    variationHint: "vary the length, wave definition, and whether pushed back or forward",
  },
  {
    id: 6,
    nome: "Corte Social Clássico",
    descricao: "Corte formal e bem estruturado para ocasiões profissionais.",
    descricaoTecnica: "Pente e tesoura, laterais curtas sem degradê, partida lateral definida.",
    descricaoPrompt: "classic professional side part haircut, clean formal barbershop style, conservative business look, neat edges, photorealistic",
    rostos: ["oval", "oblongo", "redondo"],
    estilos: ["executivo"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado"],
    tag: "Executivo",
    similarIds: [2, 10, 3],
    variationHint: "vary the part side, top length, and degree of formality",
  },
  {
    id: 7,
    nome: "Crop com Fade",
    descricao: "Franja reta no topo com fade médio — tendência europeia.",
    descricaoTecnica: "Mid fade nas laterais, topo reto tesoura, franja horizontal curta.",
    descricaoPrompt: "crop top haircut with mid fade, straight horizontal fringe, European trend style, textured short top, photorealistic",
    rostos: ["quadrado", "redondo", "losango"],
    estilos: ["moderno", "casual"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado"],
    tag: "Trend",
    similarIds: [1, 14, 4],
    variationHint: "vary the fringe length, fade level, and top texture",
  },
  {
    id: 10,
    nome: "Degradê Baixo Clássico",
    descricao: "Transição suave nas laterais — corte versátil para qualquer rosto.",
    descricaoTecnica: "Low fade entrada, pente e tesoura no topo, contorno reto na nuca.",
    descricaoPrompt: "low taper fade haircut, clean classic barbershop cut, neat neckline, versatile masculine style, photorealistic",
    rostos: ["oval", "redondo", "oblongo"],
    estilos: ["casual", "executivo"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado", "cacheado"],
    tag: "Versátil",
    similarIds: [6, 2, 17],
    variationHint: "vary the fade height, top styling (natural vs combed vs textured)",
  },
  {
    id: 12,
    nome: "Slick Back com Fade",
    descricao: "Topo penteado para trás com fade suave — charm retrô.",
    descricaoTecnica: "High fade, topo liso para trás com pomada, linha definida.",
    descricaoPrompt: "slick back hairstyle with high fade, hair neatly combed straight back with pomade shine, retro modern barbershop, photorealistic",
    rostos: ["quadrado", "triangular", "oval"],
    estilos: ["executivo", "classico"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado"],
    tag: "Old School",
    similarIds: [2, 3, 6],
    variationHint: "vary pomade finish (high shine vs matte), fade height, and hair reach",
  },
  {
    id: 14,
    nome: "Caesar com Fade",
    descricao: "Franja horizontal curta com fade — estilo romano contemporâneo.",
    descricaoTecnica: "Mid fade, topo pente e tesoura, franja horizontal 2-3cm.",
    descricaoPrompt: "caesar haircut with skin fade, short horizontal fringe, Roman-inspired contemporary barbershop style, photorealistic",
    rostos: ["redondo", "quadrado", "oval"],
    estilos: ["moderno", "casual"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado"],
    tag: "Moderno",
    similarIds: [7, 1, 10],
    variationHint: "vary fringe length and texture, fade type, top density",
  },
  {
    id: 17,
    nome: "Skin Fade com Risco",
    descricao: "Fade zero com risco lateral navalha — precisão total.",
    descricaoTecnica: "Skin fade, risco lateral navalha, topo curto pente e tesoura.",
    descricaoPrompt: "skin fade haircut with sharp razor part line, bald fade sides, short clean top, precision barbershop cut, photorealistic",
    rostos: ["oval", "quadrado", "losango"],
    estilos: ["moderno", "street"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado"],
    tag: "Precisão",
    similarIds: [4, 1, 7],
    variationHint: "vary part line position, top styling, skin vs low fade",
  },

  // ─────────────────────────────────────────────────────────────
  // GRINGOS — INTERNACIONAIS
  // ─────────────────────────────────────────────────────────────
  {
    id: 18,
    nome: "Edgar Fluffy",
    descricao: "Franja reta marcada com topo volumoso e textura — corte viral.",
    descricaoTecnica: "High fade ou skin fade, franja horizontal densa cortada reta, topo com volume e textura.",
    descricaoPrompt: "fluffy edgar haircut, straight blunt fringe, voluminous textured top, high skin fade, viral TikTok barbershop trend, photorealistic",
    rostos: ["oval", "quadrado", "redondo"],
    estilos: ["moderno", "street"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado"],
    tag: "Viral 2025",
    similarIds: [7, 1, 14],
    variationHint: "vary fluffiness, fringe density, fade height from mid to skin",
  },
  {
    id: 19,
    nome: "Flat Top",
    descricao: "Topo nivelado horizontalmente — ícone do estilo hip-hop dos anos 90.",
    descricaoTecnica: "Topo cortado plano com tesoura e pente, máquina alta nas laterais.",
    descricaoPrompt: "flat top haircut, perfectly level horizontal top, high fade sides, bold geometric masculine style, 90s hip-hop influence, photorealistic",
    rostos: ["oblongo", "oval", "losango"],
    estilos: ["street", "ousado"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "crespo", "afro"],
    tag: "Icônico",
    similarIds: [11, 4, 32],
    variationHint: "vary the flat top height and width, fade level",
  },
  {
    id: 20,
    nome: "Mullet Moderno",
    descricao: "Curto na frente e nos lados, comprido atrás — o retorno do mullet.",
    descricaoTecnica: "Laterais e frente com fade ou curtas, nuca longa e texturizada.",
    descricaoPrompt: "modern mullet haircut, short sides and front, long textured back, contemporary retro fusion style, photorealistic",
    rostos: ["oval", "triangular", "oblongo"],
    estilos: ["ousado", "street"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado"],
    tag: "Retrô Moderno",
    similarIds: [36, 5, 11],
    variationHint: "vary the back length, side fade level, and texture of the mullet tail",
  },
  {
    id: 21,
    nome: "Curtain Hair",
    descricao: "Cabelo médio dividido ao meio caindo para os lados — estilo anos 90.",
    descricaoTecnica: "Tesoura em camadas, partida central, sem fade nas laterais.",
    descricaoPrompt: "curtain hair men's hairstyle, middle part, medium length hair falling to both sides, 90s Kurt Cobain inspired, photorealistic",
    rostos: ["oval", "losango", "triangular"],
    estilos: ["casual", "ousado"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado"],
    tag: "Anos 90",
    similarIds: [5, 36, 20],
    variationHint: "vary the length, wave/texture, and how far the curtains fall",
  },
  {
    id: 22,
    nome: "Wolf Cut",
    descricao: "Camadas em cascata com volume na coroa — selvagem e texturizado.",
    descricaoTecnica: "Tesoura em camadas pesadas, franja opcional, sem fade.",
    descricaoPrompt: "wolf cut hairstyle men, heavy layers, voluminous crown, shaggy textured ends, 70s rock revival style, photorealistic",
    rostos: ["oval", "losango", "triangular"],
    estilos: ["ousado", "casual"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado", "cacheado"],
    tag: "Rock Vibes",
    similarIds: [5, 21, 36],
    variationHint: "vary layer heaviness, fringe presence, and overall volume",
  },
  {
    id: 23,
    nome: "Two-Block Coreano",
    descricao: "Topo longo e fluido com laterais e nuca raspadas — estilo K-pop.",
    descricaoTecnica: "Laterais e nuca máquina 1-2, topo comprido livre e natural.",
    descricaoPrompt: "Korean two-block haircut, long flowing top, clipper-shaved sides and back, K-pop inspired masculine style, photorealistic",
    rostos: ["oval", "redondo", "quadrado"],
    estilos: ["moderno", "casual"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado"],
    tag: "K-Style",
    similarIds: [2, 5, 21],
    variationHint: "vary the top length (medium vs long), side clip level, and top styling direction",
  },
  {
    id: 24,
    nome: "Ivy League",
    descricao: "Corte universitário americano — clássico e refinado.",
    descricaoTecnica: "Pente e tesoura, laterais curtas, partida lateral leve, topo 3-4cm.",
    descricaoPrompt: "ivy league prep haircut, short back and sides, slight side part, clean American collegiate style, photorealistic",
    rostos: ["oval", "quadrado", "oblongo"],
    estilos: ["executivo", "classico"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado"],
    tag: "All-American",
    similarIds: [6, 2, 10],
    variationHint: "vary the part prominence, side length, and top volume",
  },
  {
    id: 25,
    nome: "French Crop",
    descricao: "Franja texturizada com laterais tapadas — corte francês urbano.",
    descricaoTecnica: "High fade, franja curta texturizada com tesoura pontiaguda.",
    descricaoPrompt: "French crop haircut, textured disconnected fringe, high fade sides, European urban barbershop style, photorealistic",
    rostos: ["redondo", "quadrado", "losango"],
    estilos: ["moderno", "casual"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado"],
    tag: "Euro Trend",
    similarIds: [7, 14, 18],
    variationHint: "vary fringe texture level, fade height, and top disconnection",
  },
  {
    id: 26,
    nome: "Drop Fade",
    descricao: "Fade que desce atrás da orelha — acabamento arredondado.",
    descricaoTecnica: "Fade curva atrás da orelha, topo livre ao gosto.",
    descricaoPrompt: "drop fade haircut, fade curves down behind the ear, rounded taper neckline, clean modern barbershop, photorealistic",
    rostos: ["oval", "redondo", "quadrado"],
    estilos: ["moderno", "street"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado", "cacheado"],
    tag: "Shape Up",
    similarIds: [1, 17, 27],
    variationHint: "vary the drop curve depth, fade level, and top style",
  },
  {
    id: 27,
    nome: "Burst Fade",
    descricao: "Fade em semicírculo atrás da orelha — efeito explosivo.",
    descricaoTecnica: "Fade radial saindo da orelha, mantém volume na nuca.",
    descricaoPrompt: "burst fade haircut, semi-circular fade radiating from ear, volume preserved at neckline, dramatic modern barbershop, photorealistic",
    rostos: ["oval", "losango", "quadrado"],
    estilos: ["moderno", "street", "ousado"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado", "cacheado"],
    tag: "Signature",
    similarIds: [26, 17, 1],
    variationHint: "vary the burst radius, fade height, and neckline treatment",
  },
  {
    id: 28,
    nome: "High Taper Fade",
    descricao: "Fade que sobe alto mas com transição suave — clean e impactante.",
    descricaoTecnica: "Taper iniciando alto nas laterais, transição gradual, topo livre.",
    descricaoPrompt: "high taper fade haircut, fade starting high on sides, smooth gradient, clean modern barbershop look, photorealistic",
    rostos: ["oval", "quadrado", "losango"],
    estilos: ["moderno", "executivo", "street"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado", "cacheado"],
    tag: "Clean Cut",
    similarIds: [17, 1, 26],
    variationHint: "vary how high the taper starts, the top style, and neckline",
  },
  {
    id: 36,
    nome: "Shag Texturizado",
    descricao: "Corte longo em camadas com franja caída — rock e liberdade.",
    descricaoTecnica: "Camadas em todo o comprimento, franja natural, sem fade.",
    descricaoPrompt: "shag haircut men, heavy textured layers throughout, natural fringe, 70s rock style modern revival, photorealistic",
    rostos: ["oval", "triangular", "losango"],
    estilos: ["ousado", "casual"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado"],
    tag: "Rock",
    similarIds: [22, 21, 5],
    variationHint: "vary the overall length, layer density, and fringe length",
  },
  {
    id: 37,
    nome: "Blowout",
    descricao: "Laterais curtas com topo explodindo para cima — energia pura.",
    descricaoTecnica: "Low-mid fade, topo alongado secado para cima e para frente.",
    descricaoPrompt: "blowout haircut men, low fade sides, voluminous hair blown upward and forward on top, bold dynamic style, photorealistic",
    rostos: ["oblongo", "redondo", "quadrado"],
    estilos: ["ousado", "street"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado"],
    tag: "Volume Max",
    similarIds: [3, 11, 19],
    variationHint: "vary the blowout direction, fade height, and volume level",
  },

  // ─────────────────────────────────────────────────────────────
  // MOICANO / MOHAWK
  // ─────────────────────────────────────────────────────────────
  {
    id: 11,
    nome: "Moicano Moderno",
    descricao: "Tiras laterais com crista central — ousado e memorável.",
    descricaoTecnica: "Máquina 0 laterais, crista central 5cm tesoura e gel forte.",
    descricaoPrompt: "modern mohawk hairstyle, shaved sides, central strip styled upward with strong hold, bold alternative masculine look, photorealistic",
    rostos: ["oblongo", "losango", "oval"],
    estilos: ["ousado", "street"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado", "cacheado"],
    tag: "Arrojado",
    similarIds: [4, 19, 37],
    variationHint: "vary the strip width, height, and styling direction",
  },
  {
    id: 38,
    nome: "Fauxhawk",
    descricao: "Crista suave sem raspar os lados — o moicano elegante.",
    descricaoTecnica: "Fade alto nas laterais, topo central com gel para dar direção central.",
    descricaoPrompt: "faux hawk hairstyle men, high fade sides, central top styled to a soft peak without fully shaving sides, modern polished look, photorealistic",
    rostos: ["oval", "quadrado", "redondo"],
    estilos: ["moderno", "ousado"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado"],
    tag: "Arrojado Elegante",
    similarIds: [11, 1, 37],
    variationHint: "vary the peak height, fade level, and how soft vs sharp the mohawk shape is",
  },

  // ─────────────────────────────────────────────────────────────
  // CLÁSSICOS BRASILEIROS
  // ─────────────────────────────────────────────────────────────
  {
    id: 29,
    nome: "Navalhado Social",
    descricao: "Corte à navalha com acabamento sedoso — o clássico brasileiro.",
    descricaoTecnica: "Navalha em todo o cabelo, pente e tesoura para nivelamento.",
    descricaoPrompt: "razor haircut Brazilian social style, smooth razor-cut finish all over, classic Brazilian barbershop, photorealistic",
    rostos: ["oval", "oblongo", "quadrado"],
    estilos: ["classico", "executivo"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado"],
    tag: "Clássico BR",
    similarIds: [6, 10, 2],
    variationHint: "vary the razor pressure and finish texture",
  },
  {
    id: 30,
    nome: "Corte Militar",
    descricao: "Cabelo curto uniforme e disciplinado em toda a cabeça.",
    descricaoTecnica: "Máquina 3-4 uniforme, contorno navalha, impecável.",
    descricaoPrompt: "military crew cut haircut, uniform short length all over, clean razor edges, disciplined masculine style, photorealistic",
    rostos: ["oval", "quadrado", "redondo"],
    estilos: ["executivo", "classico"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado", "cacheado"],
    tag: "Disciplinado",
    similarIds: [4, 6, 10],
    variationHint: "vary the guard length (2 vs 3 vs 4), neckline style, and whether sides taper",
  },
  {
    id: 31,
    nome: "Pente e Tesoura Clássico",
    descricao: "Corte totalmente à tesoura — artesanal e refinado.",
    descricaoTecnica: "Apenas pente e tesoura, sem máquina, arredondado nas bordas.",
    descricaoPrompt: "scissor cut classic men's haircut, entirely cut with scissors and comb, no clipper, artisanal refined look, natural clean finish, photorealistic",
    rostos: ["oval", "oblongo", "triangular"],
    estilos: ["classico", "casual"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["liso", "ondulado"],
    tag: "Artesanal",
    similarIds: [6, 24, 10],
    variationHint: "vary the overall length and whether sides are tapered or blunt",
  },

  // ─────────────────────────────────────────────────────────────
  // ONDULADO & CACHEADO
  // ─────────────────────────────────────────────────────────────
  {
    id: 16,
    nome: "Ondulado Estruturado",
    descricao: "Cabelo ondulado definido com produto e fade lateral.",
    descricaoTecnica: "Low fade, ativador de cachos no topo, definição com difusor.",
    descricaoPrompt: "structured wavy hair with low fade, defined waves with styling product, natural texture modern barbershop, photorealistic",
    rostos: ["redondo", "oval", "triangular"],
    estilos: ["casual", "moderno"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["ondulado", "cacheado"],
    tag: "Textura",
    similarIds: [5, 33, 34],
    variationHint: "vary curl tightness, fade height, and product finish",
  },
  {
    id: 33,
    nome: "Cacheado com Fade",
    descricao: "Cachos definidos no topo com fade limpo — estilo e identidade.",
    descricaoTecnica: "Mid-high fade, cachos soltos no topo com creme definidor.",
    descricaoPrompt: "curly hair men with mid fade, defined curls on top, natural curl pattern preserved, modern barbershop style, photorealistic",
    rostos: ["oval", "redondo", "quadrado"],
    estilos: ["moderno", "casual"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["cacheado"],
    tag: "Cachos & Fade",
    similarIds: [16, 34, 26],
    variationHint: "vary the curl definition, fade height, and top volume",
  },
  {
    id: 34,
    nome: "Cacheado Solto Natural",
    descricao: "Cachos livres sem fade — natural e autêntico.",
    descricaoTecnica: "Tesoura para moldar, sem máquina, ativador de cachos.",
    descricaoPrompt: "natural curly hair men, free flowing defined curls, no fade, round natural shape, authentic curl texture, photorealistic",
    rostos: ["oval", "losango", "triangular"],
    estilos: ["casual", "ousado"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["cacheado"],
    tag: "Autêntico",
    similarIds: [16, 33, 5],
    variationHint: "vary the curl length, definition level, and overall volume",
  },
  {
    id: 35,
    nome: "Undercut Cacheado",
    descricao: "Laterais raspadas com cachos livres e volumosos no topo.",
    descricaoTecnica: "Skin fade ou máquina 0 nas laterais, cachos soltos no topo.",
    descricaoPrompt: "curly hair undercut men, shaved sides, voluminous defined curls on top, contrast between clean sides and natural curls, photorealistic",
    rostos: ["oval", "quadrado", "oblongo"],
    estilos: ["moderno", "ousado"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["cacheado"],
    tag: "Contraste",
    similarIds: [33, 2, 34],
    variationHint: "vary the fade level, curl volume on top, and whether the curls are shaped or free",
  },

  // ─────────────────────────────────────────────────────────────
  // CRESPO & AFRO
  // ─────────────────────────────────────────────────────────────
  {
    id: 39,
    nome: "Afro Shape",
    descricao: "Cabelo afro com shape esférico definido — identidade máxima.",
    descricaoTecnica: "Pente garfo para volume, tesoura para arredondar o shape.",
    descricaoPrompt: "shaped afro hairstyle, perfectly rounded spherical shape, clean edges and neckline, natural afro texture, proud Black masculine style, photorealistic",
    rostos: ["oval", "redondo", "quadrado"],
    estilos: ["ousado", "casual"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["crespo", "afro"],
    tag: "Identidade",
    similarIds: [40, 42, 19],
    variationHint: "vary the afro volume size and edge precision",
  },
  {
    id: 40,
    nome: "Fade Crespo com Shape",
    descricao: "Fade nas laterais com crespo volumoso e contorno definido no topo.",
    descricaoTecnica: "Skin fade nas laterais, shape no topo com pente garfo, contorno navalha.",
    descricaoPrompt: "high fade with natural afro top, crisp hairline shape up, clean razor line up on forehead and temples, defined afro texture on top, photorealistic",
    rostos: ["oval", "quadrado", "redondo"],
    estilos: ["moderno", "street"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["crespo", "afro"],
    tag: "Line Up",
    similarIds: [39, 42, 27],
    variationHint: "vary the fade height, top volume, and line up sharpness",
  },
  {
    id: 41,
    nome: "High Top Fade",
    descricao: "Topo flat e alto com fade alto — ícone do hip-hop.",
    descricaoTecnica: "High fade, topo cortado plano no alto com pente garfo.",
    descricaoPrompt: "high top fade haircut afro, tall flat top, high skin fade sides, iconic 90s hip-hop style, photorealistic",
    rostos: ["oblongo", "oval", "losango"],
    estilos: ["street", "ousado"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["crespo", "afro"],
    tag: "Hip-Hop Clássico",
    similarIds: [19, 40, 39],
    variationHint: "vary the flat top height, fade start point, and edge sharpness",
  },
  {
    id: 42,
    nome: "Twist Out com Fade",
    descricao: "Cachos definidos por twists com fade limpo — arte capilar.",
    descricaoTecnica: "Fade médio nas laterais, twists desfeitos no topo para definição.",
    descricaoPrompt: "twist out hairstyle men with mid fade, defined coiled pattern from twists, natural texture, modern Black barbershop style, photorealistic",
    rostos: ["oval", "redondo", "quadrado"],
    estilos: ["moderno", "casual"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["crespo", "afro"],
    tag: "Definição",
    similarIds: [40, 39, 33],
    variationHint: "vary the twist coil size, fade height, and definition level",
  },
  {
    id: 43,
    nome: "Dread Fade",
    descricao: "Dreadlocks curtos no topo com fade limpo — bold e marcante.",
    descricaoTecnica: "Fade alto nas laterais, dreadlocks iniciantes ou curtos no topo.",
    descricaoPrompt: "short dreadlocks with high fade sides, nascent locs on top, clean barbershop fade, bold masculine look, photorealistic",
    rostos: ["oval", "losango", "oblongo"],
    estilos: ["ousado", "street"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["crespo", "afro"],
    tag: "Bold",
    similarIds: [40, 41, 19],
    variationHint: "vary the loc length and thickness, fade level",
  },
  {
    id: 44,
    nome: "Undercut Crespo",
    descricao: "Laterais raspadas com crespo volumoso no topo — contraste poderoso.",
    descricaoTecnica: "Skin fade nas laterais, contorno navalha, crespo solto no topo.",
    descricaoPrompt: "afro undercut men, shaved sides with skin fade, voluminous natural afro texture on top, strong contrast, photorealistic",
    rostos: ["oval", "quadrado", "oblongo"],
    estilos: ["ousado", "moderno"],
    servicos: ["cabelo", "ambos"],
    tiposCabelo: ["crespo", "afro"],
    tag: "Contraste",
    similarIds: [40, 39, 35],
    variationHint: "vary the side fade level and top afro volume",
  },

  // ─────────────────────────────────────────────────────────────
  // BARBA
  // ─────────────────────────────────────────────────────────────
  {
    id: 8,
    nome: "Barba Cheia Aparada",
    descricao: "Barba completa com contornos definidos — maturidade e estilo.",
    descricaoTecnica: "Tesoura para nivelar, navalha nos contornos, óleo de barba.",
    descricaoPrompt: "full beard neatly trimmed and shaped, clean sharp neckline and cheekline, well-groomed masculine beard, photorealistic",
    rostos: ["oval", "quadrado", "oblongo"],
    estilos: ["executivo", "casual"],
    servicos: ["barba", "ambos"],
    tiposCabelo: ["liso", "ondulado", "cacheado", "crespo", "afro"],
    tag: "Clássico",
    similarIds: [15, 9, 13],
    variationHint: "vary beard length (short full vs medium vs long full), neckline shape",
  },
  {
    id: 9,
    nome: "Barba Curta Desenhada",
    descricao: "Barba de 3 dias esculpida com linhas precisas.",
    descricaoTecnica: "Máquina 2 uniforme, navalha nos contornos mandibulares e pescoço.",
    descricaoPrompt: "short stubble beard precisely lined with sharp razor edges at jawline and neck, groomed 3-day masculine beard, photorealistic",
    rostos: ["redondo", "triangular", "losango"],
    estilos: ["moderno", "casual"],
    servicos: ["barba", "ambos"],
    tiposCabelo: ["liso", "ondulado", "cacheado", "crespo", "afro"],
    tag: "Definido",
    similarIds: [8, 13, 45],
    variationHint: "vary stubble density, neckline shape, mustache connection",
  },
  {
    id: 13,
    nome: "Barba Vandyke",
    descricao: "Bigode separado do cavanhaque — estilo icônico e marcante.",
    descricaoTecnica: "Cavanhaque com navalha, bigode inglês definido, bochechas limpas.",
    descricaoPrompt: "vandyke beard style, pointed goatee with separately styled mustache, clean shaved cheeks, distinctive sharp masculine look, photorealistic",
    rostos: ["oblongo", "oval", "triangular"],
    estilos: ["ousado", "executivo"],
    servicos: ["barba", "ambos"],
    tiposCabelo: ["liso", "ondulado", "cacheado", "crespo", "afro"],
    tag: "Icônico",
    similarIds: [9, 8, 46],
    variationHint: "vary goatee shape (pointed vs rounded), mustache style, and gap",
  },
  {
    id: 15,
    nome: "Barba Cheia Natural",
    descricao: "Barba crescida com shape natural — personalidade forte.",
    descricaoTecnica: "Tesoura para uniformizar, contorno pescoço, sem raspar bochechas.",
    descricaoPrompt: "full long natural beard, organic shape, minimal shaping, masculine rugged look, volume and density, photorealistic",
    rostos: ["quadrado", "oval", "losango"],
    estilos: ["casual", "ousado"],
    servicos: ["barba", "ambos"],
    tiposCabelo: ["liso", "ondulado", "cacheado", "crespo", "afro"],
    tag: "Natural",
    similarIds: [8, 47, 13],
    variationHint: "vary beard length, density, and neckline treatment",
  },
  {
    id: 45,
    nome: "Stubble com Skin Fade",
    descricao: "Barba raspada que desce em fade até o pescoço — técnica moderna.",
    descricaoTecnica: "Barba curta com máquina, fade navalha na transição pescoço-rosto.",
    descricaoPrompt: "short stubble beard with skin fade blending into the neck, razor faded neckline, modern barbershop beard technique, photorealistic",
    rostos: ["oval", "quadrado", "redondo"],
    estilos: ["moderno", "executivo"],
    servicos: ["barba", "ambos"],
    tiposCabelo: ["liso", "ondulado", "cacheado", "crespo", "afro"],
    tag: "Técnica Fade",
    similarIds: [9, 8, 13],
    variationHint: "vary the stubble length and where the fade starts on the neck",
  },
  {
    id: 46,
    nome: "Barba Francesa",
    descricao: "Cavanhaque fino com bigode aparado — sofisticação europeia.",
    descricaoTecnica: "Navalha para definir cavanhaque estreito, bigode aparado com tesoura.",
    descricaoPrompt: "French goatee beard, thin pointed goatee with neatly trimmed mustache, European style sophisticated masculine beard, photorealistic",
    rostos: ["oval", "oblongo", "triangular"],
    estilos: ["classico", "executivo"],
    servicos: ["barba", "ambos"],
    tiposCabelo: ["liso", "ondulado", "cacheado", "crespo", "afro"],
    tag: "Europeu",
    similarIds: [13, 9, 8],
    variationHint: "vary the goatee width and mustache trim level",
  },
  {
    id: 47,
    nome: "Barba Lenhador",
    descricao: "Barba longa e densa sem muito trato — viril e imponente.",
    descricaoTecnica: "Comprimento livre, apenas contorno no pescoço, óleo para brilho.",
    descricaoPrompt: "full lumberjack beard, long thick dense beard, minimal shaping, just neckline cleaned, rugged masculine lumberjack style, photorealistic",
    rostos: ["quadrado", "oval", "redondo"],
    estilos: ["casual", "ousado"],
    servicos: ["barba", "ambos"],
    tiposCabelo: ["liso", "ondulado", "cacheado", "crespo", "afro"],
    tag: "Rústico",
    similarIds: [15, 8, 13],
    variationHint: "vary the density and whether the mustache is shaped",
  },
  {
    id: 48,
    nome: "Cavanhaque Desenhado",
    descricao: "Cavanhaque moderno com linhas precisas e bochechas limpas.",
    descricaoTecnica: "Navalha para contorno do cavanhaque, bochechas e pescoço limpos.",
    descricaoPrompt: "modern goatee with precise razor lines, clean shaved cheeks and neck, sharp masculine chin beard, photorealistic",
    rostos: ["oblongo", "triangular", "losango"],
    estilos: ["moderno", "executivo"],
    servicos: ["barba", "ambos"],
    tiposCabelo: ["liso", "ondulado", "cacheado", "crespo", "afro"],
    tag: "Moderno",
    similarIds: [13, 46, 9],
    variationHint: "vary the goatee width and whether the mustache connects",
  },
];

// ─── UTILITÁRIOS ──────────────────────────────────────────────

/**
 * Filtra cortes por serviço, formato de rosto, estilo e tipo de cabelo.
 * Retorna exatamente `quantidade` cortes com fallbacks progressivos.
 */
export function filtrarCortes(servico, rosto, estilo, quantidade = 3, tipoCabelo = null) {
  const compativel = (c) =>
    c.servicos.includes(servico) || c.servicos.includes("ambos");

  // Ideal: todos os critérios incluindo tipo de cabelo
  let resultado = ESTILOS_CORTE.filter(
    (c) =>
      compativel(c) &&
      c.rostos.includes(rosto) &&
      c.estilos.includes(estilo) &&
      (!tipoCabelo || !c.tiposCabelo || c.tiposCabelo.includes(tipoCabelo))
  );

  // Fallback 1: ignora rosto, mantém estilo + tipo de cabelo + serviço
  if (resultado.length < quantidade) {
    const extras = ESTILOS_CORTE.filter(
      (c) =>
        compativel(c) &&
        c.estilos.includes(estilo) &&
        (!tipoCabelo || !c.tiposCabelo || c.tiposCabelo.includes(tipoCabelo)) &&
        !resultado.includes(c)
    );
    resultado = [...resultado, ...extras];
  }

  // Fallback 2: ignora tipo de cabelo
  if (resultado.length < quantidade) {
    const extras = ESTILOS_CORTE.filter(
      (c) =>
        compativel(c) &&
        c.estilos.includes(estilo) &&
        !resultado.includes(c)
    );
    resultado = [...resultado, ...extras];
  }

  // Fallback 3: pega o que tiver
  if (resultado.length < quantidade) {
    const tudo = ESTILOS_CORTE.filter((c) => compativel(c) && !resultado.includes(c));
    resultado = [...resultado, ...tudo];
  }

  return embaralharParcial(resultado).slice(0, quantidade);
}

/**
 * Dado um corte base, retorna cortes similares (diferentes do original).
 */
export function buscarSimilares(corteBase, quantidade = 3) {
  const ids = corteBase.similarIds ?? [];
  const similares = ids
    .map((id) => ESTILOS_CORTE.find((c) => c.id === id))
    .filter(Boolean);

  if (similares.length >= quantidade) return similares.slice(0, quantidade);

  const maisEstilo = ESTILOS_CORTE.filter(
    (c) =>
      c.id !== corteBase.id &&
      c.estilos.some((e) => corteBase.estilos.includes(e)) &&
      !similares.includes(c)
  );

  return [...similares, ...maisEstilo].slice(0, quantidade);
}

function embaralharParcial(arr, n = 8) {
  const head = arr.slice(0, n);
  const tail = arr.slice(n);
  for (let i = head.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [head[i], head[j]] = [head[j], head[i]];
  }
  return [...head, ...tail];
}
