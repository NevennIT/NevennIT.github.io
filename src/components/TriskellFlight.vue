<script setup>
import { onMounted, onBeforeUnmount, ref, shallowRef, nextTick } from 'vue'
import { TRISKELL } from '../lib/triskell'
import { shatter, meshPath } from '../lib/triskell-shards'
import { reducedMotion, finePointer } from '../lib/motion'
import { VOLUME_LAYERS } from './TriskellLogo.vue'
import '../styles/triskell-flight.css'

/* Triskell qui suit la page : une seule couche fixe, pilotée par une seule boucle rAF lisant scrollY.
   Chronologie (positions des sections, mesurées au redimensionnement seulement) :
   - accueil        : logo plein en volume posé sur son emplacement, tilt souris, tiers de tour à la sortie ;
   - toute la page  : derrière les sections, il traverse l'écran de gauche à droite sur une courbe en huit,
                      pleine taille au centre, en culbutant sur les trois axes ;
   - entrée projets : explosion brève et violente en éclats de Voronoï (souffle, onde de choc, secousse),
                      puis recomposition un écran plus loin ;
   - projets→contact : court glitch VHS, au creux duquel le logo passe en fil de fer (contour + maillage) ;
   - pied de page   : il se pose au centre, à la taille de l'accueil, se remplit à nouveau et fait un dernier tiers de tour. */

const WIRES = [0, 1, 2, 3]
const SLICES = [0, 1, 2]

const el = ref(null)
const shards = shallowRef([])
const mesh = ref('')

const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v)
const lerp = (a, b, t) => a + (b - a) * t
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a || 1)); return t * t * (3 - 2 * t) }
const bump = (a, b, v) => (v <= a || v >= b ? 0 : Math.sin(((v - a) / (b - a)) * Math.PI))
const DEG = Math.PI / 180

// Écritures de style seulement quand la valeur change.
const cache = new WeakMap()
function put(node, key, val) {
  let c = cache.get(node)
  if (!c) cache.set(node, (c = {}))
  if (c[key] === val) return
  c[key] = val
  if (key.charCodeAt(0) === 45) node.style.setProperty(key, val)
  else node.style[key] = val
}
function flag(node, cls, on) {
  if (node.__nvOn === on) return
  node.__nvOn = on
  node.classList.toggle(cls, on)
}

const M = { vw: 0, vh: 0, base: 128, home: 128, heroH: 1, projBottom: 0, contactTop: 0, contactEnd: 0, footTop: 0, maxScroll: 1, compact: false }
const K = {}
let nodes = null, slot = null, sections = {}
let raf = 0, timer = 0, idle = 0, ro = null

function measure() {
  if (!el.value) return
  const y = scrollY, de = document.documentElement
  const top = (n) => n.getBoundingClientRect().top + y
  const { hero, projets, contact, footer } = sections
  M.vw = innerWidth; M.vh = innerHeight
  M.compact = M.vw < 768
  M.base = el.value.offsetWidth || 128
  M.home = (slot && slot.offsetWidth) || 128
  M.heroH = hero ? hero.offsetHeight || M.vh : M.vh
  M.projBottom = projets ? top(projets) + projets.offsetHeight : M.heroH + M.vh
  M.contactTop = contact ? top(contact) : M.projBottom
  M.footTop = footer ? top(footer) : de.scrollHeight
  const form = contact && contact.querySelector('.nv-contact')
  M.contactEnd = form ? top(form) + form.offsetHeight : M.footTop - 160
  M.maxScroll = Math.max(1, de.scrollHeight - M.vh)

  // Repères de la chronologie, en scrollY, toujours dans l'ordre même si une section est courte.
  const vh = M.vh, H = M.heroH
  K.d0 = 0.03 * H; K.d1 = 0.6 * H
  // Explosion courte : éclatement sur 0,22 écran, brisé ~0,5 écran, recomposé sur 0,3 écran.
  K.e0 = 0.45 * H; K.e1 = K.e0 + 0.22 * vh
  K.r0 = K.e1 + 0.5 * vh; K.r1 = K.r0 + 0.3 * vh
  K.g0 = Math.max(M.contactTop - 0.85 * vh, K.r1 + 0.05 * vh)
  K.g1 = K.g0 + 0.56 * vh
  K.gm = (K.g0 + K.g1) / 2
  K.f0 = Math.max(M.footTop - vh, K.g1 + 0.05 * vh)
  K.f1 = Math.max(lerp(K.f0, M.maxScroll, 0.7), K.f0 + 1)
}

