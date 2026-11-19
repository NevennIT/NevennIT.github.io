// Petit rendu Markdown pour les notes de version, sans dépendance.
// Sûr par construction : tout le texte est échappé AVANT d'être mis en forme, seules les balises produites ici
// sortent, et les liens n'acceptent que http(s) (rel="noopener", nouvel onglet).
// Pris en charge : titres, listes (imbriquées par l'indentation), citations, filet, blocs de code, `code`,
// **gras**, *italique*, [liens](https://…), <https://…> et URL nues, paragraphes.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
export const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c])

// Marqueurs internes (caractères de contrôle, retirés de l'entrée) pour mettre de côté code et liens déjà rendus.
const MARK = '\u0001'
const URL_RE = /^https?:\/\/[^\s<>"']+$/i

function link(href, label) {
  return '<a href="' + href + '" target="_blank" rel="noopener">' + label + '</a>'
}

// Mise en forme d'une ligne déjà échappée.
function inline(text) {
  const kept = []
  const keep = (html) => MARK + (kept.push(html) - 1) + MARK

  // `code` : contenu laissé tel quel (déjà échappé).
  let s = text.replace(/(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/g, (m, ticks, code) => keep('<code>' + code.trim() + '</code>'))
  // [texte](url) : url http(s) seulement, sinon le texte seul.
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;[^)]*&quot;)?\)/g, (m, label, href) => {
    const raw = href.replace(/&amp;/g, '&')
    return URL_RE.test(raw) ? keep(link(href, emphasis(label))) : label
  })
  // <https://…> (échappé en &lt;…&gt;) et URL nues.
  s = s.replace(/&lt;(https?:\/\/[^\s&]+(?:&amp;[^\s&]+)*)&gt;/gi, (m, href) => keep(link(href, href)))
  s = s.replace(/(^|[\s(])(https?:\/\/[^\s<]+[^\s<.,;:!?)\]'])/gi, (m, pre, href) => pre + keep(link(href, href)))
  s = emphasis(s)
  return s.replace(new RegExp(MARK + '(\\d+)' + MARK, 'g'), (m, i) => kept[+i])
}

function emphasis(s) {
  return s
    .replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^\w])__(?=\S)([\s\S]*?\S)__(?!\w)/g, '$1<strong>$2</strong>')
    .replace(/(^|[^*\w])\*(?=[^\s*])([^*]*?[^\s*])\*(?!\*)/g, '$1<em>$2</em>')
    .replace(/(^|[^\w])_(?=[^\s_])([^_]*?[^\s_])_(?!\w)/g, '$1<em>$2</em>')
    .replace(/~~(?=\S)([\s\S]*?\S)~~/g, '<del>$1</del>')
}

const LIST_RE = /^(\s*)([-*+]|\d{1,9}[.)])\s+(.*)$/

export function renderMarkdown(src) {
  if (!src) return ''
  const lines = String(src).replace(/\r\n?/g, '\n').replace(/[\u0000\u0001]/g, '').split('\n')
  const out = []
  let para = []
  // Pile des listes ouvertes : { indent, tag }.
  const lists = []

  const flushPara = () => {
    if (para.length) out.push('<p>' + inline(escapeHtml(para.join(' '))) + '</p>')
    para = []
  }
  const closeLists = (indent = -1) => {
    while (lists.length && lists[lists.length - 1].indent > indent) out.push('</li></' + lists.pop().tag + '>')
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Bloc de code ``` … ```
    const fence = line.match(/^\s*(```|~~~)/)
    if (fence) {
      flushPara(); closeLists()
      const body = []
      while (++i < lines.length && !lines[i].trim().startsWith(fence[1])) body.push(lines[i])
      out.push('<pre><code>' + escapeHtml(body.join('\n')) + '</code></pre>')
      continue
    }

    if (!line.trim()) { flushPara(); continue }

    // Titres : décalés sous les intitulés de la fiche (# et ## → h5, au-delà → h6).
    const h = line.match(/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/)
    if (h) {
      flushPara(); closeLists()
      const tag = h[1].length <= 2 ? 'h5' : 'h6'
      out.push('<' + tag + '>' + inline(escapeHtml(h[2])) + '</' + tag + '>')
      continue
    }

    if (/^\s{0,3}([-*_])(\s*\1){2,}\s*$/.test(line)) { flushPara(); closeLists(); out.push('<hr>'); continue }

    const q = line.match(/^\s{0,3}>\s?(.*)$/)
    if (q) {
      flushPara(); closeLists()
      const body = [q[1]]
      while (i + 1 < lines.length && /^\s{0,3}>/.test(lines[i + 1])) body.push(lines[++i].replace(/^\s{0,3}>\s?/, ''))
      out.push('<blockquote>' + renderMarkdown(body.join('\n')) + '</blockquote>')
      continue
    }

    const li = line.match(LIST_RE)
    if (li) {
      flushPara()
      const indent = li[1].replace(/\t/g, '  ').length
      const tag = /\d/.test(li[2]) ? 'ol' : 'ul'
      const top = lists[lists.length - 1]
      if (!top || indent > top.indent) {
        lists.push({ indent, tag })
        out.push('<' + tag + '><li>')
      } else {
        closeLists(indent)
        const cur = lists[lists.length - 1]
        if (cur && cur.tag !== tag && cur.indent === indent) { out.push('</li></' + lists.pop().tag + '>'); lists.push({ indent, tag }); out.push('<' + tag + '><li>') }
        else if (cur) out.push('</li><li>')
        else { lists.push({ indent, tag }); out.push('<' + tag + '><li>') }
      }
      out.push(inline(escapeHtml(li[3])))
      continue
    }

    // Suite d'un élément de liste (ligne indentée) ou paragraphe.
    if (lists.length && /^\s+\S/.test(line)) { out.push(' ' + inline(escapeHtml(line.trim()))); continue }
    closeLists()
    para.push(line.trim())
  }
  flushPara(); closeLists()
  return out.join('')
}
