// Éclats du triskell : cellules de Voronoï semées dans le tracé (jamais redessiné : TRISKELL.d sert de test et de découpe).
// Coordonnées dans la viewBox du logo ; les vecteurs d'explosion sont en fractions de la taille du logo.
import { TRISKELL } from './triskell'
import { rng, voronoi, bestCandidates, nearest } from './voronoi'

const [bx, by, bw, bh] = TRISKELL.viewBox.split(/[\s,]+/).map(Number)
export const BOX = { x: bx, y: by, w: bw, h: bh }

// Test « point dans le tracé » via Path2D (même matrice que le rendu) ; sans support, toute la boîte compte.
function insideTest() {
  try {
    const m = TRISKELL.transform.match(/-?\d*\.?\d+(?:e-?\d+)?/gi).map(Number)
    const path = new Path2D()
    path.addPath(new Path2D(TRISKELL.d), new DOMMatrix(m))
    const ctx = document.createElement('canvas').getContext('2d')
    if (!ctx) throw new Error('canvas')
    return (x, y) => ctx.isPointInPath(path, x, y)
  } catch (e) {
    return () => true
  }
}

const f = (v) => v.toFixed(1)

export function shatter(count = 22, seed = 7) {
  const inside = insideTest(), random = rng(seed)
  const step = 8, pts = []
  for (let y = BOX.y + step / 2; y < BOX.y + BOX.h; y += step)
    for (let x = BOX.x + step / 2; x < BOX.x + BOX.w; x += step)
      if (inside(x, y)) pts.push([x, y])

  const sites = bestCandidates(pts, count, random)
  const cells = voronoi(sites, BOX)

  // Centre de masse de la partie visible de chaque éclat (cellule ∩ tracé), par échantillonnage.
  const acc = sites.map(() => [0, 0, 0])
  for (const p of pts) {
    const a = acc[nearest(sites, p[0], p[1])]
    a[0] += p[0]; a[1] += p[1]; a[2]++
  }

  const cx = BOX.x + BOX.w / 2, cy = BOX.y + BOX.h / 2
  return cells.map((cell, i) => {
    const a = acc[i]
    const gx = a[2] ? a[0] / a[2] : sites[i][0], gy = a[2] ? a[1] / a[2] : sites[i][1]
    const dx = (gx - cx) / BOX.w, dy = (gy - cy) / BOX.h
    const len = Math.hypot(dx, dy)
    // Direction : vers l'extérieur depuis le centre de symétrie, un peu déviée.
    const dir = Math.atan2(dy, dx) + (random() - 0.5) * 0.7
    const dist = (0.12 + random() * 0.22) * (0.7 + len)
    // Axe de rotation surtout hors du plan… mais pas trop : l'éclat ne doit jamais se présenter par la tranche.
    let ax = (random() * 2 - 1) * 0.55, ay = (random() * 2 - 1) * 0.55, az = random() < 0.5 ? -1 : 1
    const al = Math.hypot(ax, ay, az) || 1
    return {
      points: cell.map((p) => f(p[0]) + ',' + f(p[1])).join(' '),
      cell,
      ox: (((gx - BOX.x) / BOX.w) * 100).toFixed(2) + '%',
      oy: (((gy - BOX.y) / BOX.h) * 100).toFixed(2) + '%',
      vx: Math.cos(dir) * dist,
      vy: Math.sin(dir) * dist,
      vz: random() * 0.6 - 0.2,
      ax: +(ax / al).toFixed(3), ay: +(ay / al).toFixed(3), az: +(az / al).toFixed(3),
      turn: (random() < 0.5 ? -1 : 1) * (30 + random() * 50),
      ph: random() * Math.PI * 2,
      sp: 0.6 + random() * 0.8,
    }
  })
}

// Maillage des cellules en un seul tracé (mode fil de fer).
export function meshPath(shards) {
  return shards.map((s) => 'M' + s.cell.map((p) => f(p[0]) + ' ' + f(p[1])).join('L') + 'Z').join('')
}
