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

## 3. 남은 작업

### 완료

- [x] Vite env → `NEXT_PUBLIC_*` / `process.env` (앱, CI)
- [x] `tsconfig.json` Next TypeScript 설정 (`vite/client` 제거, plugin·include)
- [x] `vite.config.js` 제거
- [x] 리그 엠블럼: `public/emblem` → `entities/league/assets` import (`StaticImageData`)
- [x] GitHub Pages deploy 워크플로 비활성화 (Vercel 전환)

### 미완료

- [ ] App Router 진입점 (`app/layout.tsx`, `app/page.tsx`) 구성
- [ ] `react-router-dom` → Next 파일 기반 라우팅 전환
- [ ] `index.html` 제거
- [ ] `LeagueSelectModal` `styled.img` → `next/image` 전환
- [ ] `build:analyze`용 `@next/bundle-analyzer` 설정
- [ ] Vercel 배포 설정
- [ ] README 이미지 `src/assets/imgs` → `docs/assets` 이동 (선택)

## 4. 환경 변수

<!-- |        | Vite              | Next            |
| ------ | ----------------- | --------------- |
| 접두사 | `VITE_*`          | `NEXT_PUBLIC_*` |
| 호출   | `import.meta.env` | `process.env`   | -->

<!-- ### 접두사가 의미하는 것

- `NEXT_PUBLIC_*` → **빌드 시 클라이언트 번들에 인라인**되어, 브라우저 JS에서 `process.env`로 읽을 수 있음
- 접두사 없음 → **서버(Node) 코드에서만** `process.env`로 읽을 수 있음 (클라이언트 번들에는 포함되지 않음)
- 접두사가 없으면 브라우저에서 그 값 자체를 읽을 수 없으므로, 사실상 외부에 노출되지 않음
- 헷갈리기 쉬운 포인트: 접두사가 없다고 **클라이언트에서 fetch/axios 호출 자체가 막히는 건 아님**
  - 막히는 건 브라우저 JS에서 **그 env 값을 읽는 것**뿐
  - 비밀키는 클라이언트가 `/api/...`를 호출하고, **서버(Route Handler)가 키를 붙여** 외부 API 호출 -->

### 변수별 정리

| 변수                                   | 접두사            | 이유                                                          |
| -------------------------------------- | ----------------- | ------------------------------------------------------------- |
| Functions (`FUNCTION_*`)               | ❌                | Cloud Functions = Node.js 환경                                |
| `FOOTBALL_API_KEY`, `FIREBASE_API_KEY` | ❌                | 비밀키. 서버/CI/Functions 전용                                |
| RTDB base URL                          | ✅ `NEXT_PUBLIC_` | 지금은 클라이언트 axios가 RTDB 직접 호출 (`client.ts`)        |
| `NEXT_PUBLIC_BASE_PATH`                | ✅                | 서브패스 배포 시 (`AppRouter.tsx`). Vercel 루트 배포면 미사용 |
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
  return <Outlet />
}
```

- `lighthouse.yml` Build step: `env.NEXT_PUBLIC_LHCI: 'true'` → 번들에 `"true"`로 인라인
- CI에서 `NEXT_PUBLIC_LHCI`를 할당하지 않으면 → `=== 'true'`가 false → 리그 가드 정상 동작 (의도된 동작)
