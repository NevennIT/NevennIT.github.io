<script setup>
import { ref, shallowRef, reactive, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import ProjectGallery from './ProjectGallery.vue'
import ProjectActions from './ProjectActions.vue'
import ProjectTabs from './ProjectTabs.vue'
import { projects } from '../data/projects'
import releaseData from '../data/releases.json'
import { t, tr } from '../i18n'
import { useProjectRoute } from '../composables/useProjectRoute'
import { getLenis } from '../composables/useSmoothScroll'
import { reducedMotion, ms, cssVar } from '../lib/motion'
import '../styles/modal.css'

// Fiche projet détaillée, ouverte par la route #/projet/<id>.
// Ouverture depuis une carte visible : la carte se transforme en fiche (FLIP en WAAPI, transform seulement) :
//   - le fond de la fiche (.nv-modal__shell) part du rectangle de la carte, rayons corrigés de l'échelle ;
//   - le média de la carte devient le média d'en-tête (doublure .nv-modal__proxy, puis le vrai média) ;
//   - le texte de la carte s'efface (copie fantôme), le contenu de la fiche apparaît ensuite en fondu.
// Fermeture : morph inverse vers la position actuelle de la carte, qui réapparaît en fondu enchaîné.
// Sans carte visible (lien direct, carte filtrée ou hors écran) : apparition en échelle et fondu ; mouvement réduit : fondu court.
const { projectId, closeProject } = useProjectRoute()

// Fiches détaillées (src/data/details/<id>.js), chargées à la demande ; fichier absent → null.
const detailFiles = import.meta.glob('../data/details/*.js', { import: 'default' })
const detailCache = new Map()
function loadDetails(id) {
  if (!detailCache.has(id)) {
    const load = detailFiles['../data/details/' + id + '.js']
    detailCache.set(id, load ? load().catch(() => null) : Promise.resolve(null))
  }
  return detailCache.get(id)
}

const root = ref(null)
const frame = ref(null)
const shell = ref(null)
const scroller = ref(null)
const closeBtn = ref(null)

const project = shallowRef(null)
const details = shallowRef(null)
const visible = ref(false)
const startSlide = ref(0)
const titleId = 'nv-modal-title'

let state = 'closed' // closed | opening | open | closing
let anims = []
let card = null
let lastFocus = null
let token = 0

/* ---------- Versions : build (releases.json) + dernière release lue en direct sur l'API publique ---------- */
const live = reactive({})
async function fetchLatest(repo) {
  if (repo in live) return
  live[repo] = null
  try {
    const res = await fetch('https://api.github.com/repos/' + repo + '/releases/latest', { headers: { Accept: 'application/vnd.github+json' } })
    if (!res.ok) return
    const r = await res.json()
    live[repo] = {
      tag: r.tag_name,
      name: r.name || r.tag_name,
      published_at: r.published_at,
      prerelease: !!r.prerelease,
      body: r.body || '',
      html_url: r.html_url,
      assets: (r.assets || []).map((a) => ({ name: a.name, size: a.size, browser_download_url: a.browser_download_url })),
    }
  } catch (e) {
    /* hors ligne ou limite de débit : on garde les données du build */
  }
}

const repos = (releaseData && releaseData.repos) || {}
const pubReleases = computed(() => {
  const repo = project.value && project.value.download && project.value.download.releases
  if (!repo) return []
  const list = repos[repo] || []
  const l = live[repo]
  if (!l) return list
  return list.some((r) => r.tag === l.tag) ? list.map((r) => (r.tag === l.tag ? l : r)) : [l, ...list]
})
const ownReleases = computed(() => (project.value && project.value.repo && repos[project.value.repo]) || [])
const latest = computed(() => pubReleases.value[0] || ownReleases.value[0] || null)
const changelog = computed(() => (ownReleases.value.length ? ownReleases.value : pubReleases.value))
const file = computed(() => {
  const p = project.value, dl = p && p.download
  if (!dl || !dl.releases) return null
  let re
  try { re = new RegExp(dl.asset || '') } catch (e) { re = /$^/ }
  for (const r of pubReleases.value) {
    const a = (r.assets || []).find((x) => re.test(x.name) && x.browser_download_url)
    if (a) return { url: a.browser_download_url, size: a.size, name: a.name, tag: r.tag }
  }
  // Pas encore de données : page des releases du dépôt public.
  return { url: 'https://github.com/' + dl.releases + '/releases/latest' }
})

/* ---------- Contenu ---------- */
const media = computed(() => {
  const p = project.value
  if (!p) return []
  const imgs = (Array.isArray(p.image) ? p.image : p.image ? [p.image] : []).filter(Boolean)
  const extra = ((details.value && details.value.media) || []).filter((m) => m && !(m.type === 'image' && imgs.includes(m.src)))
  return [...imgs.map((src) => ({ type: 'image', src })), ...extra]
})
const tagline = computed(() => (details.value && tr(details.value.tagline)) || tr(project.value && project.value.description))
const platforms = computed(() => (details.value && details.value.platforms) || [])

/* ---------- Page derrière : défilement, focus, titre ---------- */
const html = document.documentElement
function lockPage(on) {
  const lenis = getLenis()
  if (on) {
    if (lenis) lenis.stop()
    html.style.scrollbarGutter = 'stable'
    html.style.overflow = 'hidden'
  } else {
    html.style.overflow = ''
    html.style.scrollbarGutter = ''
    if (lenis) lenis.start()
  }
  // Le reste de l'appli devient inerte : ni focus ni lecteur d'écran derrière la fiche.
  const host = root.value && root.value.parentElement
  if (host) for (const el of host.children) if (el !== root.value) el.inert = on
}

watch([visible, project, () => t('meta.title')], () => {
  document.title = visible.value && project.value ? project.value.title + ' — NevennIT' : t('meta.title')
}, { flush: 'post' })

/* ---------- Carte d'origine ---------- */
function findCard(id) {
  const el = document.querySelector('.nv-card[data-project="' + CSS.escape(id) + '"]')
  if (!el || el.closest('[data-nv-reveal]:not(.is-in)')) return null
  return el
}
// Tilt neutralisé (perspective seule, comme au repos) avant toute mesure ; la carte garde ce style tant que la fiche est ouverte.
function measureCard(el) {
  el.style.transition = 'none'
  el.style.transform = 'perspective(var(--perspective))'
  const r = el.getBoundingClientRect()
  if (!r.width || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return null
  const m = el.querySelector('.nv-card__media')
  return { rect: r, media: m ? m.getBoundingClientRect() : null, radius: parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0 }
}
function releaseCard() {
  if (!card) return
  card.style.visibility = ''
  card.style.transform = ''
  card.style.transition = ''
  card = null
}
function cardSlide(el) {
  const track = el && el.querySelector('.nv-carousel__track')
  return track ? parseInt(track.style.getPropertyValue('--i'), 10) || 0 : 0
}

/* ---------- Animations ---------- */
const DUR = () => ms('--dur-3', 700)
const EASE = () => cssVar('--ease-out') || 'cubic-bezier(0.16, 1, 0.3, 1)'
function run(el, frames, opts) {
  const a = el.animate(frames, { fill: 'both', ...opts })
  anims.push(a)
  // Filet de sécurité : onglet en arrière-plan, la timeline peut geler ; on n'attend jamais plus que la durée prévue.
  const max = (opts.duration || 0) + (opts.delay || 0) + 150
  return Promise.race([a.finished.catch(() => {}), new Promise((r) => setTimeout(r, max))])
}
function stopAnims() {
  for (const a of anims) a.cancel()
  anims = []
}
// Transformation qui pose le rectangle `to` (repère : `from`) avec origine en haut à gauche, et rayon corrigé de l'échelle.
function flip(from, to, radius) {
  const sx = from.width / to.width, sy = from.height / to.height
  return {
    transform: 'translate(' + (from.left - to.left) + 'px, ' + (from.top - to.top) + 'px) scale(' + sx + ', ' + sy + ')',
    borderRadius: radius / sx + 'px / ' + radius / sy + 'px',
  }
}
// Doublure du média : copie de la diapositive affichée, posée par-dessus la fiche le temps du morph.
function makeProxy(viewport) {
  const r = viewport.getBoundingClientRect()
  const proxy = document.createElement('div')
  proxy.className = 'nv-modal__proxy'
  proxy.setAttribute('aria-hidden', 'true')
  const slide = viewport.querySelector('.nv-gallery__slide.is-active') || viewport.querySelector('.nv-card__placeholder')
  if (slide) {
    const c = slide.cloneNode(true)
    c.querySelectorAll('video, iframe').forEach((v) => v.remove())
    proxy.appendChild(c)
  }
  Object.assign(proxy.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' })
  root.value.appendChild(proxy)
  return { proxy, rect: r }
}
const fadeEls = () => [closeBtn.value, ...root.value.querySelectorAll('[data-fade]')].filter(Boolean)

async function animateOpen(from) {
  const dur = DUR(), ease = EASE()
  const backdrop = root.value.querySelector('.nv-modal__backdrop')
  run(backdrop, [{ opacity: 0 }, { opacity: 1 }], { duration: reducedMotion ? 200 : dur * 0.7, easing: 'linear' })

  if (reducedMotion) return run(frame.value, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'linear' })
  if (!from) {
    return run(frame.value, [{ opacity: 0, transform: 'translate3d(0, 24px, 0) scale(0.96)' }, { opacity: 1, transform: 'none' }], { duration: dur * 0.8, easing: ease })
  }

  root.value.classList.add('is-morphing')
  const F = frame.value.getBoundingClientRect()
  const viewport = root.value.querySelector('[data-morph="media"]')
  const shellRadius = parseFloat(getComputedStyle(shell.value).borderTopLeftRadius) || 0
  const done = [run(shell.value, [flip(from.rect, F, from.radius), { transform: 'none', borderRadius: shellRadius + 'px' }], { duration: dur, easing: ease })]

  // Texte de la carte : copie fantôme qui suit le coin du fond et s'efface vite.
  const body = card.querySelector('.nv-card__body')
  if (body) {
    const b = body.getBoundingClientRect()
    const ghost = body.cloneNode(true)
    ghost.classList.add('nv-modal__ghost')
    ghost.setAttribute('aria-hidden', 'true')
    ghost.inert = true
    Object.assign(ghost.style, { left: b.left - F.left + 'px', top: b.top - F.top + 'px', width: b.width + 'px' })
    shell.value.after(ghost)
    const dx = F.left - from.rect.left, dy = F.top - from.rect.top
    run(ghost, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translate(' + dx * 0.35 + 'px, ' + dy * 0.35 + 'px)' }], { duration: dur * 0.35, easing: 'linear' })
      .then(() => ghost.remove())
  }

  if (viewport && from.media) {
    const { proxy, rect } = makeProxy(viewport)
    const mr = parseFloat(getComputedStyle(viewport).borderTopLeftRadius) || 0
    done.push(run(proxy, [flip(from.media, rect, mr), { transform: 'none', borderRadius: mr + 'px' }], { duration: dur, easing: ease }))
    const img = proxy.querySelector('img')
    if (img) run(img, [{ transform: 'scale(1.08)' }, { transform: 'none' }], { duration: dur, easing: ease })
    Promise.all(done).then(() => proxy.remove())
  }

  card.style.visibility = 'hidden'
  for (const el of fadeEls()) {
    run(el, [{ opacity: 0, transform: 'translate3d(0, 12px, 0)' }, { opacity: 1, transform: 'none' }], { duration: dur * 0.45, delay: dur * 0.5, easing: ease })
  }
  await Promise.all(done)
  if (root.value) root.value.classList.remove('is-morphing')
}

async function animateClose(to) {
  const dur = DUR() * 0.8, ease = EASE()
  const backdrop = root.value.querySelector('.nv-modal__backdrop')

  if (reducedMotion) {
    run(backdrop, [{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: 'linear' })
    return run(frame.value, [{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: 'linear' })
  }
  if (!to) {
    run(backdrop, [{ opacity: 1 }, { opacity: 0 }], { duration: dur * 0.6, easing: 'linear' })
    return run(frame.value, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translate3d(0, 16px, 0) scale(0.97)' }], { duration: dur * 0.6, easing: EASE() })
  }

  // Contenu d'abord, puis le fond et le média reviennent sur la carte.
  await Promise.all(fadeEls().map((el) => run(el, [{ opacity: 1 }, { opacity: 0 }], { duration: ms('--dur-1', 160), easing: 'linear' })))
  if (!root.value) return
  scroller.value.scrollTop = 0
  root.value.classList.add('is-morphing')
  const F = frame.value.getBoundingClientRect()
  const viewport = root.value.querySelector('[data-morph="media"]')
  const shellRadius = parseFloat(getComputedStyle(shell.value).borderTopLeftRadius) || 0
  const back = { duration: dur, easing: ease }
  // Fondu enchaîné dès que le fond touche presque la carte : la vraie carte réapparaît sous le fond qui s'efface.
  const out = { duration: dur * 0.4, delay: dur * 0.4, easing: 'linear' }

  run(backdrop, [{ opacity: 1 }, { opacity: 0 }], { duration: dur, easing: 'linear' })
  const done = [
    run(shell.value, [{ transform: 'none', borderRadius: shellRadius + 'px' }, flip(to.rect, F, to.radius)], back),
    run(shell.value, [{ opacity: 1 }, { opacity: 0 }], out),
  ]
  if (viewport && to.media) {
    const { proxy, rect } = makeProxy(viewport)
    const mr = parseFloat(getComputedStyle(viewport).borderTopLeftRadius) || 0
    done.push(run(proxy, [{ transform: 'none', borderRadius: mr + 'px' }, flip(to.media, rect, mr)], back))
    done.push(run(proxy, [{ opacity: 1 }, { opacity: 0 }], out))
  }
  const c = card
  setTimeout(() => { if (c && c === card && state === 'closing') c.style.visibility = '' }, dur * 0.4)
  await Promise.all(done)
}

/* ---------- Ouverture / fermeture ---------- */
async function open(p) {
  const my = ++token
  state = 'opening'
  project.value = p
  details.value = null
  const pending = loadDetails(p.id).then((d) => { if (my === token) details.value = d })
  if (p.download && p.download.releases) fetchLatest(p.download.releases)
  // Contenu de la fiche prêt avant la mesure, sans attendre un réseau lent.
  await Promise.race([pending, new Promise((r) => setTimeout(r, 180))])
  if (my !== token) return

  lastFocus = document.activeElement
  card = findCard(p.id)
  const from = card && !reducedMotion ? measureCard(card) : null
  startSlide.value = cardSlide(card)
  visible.value = true
  await nextTick()
  if (my !== token || !root.value) return
  lockPage(true)
  closeBtn.value && closeBtn.value.focus({ preventScroll: true })
  document.addEventListener('keydown', onKeydown)
  await animateOpen(from)
  if (my !== token) return
  stopAnims()
  state = 'open'
}

async function close() {
  const my = ++token
  state = 'closing'
  // Fermée avant même d'être montée (fiche encore en chargement) : rien à animer.
  if (!root.value) { finish(); return }
  root.value.querySelectorAll('video').forEach((v) => v.pause())
  document.removeEventListener('keydown', onKeydown)
  // Fermeture pendant l'ouverture : on part de l'état final.
  stopAnims()
  root.value && root.value.classList.remove('is-morphing')
  const id = project.value && project.value.id
  const target = id ? findCard(id) : null
  if (card && target !== card) releaseCard()
  if (target) card = target
  const to = card && !reducedMotion ? measureCard(card) : null
  await animateClose(to)
  if (my !== token) return
  finish()
}

function finish() {
  stopAnims()
  root.value && root.value.querySelectorAll('.nv-modal__proxy, .nv-modal__ghost').forEach((el) => el.remove())
  const back = card
  lockPage(false)
  releaseCard()
  visible.value = false
  project.value = null
  details.value = null
  state = 'closed'
  // Focus rendu à la carte d'origine (son lien), sinon à l'élément qui l'avait.
  const target = (back && back.querySelector('.nv-card__title a')) || (lastFocus && lastFocus.isConnected ? lastFocus : null)
  if (target && target.focus) target.focus({ preventScroll: true })
  lastFocus = null
}

watch(projectId, (id) => {
  const p = id ? projects.find((x) => x.id === id) : null
  if (id && !p) { closeProject(); return }
  if (p) {
    if (state === 'closed') open(p)
    else if (state === 'closing') { finish(); open(p) }
    else if (project.value !== p) {
      // Autre fiche demandée pendant l'ouverture (URL modifiée) : contenu remplacé sur place.
      releaseCard()
      project.value = p
      details.value = null
      loadDetails(p.id).then((d) => { if (project.value === p) details.value = d })
      if (p.download && p.download.releases) fetchLatest(p.download.releases)
      if (scroller.value) scroller.value.scrollTop = 0
    }
  } else if (state === 'opening' || state === 'open') close()
}, { immediate: true })

/* ---------- Clavier : Échap, piège à focus ---------- */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, iframe, video[controls], [tabindex]:not([tabindex="-1"])'
function onKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault()
    closeProject()
    return
  }
  if (e.key !== 'Tab' || !frame.value) return
  const items = [...frame.value.querySelectorAll(FOCUSABLE)].filter((el) => el.tabIndex >= 0 && !el.closest('[inert]') && el.getClientRects().length)
  if (!items.length) return
  const first = items[0], last = items[items.length - 1]
  if (!frame.value.contains(document.activeElement)) { e.preventDefault(); first.focus() }
  else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
}

// Fiche préchargée au survol d'une carte : contenu prêt au clic.
function prefetch(e) {
  const el = e.target.closest && e.target.closest('[data-project]')
  if (el) loadDetails(el.dataset.project)
}
onMounted(() => document.addEventListener('pointerover', prefetch, { passive: true }))
onBeforeUnmount(() => {
  document.removeEventListener('pointerover', prefetch)
  document.removeEventListener('keydown', onKeydown)
  if (visible.value) { lockPage(false); releaseCard() }
})
</script>

<template>
  <div v-if="visible && project" ref="root" class="nv-modal">
    <div class="nv-modal__backdrop" aria-hidden="true" @click="closeProject" />
    <div ref="frame" class="nv-modal__frame" role="dialog" aria-modal="true" :aria-labelledby="titleId">
      <div ref="shell" class="nv-modal__shell" aria-hidden="true" />
      <div ref="scroller" class="nv-modal__scroll" data-lenis-prevent>
        <header class="nv-modal__head">
          <ProjectGallery :key="project.id" :items="media" :title="project.title" :start="startSlide" />
          <div class="nv-modal__intro" data-fade>
            <p class="nv-modal__meta label">
              <b>{{ project.year }}</b>
              <span>{{ t('type.' + project.type) }}</span>
              <span v-if="platforms.length">{{ platforms.join(' · ') }}</span>
              <span class="nv-modal__status" :class="'is-' + project.status">{{ t('status.' + project.status) }}</span>
            </p>
            <h2 :id="titleId" class="nv-modal__title">{{ project.title }}</h2>
            <p v-if="tagline" class="nv-modal__tagline lead">{{ tagline }}</p>
            <ul class="nv-tags">
              <li v-for="tag in project.tags" :key="tag" class="nv-tag label">{{ tag }}</li>
            </ul>
            <ProjectActions :project="project" :latest="latest" :file="file" :platform="platforms[0] || 'Windows'" />
          </div>
        </header>
        <div class="nv-modal__body" data-fade>
          <ProjectTabs :key="project.id" :project="project" :details="details" :releases="changelog" />
        </div>
      </div>
      <button ref="closeBtn" type="button" class="nv-modal__close" :aria-label="t('modal.close')" @click="closeProject">
        <svg class="nv-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
    </div>
  </div>
</template>
