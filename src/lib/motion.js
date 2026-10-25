// Effets NevennIT : port en module ES de components/bundle.js du design system (mêmes réglages, mêmes variables CSS).
const doc = document, root = doc.documentElement, win = window
const mq = (q) => !!(win.matchMedia && win.matchMedia(q).matches)
const noop = () => {}
const TAU = Math.PI * 2

export const reducedMotion = mq('(prefers-reduced-motion: reduce)')
export const finePointer = mq('(hover: hover) and (pointer: fine)')

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const lerp = (a, b, t) => a + (b - a) * t
export const cssVar = (name, el) => getComputedStyle(el || root).getPropertyValue(name).trim()
export const num = (name, fallback, el) => {
  const v = parseFloat(cssVar(name, el))
  return isNaN(v) ? fallback : v
}
export function onThemeChange(fn) {
  const mo = new MutationObserver(fn)
  mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
  return () => mo.disconnect()
}

/* Inclinaison 3D : écrit --rx --ry (deg) et --gx --gy (%) sur l'élément ; le CSS fait le reste.
   track 'self' : survol de l'élément (cartes) ; 'window' : toute la fenêtre (scène de l'accueil). */
export function tilt(el, o = {}) {
  if (reducedMotion || !finePointer) return noop
  const track = o.track || 'self'
  const max = o.max != null ? o.max : track === 'window' ? 6 : num('--tilt-max', 10, el)
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0
  function frame() {
    cx = lerp(cx, tx, 0.1)
    cy = lerp(cy, ty, 0.1)
    const s = el.style
    s.setProperty('--rx', (-cy * max).toFixed(2) + 'deg')
    s.setProperty('--ry', (cx * max).toFixed(2) + 'deg')
    s.setProperty('--gx', ((cx + 1) * 50).toFixed(1) + '%')
    s.setProperty('--gy', ((cy + 1) * 50).toFixed(1) + '%')
    raf = Math.abs(cx - tx) + Math.abs(cy - ty) > 0.0005 ? requestAnimationFrame(frame) : 0
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame) }
  function move(e) {
    if (track === 'window') {
      tx = (e.clientX / win.innerWidth) * 2 - 1
      ty = (e.clientY / win.innerHeight) * 2 - 1
    } else {
      const r = el.getBoundingClientRect()
      tx = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1)
      ty = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1)
      el.classList.add('is-tilting')
    }
    kick()
  }
  function leave() { tx = 0; ty = 0; el.classList.remove('is-tilting'); kick() }
  const target = track === 'window' ? root : el
  target.addEventListener('pointermove', move)
  target.addEventListener('pointerleave', leave)
  return () => {
    target.removeEventListener('pointermove', move)
    target.removeEventListener('pointerleave', leave)
    cancelAnimationFrame(raf)
  }
}

/* Aimant : l'élément suit le pointeur (--mx --my en px) ; le retour élastique est une transition CSS. */
export function magnetic(el, o = {}) {
  if (reducedMotion || !finePointer) return noop
  const strength = o.strength != null ? o.strength : 0.3
  function move(e) {
    if (el.disabled || el.getAttribute('aria-disabled') === 'true') return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', ((e.clientX - r.left - r.width / 2) * strength).toFixed(1) + 'px')
    el.style.setProperty('--my', ((e.clientY - r.top - r.height / 2) * strength).toFixed(1) + 'px')
  }
  function leave() { el.style.setProperty('--mx', '0px'); el.style.setProperty('--my', '0px') }
  el.addEventListener('pointermove', move)
  el.addEventListener('pointerleave', leave)
  return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
}

/* Progression de défilement : --p de 0 à 1 sur l'élément.
   'exit' : pendant qu'il quitte l'écran par le haut (accueil) ; 'enter' : pendant qu'il entre par le bas (pied de page) ;
   'through' : de son entrée à sa sortie. */
