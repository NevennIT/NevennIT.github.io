// Génère docs/guide-portfolio.pdf à partir de docs/guide/guide.html (captures dans docs/guide/img/).
//   npm run guide        (utilise Microsoft Edge installé ; rien à télécharger)
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright-core'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SRC = pathToFileURL(ROOT + 'docs/guide/guide.html').href
const OUT = ROOT + 'docs/guide-portfolio.pdf'

const browser = await chromium.launch({ channel: 'msedge' })
const page = await browser.newPage()
await page.goto(SRC, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.pdf({
  path: OUT,
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: true,
  headerTemplate: '<span></span>',
  footerTemplate: `<div style="width:100%;font:8px 'Segoe UI',sans-serif;color:#8a8f99;padding:0 16mm;display:flex;justify-content:space-between">
    <span>Guide du portfolio NevennIT</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
})
await browser.close()
console.log('PDF écrit :', OUT)
