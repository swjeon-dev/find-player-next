# To NextJS

## 1. Next 설치 ✅

```bash
npm i next@latest react@latest react-dom@latest
```

## 2. scripts / CI 정리 ✅

`package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "start": "next start",
    "build": "next build",
    "build:analyze": "ANALYZE=true next build",
    "lhci": "npx lhci autorun",
    "lhci:local": "NEXT_PUBLIC_LHCI=true npm run build && npm run lhci",
    "sync:lighthouse-readme": "node scripts/sync-lighthouse-readme.mjs"
  }
}
```

- `.lighthouserc.js`: `next start` 기준으로 변경
- `lighthouse.yml`: `NEXT_PUBLIC_LHCI` 사용, Build step API 키 제거
- Vite env (`VITE_*`, `import.meta.env`) → `NEXT_PUBLIC_*`, `process.env` ✅
- GitHub Pages `deploy.yml` 비활성화 (`deploy.yml__`, Vercel 전환)
- next 자체 번들러 사용으로 `vite`, `rollup-plugin-visualizer`, `@vitejs/plugin-react` 패키지 제거
- `tsconfig.json`: Next plugin, `bundler` resolution, `.next/types` include, `next-env.d.ts`는 `.gitignore`

```text
"types": ["node"] // <= vite/client
```

GitHub Secrets 이름(`VITE_FIREBASE_API_KEY` 등)은 functions/동기화 워크플로에서 그대로 사용합니다.

## 3. 마이그레이션 진행 상황

### 3-1. App Router 1차 전환 ✅

**구조**

- `app/` — Next App Router (`layout.tsx`, `page.tsx`, `not-found.tsx`, `submission/`)
- `src/app/` — FSD Application (Providers, styles, `ProtectedRoute` 가드)
- `createRoot` / `src/index.tsx` / `index.html` 제거 → `app/layout.tsx`가 진입점

**완료**

- [x] `app/layout.tsx` + `src/app/providers/Providers.tsx` (Query, Recoil, Theme, GlobalStyle)
- [x] `src/pages/*` → `app/page.tsx`, `app/submission/page.tsx`, `app/not-found.tsx`
- [x] `Header` — `react-router-dom` Link → `next/link`
- [x] `tsconfig` include에 `app` 추가
- [x] Vite SPA 진입점 제거 (`src/index.tsx`, `index.html`, `index.html__`)

### 3-2. 라우팅·셸 정리 ✅

- [x] `LeagueSelectModal` — `useNavigate` → `next/navigation` `useRouter`
- [x] `ProtectedRoute` — `Outlet`/`Navigate` 제거, `children` + `useRouter` 패턴으로 전환
- [x] `app/submission/layout.tsx` — submission 라우트에 리그 선택 가드 연결
- [x] `app/layout.tsx` — `modal-root` portal 대상 추가
- [x] `metadata` — root layout `title.template`, 홈·404 Server page 분리 (`CoverPage`, `NotFoundContent`)
- [x] `app/not-found.tsx` — 조기 `return` 버그 수정
- [x] `react-router-dom`, `react-helmet-async` 의존성 제거
- [x] SPA 레거시 제거 (`AppRouter_`, FSD `RootLayout.tsx`)
- [x] SSR 호환 — `recoil-persist`/`query persist`의 `sessionStorage`·`localStorage` 접근을 클라이언트로 지연
- [x] `app/submission/page.tsx` — `dynamic = 'force-dynamic'` (Recoil 상태 의존 라우트)

### 3-3. `next.config.ts` 정리 ✅

**path alias (`@/*`, `@common`)** — `tsconfig.json` `paths`만으로 충분. Next 16(Turbopack 기본)이 자동 적용.

**dev Profiler stub** — `turbopack.resolveAlias`로 환경별 분기:

```typescript
'@/shared/lib/dev': path.join(
  __dirname,
  process.env.NODE_ENV === 'production'
    ? 'src/shared/lib/dev/index.prod.ts'  // no-op
    : 'src/shared/lib/dev/index.ts',      // React Profiler
),
```

