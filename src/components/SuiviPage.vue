<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { projects } from '../data/projects'
import releaseData from '../data/releases.json'
import { getLenis } from '../composables/useSmoothScroll'
import { site } from '../config'
import '../styles/suivi.css'

// Page de suivi (#/suivi), pour le propriétaire : absente du menu. Elle ne montre que des informations déjà publiques :
// versions affichées par le site (releases.json du build), compteurs de téléchargement des dépôts publics,
// déploiements et historique du dépôt du portfolio (API GitHub publique, sans token, 60 appels par heure et par IP).
const REPO = 'NevennIT/NevennIT.github.io'
const API = 'https://api.github.com/repos/'

const runs = ref(null), commits = ref(null), downloads = ref({}), live = ref(null), error = ref('')

const fmt = (iso, time = true) => iso
  ? new Date(iso).toLocaleString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', ...(time ? { hour: '2-digit', minute: '2-digit' } : {}) })
  : '—'
const ago = (iso) => {
  if (!iso) return ''
  const m = Math.round((Date.now() - new Date(iso)) / 60000)
  if (m < 60) return `il y a ${m} min`
  if (m < 48 * 60) return `il y a ${Math.round(m / 60)} h`
  return `il y a ${Math.round(m / 1440)} j`
}

// Une ligne par projet : version affichée sur le site, date, téléchargements (dépôt public seulement).
const apps = computed(() => projects.map((p) => {
  const list = (p.repo && releaseData.repos[p.repo]) || []
  const pub = p.download && p.download.releases
  const pubList = (pub && releaseData.repos[pub]) || []
  const latest = list[0] || pubList[0] || null
  return {
    id: p.id, title: p.title, repo: p.repo, pub, latest,
    button: !p.download ? 'Aucun' : p.download.releases ? 'Téléchargement gratuit' : p.download.buy ? 'Achat' : 'Bientôt disponible',
    publicLag: pub && list[0] && pubList[0] && pubList[0].tag !== list[0].tag ? pubList[0].tag : '',
  }
}))

// Messages de commit lisibles : ceux de Pages CMS (« Update content/projects/x.json (via Pages CMS) ») sont traduits.
const LABELS = [
  [/^content\/projects\/(.+)\.json$/, (m) => `projet « ${m[1]} »`],
  [/^content\/fiches\/(.+)\.json$/, (m) => `fiche détaillée « ${m[1]} »`],
  [/^content\/parcours\.json$/, () => 'parcours'],
  [/^content\/site\.json$/, () => 'textes et réglages'],
  [/^public\/projects\/videos\/(.+)$/, (m) => `vidéo ${m[1]}`],
  [/^public\/projects\/(.+)$/, (m) => `image ${m[1]}`],
]
const ACTIONS = { create: 'Ajout :', update: 'Modification :', delete: 'Suppression :' }
function human(message) {
  const first = message.split('\n')[0]
  const cms = /^(create|update|delete)\s+(\S+)/i.exec(first)
  if (cms) {
    const path = cms[2]
    const hit = LABELS.map(([re, f]) => [re.exec(path), f]).find(([m]) => m)
    return { text: `${ACTIONS[cms[1].toLowerCase()]} ${hit ? hit[1](hit[0]) : path}`, cms: /pages cms/i.test(first) }
  }
  const pr = /^Merge pull request #(\d+)/.exec(first)
  if (pr) return { text: `Mise à jour du site (PR #${pr[1]})`, cms: false }
  return { text: first, cms: false }
}

const EVENTS = { push: 'Modification du site', schedule: 'Vérification horaire', workflow_dispatch: 'Lancement manuel', repository_dispatch: 'Déclenché par une appli' }
const STATES = { success: 'réussi', failure: 'échec', cancelled: 'annulé', skipped: 'sauté' }

async function json(url) {
  const r = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
  if (r.status === 403) throw new Error('Limite de l’API GitHub atteinte (60 appels par heure) : réessayez plus tard.')
  if (!r.ok) throw new Error('GitHub ne répond pas (' + r.status + ').')
  return r.json()
}