// Trajectoire à travers la page : courbe en huit (Lissajous 1:2) de bord à bord, ~1,25 écran par traversée.
// Pleine taille au centre de l'écran, moitié sur les bords ; renvoie aussi l'inclinaison (bank, deg) dans les virages.
const EDGE = 0.5
function course(S, y, fp) {
  const { vw, vh, base, compact } = M
  const t = (Math.max(0, S - K.d0) / vh) * Math.PI * 0.8
  const margin = (base * EDGE) / 2 + (compact ? 8 : 32)
  let x = vw / 2 + (vw / 2 - margin) * Math.sin(t)
  let yy = vh * 0.5 + vh * (compact ? 0.24 : 0.2) * Math.sin(2 * t)
  let s = lerp(EDGE, 1, Math.cos(t) ** 2)
  let bank = Math.cos(t) * 26
  // Pied de page : il se pose au centre, à la taille de l'accueil, entre le formulaire et le filet du pied de page.
  if (fp > 0) {
    // Taille de l'accueil, réduite seulement si l'espace sous le formulaire est plus court (mobile).
    const rest = Math.max(48, Math.min(M.home, M.footTop - M.contactEnd - 24)) / base
    x = lerp(x, vw / 2, fp)
    yy = lerp(yy, (M.contactEnd + M.footTop) / 2 - y, fp)
    s = lerp(s, rest, fp)
    bank *= 1 - fp
  }
  yy = Math.min(yy, M.footTop - y - 32 - (base * s) / 2)
  return { x, y: yy, s, bank }
}

// État animé (lissé)
const st = {
  s: 0, last: 0,
  tx: 0, ty: 0, cx: 0, cy: 0,
  gNext: 0, gj: 0, gy: 0, gm: 0, slices: SLICES.map(() => ({ on: false, clip: '', shift: 0 })),
  shardsLive: false,
  // Souffle de l'explosion et claquement de la recomposition : déclenchés au franchissement, puis amortis dans le temps.
  eWas: 0, burst: -1e9, snap: -1e9, sx: 0, sy: 0,
}
const BURST_MS = 950, SNAP_MS = 520
const decay = (now, at, dur) => { const k = (now - at) / dur; return k >= 0 && k < 1 ? (1 - k) * (1 - k) : 0 }

function reroll() {
  st.gj = Math.random()
  st.gy = (Math.random() - 0.5) * 2
  st.gm = (Math.random() - 0.5) * 2
  for (const sl of st.slices) {
    sl.on = Math.random() < 0.7
    const top = Math.random() * 86, h = 3 + Math.random() * 11
    sl.clip = `inset(${top.toFixed(1)}% -40% ${(100 - top - h).toFixed(1)}% -40%)`
    sl.shift = (Math.random() - 0.5) * 2
  }
}

function collect() {
  const root = el.value
  if (!root) return
  const q = (s) => root.querySelector(s)
  nodes = {
    body: q('.nv-flight__body'),
    vol: q('.nv-flight__vol'),
    flash: q('.nv-flight__flash'),
    shardsBox: q('.nv-flight__shards'),
    wire: q('.nv-flight__wire'),
    glitch: [...root.querySelectorAll('.nv-flight__glitch')],
    ghostIon: q('.nv-glitch__ghost--ion'),
    ghostFlare: q('.nv-glitch__ghost--flare'),
    ring: q('.nv-flight__ring'),
    slices: [...root.querySelectorAll('.nv-glitch__slice')],
    imgs: [...root.querySelectorAll('.nv-glitch__img')],
    scan: q('.nv-glitch__scan'),
    shards: [...root.querySelectorAll('.nv-shard')].map((n, i) => ({ n, edge: n.querySelector('.nv-shard__edge'), d: shards.value[i] })),
  }
}

