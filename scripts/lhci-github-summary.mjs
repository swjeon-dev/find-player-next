/**
 * CI Job Summary용: .lighthouseci 링크·점수를 GITHUB_STEP_SUMMARY에 기록합니다.
 */
import fs from 'node:fs'
import path from 'node:path'

const LH_DIR = path.join(process.cwd(), '.lighthouseci')
const CATEGORIES = [
  ['performance', 'Performance'],
  ['accessibility', 'A11y'],
  ['best-practices', 'Best'],
  ['seo', 'SEO'],
]

function scorePct(score) {
  if (typeof score !== 'number' || Number.isNaN(score)) return '—'
  return `${Math.round(score * 100)}`
}

function median(nums) {
  if (nums.length === 0) return null
  const s = [...nums].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

function shortenUrl(url) {
  try {
    const u = new URL(url)
    return u.pathname + u.search || '/'
  } catch {
    return url
  }
}

function loadReports() {
  if (!fs.existsSync(LH_DIR)) return []
  return fs
    .readdirSync(LH_DIR)
    .filter((f) => f.startsWith('lhr-') && f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(LH_DIR, f), 'utf8')))
}

function loadLinks() {
  const linksPath = path.join(LH_DIR, 'links.json')
  if (!fs.existsSync(linksPath)) return {}
  return JSON.parse(fs.readFileSync(linksPath, 'utf8'))
}

function aggregateByUrl(reports) {
  const byUrl = new Map()
  for (const r of reports) {
    const url = r.requestedUrl || r.finalUrl || '(unknown)'
    if (!byUrl.has(url)) byUrl.set(url, [])
    byUrl.get(url).push(r)
  }

  const rows = []
  for (const [url, runs] of byUrl) {
    const row = { url }
    for (const [key] of CATEGORIES) {
      const scores = runs
        .map((run) => run.categories?.[key]?.score)
        .filter((s) => typeof s === 'number')
      row[key] = median(scores)
    }
    rows.push(row)
  }
  return rows.sort((a, b) => a.url.localeCompare(b.url))
}

function main() {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY
  if (!summaryPath) {
    console.log('GITHUB_STEP_SUMMARY 없음 — 로컬에서는 stdout만 출력합니다.')
  }

  const links = loadLinks()
  const rows = aggregateByUrl(loadReports())
  const lines = ['## Lighthouse CI', '']

  if (process.env.LHCI_GITHUB_APP_TOKEN) {
    lines.push(
      'GitHub App 토큰이 설정되어 있습니다. 이 커밋의 **Checks** 탭에서 Lighthouse status check와 리포트 링크를 확인할 수 있습니다.',
      '',
    )
  } else {
    lines.push(
      '> `LHCI_GITHUB_APP_TOKEN`이 없어 status check는 등록되지 않았습니다. [Lighthouse CI GitHub App](https://github.com/apps/lighthouse-ci) 설치 후 repo secret을 추가하세요.',
      '',
    )
  }

  if (rows.length > 0) {
    lines.push(
      '| URL | Perf | A11y | Best | SEO |',
      '| --- | ---: | ---: | ---: | ---: |',
      ...rows.map(
        (row) =>
          `| \`${shortenUrl(row.url)}\` | ${scorePct(row.performance)} | ${scorePct(row.accessibility)} | ${scorePct(row['best-practices'])} | ${scorePct(row.seo)} |`,
      ),
      '',
    )
  }

  const linkEntries = Object.entries(links)
  if (linkEntries.length > 0) {
    lines.push('### 리포트', '')
    for (const [url, href] of linkEntries) {
      lines.push(`- [\`${shortenUrl(url)}\`](${href})`)
    }
    lines.push('')
  }

  if (rows.length === 0 && linkEntries.length === 0) {
    lines.push('_`.lighthouseci` 결과가 없습니다._', '')
  }

  const md = lines.join('\n')
  console.log(md)
  if (summaryPath) fs.appendFileSync(summaryPath, md)
}

main()
