// Traductions FR/EN, sans dépendance.
//   t('nav.projects')            texte de l'interface (messages/*.js), avec {param} remplacés
//   tr({ fr: '…', en: '…' })     texte de contenu bilingue (données des projets, parcours, fiches)
//   locale                       'fr' | 'en', réactif ; setLocale / toggleLocale le changent
// Langue : choix mémorisé (localStorage nv-lang), sinon langue du navigateur ; posée sur <html lang> par index.html.
import { ref, watch } from 'vue'

export const LOCALES = ['fr', 'en']
const KEY = 'nv-lang'
const root = document.documentElement

// Chaque fichier de messages/ exporte { fr: {...}, en: {...} } ; ils sont fusionnés ici (un fichier par partie du site).
const files = import.meta.glob('./messages/*.js', { eager: true, import: 'default' })
const dict = { fr: {}, en: {} }
for (const file of Object.values(files)) for (const l of LOCALES) Object.assign(dict[l], flatten(file[l] || {}))

function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? prefix + '.' + k : k
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out)
    else out[key] = v
  }
  return out
}

function initial() {
  const set = root.lang
  if (LOCALES.includes(set)) return set
  try {
    const saved = localStorage.getItem(KEY)
    if (LOCALES.includes(saved)) return saved
  } catch (e) { /* stockage indisponible */ }
  return (navigator.language || 'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

export const locale = ref(initial())

watch(locale, (l) => {
  root.lang = l
  try { localStorage.setItem(KEY, l) } catch (e) { /* le choix vaut pour la visite */ }
  const title = dict[l]['meta.title'], desc = dict[l]['meta.description']
  if (title) document.title = title
  const m = document.querySelector('meta[name="description"]')
  if (m && desc) m.setAttribute('content', desc)
}, { immediate: true })

export const setLocale = (l) => { if (LOCALES.includes(l)) locale.value = l }
export const toggleLocale = () => setLocale(locale.value === 'fr' ? 'en' : 'fr')

export function t(key, params) {
  let s = dict[locale.value][key] ?? dict.fr[key]
  if (s == null) {
    if (import.meta.env.DEV) console.warn('[i18n] clé manquante :', key)
    return key
  }
  if (params) s = s.replace(/\{(\w+)\}/g, (m, p) => (params[p] != null ? params[p] : m))
  return s
}

// Contenu bilingue : { fr, en } → la langue courante (repli sur le français) ; une chaîne ou un tableau passent tels quels.
export function tr(value) {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) return value
  return value[locale.value] ?? value.fr ?? ''
}

// Dates « 11 nov. 2026 » / « Nov 11, 2026 ».
export function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function useI18n() {
  return { locale, t, tr, setLocale, toggleLocale, formatDate }
}