function frame(now) {
  raf = requestAnimationFrame(frame)
  if (!nodes || !nodes.body) return
  const dt = st.last ? Math.min(now - st.last, 64) : 16.7
  st.last = now
  const y = scrollY, f = dt / 16.7

  // Défilement lissé pour la chronologie ; tilt lissé comme v-tilt.
  st.s += (y - st.s) * (1 - Math.pow(0.86, f))
  if (Math.abs(y - st.s) < 0.3) st.s = y
  st.cx += (st.tx - st.cx) * (1 - Math.pow(0.9, f))
  st.cy += (st.ty - st.cy) * (1 - Math.pow(0.9, f))
  const S = st.s, vh = M.vh

  const heroExit = clamp(S / M.heroH)
  const d = smooth(K.d0, K.d1, S)
  const e = smooth(K.e0, K.e1, S) * (1 - smooth(K.r0, K.r1, S))
  const g = bump(K.g0, K.g1, S)
  const wUp = smooth(K.gm - 0.05 * vh, K.gm + 0.05 * vh, S)
  const fp = smooth(K.f0, K.f1, S)
  const w = wUp * (1 - fp)

  // Explosion : souffle au franchissement du seuil, claquement quand les éclats se ressoudent.
  if (e > 0.02 && st.eWas <= 0.02) st.burst = now
  if (e <= 0.02 && st.eWas > 0.02) st.snap = now
  st.eWas = e
  const b = decay(now, st.burst, BURST_MS), sn = decay(now, st.snap, SNAP_MS)
  if (b > 0.02) { st.sx = (Math.random() - 0.5) * 14 * b; st.sy = (Math.random() - 0.5) * 14 * b } else { st.sx = st.sy = 0 }

  // Position : de l'emplacement de l'accueil (lu en direct tant qu'il compte) vers la courbe qui traverse la page.
  const to = course(S, y, fp)
  let x = to.x, yy = to.y, s = to.s
  if (d < 1 && slot) {
    const r = slot.getBoundingClientRect()
    const as = r.width / M.base
    x = lerp(r.left + r.width / 2, to.x, Math.pow(d, 0.8))
    yy = lerp(r.top + r.height / 2, to.y, Math.pow(d, 1.3))
    s = lerp(as, to.s, d)
  }
  const half = M.base / 2
  put(el.value, 'transform', `translate3d(${(x - half + st.sx).toFixed(1)}px,${(yy - half + st.sy).toFixed(1)}px,0) scale(${s.toFixed(4)})`)
  put(el.value, 'opacity', '1')

  // Orientation : rotation lente (40 s par tour), tiers de tour en quittant l'accueil puis dans le pied de page,
  // inclinaison dans les virages et, pendant la traversée, culbute sur les trois axes (oscillations amples
  // sans saut, qui s'éteignent dans l'accueil et au repos du pied de page ; le temps les fait dériver à l'arrêt).
  const tiltMax = lerp(28, 14, d)
  const m = d * (1 - fp), T = Math.max(0, S - K.d0) / vh
  const rx = -st.cy * tiltMax + Math.sin(T * 1.9 + now * 0.0004) * 55 * m
  const ry = st.cx * tiltMax + to.bank * d + Math.sin(T * 1.15 + 0.6 + now * 0.00027) * 165 * m
  const angle = (now * 0.009) % 360 + heroExit * 120 + fp * 120 + Math.sin(T * 0.7) * 150 * m
  const orient = `translateZ(var(--lift-2)) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${angle.toFixed(2)}deg)`
  const jx = g > 0 ? st.gm * g * 3 : 0
  put(nodes.body, 'transform', `translate3d(${jx.toFixed(2)}px,0,0) ${orient}`)

  // Onde de choc : un anneau flare qui s'élargit et s'éteint au moment de l'explosion.
  if (nodes.ring) {
    const k = clamp((now - st.burst) / BURST_MS)
    put(nodes.ring, 'opacity', (b * 0.9).toFixed(3))
    put(nodes.ring, 'transform', `scale(${(0.35 + (1 - Math.pow(1 - k, 3)) * 2.6).toFixed(3)})`)
  }

  // Volume plein ↔ éclats ↔ fil de fer
  put(nodes.vol, '--nv-vol', ((1 - smooth(0, 0.05, e)) * (1 - w)).toFixed(3))
  put(nodes.wire, '--nv-wire', w.toFixed(3))
  flag(nodes.wire, 'is-on', w > 0.001)

  // Éclat de lumière : au début de l'explosion, à la fin de la recomposition, et au retour au plein.
  const flash = Math.max(b, sn * 0.75, e < 0.35 ? Math.sin((e / 0.35) * Math.PI) * 0.6 : 0, Math.sin(fp * Math.PI) * 0.5 * wUp)
  put(nodes.flash, 'opacity', flash.toFixed(3))
  put(nodes.flash, 'transform', `scale(${(0.7 + flash * 0.5 + b * 0.9).toFixed(3)})`)

  // Éclats de Voronoï : translation + rotation 3D par éclat, orbite lente autour de l'axe vertical du logo.
  if (nodes.shards.length && (e > 0.0005 || st.shardsLive)) {
    st.shardsLive = e > 0.0005
    put(nodes.shardsBox, '--nv-shard', smooth(0, 0.02, e).toFixed(3))
    // Le souffle projette les éclats au-delà de leur position, puis ils retombent sur leur orbite.
    const B = M.base, sp = e * (2 - e) * (1 + b * 0.9)
    const th = now * 0.00015 + S * 0.0005, c = Math.cos(th), sn = Math.sin(th)
    for (const sh of nodes.shards) {
      const p = sh.d
      if (!st.shardsLive) {
        put(sh.n, 'transform', 'none')
        put(sh.edge, 'opacity', '0')
        continue
      }
      const ox = p.vx * B, oz = p.vz * B
      const X = (ox * c - oz * sn) * sp
      const Z = (ox * sn + oz * c) * sp
      const Y = p.vy * B * sp + Math.sin(now * 0.0011 * p.sp + p.ph) * B * 0.025 * e
      const turn = p.turn * sp + p.turn * b * 1.4 + Math.sin(now * 0.0007 * p.sp + p.ph) * 14 * e
      put(sh.n, 'transform', `translate3d(${X.toFixed(1)}px,${Y.toFixed(1)}px,${Z.toFixed(1)}px) rotate3d(${p.ax},${p.ay},${p.az},${turn.toFixed(1)}deg)`)
      put(sh.edge, 'opacity', Math.min(1, e * (0.25 + 0.75 * Math.abs(Math.sin(turn * DEG + p.ph))) + b * 0.8).toFixed(3))
    }
  }

  // Glitch VHS : intensité g (bosse sur un court passage), tirages aléatoires toutes les 60 à 170 ms.
  if (nodes.glitch.length) {
    const on = g > 0.002
    for (const gl of nodes.glitch) flag(gl, 'is-on', on)
    if (on) {
      if (now >= st.gNext) { st.gNext = now + 60 + Math.random() * 110; reroll() }
      for (const gl of nodes.glitch) put(gl, '--nv-w', w.toFixed(3))
      for (const img of nodes.imgs) put(img, 'transform', orient)
      const dx = g * (1.5 + 3 * st.gj), dy = st.gy * g
      put(nodes.ghostIon, 'transform', `translate3d(${(-dx).toFixed(2)}px,${dy.toFixed(2)}px,0)`)
      put(nodes.ghostFlare, 'transform', `translate3d(${dx.toFixed(2)}px,${(-dy).toFixed(2)}px,0)`)
      put(nodes.ghostIon, 'opacity', (g * 0.85).toFixed(3))
      put(nodes.ghostFlare, 'opacity', (g * 0.7).toFixed(3))
      nodes.slices.forEach((n, i) => {
        const sl = st.slices[i]
        put(n, 'clipPath', sl.clip)
        put(n, 'transform', `translate3d(${(sl.shift * g * 10).toFixed(1)}px,0,0)`)
        put(n, 'opacity', sl.on ? g.toFixed(3) : '0')
      })
      put(nodes.scan, 'opacity', (g * 0.45).toFixed(3))
    }
  }
}

