#!/usr/bin/env node
/**
 * dist_old vs dist Lighthouse 비교 (로컬 preview/serve 대상)
 * 사용: node scripts/compare-lighthouse.mjs
 */
import { spawn } from 'node:child_process'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const OUT = join(ROOT, '.lighthouseci', 'compare')
const BASE = '/find-player-game'
const URLS = [`${BASE}/`, `${BASE}/submission`]

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.txt': 'text/plain',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
}

function serveStatic(rootDir, port) {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      let path = req.url?.split('?')[0] ?? '/'
      if (path === '/') path = `${BASE}/`
      if (!path.startsWith(BASE)) {
        res.writeHead(404)
        res.end('Not found')
        return
      }
      let rel = path.slice(BASE.length) || '/index.html'
      if (rel === '/') rel = '/index.html'
      let filePath = join(rootDir, rel)
      if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
        // SPA fallback (GitHub Pages 404.html과 동일)
        filePath = join(rootDir, 'index.html')
        if (!existsSync(filePath)) {
          res.writeHead(404)
          res.end('Not found')
          return
        }
      }
      const ext = extname(filePath)
      res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' })
      createReadStream(filePath).pipe(res)
    })
    server.listen(port, '127.0.0.1', () => resolve(server))
    server.on('error', reject)
  })
}

function run(cmd, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      env: { ...process.env, ...env },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let out = ''
    child.stdout.on('data', d => { out += d })
    child.stderr.on('data', d => { out += d })
    child.on('close', code =>
      code === 0 ? resolve(out) : reject(new Error(`${cmd} exit ${code}\n${out}`)),
    )
  })
}

async function lighthouse(url, outPath) {
  await run('npx', [
    'lighthouse',
    url,
    '--output=json',
    `--output-path=${outPath}`,
    '--quiet',
    '--chrome-flags=--headless=new --disable-dev-shm-usage --no-sandbox',
    '--only-categories=performance,accessibility,best-practices,seo',
  ])
  return JSON.parse(await readFile(outPath, 'utf8'))
}

function extract(lhr) {
  const cats = lhr.categories
  const audits = lhr.audits
  return {
    performance: Math.round((cats.performance?.score ?? 0) * 100),
    accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((cats['best-practices']?.score ?? 0) * 100),
    seo: Math.round((cats.seo?.score ?? 0) * 100),
    fcp: audits['first-contentful-paint']?.displayValue ?? '-',
    lcp: audits['largest-contentful-paint']?.displayValue ?? '-',
    tbt: audits['total-blocking-time']?.displayValue ?? '-',
    cls: audits['cumulative-layout-shift']?.displayValue ?? '-',
    speedIndex: audits['speed-index']?.displayValue ?? '-',
  }
}

async function measure(label, rootDir, port) {
  const server = await serveStatic(rootDir, port)
  const results = {}
  try {
    for (const path of URLS) {
      const url = `http://127.0.0.1:${port}${path}`
      const safe = path.replace(/\//g, '_').replace(/^_/, '') || 'home'
      const outPath = join(OUT, `${label}-${safe}.json`)
      const lhr = await lighthouse(url, outPath)
      results[path] = extract(lhr)
    }
  } finally {
    server.close()
  }
  return results
}

async function main() {
  await mkdir(OUT, { recursive: true })
  console.log('Measuring dist_old (port 4174)...')
  const old = await measure('old', join(ROOT, 'dist_old'), 4174)
  console.log('Measuring dist (port 4173)...')
  const cur = await measure('new', join(ROOT, 'dist'), 4173)
  await writeFile(join(OUT, 'summary.json'), JSON.stringify({ old, new: cur }, null, 2))
  console.log(JSON.stringify({ old, new: cur }, null, 2))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