async function load() {
  error.value = ''
  try {
    const [r, c] = await Promise.all([
      json(API + REPO + '/actions/workflows/deploy.yml/runs?per_page=50'),
      json(API + REPO + '/commits?sha=main&per_page=25'),
    ])
    runs.value = r.workflow_runs.map((x) => ({
      id: x.id, url: x.html_url, event: EVENTS[x.event] || x.event, date: x.created_at,
      state: x.status === 'completed' ? STATES[x.conclusion] || x.conclusion : 'en cours', ok: x.conclusion === 'success', pending: x.status !== 'completed',
    }))
    commits.value = c.map((x) => ({ sha: x.sha.slice(0, 7), url: x.html_url, date: x.commit.author.date, ...human(x.commit.message) }))
    // Téléchargements : dépôts publics de releases seulement (les dépôts privés ne les exposent pas).
    const pubs = [...new Set(projects.map((p) => p.download && p.download.releases).filter(Boolean))]
    const counts = {}
    await Promise.all(pubs.map(async (repo) => {
      const list = await json(API + repo + '/releases?per_page=30')
      const sum = (rel) => rel.assets.reduce((n, a) => n + a.download_count, 0)
      counts[repo] = { total: list.reduce((n, rel) => n + sum(rel), 0), latest: list[0] ? sum(list[0]) : 0, tag: list[0] && list[0].tag_name }
    }))
    downloads.value = counts
  } catch (e) {
    error.value = e.message
  }
  // Versions réellement en ligne (publiées avec le site au dernier déploiement).
  try { live.value = await (await fetch('/versions.json', { cache: 'no-store' })).json() } catch { live.value = null }
}

const lastDeploy = computed(() => runs.value && runs.value.find((r) => r.event !== EVENTS.schedule))
const lastCheck = computed(() => runs.value && runs.value.find((r) => r.event === EVENTS.schedule))
// Liste : les vérifications horaires sans incident sont masquées (il y en a une par heure) ; leur dernier passage est dans la carte.
const shownRuns = computed(() => runs.value && runs.value.filter((r) => r.event !== EVENTS.schedule || (!r.ok && !r.pending)).slice(0, 12))

