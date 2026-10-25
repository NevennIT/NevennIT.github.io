// Voronoï maison, sans dépendance : chaque cellule est l'intersection des demi-plans « plus proche de mon site ».
// En O(n²) : prévu pour quelques dizaines de sites (éclats du triskell), calculé une seule fois.

// Générateur pseudo-aléatoire déterministe (mulberry32) : mêmes éclats à chaque visite.
export function rng(seed = 1) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Garde la partie du polygone où nx·x + ny·y <= c (Sutherland–Hodgman sur un seul bord).
function clipHalfPlane(poly, nx, ny, c) {
  const out = []
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length]
    const dp = nx * p[0] + ny * p[1] - c, dq = nx * q[0] + ny * q[1] - c
    if (dp <= 0) out.push(p)
    if ((dp < 0 && dq > 0) || (dp > 0 && dq < 0)) {
      const t = dp / (dp - dq)
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t])
    }
  }
  return out
}

// Cellules de Voronoï des sites dans la boîte { x, y, w, h } : un polygone [[x, y], …] par site.
export function voronoi(sites, box) {
  const frame = [[box.x, box.y], [box.x + box.w, box.y], [box.x + box.w, box.y + box.h], [box.x, box.y + box.h]]
  return sites.map((s, i) => {
    let cell = frame
    for (let j = 0; j < sites.length && cell.length; j++) {
      if (j === i) continue
      const o = sites[j], nx = o[0] - s[0], ny = o[1] - s[1]
      // Médiatrice : nx·x + ny·y = n·milieu
      cell = clipHalfPlane(cell, nx, ny, nx * (s[0] + o[0]) / 2 + ny * (s[1] + o[1]) / 2)
    }
    return cell
  })
}

// Semis « meilleur candidat » : des sites bien répartis, tirés parmi des points candidats.
export function bestCandidates(points, count, random, tries = 14) {
  const sites = []
  if (!points.length) return sites
  while (sites.length < count) {
    let best = null, bestD = -1
    for (let k = 0; k < tries; k++) {
      const p = points[Math.floor(random() * points.length)]
      let d = Infinity
      for (const s of sites) d = Math.min(d, (s[0] - p[0]) ** 2 + (s[1] - p[1]) ** 2)
      if (d > bestD) { bestD = d; best = p }
    }
    sites.push(best)
  }
  return sites
}

// Indice du site le plus proche d'un point.
export function nearest(sites, x, y) {
  let k = 0, d = Infinity
  for (let i = 0; i < sites.length; i++) {
    const dd = (sites[i][0] - x) ** 2 + (sites[i][1] - y) ** 2
    if (dd < d) { d = dd; k = i }
  }
  return k
}