function onPointer(e) {
  st.tx = (e.clientX / innerWidth) * 2 - 1
  st.ty = (e.clientY / innerHeight) * 2 - 1
}
function onLeave() { st.tx = 0; st.ty = 0 }

// Mouvement réduit : logo statique rangé à droite, affiché hors de l'accueil et du pied de page.
function onStatic() {
  const y = scrollY
  el.value.classList.toggle('is-shown', y > M.heroH * 0.6 && y + M.vh < M.footTop + 40)
}

function buildShards() {
  const list = shatter(M.compact || !finePointer ? 12 : 22)
  shards.value = list
  mesh.value = meshPath(list)
  nextTick(collect)
}

onMounted(() => {
  sections = {
    hero: document.getElementById('accueil'),
    projets: document.getElementById('projets'),
    contact: document.getElementById('contact'),
    footer: document.querySelector('.nv-footer'),
  }
  slot = document.querySelector('[data-nv-triskell-slot]')
  measure()
  addEventListener('resize', measure)
  ro = new ResizeObserver(() => measure())
  ro.observe(document.body)

  if (reducedMotion) {
    addEventListener('scroll', onStatic, { passive: true })
    onStatic()
    return
  }
  if (finePointer) {
    addEventListener('pointermove', onPointer, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
  }
  collect()
  // Éclats calculés hors du premier rendu (ils ne servent qu'après l'accueil).
  idle = 'requestIdleCallback' in window ? requestIdleCallback(buildShards, { timeout: 600 }) : setTimeout(buildShards, 200)
  // Démarrage après Lenis : sa boucle défile d'abord, la nôtre lit ensuite la position à jour (pas de décalage d'une image).
  timer = setTimeout(() => {
    st.s = scrollY
    raf = requestAnimationFrame(frame)
  }, 0)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  clearTimeout(timer)
  if ('cancelIdleCallback' in window) cancelIdleCallback(idle)
  clearTimeout(idle)
  if (ro) ro.disconnect()
  removeEventListener('resize', measure)
  removeEventListener('scroll', onStatic)
  removeEventListener('pointermove', onPointer)
  document.documentElement.removeEventListener('pointerleave', onLeave)
})
</script>

<template>
  <div ref="el" class="nv-flight" :class="{ 'is-static': reducedMotion }" aria-hidden="true">
    <svg class="nv-flight__defs" width="0" height="0" focusable="false">
      <defs>
        <clipPath id="nv-tri-clip"><path :d="TRISKELL.d" :transform="TRISKELL.transform" /></clipPath>
      </defs>
    </svg>

    <div v-if="!reducedMotion" class="nv-flight__flash" />
    <div v-if="!reducedMotion" class="nv-flight__ring" />

    <!-- Glitch, dessous : copies teintées décalées, visibles seulement en liseré autour du logo (décalage RGB). -->
    <div v-if="!reducedMotion" class="nv-flight__glitch">
      <div class="nv-glitch__ghost nv-glitch__ghost--ion">
        <svg class="nv-glitch__img" :viewBox="TRISKELL.viewBox">
          <g :transform="TRISKELL.transform"><path class="nv-glitch__fill" :d="TRISKELL.d" /><path class="nv-glitch__line" :d="TRISKELL.d" /></g>
        </svg>
      </div>
      <div class="nv-glitch__ghost nv-glitch__ghost--flare">
        <svg class="nv-glitch__img" :viewBox="TRISKELL.viewBox">
          <g :transform="TRISKELL.transform"><path class="nv-glitch__fill" :d="TRISKELL.d" /><path class="nv-glitch__line" :d="TRISKELL.d" /></g>
        </svg>
      </div>
    </div>

    <div class="nv-triskell nv-flight__body">
      <div class="nv-flight__vol">
        <svg
          v-for="layer in VOLUME_LAYERS"
          :key="layer.i"
          class="nv-triskell__layer"
          :viewBox="TRISKELL.viewBox"
          :style="{ '--i': layer.i, fill: layer.fill }"
        >
          <g :transform="TRISKELL.transform"><path :d="TRISKELL.d" /></g>
        </svg>
      </div>

      <template v-if="!reducedMotion">
        <div class="nv-flight__shards">
          <div v-for="(s, i) in shards" :key="i" class="nv-shard" :style="{ transformOrigin: `${s.ox} ${s.oy}` }">
            <svg class="nv-shard__fill" :viewBox="TRISKELL.viewBox"><polygon :points="s.points" clip-path="url(#nv-tri-clip)" /></svg>
            <svg class="nv-shard__edge" :viewBox="TRISKELL.viewBox"><polygon :points="s.points" clip-path="url(#nv-tri-clip)" /></svg>
          </div>
        </div>

        <div class="nv-flight__wire">
          <svg v-for="k in WIRES" :key="k" class="nv-wire" :viewBox="TRISKELL.viewBox" :style="{ '--k': k }">
            <!-- Toujours rendu (d vide au départ) : inséré plus tard, Vue le créerait hors de l'espace de noms SVG. -->
            <path v-if="k === 0" class="nv-wire__mesh" :d="mesh" clip-path="url(#nv-tri-clip)" />
            <g :transform="TRISKELL.transform"><path class="nv-wire__line" :d="TRISKELL.d" /></g>
          </svg>
        </div>
      </template>
    </div>

    <!-- Glitch, dessus : tranches horizontales qui glissent et lignes de balayage. -->
    <div v-if="!reducedMotion" class="nv-flight__glitch">
      <div v-for="k in SLICES" :key="k" class="nv-glitch__slice">
        <svg class="nv-glitch__img" :viewBox="TRISKELL.viewBox">
          <g :transform="TRISKELL.transform"><path class="nv-glitch__fill" :d="TRISKELL.d" /><path class="nv-glitch__line" :d="TRISKELL.d" /></g>
        </svg>
      </div>
      <div class="nv-glitch__scan" />
    </div>
  </div>
</template>
