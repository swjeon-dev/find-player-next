/**
 * .lighthouseci/lhr-*.json 을 읽어 README.md 의
 * <!-- LIGHTHOUSE_SCORES_START --> ... <!-- LIGHTHOUSE_SCORES_END --> 구간을 갱신합니다.
 *
 * 사용 전: npm run build && npx lhci collect (또는 autorun)
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const LH_DIR = path.join(ROOT, '.lighthouseci')
const README_PATH = path.join(ROOT, 'README.md')
const START = '<!-- LIGHTHOUSE_SCORES_START -->'
const END = '<!-- LIGHTHOUSE_SCORES_END -->'

const CATEGORIES = [
  ['performance', 'Performance'],
  ['accessibility', 'Accessibility'],
  ['best-practices', 'Best practices'],
  ['seo', 'SEO'],
]

function scoreToCell(score) {
  if (typeof score !== 'number' || Number.isNaN(score)) return '—'
  return `${Math.round(score * 100)}%`
}

function median(nums) {
  if (nums.length === 0) return null
  const s = [...nums].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

function loadLhrReports() {
  if (!fs.existsSync(LH_DIR)) {
    console.error(`오류: ${LH_DIR} 가 없습니다. 먼저 npx lhci collect 또는 lhci autorun 을 실행합니다.`)
    process.exit(1)
  }
  const files = fs
    .readdirSync(LH_DIR)
    .filter((f) => f.startsWith('lhr-') && f.endsWith('.json'))
  if (files.length === 0) {
    console.error(
      '오류: lhr-*.json 이 없습니다. collect 가 성공했는지, .lighthouseci 경로를 확인합니다.',
    )
    process.exit(1)
  }
  return files.map((f) => {
    const raw = fs.readFileSync(path.join(LH_DIR, f), 'utf8')
    return JSON.parse(raw)
  })
}

/** requestedUrl 기준으로 묶고, 카테고리별 점수는 여러 런의 중앙값 */
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
  rows.sort((a, b) => a.url.localeCompare(b.url))
  return rows
}

function buildTable(rows) {
  const header = `| 측정 URL | ${CATEGORIES.map(([, label]) => label).join(' | ')} |`
  const sep = `| --- |${CATEGORIES.map(() => ' --- |').join('')}`
  const body = rows
    .map(
      (row) =>
        `| \`${shortenUrl(row.url)}\` | ${CATEGORIES.map(([k]) => scoreToCell(row[k])).join(' | ')} |`,
    )
    .join('\n')

  const fetchedAt = new Date().toISOString().slice(0, 19).replace('T', ' ') + ' UTC'

  return [
    `_마지막 갱신: ${fetchedAt} · \`npm run sync:lighthouse-readme\`_`,
    '',
    header,
    sep,
    body,
  ].join('\n')
}

function shortenUrl(url) {
  try {
    const u = new URL(url)
    return u.pathname + u.search || '/'
  } catch {
    return url
  }
}

function replaceReadmeBlock(readme, innerMarkdown) {
  if (!readme.includes(START) || !readme.includes(END)) {
    console.error(`오류: README.md 에 ${START} / ${END} 마커가 모두 있어야 합니다.`)
    process.exit(1)
  }
  const before = readme.split(START)[0]
  const after = readme.split(END)[1]
  return `${before}${START}\n${innerMarkdown}\n${END}${after}`
}

function main() {
  const reports = loadLhrReports()
  const rows = aggregateByUrl(reports)
  const md = buildTable(rows)
  const readme = fs.readFileSync(README_PATH, 'utf8')
  fs.writeFileSync(README_PATH, replaceReadmeBlock(readme, md), 'utf8')
  console.log(`README 갱신 완료: ${README_PATH} (${rows.length}개 URL)`)
}

main()