let tracked = [], scheduled = false
function updateProgress() {
  scheduled = false
  const vh = win.innerHeight
  for (const t of tracked) {
    const r = t.el.getBoundingClientRect()
    const p = t.mode === 'through' ? (vh - r.top) / (vh + r.height) : t.mode === 'enter' ? (vh - r.top) / r.height : -r.top / r.height
    t.el.style.setProperty('--p', clamp(p, 0, 1).toFixed(4))
  }
}
function schedule() { if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress) } }
export function progress(el, mode) {
  if (reducedMotion) return noop
  if (!tracked.length) {
    win.addEventListener('scroll', schedule, { passive: true })
    win.addEventListener('resize', schedule)
  }
  tracked.push({ el, mode: mode || 'exit' })
  schedule()
  return () => {
    tracked = tracked.filter((t) => t.el !== el)
    if (!tracked.length) {
      win.removeEventListener('scroll', schedule)
      win.removeEventListener('resize', schedule)
    }
  }
}

/* Scène de particules 3D (Canvas 2D) : sphère de Fibonacci qui respire, tourne, suit le pointeur,
   s'écarte autour de lui, et se disperse avec le défilement. Couleurs lues dans les tokens. */
export function particles(canvas, o = {}) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return { setProgress: noop, destroy: noop }
  const count = o.count || (finePointer ? 900 : 420)
  const host = o.host || canvas.parentElement
  const spin = o.spin != null ? o.spin : 0.0016
  const pts = []
  let colors = [], w = 0, h = 0, R = 0
  let yaw = 0, yawOff = 0, pitch = 0.35, nx = 0, ny = 0
  let mx = -1e4, my = -1e4, smx = -1e4, smy = -1e4
  let prog = 0, tProg = 0, manual = false, raf = 0, last = 0, visible = true, alive = true
  const golden = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2, ring = Math.sqrt(1 - y * y), th = golden * i, roll = Math.random()
    pts.push({
      x: Math.cos(th) * ring, y, z: Math.sin(th) * ring,
      k: 0.86 + Math.random() * 0.28,
      s: 1 + Math.random() * 2.4,
      c: roll < 0.06 ? 1 : roll < 0.1 ? 2 : 0,
      ph: Math.random() * TAU,
    })
  }

  function readColors() {
    colors = [cssVar('--ink-faint', canvas) || '#5c6068', cssVar('--flare', canvas) || '#ff5a1f', cssVar('--ion', canvas) || '#3ad6ff']
    if (reducedMotion) render(0)
  }
  function resize() {
    const r = canvas.getBoundingClientRect(), dpr = Math.min(win.devicePixelRatio || 1, 2)
    w = r.width; h = r.height
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    R = Math.min(w, h) * (o.radius || 0.34)
    if (reducedMotion) render(0)
  }

  function project(x, y, z, cyw, syw, cp, sp, D) {
    const x1 = x * cyw - z * syw, z1 = x * syw + z * cyw
    const y1 = y * cp - z1 * sp, z2 = y * sp + z1 * cp
    const dz = D + z2
    if (dz < D * 0.2) return null
    const sc = D / dz
    return { x: x1 * sc, y: y1 * sc, z: z2, s: sc }
  }

  function render(time) {
    ctx.clearRect(0, 0, w, h)
    if (!R) return
    const a = yaw + yawOff, cyw = Math.cos(a), syw = Math.sin(a), cp = Math.cos(pitch), sp = Math.sin(pitch)
    const D = R * 3, ox = w * (o.x != null ? o.x : 0.5), oy = h * (o.y != null ? o.y : 0.5)
    const fade = 1 - prog * 0.85, breathe = time * 0.0006
    let q

    for (let c = 0; c < 3; c++) {
      ctx.fillStyle = colors[c]
      for (const p of pts) {
        if (p.c !== c) continue
        const k = p.k * (1 + Math.sin(breathe + p.ph) * 0.025) * (1 + prog * p.s) * R
        q = project(p.x * k, p.y * k, p.z * k, cyw, syw, cp, sp, D)
        if (!q) continue
        let sx = ox + q.x, sy = oy + q.y
        const dx = sx - smx, dy = sy - smy, d2 = dx * dx + dy * dy
        if (d2 < 8100) {
          const d = Math.sqrt(d2) || 1, push = (1 - d / 90) * 28
          sx += (dx / d) * push; sy += (dy / d) * push
        }
        ctx.globalAlpha = clamp(0.2 + 0.8 * (0.5 - q.z / (2 * R)), 0.06, 1) * fade
        ctx.beginPath()
        ctx.arc(sx, sy, (c ? 1.6 : 1.1) * q.s, 0, TAU)
        ctx.fill()
      }
    }

    /* Orbite ion, plus claire devant la sphère, et son satellite flare. */
    const tiltRing = 0.42, cr = Math.cos(tiltRing), sr = Math.sin(tiltRing), RR = R * 1.45 * (1 + prog * 1.2)
    let prev = null
    const seg = 96
    ctx.strokeStyle = colors[2]
    ctx.lineWidth = 1
    for (let i = 0; i <= seg; i++) {
      const ang = (i / seg) * TAU, rx = Math.cos(ang) * RR, rz = Math.sin(ang) * RR
      q = project(rx, -rz * sr, rz * cr, cyw, syw, cp, sp, D)
      if (q && prev) {
        ctx.globalAlpha = (q.z < 0 ? 0.5 : 0.14) * fade
        ctx.beginPath(); ctx.moveTo(ox + prev.x, oy + prev.y); ctx.lineTo(ox + q.x, oy + q.y); ctx.stroke()
      }
      prev = q
    }
    const sat = time * 0.00035
    q = project(Math.cos(sat) * RR, -Math.sin(sat) * RR * sr, Math.sin(sat) * RR * cr, cyw, syw, cp, sp, D)
    if (q) {
      ctx.globalAlpha = (q.z < 0 ? 1 : 0.35) * fade
      ctx.fillStyle = colors[1]
      ctx.shadowColor = colors[1]
      ctx.shadowBlur = 14
      ctx.beginPath(); ctx.arc(ox + q.x, oy + q.y, 3.2 * q.s, 0, TAU); ctx.fill()
      ctx.shadowBlur = 0
    }
    ctx.globalAlpha = 1
  }

  function loop(time) {
    raf = 0
    if (!alive || !visible || doc.hidden) return
    const dt = last ? Math.min(time - last, 50) : 16.7
    last = time
    yaw += (spin * dt) / 16.7
    yawOff = lerp(yawOff, nx * 0.6, 0.05)
    pitch = lerp(pitch, 0.35 + ny * 0.35, 0.05)
    smx = lerp(smx, mx, 0.2); smy = lerp(smy, my, 0.2)
    if (o.scroll && !manual && host) {
      const hr = host.getBoundingClientRect()
      tProg = clamp(-hr.top / (hr.height || 1), 0, 1)
    }
    prog = lerp(prog, tProg, 0.08)
    render(time)
    raf = requestAnimationFrame(loop)
  }
  const kick = () => { if (!raf && alive && !reducedMotion) { last = 0; raf = requestAnimationFrame(loop) } }

  function pointer(e) {
    const r = canvas.getBoundingClientRect()
    mx = e.clientX - r.left; my = e.clientY - r.top
    nx = (e.clientX / win.innerWidth) * 2 - 1; ny = (e.clientY / win.innerHeight) * 2 - 1
  }
  function away() { mx = my = -1e4; nx = ny = 0 }

  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  const io = 'IntersectionObserver' in win
    ? new IntersectionObserver((en) => { visible = en[0].isIntersecting; if (visible) kick() })
    : null
  if (io) io.observe(canvas)
  const offTheme = onThemeChange(readColors)
  if (finePointer && !reducedMotion) {
    win.addEventListener('pointermove', pointer, { passive: true })
    root.addEventListener('pointerleave', away)
  }
  doc.addEventListener('visibilitychange', kick)
  readColors()
  resize()
  if (reducedMotion) render(0)
  else kick()

  return {
    setProgress(v) { manual = true; tProg = clamp(v, 0, 1); if (reducedMotion) { prog = tProg; render(0) } else kick() },
    destroy() {
      alive = false; cancelAnimationFrame(raf); ro.disconnect(); if (io) io.disconnect(); offTheme()
      win.removeEventListener('pointermove', pointer); root.removeEventListener('pointerleave', away)
      doc.removeEventListener('visibilitychange', kick)
    },
  }
}
