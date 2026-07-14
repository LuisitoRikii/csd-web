// src/components/svg/BrushGraphic.jsx

// puntas de cerdas irregulares/despeinadas (silueta en abanico, no un corte recto)
const BRISTLE_TIPS = [
  { x: 92, y: 14 }, { x: 104, y: 2 }, { x: 114, y: 22 }, { x: 126, y: 6 },
  { x: 140, y: 18 }, { x: 154, y: 4 }, { x: 168, y: 20 }, { x: 182, y: 8 },
  { x: 196, y: 16 }, { x: 210, y: 3 }, { x: 224, y: 19 }, { x: 238, y: 7 },
  { x: 252, y: 17 }, { x: 266, y: 4 }, { x: 280, y: 21 }, { x: 294, y: 9 },
  { x: 308, y: 15 },
]

function buildBristlesPath() {
  let d = `M 100 145 L ${BRISTLE_TIPS[0].x} ${BRISTLE_TIPS[0].y} `
  for (let i = 1; i < BRISTLE_TIPS.length; i++) {
    d += `L ${BRISTLE_TIPS[i].x} ${BRISTLE_TIPS[i].y} `
  }
  d += `L 300 145 Z`
  return d
}

// Silueta del mango basada en referencia real: cuerpo recto y ancho
// (mismo ancho que la virola) durante un tramo largo, recién se angosta
// en un cuello corto cerca del final, y termina en una punta redondeada
// con el agujero. (antes se afinaba enseguida tras la virola, por eso
// se veía "chato" arriba y alargado abajo)
const HANDLE_PATH = `
  M 98 175
  L 302 175
  L 300 288
  Q 300 308 289 322
  Q 279 336 261 344
  Q 276 349 281 363
  Q 284 379 256 384
  L 144 384
  Q 116 379 119 363
  Q 124 349 139 344
  Q 121 336 111 322
  Q 100 308 100 288
  Z
`

export const BRUSH_HEIGHT = 385

/**
 * Silueta de pincel realista: cerdas en abanico con puntas despeinadas,
 * virola metálica con brillo, mango de madera recto y ancho que se
 * angosta solo cerca de la punta redondeada (fiel a una brocha real),
 * vetas y sombreado cilíndrico, agujero pasante.
 *
 * holeMode="fill" -> el agujero se rellena con holeFillColor (para cuando
 *   la brocha está sobre un fondo conocido, ej. las franjas amarillas).
 * holeMode="ring" -> el agujero es un anillo hueco (para usar sobre
 *   cualquier fondo, sin depender del color detrás).
 */
export const BrushGraphic = ({
  metalColor = '#b7b7b7',
  handleColor = '#3b2a1e',
  holeMode = 'fill',
  holeFillColor = '#f6d631',
}) => {
  return (
    <>
      {/* cerdas */}
      <path d={buildBristlesPath()} fill="#ffffff" />
      {/* sombra donde las cerdas se juntan con la virola, para dar profundidad */}
      <path d="M 108 108 L 292 108 L 300 145 L 100 145 Z" fill="#000000" opacity="0.07" />
      {/* textura de cerdas individuales, siguiendo el abanico */}
      {BRISTLE_TIPS.map((tip, i) => {
        const bottomX = 100 + i * (200 / (BRISTLE_TIPS.length - 1))
        return (
          <line
            key={i}
            x1={bottomX} y1={140}
            x2={tip.x} y2={tip.y}
            stroke="#d8d8d8" strokeWidth="1.5"
          />
        )
      })}

      {/* virola metálica */}
      <rect x="93" y="145" width="214" height="30" rx="3" fill={metalColor} />
      <rect x="93" y="154" width="214" height="2.5" fill="#8f8f8f" />
      <rect x="93" y="163" width="214" height="2.5" fill="#8f8f8f" />
      <rect x="96" y="147" width="208" height="3" rx="1.5" fill="#e8e8e8" opacity="0.75" />

      {/* mango de madera: cuerpo recto y ancho + cuello corto + punta redondeada */}
      <path d={HANDLE_PATH} fill={handleColor} />

      {/* brillo cilíndrico (lado iluminado), recto en el tramo ancho */}
      <rect x="136" y="182" width="9" height="102" fill="#ffffff" opacity="0.08" />
      {/* sombra cilíndrica (lado opuesto) */}
      <rect x="258" y="182" width="11" height="100" fill="#000000" opacity="0.15" />

      {/* vetas de madera, rectas en el cuerpo recto */}
      <line x1="112" y1="205" x2="288" y2="205" stroke="#000" strokeOpacity="0.12" strokeWidth="2" />
      <line x1="108" y1="245" x2="292" y2="245" stroke="#000" strokeOpacity="0.1" strokeWidth="2" />

      {/* agujero del mango */}
      {holeMode === 'fill' ? (
        <>
          <circle cx="200" cy="364" r="15" fill={holeFillColor} />
          <circle cx="200" cy="364" r="15" fill="none" stroke="#000" strokeOpacity="0.15" strokeWidth="2" />
        </>
      ) : (
        <circle cx="200" cy="364" r="15" fill="none" stroke={metalColor} strokeWidth="4" opacity="0.5" />
      )}
    </>
  )
}