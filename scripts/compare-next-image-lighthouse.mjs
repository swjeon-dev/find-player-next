#!/usr/bin/env node
/**
 * next/image 전환 전·후 Lighthouse 비교 (로컬 production build)
 * 사용: node scripts/compare-next-image-lighthouse.mjs [before|after]
 */
import { spawn } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const OUT = join(ROOT, '.lighthouseci', 'next-image')
const PORT = 3010
const BASE = `http://127.0.0.1:${PORT}`

const PAGES = [
  { name: 'home', url: `${BASE}/` },
  {
    name: 'submission',
    url: `${BASE}/submission`,
    extraHeaders: { Cookie: 'league-id=39' },
  },
]

function run(cmd, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: ROOT,
      env: { ...process.env, ...env },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let out = ''
    child.stdout.on('data', d => {
      out += d
    })
    child.stderr.on('data', d => {
      out += d
    })
    child.on('close', code =>
      code === 0 ? resolve(out) : reject(new Error(`${cmd} exit ${code}\n${out}`)),
    )
  })
}

async function waitForHttp(url, timeoutMs = 120000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url)
      if (res.ok || res.status === 307 || res.status === 308) return
    } catch {
      // server not ready
    }
    await new Promise(r => setTimeout(r, 500))
  }
  throw new Error(`Server start timeout: ${url}`)
}

async function startServer() {
  const child = spawn('npm', ['run', 'start', '--', '-p', String(PORT), '-H', '127.0.0.1'], {
    cwd: ROOT,
    env: { ...process.env },
    stdio: 'ignore',
  })
  await waitForHttp(`${BASE}/`)
  return child
}

async function lighthouse(url, outPath, extraHeaders) {
  const args = [
    'lighthouse',
    url,
    '--output=json',
    `--output-path=${outPath}`,
    '--quiet',
    '--chrome-flags=--headless=new --disable-dev-shm-usage --no-sandbox',
    '--only-categories=performance',
    '--only-audits=largest-contentful-paint,first-contentful-paint,cumulative-layout-shift,total-blocking-time,speed-index',
  ]
  if (extraHeaders) {
    args.push(`--extra-headers=${JSON.stringify(extraHeaders)}`)
  }
  await run('npx', args)
  return JSON.parse(await readFile(outPath, 'utf8'))
}

function extract(lhr) {
  const audits = lhr.audits
  return {
    performance: Math.round((lhr.categories.performance?.score ?? 0) * 100),
    fcp: audits['first-contentful-paint']?.numericValue ?? null,
    lcp: audits['largest-contentful-paint']?.numericValue ?? null,
    tbt: audits['total-blocking-time']?.numericValue ?? null,
    cls: audits['cumulative-layout-shift']?.numericValue ?? null,
    speedIndex: audits['speed-index']?.numericValue ?? null,
    lcpElement: audits['largest-contentful-paint-element']?.displayValue ?? '-',
  }
}

function ms(n) {
  if (n == null) return '-'
  return `${(n / 1000).toFixed(2)} s`
}

async function measure(label) {
  await mkdir(OUT, { recursive: true })
  console.log(`\n[${label}] build...`)
  await run('npm', ['run', 'build'], { NEXT_PUBLIC_LHCI: 'true' })

  console.log(`[${label}] start server :${PORT}`)
  const server = await startServer()
  const results = {}

  try {
    for (const page of PAGES) {
      const outPath = join(OUT, `${label}-${page.name}.json`)
      console.log(`[${label}] lighthouse ${page.name}`)
      const lhr = await lighthouse(page.url, outPath, page.extraHeaders)
      results[page.name] = extract(lhr)
    }
  } finally {
    server.kill('SIGTERM')
  }

  return results
}

function compare(before, after) {
  const rows = []
  for (const page of ['home', 'submission']) {
    const b = before[page]
    const a = after[page]
    rows.push({
      page,
      metric: 'Performance',
      before: b.performance,
      after: a.performance,
      delta: a.performance - b.performance,
    })
    for (const [key, label] of [
      ['fcp', 'FCP'],
      ['lcp', 'LCP'],
      ['tbt', 'TBT'],
      ['cls', 'CLS'],
      ['speedIndex', 'Speed Index'],
    ]) {
      const bv = b[key]
      const av = a[key]
      rows.push({
        page,
        metric: label,
        before: key === 'cls' ? bv?.toFixed(3) : ms(bv),
        after: key === 'cls' ? av?.toFixed(3) : ms(av),
        delta:
          bv != null && av != null
            ? key === 'cls'
              ? (av - bv).toFixed(3)
              : `${(((av - bv) / bv) * 100).toFixed(1)}%`
            : '-',
      })
    }
    rows.push({
      page,
      metric: 'LCP element',
      before: b.lcpElement,
      after: a.lcpElement,
      delta: '-',
    })
  }
  return rows
}

async function main() {
  const mode = process.argv[2]
  if (mode === 'before' || mode === 'after') {
    const results = await measure(mode)
    await writeFile(join(OUT, `${mode}.json`), JSON.stringify(results, null, 2))
    console.log(JSON.stringify(results, null, 2))
    return
  }

  const beforePath = join(OUT, 'before.json')
  const afterPath = join(OUT, 'after.json')

  const before = await measure('before')
  await writeFile(beforePath, JSON.stringify(before, null, 2))

  const after = await measure('after')
  await writeFile(afterPath, JSON.stringify(after, null, 2))

  const summary = { before, after, compare: compare(before, after) }
  await writeFile(join(OUT, 'summary.json'), JSON.stringify(summary, null, 2))
  console.log('\n=== summary ===')
  console.log(JSON.stringify(summary, null, 2))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