onMounted(() => {
  const l = getLenis(); if (l) l.stop()
  document.documentElement.style.overflow = 'hidden'
  load()
})
onBeforeUnmount(() => {
  const l = getLenis(); if (l) l.start()
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <div class="nv-suivi" data-lenis-prevent role="main" aria-labelledby="suivi-title">
    <div class="nv-suivi__inner">
      <header class="nv-suivi__head">
        <div>
          <p class="label nv-suivi__eyebrow">NevennIT · page privée, absente du menu</p>
          <h1 id="suivi-title" class="display-l">Suivi du portfolio</h1>
        </div>
        <div class="nv-suivi__head-actions">
          <button type="button" class="nv-tag label" @click="load">Actualiser</button>
          <a class="nv-tag label" href="#accueil">Retour au site</a>
        </div>
      </header>

      <p v-if="error" class="nv-suivi__error" role="alert">{{ error }}</p>

      <section class="nv-suivi__grid" aria-label="État">
        <article class="nv-suivi__card">
          <h2 class="label">Dernier déploiement</h2>
          <template v-if="lastDeploy">
            <p class="nv-suivi__big" :class="{ 'is-bad': !lastDeploy.ok && !lastDeploy.pending }">{{ lastDeploy.state }}</p>
            <p class="small">{{ lastDeploy.event }} · {{ fmt(lastDeploy.date) }} ({{ ago(lastDeploy.date) }})</p>
          </template>
          <p v-else class="small">Chargement…</p>
        </article>
        <article class="nv-suivi__card">
          <h2 class="label">Versions vérifiées</h2>
          <p class="nv-suivi__big">{{ ago(releaseData.generatedAt) || '—' }}</p>
          <p class="small">Version du site : {{ fmt(releaseData.generatedAt) }}.
            <template v-if="lastCheck">Dernière vérification horaire : {{ ago(lastCheck.date) }} ({{ lastCheck.state }}).</template>
          </p>
        </article>
        <article class="nv-suivi__card">
          <h2 class="label">Raccourcis</h2>
          <ul class="nv-suivi__links small">
            <li><a class="nv-link" href="https://app.pagescms.org" target="_blank" rel="noopener">Modifier le site (Pages CMS)</a></li>
            <li><a class="nv-link" :href="site.repository + '/actions'" target="_blank" rel="noopener">Déploiements (GitHub Actions)</a></li>
            <li><a class="nv-link" :href="site.repository + '/blob/main/docs/guide-portfolio.pdf'" target="_blank" rel="noopener">Guide (PDF)</a></li>
            <li><a class="nv-link" :href="site.repository + '/issues?q=is%3Aissue+en+ligne'" target="_blank" rel="noopener">Notifications de versions</a></li>
          </ul>
        </article>
      </section>

      <section class="nv-suivi__section" aria-labelledby="suivi-apps">
        <h2 id="suivi-apps" class="title">Applications</h2>
        <div class="nv-suivi__table-wrap">
          <table class="nv-suivi__table">
            <thead>
              <tr><th>Projet</th><th>Version sur le site</th><th>Publiée le</th><th>Bouton</th><th>Téléchargements</th></tr>
            </thead>
            <tbody>
              <tr v-for="a in apps" :key="a.id">
                <td><a class="nv-link" :href="'#/projet/' + a.id">{{ a.title }}</a></td>
                <td>
                  <b v-if="a.latest">{{ a.latest.tag }}</b><span v-else class="nv-suivi__muted">aucune release</span>
                  <span v-if="a.publicLag" class="nv-suivi__warn small"> · dépôt public encore en {{ a.publicLag }}</span>
                </td>
                <td>{{ a.latest ? fmt(a.latest.published_at, false) : '—' }}</td>
                <td>{{ a.button }}</td>
                <td>
                  <template v-if="a.pub && downloads[a.pub]">
                    {{ downloads[a.pub].latest }} <span class="nv-suivi__muted small">pour {{ downloads[a.pub].tag }}, {{ downloads[a.pub].total }} au total</span>
                  </template>
                  <span v-else class="nv-suivi__muted">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="small nv-suivi__muted">Les versions sont relues toutes les heures ; une nouvelle version apparaît sur le site dans l'heure, avec un e-mail de GitHub.
          Les téléchargements ne sont comptés que pour les applis publiées dans un dépôt public.</p>
      </section>

      <div class="nv-suivi__cols">
        <section class="nv-suivi__section" aria-labelledby="suivi-history">
          <h2 id="suivi-history" class="title">Historique du site</h2>
          <ol v-if="commits" class="nv-suivi__list">
            <li v-for="c in commits" :key="c.sha">
              <span class="label nv-suivi__date">{{ fmt(c.date) }}</span>
              <a :href="c.url" target="_blank" rel="noopener">{{ c.text }}</a>
              <span v-if="c.cms" class="nv-tag label nv-tag--ion">Pages CMS</span>
            </li>
          </ol>
          <p v-else class="small">Chargement…</p>
        </section>
        <section class="nv-suivi__section" aria-labelledby="suivi-runs">
          <h2 id="suivi-runs" class="title">Déploiements et vérifications</h2>
          <ol v-if="shownRuns" class="nv-suivi__list">
            <li v-for="r in shownRuns" :key="r.id">
              <span class="label nv-suivi__date">{{ fmt(r.date) }}</span>
              <a :href="r.url" target="_blank" rel="noopener">{{ r.event }}</a>
              <span class="nv-tag label" :class="r.ok ? 'nv-tag--ion' : r.pending ? '' : 'nv-tag--flare'">{{ r.state }}</span>
            </li>
          </ol>
          <p v-else class="small">Chargement…</p>
          <p class="small nv-suivi__muted">Les vérifications horaires réussies ne sont pas listées (leur dernier passage est en haut) ; un échec, lui, apparaît ici.</p>
        </section>
      </div>
    </div>
  </div>
</template>