| 환경 | import `@/shared/lib/dev` | 동작 |
|------|---------------------------|------|
| `next dev` | `index.ts` → `Profiler.tsx` | 콘솔에 렌더 시간 출력 |
| `next build` | `index.prod.ts` → `Profiler.prod.tsx` | children만 반환 (오버헤드 없음) |

> barrel import (`@/shared`)는 alias를 타지 않습니다. Profiler 사용 시 `@/shared/lib/dev`로 직접 import하세요.

Next 16에서는 `next dev` / `next build` 모두 Turbopack이 기본입니다. webpack fallback이 필요하면 `--webpack` 플래그를 사용합니다.

### 미완료

- [ ] **배포** — Vercel 프로젝트 연동 (루트 배포 시 `basePath` 불필요; 서브패스 배포 시 `next.config` `basePath` + env 검토)

## 4. 환경 변수

### 변수별 정리

| 변수                                   | 접두사            | 이유                                                          |
| -------------------------------------- | ----------------- | ------------------------------------------------------------- |
| Functions (`FUNCTION_*`)               | ❌                | Cloud Functions = Node.js 환경                                |
| `FOOTBALL_API_KEY`, `FIREBASE_API_KEY` | ❌                | 비밀키. 서버/CI/Functions 전용                                |
| RTDB base URL                          | ✅ `NEXT_PUBLIC_` | 지금은 클라이언트 axios가 RTDB 직접 호출 (`client.ts`)        |
| `NEXT_PUBLIC_BASE_PATH`                | ✅                | 서브패스 배포 시. Vercel 루트 배포면 미사용                   |
| `LHCI_GITHUB_APP_TOKEN`                | ❌                | CI 스크립트(`lhci`, `.mjs`) 전용                              |
| `NEXT_PUBLIC_LHCI`                     | ✅                | Lighthouse CI용. 아래 참고                                    |

> Firebase 호출을 전부 Server Component / Route Handler로 옮기면 Firebase 관련 env는 접두사 없이 서버 전용으로 통일 가능

### `.env` 예시

```env
NEXT_PUBLIC_FIREBASE_API_BASE_URL=https://...
NEXT_PUBLIC_BASE_PATH=/find-player-game

FIREBASE_API_KEY=...
FOOTBALL_API_KEY=...
LHCI_GITHUB_APP_TOKEN=...

# NEXT_PUBLIC_LHCI=true  ← lighthouse.yml 빌드 step에서만 주입
```

### LHCI는 CI(Node)인데 왜 `NEXT_PUBLIC_`인가?

Lighthouse CI 워크플로는 GitHub Actions(CI)에서 돌지만, **두 가지 실행 환경**이 섞여 있습니다.

1. **빌드·CI 스크립트** (`npm run build`, `lhci autorun`, `node scripts/*.mjs`) — Node에서 실행. 접두사 없는 env도 읽을 수 있음.
2. **가상 브라우저(Lighthouse)** — UI 없는 Chrome에서 **빌드된 클라이언트 JS**를 실행. CI 러너의 env를 런타임에 읽지 못하고, **빌드 시 번들에 박힌 `NEXT_PUBLIC_*` 값만** 사용 가능.

```text
[빌드·CI 스크립트]  npm run build / lhci autorun / node scripts/*.mjs  → 접두사 없어도 OK
[가상 브라우저]      ProtectedRoute 등 클라이언트 코드                  → NEXT_PUBLIC_으로 빌드에 박힌 값만 읽음
```

`ProtectedRoute`에서 리그 선택 가드를 CI 때만 우회:

```typescript
if (process.env.NEXT_PUBLIC_LHCI === 'true') {
  return <>{children}</>
}
```

- `lighthouse.yml` Build step: `env.NEXT_PUBLIC_LHCI: 'true'` → 번들에 `"true"`로 인라인
- CI에서 `NEXT_PUBLIC_LHCI`를 할당하지 않으면 → `=== 'true'`가 false → 리그 가드 정상 동작 (의도된 동작)

## 5. 참고

- styled-components — Client에서만 (`'use client'`). metadata는 Server `page`/`layout`에서 export
- Provider·설정은 FSD `src/app/`, Next 라우트 파일만 루트 `app/`
- FSD `src/app`과 Next `app/`은 별개 디렉터리 (의도된 공존 구조)
