# To NextJS

## 진행 현황

한곳에서만 갱신합니다. 본문 §3·§6·§7은 상세 설명용입니다.

### 완료

- [x] Next.js · React 최신 설치
- [x] scripts / CI 정리 (`next dev|build|start`, LHCI, Vite·CRA 진입점 제거)
- [x] env `VITE_*` → `NEXT_PUBLIC_*` / `process.env`
- [x] App Router 1차 전환 — `app/layout.tsx`, Providers, `app/page`·`submission`·`not-found`, Header `next/link`
- [x] 라우팅·셸 — `useRouter`, ProtectedRoute, submission layout, `modal-root`, metadata template
- [x] 페이지 UI → FSD `widget/` 슬라이스 (`CoverView`, `NotFoundView`, `SubmissionView`)
- [x] SSR 호환 — persist storage 클라이언트 지연, submission `force-dynamic`
- [x] `next.config.ts` — path alias, dev Profiler stub (Turbopack alias)
- [x] GlobalStyle → `global.css` + `modern-normalize`, `app/layout.tsx` import
- [x] app 셸 SC → CSS Modules 1차 — Header, CoverView, NotFoundView + `global.css` 색상 토큰
- [x] 컴포넌트 SC → CSS Modules 전환 완료 (15/15) — `entities`·`widget`·`SkeletonBase`, `.module.css` 색상 `var(--color-*)` 통일
- [x] styled-components 인프라 제거 — `ThemeProvider`, `StyledComponentsRegistry`, `compiler.styledComponents`, `styled-components`·`styled-reset`·`@types/styled-components`, `theme.ts`·`styled.d.ts` 제거; `breakpoints.ts` 분리
- [x] Recoil → Zustand — `leagueInfo`·`quiz`·`input` store, persist·SSR hydration, `ProtectedRoute` 가드 (최종 검토 §8-7)
- [x] quiz store · React Query 분리 — `selectedPlayerId` persist, 선수 데이터 RQ (§8-8)

### Recoil → Zustand 진행률

**완료 (3/3 atom + Providers)** — `recoil`·`recoil-persist`·`RecoilRoot` 제거. React Query persist는 기존 유지.

| 상태 | Recoil (Before) | Zustand (After) | persist · SSR |
| ---- | --------------- | --------------- | ------------- |
| ✅ | `leagueInfoState` (`id: number \| null`) | `useLeagueInfoStore` (`league.store.ts`) | sessionStorage `leagueInfo` · `skipHydration` + `rehydrate()` |
| ✅ | `quizState` (`IFirebasePlayer \| null`) | `useQuizStore` (`quiz.store.ts`) | sessionStorage `quiz-player-id` · `selectedPlayerId`만 persist · 선수 데이터는 React Query (§8-8) |
| ✅ | `inputState` (`string`) | `useInputStore` (`input.store.ts`) | 없음 (메모리) |
| ✅ | `RecoilRoot` in Providers | 제거 | — |

### styled-components → CSS Modules 진행률

**완료 (15/15 + 인프라 제거)** — UI·인프라 모두 CSS Modules + `global.css`로 전환됨.

| 상태 | 대상 | 파일 |
| ---- | ---- | ---- |
| ✅ | `shared/ui/layout/Header` | `Header.module.css` — 반응형 `@media`, `useBreakpoint` 제거 |
| ✅ | `widget/home/CoverView` | `CoverView.module.css` |
| ✅ | `widget/not-found/NotFoundView` | `not-found.module.css` |
| ✅ | `entities/league/LeagueSelectModal` | `LeagueSelectModal.module.css`, `LeagueSelectModalTrigger.module.css` |
| ✅ | `entities/club/Club` | `Club.module.css` |
| ✅ | `entities/search/AutoSearchList` | `AutoSearchList.module.css` |
| ✅ | `entities/search/SearchForm` | `SearchForm.module.css` |
| ✅ | `entities/search/HintList` · `HintUI` | `HintList.module.css`, `HintUI.module.css` |
| ✅ | `widget/club/ClubViews` · `ClubViewsError` | `ClubViews.module.css`, `ClubViewsError.module.css` |
| ✅ | `widget/club/ClubSquadModal` | `ClubSquadModal.module.css` |
| ✅ | `widget/submission/SubmissionGameContainer` | `SubmissionGameContainer.module.css` |
| ✅ | `widget/submission/SubmissionCard` | `SubmissionCard.module.css` |
| ✅ | `widget/submission/SubmissionLoader` | `SubmissionLoader.module.css` |
| ✅ | `widget/submission/ChangeButton` | `ChangeButton.module.css` |
| ✅ | `shared/ui/skeleton/SkeletonBase` | `SkeletonBase.module.css` + `SkeletonBase.tsx` |

### 미완료

- [ ] **배포** — Vercel 프로젝트 연동 (루트 배포 시 `basePath` 불필요; 서브패스 배포 시 `next.config` `basePath` + env 검토)

### 선택 (Next 서버 이점) — §9

- [ ] cookie + submission 서버 prefetch · dehydrate
- [ ] middleware 가드 (ProtectedRoute 보완)
- [ ] Route Handler + `revalidate` (BFF·캐시)
- [ ] Server / Client UI 분리 (정적 셸)

---

## 1. Next 설치

```bash
npm i next@latest react@latest react-dom@latest
```

## 2. scripts / CI 정리

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
- Vite env (`VITE_*`, `import.meta.env`) → `NEXT_PUBLIC_*`, `process.env`
- GitHub Pages `deploy.yml` 비활성화 (`deploy.yml__`, Vercel 전환)
- next 자체 번들러 사용으로 `vite`, `rollup-plugin-visualizer`, `@vitejs/plugin-react` 패키지 제거
- `tsconfig.json`: Next plugin, `bundler` resolution, `.next/types` include, `next-env.d.ts`는 `.gitignore`

```text
"types": ["node"] // <= vite/client
```

GitHub Secrets 이름(`VITE_FIREBASE_API_KEY` 등)은 functions/동기화 워크플로에서 그대로 사용합니다.

## 3. 마이그레이션 (상세)

### 3-1. App Router 1차 전환

**구조**

- `app/` — Next App Router (`layout.tsx`, `page.tsx`, `not-found.tsx`, `submission/`)
- `src/app/` — FSD Application (Providers, styles, `ProtectedRoute` 가드)
- `createRoot` / `src/index.tsx` / `index.html` 제거 → `app/layout.tsx`가 진입점

**적용 내용**

- `app/layout.tsx` (`global.css` import) + `src/app/providers/Providers.tsx` (Query, Zustand rehydrate)
- `src/pages/*` → `app/page.tsx`, `app/submission/page.tsx`, `app/not-found.tsx`
- `Header` — `react-router-dom` Link → `next/link`
- `tsconfig` include에 `app` 추가
- Vite SPA 진입점 제거 (`src/index.tsx`, `index.html`, `index.html__`)

### 3-2. 라우팅·셸 정리

- `LeagueSelectModal` — `useNavigate` → `next/navigation` `useRouter`
- `ProtectedRoute` — `Outlet`/`Navigate` 제거, `children` + `useRouter` 패턴으로 전환
- `app/submission/layout.tsx` — submission 라우트에 리그 선택 가드 연결
- `app/layout.tsx` — `modal-root` portal 대상 추가
- `metadata` — root layout `title.template`, 하위 page는 `title` 문자열만 지정
- `app/` 페이지 UI → FSD `widget/` 슬라이스 이동 (`CoverView`, `NotFoundView`, `SubmissionView`)
- `app/not-found.tsx` — 조기 `return` 버그 수정
- `react-router-dom`, `react-helmet-async` 의존성 제거
- SPA 레거시 제거 (`AppRouter_`, FSD `RootLayout.tsx`)
- SSR 호환 — Zustand `skipHydration` + `rehydrate()`, React Query persist의 `localStorage` 접근을 클라이언트로 지연
- `app/submission/page.tsx` — `dynamic = 'force-dynamic'` (클라이언트 상태·가드 의존 라우트, §8-6에서 재검토 가능)
- styled-components FOUC 대응 (당시) — `compiler.styledComponents` + `StyledComponentsRegistry` → **제거 완료**, CSS Modules로 대체

### 3-3. `next.config.ts` 정리

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

| 환경         | import `@/shared/lib/dev`             | 동작                            |
| ------------ | ------------------------------------- | ------------------------------- |
| `next dev`   | `index.ts` → `Profiler.tsx`           | 콘솔에 렌더 시간 출력           |
| `next build` | `index.prod.ts` → `Profiler.prod.tsx` | children만 반환 (오버헤드 없음) |

> barrel import (`@/shared`)는 alias를 타지 않습니다. Profiler 사용 시 `@/shared/lib/dev`로 직접 import하세요.

Next 16에서는 `next dev` / `next build` 모두 Turbopack이 기본입니다. webpack fallback이 필요하면 `--webpack` 플래그를 사용합니다.

## 4. 환경 변수

### 변수별 정리

| 변수                                   | 접두사            | 이유                                                   |
| -------------------------------------- | ----------------- | ------------------------------------------------------ |
| Functions (`FUNCTION_*`)               | ❌                | Cloud Functions = Node.js 환경                         |
| `FOOTBALL_API_KEY`, `FIREBASE_API_KEY` | ❌                | 비밀키. 서버/CI/Functions 전용                         |
| RTDB base URL                          | ✅ `NEXT_PUBLIC_` | 지금은 클라이언트 axios가 RTDB 직접 호출 (`client.ts`) |
| `NEXT_PUBLIC_BASE_PATH`                | ✅                | 서브패스 배포 시. Vercel 루트 배포면 미사용            |
| `LHCI_GITHUB_APP_TOKEN`                | ❌                | CI 스크립트(`lhci`, `.mjs`) 전용                       |
| `NEXT_PUBLIC_LHCI`                     | ✅                | Lighthouse CI용. 아래 참고                             |

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

`ProtectedRoute`에서 리그 선택 가드를 CI 때만 우회 (`canAccess`):

```typescript
const isLhci = process.env.NEXT_PUBLIC_LHCI === 'true'
const canAccess = isLhci || Boolean(leagueId)

if (!hydrated) return null
if (!canAccess) return null
```

- `lighthouse.yml` Build step: `env.NEXT_PUBLIC_LHCI: 'true'` → 번들에 `"true"`로 인라인
- CI에서 `NEXT_PUBLIC_LHCI`를 할당하지 않으면 → `isLhci` false → 리그 가드 정상 동작 (의도된 동작)

## 5. 참고

- Provider·설정은 FSD `src/app/`, Next 라우트 파일만 루트 `app/`
- FSD `src/app`과 Next `app/`은 별개 디렉터리 (의도된 공존 구조)
- styled-components 상세 — 아래 §6

### 5-1. `app/` vs `widget/` (FSD + App Router)

Next `app/`은 **라우팅·metadata·layout**만 담고, 페이지 UI는 FSD `widget/` 슬라이스에 둡니다.

```text
app/
  layout.tsx              metadata template, Providers
  page.tsx                metadata + <CoverView />
  not-found.tsx           metadata + <NotFoundView />
  submission/
    layout.tsx            <ProtectedRoute>
    page.tsx              metadata + <SubmissionView />

src/widget/
  home/ui/CoverView.tsx
  not-found/ui/NotFoundView.tsx
  submission/ui/SubmissionView.tsx
```

| 레이어      | 역할                                           |
| ----------- | ---------------------------------------------- |
| `app/`      | Server page 셸 — `metadata`, `dynamic`, layout |
| `widget/`   | 페이지 단위 UI 조합 (`'use client'`)           |
| `entities/` | 도메인 단위 UI·상태                            |

### 5-2. metadata `title.template`

root layout에 template을 두면 하위 page는 **`%s`에 들어갈 문자열만** 지정하면 됩니다.

```typescript
// app/layout.tsx
export const metadata = {
  title: {
    default: 'Find Football Player',
    template: '%s | Find Football Player',
  },
}

// app/page.tsx
export const metadata = { title: 'Home' }
// → <title>Home | Find Football Player</title>

// app/not-found.tsx
export const metadata = { title: '404' }
// → <title>404 | Find Football Player</title>
```

- template을 **우회**하려면 `title: { absolute: '...' }` 사용
- template을 **적용하지 않으려면** 하위 page에서 `title`을 생략 → root `default` 사용
- `description`은 page마다 별도로 지정 (template 없음)

### 5-3. barrel import (`@/widget`, `@/app`)와 번들

**barrel(`index.ts`)에서 export한 모든 모듈이 전부 번들에 들어가는 것은 아닙니다.** Turbopack/webpack은 사용하는 export만 따라가는 **트리 쉐이킹**을 합니다.

다만 barrel import가 문제가 되는 경우는 “전체 번들링”보다 다른 이유입니다.

| 우려                                    | 실제                                                         |
| --------------------------------------- | ------------------------------------------------------------ |
| export 전부가 번들에 포함               | ❌ 사용한 심볼만 따라감 (일반적)                             |
| Server Component에서 client 모듈 끌려옴 | ⚠️ barrel 경유 시 `'use client'` 경계가 불명확해질 수 있음   |
| 순환 참조                               | ⚠️ `@/widget` → `SubmissionView` → `@/widget` 같은 패턴 주의 |
| side effect 있는 re-export              | ⚠️ barrel 체인에 side effect가 있으면 쉐이킹이 깨질 수 있음  |

FSD는 **슬라이스 public API(`index.ts`)를 통한 import**를 권장하고, `@/widget/home/ui/CoverView` 같은 **deep import는 캡슐화를 깨므로 비권장**합니다.

```typescript
// 권장 — 슬라이스 public API
import { CoverView } from '@/widget/home'

// 가능하지만 FSD 비권장 — 내부 경로 직접 접근
import CoverView from '@/widget/home/ui/CoverView'

// 주의 — 최상위 barrel은 슬라이스 간 순환 참조에 취약
import { ClubViews } from '@/widget' // widget 내부에서는 @/widget/club 권장
```

실무적으로는 **page(`app/`)에서는 `@/widget/home`처럼 슬라이스 단위 import**, **widget 내부에서는 형제 슬라이스를 `@/widget/club`처럼 직접 import**하는 절충이 무난합니다. layout에서 `@/shared/ui/layout`처럼 세그먼트 직접 import가 필요한 경우는 §6-7 참고.

## 6. styled-components → CSS Modules (완료)

> **현재:** styled-components 의존성·인프라 없음. 아래 §6-4~6-7은 마이그레이션 당시 참고용.

### 6-1. 현재 스타일 구조

```text
app/layout.tsx          (Server) — @/app/styles → global.css
  └─ Providers          ('use client') — Query, Zustand rehydrate
       ├─ Header
       └─ main
            └─ widget/entities  — *.module.css + var(--color-*)
```

| 역할 | 위치 |
| ---- | ---- |
| 색상·reset 토큰 | `src/app/styles/global.css` (`:root` `--color-*`) |
| 컴포넌트 스타일 | `*.module.css` |
| breakpoint (JS) | `src/shared/config/breakpoints.ts` → `useBreakpoint` |
| breakpoint (CSS) | 각 `.module.css`의 `@media (max-width: Npx)` — `var()` 불가, px 리터럴 |

### 6-2. 제거한 인프라

| 항목 | 비고 |
| ---- | ---- |
| `ThemeProvider`, `theme.ts`, `styled.d.ts` | styled `DefaultTheme` / `theme.media` 타입 |
| `StyledComponentsRegistry.tsx` | Next CSS-in-JS SSR 래퍼 |
| `next.config` `compiler.styledComponents` | styled SWC 플러그인 |
| `styled-components`, `styled-reset`, `@types/styled-components` | `package.json` 의존성 |
| `package.json__` | Vite 시절 백업 |

### 6-3. Next에서 styled-components를 쓸 때 (이력)

Next App Router에서 styled-components **쓸 수는 있음**. 다만 기본은 Server Component + 빌드 타임 CSS라 Registry·`'use client'` 경계가 추가로 필요하고 런타임 주입 비용도 있음.

| 방식                        | App Router | 메모                   |
| --------------------------- | ---------- | ---------------------- |
| CSS Modules                 | ◎          | Next 기본, RSC 그대로  |
| Tailwind                    | ◎          | 빌드 타임, 트리 쉐이킹 |
| styled-components           | △          | 가능. Registry 필요    |
| Panda CSS / Vanilla Extract | ○          | zero-runtime 쪽        |

이 프로젝트는 Vite 때 styled-components를 쓰다가 **CSS Modules로 전환 완료**.

### 6-4. FOUC — client styled를 server layout이랑 같이 쓸 때 (이력)

홈 들어가면 잠깐 스타일 없는 화면 나오는 거, **styled-components 때문이 맞음** (FOUC).

구조:

```text
app/layout.tsx          (Server) — global.css import
  └─ StyledComponentsRegistry
       └─ Providers     ('use client')
            ├─ ThemeProvider
            └─ main
                 └─ CoverView 등  ('use client', widget/)
```

styled-components는 **브라우저에서 `<style>` 넣는 방식**. 컴포넌트 styled는 Client 트리 안에 있어 **Registry 없으면** hydration 전까지 기본 스타일로 그림.

**body 배경·reset**은 §7에서 `global.css`로 layout import → 첫 HTML에 포함. **컴포넌트 styled**(LeagueSelectModal 버튼 등)는 여전히 Registry가 SSR 시 `<head>`에 수집·주입.

`next.config.ts`의 `compiler.styledComponents: true`만으로는 FOUC 안 잡힘. 클래스명 정리용이고, **첫 HTML에 CSS 실어 보내는 건 Registry**가 함.

### 6-5. 당시 적용해 둔 것 (이력)

```typescript
// next.config.ts
compiler: { styledComponents: true },
```

- `src/app/providers/StyledComponentsRegistry.tsx` — [Next CSS-in-JS 가이드](https://nextjs.org/docs/app/guides/css-in-js) 패턴
- `app/layout.tsx` — Registry로 Providers 감쌈 (SSR 시 `<head>`에 style 넣기 위함)

```text
StyledComponentsRegistry   ← SSR 시 CSS 수집·주입
  └─ Providers → Header, main(children)
```

### 6-6. Registry가 하는 일 (이력)

Registry = 프로젝트에 만든 Client Component 래퍼. **스타일 모으고 head에 넣는 건 서버에서만.** 클라이언트에선 `children`만 반환.

```text
[1] 서버에서 Registry 실행
      useServerInsertedHTML(콜백)  → 등록만. 아직 head에 안 넣음
      return <StyleSheetManager>{children}</StyleSheetManager>

[2] children 트리 렌더 (Manager 안)
      styled-components가 CSS를 sheet에 모음  ← 이게 먼저

[3] 트리 렌더 끝나서 스타일 다 모이면
      아까 등록한 콜백 실행
        getStyleElement() → <style>
        return <>{styles}</> → Next가 <head>에 삽입  ← 이게 나중
        clearTag() → sheet 비움
```

정리: **styled-components를 sheet에 모은 뒤, 콜백이 head에 넣음.** 시점은 트리 렌더가 끝나서 CSS가 모인 때.

#### 서버 / 클라이언트

|                         | 서버                                                | 클라이언트        |
| ----------------------- | --------------------------------------------------- | ----------------- |
| `StyleSheetManager`     | sheet에 CSS 수집                                    | 안 씀             |
| `useServerInsertedHTML` | `<head>`에 `<style>`                                | **실행 안 됨**    |
| Registry return         | `<StyleSheetManager>{children}</StyleSheetManager>` | `<>{children}</>` |

클라이언트에선 head에 style 이미 와 있으니까 Manager 없이 children만. hydration으로 className 맞추면 끝. 이후 새 스타일은 styled-components가 평소처럼 브라우저에서 `<head>`에 넣음.

**클라이언트에서 Registry가 style을 “다른 형태로” 넘기는 게 아님.** 서버가 첫 HTML에 넣어 둔 걸 쓰는 것뿐.

<!-- #### `useServerInsertedHTML` ≠ `useEffect`

둘 다 “렌더 중에 콜백 등록 → 나중에 실행” 느낌은 비슷한데:

- `useEffect` — 클라이언트, paint **이후**
- `useServerInsertedHTML` — **서버**가 HTML 만들 때, 스타일 쓰는 콘텐츠보다 **앞**에 끼워 넣으려는 용도

브라우저 `useEffect`처럼 “렌더 끝나고 한 번”이 아니라, **서버 SSR 파이프라인 안에서** 모은 CSS를 HTML에 실어 보내는 훅. -->

#### `clearTag()`

`getStyleElement()`로 꺼낸 다음 sheet 비움. 안 비우면 레이아웃·페이지 여러 번 렌더할 때 `<head>`에 `<style>` 중복 쌓일 수 있음 (스트리밍 SSR).

```text
모음 → head에 넣음 → clearTag() → 다음 렌더는 빈 sheet부터
```

### 6-7. 그 외 (이력)

- styled + hooks 쓰는 UI는 `'use client'`. metadata는 server `page`/`layout`에서.
- layout에서 `@/shared` barrel 쓰면 hooks가 server에 끌려올 수 있음 → `@/shared/ui/layout`처럼 직접 import.
- Profiler stub은 `@/shared/lib/dev`로 직접 (barrel은 alias 안 탐).

## 7. GlobalStyle → `global.css` (완료)

styled-components `GlobalStyle` + `styled-reset`을 제거하고 **빌드 타임 global CSS**로 옮겼습니다. 컴포넌트 styled → CSS Modules 전환(§6)과 함께 완료.

### 7-1. 변경 요약

| Before | After |
| ------ | ----- |
| `GlobalStyle.tsx` (`createGlobalStyle` + `styled-reset`) | `src/app/styles/global.css` |
| Client `Providers`에서 `<GlobalStyle />` mount | Server `app/layout.tsx`에서 `@/app/styles` import |
| Meyer reset (`styled-reset`, styled-components 의존) | `modern-normalize` (`@import` in CSS) |

### 7-2. `global.css`

`:root`에 색상 토큰(`--color-*`)을 둡니다. breakpoint는 `breakpoints.ts`(JS)와 각 `.module.css`의 `@media` px 리터럴로 관리합니다. 전체 목록은 `src/app/styles/global.css` 참고.

```css
@import 'modern-normalize/modern-normalize.css';

:root {
  /* 코어 */
  --color-bg: #001d3d;
  --color-surface: #023047;
  --color-text: white;
  --color-accent: #f9c74f;
  --color-card: white;

  /* 도메인별 — search, league, club, error, submission, skeleton 등 */
  --color-equal: #06d6a0;
  --color-not-equal: #8b8c89;
  /* … */
}

* { box-sizing: border-box; }
body {
  background-color: var(--color-bg);
  color: var(--color-text);
}
a { text-decoration: none; }
```

- **reset**: `styled-reset` → **`modern-normalize`**
- **색상 토큰**: CSS Modules에서 `var(--color-*)`만 사용 (리터럴 없음)
- **breakpoint**: `src/shared/config/breakpoints.ts` + `useBreakpoint` (JS); `@media`에는 px 리터럴 (`var()` 불가)

### 7-3. import 경로

```typescript
// app/layout.tsx (Server)
import '@/app/styles' // → styles/index.ts → global.css side-effect
```

`Providers`에서는 `GlobalStyle` 제거. body 배경 FOUC는 layout import로 **첫 HTML `<head>`에 CSS 포함**됩니다.

## 8. Recoil → Zustand (완료)

`recoil`·`recoil-persist` 의존성과 `RecoilRoot`를 제거하고, atom 3개를 Zustand store로 이전했습니다. **React Query persist**(`persistClient.ts`)는 역할이 달라 그대로 유지합니다.

### 8-1. 상태 매핑

| Recoil atom | 파일 (Before) | Zustand store | 파일 (After) | 소비처 예 |
| ----------- | ------------- | ------------- | ------------ | --------- |
| `leagueInfoState` | `leagueInfoState.ts` | `useLeagueInfoStore` | `league.store.ts` | `ProtectedRoute`, `ClubViews`, `useQuizGenerator` |
| `quizState` | `quizState.ts` | `useQuizStore` | `quiz.store.ts` | `useQuizGenerator` (ID 선택) · `SubmissionCard` (React Query `player`) |
| `inputState` | `inputState.ts` | `useInputStore` | `input.store.ts` | `useSearch`, `useSubmissionGame`, `useClubSquadModal` |

**API 차이**

| 항목 | Recoil | Zustand |
| ---- | ------ | ------- |
| 읽기 | `useRecoilValue(leagueInfoState)` → `{ id }` | `useLeagueInfoStore(s => s.id)` |
| 쓰기 | `useSetRecoilState` / `useRecoilState` | `useLeagueInfoStore(s => s.setId)` |
| 기본값 `leagueId` | `null` | `0` (falsy 동일) |
| Provider | `<RecoilRoot>` 필수 | 불필요 (모듈 싱글톤 store) |

### 8-2. persist 비교 (Recoil vs Zustand vs React Query)

앱에는 **persist 계층이 3종** 있습니다. Recoil 전환으로 바뀐 것은 **클라이언트 UI 상태(Zustand)** 뿐이고, **서버 캐시(React Query)** 는 기존과 동일합니다.

| 계층 | Before (Recoil 시절) | After (현재) | Storage | 키 / 식별 | 수명 | 담는 데이터 |
| ---- | ---------------------- | ------------ | ------- | --------- | ---- | ----------- |
| **리그 선택** | `recoil-persist` + `leagueInfoState` | Zustand `persist` · `useLeagueInfoStore` | `sessionStorage` | `leagueInfo` | 탭 세션 | `id` (리그 ID) |
| **현재 퀴즈** | `recoil-persist` + `quizState` | Zustand `persist` · `useQuizStore` + React Query | `sessionStorage` + RQ cache | `quiz-player-id` ※ | 탭 세션 | `selectedPlayerId` (store) · `IFirebasePlayer` (RQ) |
| **검색 입력** | persist 없음 · `inputState` | persist 없음 · `useInputStore` | — | — | 메모리 | 검색어 문자열 |
| **API 캐시** | `@tanstack/react-query-persist-client` | 동일 · `setupQueryPersist()` | `localStorage` | RQ dehydrate 키 | 24h (`maxAge`) | `queryKey[0] === 'persist'` 인 쿼리만 |

※ 퀴즈 storage 키: Recoil `quizPlayer` → Zustand `quiz-player` → **`quiz-player-id`** (선수 객체 persist 제거). 배포 후 기존 탭 캐시는 자동 이전되지 않음 (리그는 §8-4 마이그레이션).

#### Recoil persist vs Zustand persist (동작)

| | Recoil + `recoil-persist` | Zustand + `persist` (league) |
| -- | ------------------------- | ------------------------------ |
| 선언 | atom `effects_UNSTABLE: [persistAtom]` | `persist(..., { name, storage, ... })` |
| 저장 시점 | atom set 시 | `setState` 시 (`partialize` 적용) |
| 저장 형식 | `{ "leagueInfo": { "id": 39 } }` | `{ "state": { "id": 39 }, "version": 0 }` |
| SSR (Next) | `sessionPersistStorage` noop → 클라이언트에서 effect로 복원 | `skipHydration: true` → **수동** `rehydrate()` (§8-3) |
| 가드 | Recoil은 CSR 위주라 submission 가드가 단순했음 | `ProtectedRoute`에서 **hydration 완료 후** redirect (§8-3) |

#### React Query persist (변경 없음)

```typescript
// persistClient.ts — Recoil 전환과 무관, 계속 localStorage
shouldDehydrateQuery: query =>
  query.state.status === 'success' &&
  Array.isArray(query.queryKey) &&
  query.queryKey[0] === 'persist'
```

- **역할**: 팀 ID 목록·선수 ID 목록 등 **API 응답 캐시** (네트워크 절약)
- **Zustand와 분리**: `leagueId`(UI 선택) ≠ `persist` 쿼리 데이터(서버 스냅샷)

### 8-3. SSR · Next.js 대응 (league persist)

Recoil 시절 `sessionPersistStorage`로 서버에서 storage 접근을 noop 처리했습니다. Zustand `persist`는 **모듈 로드 시 자동 hydrate**가 SSR에서 빈 storage로 먼저 끝나 `hasHydrated: true`, `id: 0`이 고정되는 문제가 있어 아래 패턴을 적용했습니다.

```text
Providers (useEffect)
  └─ useLeagueInfoStore.persist.rehydrate()   ← 클라이언트에서 sessionStorage 읽기
  └─ setupQueryPersist()

ProtectedRoute
  └─ useLeagueInfoHydrated() === true 일 때만 leagueId 검사 · redirect
```

| 파일 | 역할 |
| ---- | ---- |
| `league.store.ts` | `skipHydration: true`, `partialize: { id }`, legacy Recoil JSON 읽기 |
| `Providers.tsx` | 마운트 후 `rehydrate()` |
| `ProtectedRoute.tsx` | hydration 전 `null` 반환, 이후 `leagueId` 없으면 home |

`useLeagueInfoHydrated`는 React state로 rehydrate 완료를 노출합니다.

```typescript
// league.store.ts — 요약
useState(() => useLeagueInfoStore.persist.hasHydrated())
useEffect(() => {
  const unsub = useLeagueInfoStore.persist.onFinishHydration(() => setHydrated(true))
  setHydrated(useLeagueInfoStore.persist.hasHydrated()) // 늦게 마운트된 컴포넌트 동기화
  return unsub
}, [])
```

| 동작 | 반영 여부 |
| ---- | --------- |
| `false → true` (첫 rehydrate) | ✅ `onFinishHydration` |
| 마운트 시 이미 `true` | ✅ `useEffect` 내 `hasHydrated()` 동기화 |
| `true → false → true` (rehydrate 재호출) | ❌ `onHydrate` 미구독, `setHydrated(false)` 없음 |

`hasHydrated()`는 **구독형 reactive 값이 아님**. 현재 `Providers`에서 `rehydrate()`는 마운트 시 1회만 호출하므로 **`false → true` 한 번만** 필요하고, 이 패턴으로 충분합니다.

### 8-4. storage 키 · 포맷 마이그레이션

**리그 (`leagueInfo`)**

| | Recoil `recoil-persist` | Zustand |
| -- | ------------------------ | ------- |
| sessionStorage 키 | `leagueInfo` | `leagueInfo` (동일) |
| 값 예시 | `{"leagueInfo":{"id":2021}}` | `{"state":{"id":2021},"version":0}` |

`league.store.ts`의 `leaguePersistStorage.getItem`에서 Recoil 형식을 Zustand 형식으로 변환해 읽습니다. 신규 저장은 Zustand 형식만 씁니다.

**퀴즈**

| | Recoil | Zustand |
| -- | ------ | ------- |
| sessionStorage 키 | `quizPlayer` | `quiz-player-id` |
| persist 값 | `IFirebasePlayer` 전체 | `{ selectedPlayerId: number \| null }` |
| 마이그레이션 | — | **없음** (키·포맷 변경으로 이전 세션 퀴즈는 무시) |

**입력값** — Before/After 모두 persist 없음. 새로고침 시 검색어 초기화는 동일.

### 8-5. 제거한 항목

| 항목 | 비고 |
| ---- | ---- |
| `recoil`, `recoil-persist` | `package.json` |
| `RecoilRoot` | `Providers.tsx` |
| `leagueInfoState.ts`, `quizState.ts`, `inputState.ts` | → `*.store.ts` |
| `sessionPersistStorage` (`shared/lib/storage`) | league store에서 `sessionStorage` 직접 사용 |

### 8-6. 선택적 후속 (전환 범위 밖)

Recoil → Zustand **전환 자체는 완료**. 아래는 일관성·구조 개선용 선택 과제입니다.

| 항목 | 우선순위 | 메모 |
| ---- | -------- | ---- |
| `quiz.store` SSR hydration 통일 | 낮음 | league와 동일하게 `skipHydration` + `rehydrate()` 가능. 현재는 자동 hydrate · 라우트 가드 미연동이라 **실질 영향 제한적** (§8-7) |
| `app/submission/page.tsx` `force-dynamic` | 낮음 | 클라이언트 가드·persist 의존. 제거 시 동작 재확인 필요 |

### 8-7. 최종 검토 (2026-06-17)

#### 체크리스트

| 항목 | 결과 |
| ---- | ---- |
| `recoil` · `recoil-persist` 의존성 제거 | ✅ `package.json`에 없음 |
| Recoil atom / `RecoilRoot` 잔존 | ✅ 코드베이스 0건 |
| atom 3개 Zustand store 이전 | ✅ `league` · `quiz` · `input` |
| persist storage 키·포맷 | ✅ league legacy 호환 · quiz 키 `quiz-player-id` · ID만 persist |
| quiz store · React Query 분리 | ✅ `selectedPlayerId` + `useFetchingPlayerData` (§8-8) |
| SSR · hydration (league) | ✅ `skipHydration` + `Providers.rehydrate()` + `useLeagueInfoHydrated` |
| 소비처 import 전환 | ✅ grep 기준 전부 `*.store.ts` |
| `npm run build` | ✅ 통과 |

#### store별 요약

```text
src/entities/league/model/league.store.ts   useLeagueInfoStore   persist · SSR 수동 rehydrate · legacy JSON
src/widget/submission/model/quiz.store.ts   useQuizStore         persist · selectedPlayerId only · 자동 hydrate
src/entities/search/model/input.store.ts    useInputStore        메모리 only
```

| Store | persist | SSR 패턴 | 소비처 |
| ----- | ------- | -------- | ------ |
| `useLeagueInfoStore` | sessionStorage `leagueInfo` | `skipHydration` + `rehydrate()` | `ProtectedRoute`, `useLeagueSelectModal`, `ClubViews`, `useQuizGenerator` |
| `useQuizStore` | sessionStorage `quiz-player-id` | 자동 hydrate (클라이언트) | `useQuizGenerator` |
| `useFetchingPlayerData` | React Query cache | `keepPreviousData` | `useQuizGenerator` → `SubmissionCard` |
| `useInputStore` | 없음 | 해당 없음 | `useSearch`, `useSubmissionGame`, `useClubSquadModal` |

#### Providers · 가드 흐름

```text
app/layout.tsx
  └─ Providers (client)
       ├─ useLeagueInfoStore.persist.rehydrate()   ← league만 수동
       └─ setupQueryPersist()                       ← React Query (localStorage)

app/submission/layout.tsx
  └─ ProtectedRoute
       ├─ useLeagueInfoHydrated() === false → null
       ├─ leagueId 없음 → home redirect (LHCI 제외)
       └─ children
```

#### `quiz.store` SSR — league와 다른 점

league는 **라우트 가드**에 쓰이므로 SSR에서 `id: 0`으로 고정되면 오 redirect가 발생합니다.  
quiz store는 **`selectedPlayerId`만** persist하며, 선수 상세는 React Query가 담당합니다. persist 자동 hydrate가 서버에서 빈 값으로 끝나도:

- `ProtectedRoute`는 league hydration만 기다림
- `selectedPlayerId`가 없으면 `playersId` sync effect가 랜덤 ID 선택 → RQ fetch
- 새로고침 시 sessionStorage의 ID로 RQ가 선수 데이터 재fetch

→ **전환 완료 기준에는 문제 없음**. league와 패턴 통일은 선택 과제.

#### React Query persist (변경 없음)

Zustand와 **역할 분리** 유지:

| | Zustand | React Query persist |
| -- | ------- | ------------------- |
| 데이터 | UI 선택 상태 (리그 ID, 퀴즈 선수 ID, 검색어) | API 응답 캐시 (`queryKey[0] === 'persist'`, 선수 상세 `player`) |
| Storage | sessionStorage (league, quiz ID) / 없음 (input) | localStorage |
| 복원 | `Providers.rehydrate()` (league) / 자동 (quiz ID) | `setupQueryPersist()` |

### 8-8. quiz store · React Query 분리 (완료)

`IFirebasePlayer` 전체를 Zustand에 두던 1차 전환(§8) 이후, **선택 ID와 선수 데이터**를 분리했습니다.

| | Before (§8 1차) | After (§8-8) |
| -- | --------------- | ------------ |
| store | `quiz: IFirebasePlayer` | `selectedPlayerId: number \| null` |
| persist 키 | `quiz-player` | `quiz-player-id` |
| 선수 데이터 | store에 `setQuiz(player)` 동기화 | `useFetchingPlayerData` (React Query) |
| UI | `SubmissionCard`가 store `quiz` 구독 | `useQuizGenerator`가 `player` 반환 → props |

```text
playersId (RQ) ──sync effect──▶ selectedPlayerId (Zustand persist)
                                      │
                                      ▼
                            useFetchingPlayerData (RQ · keepPreviousData)
                                      │
                                      ▼
                              SubmissionCard (player prop)
```

- `generateQuiz()` / 리그 변경: ID만 갱신 → query key 변경 → 자동 fetch
- `keepPreviousData`: 선수 변경 중 이전 사진 유지 (스켈레톤 대신 페치 애니메이션)
- mount `generateQuiz()` 제거: `playersId` sync effect가 초기 ID 선택

#### 결론

**Recoil → Zustand 전환 및 quiz store 분리는 완료**입니다. 남은 항목은 quiz SSR 패턴 통일 등 **선택적 개선**이며, 배포·동작을 막는 미완료 항목은 없습니다.

## 9. Next 서버 이점 — 현재 한계와 활용 방향

> **현재:** 데이터 fetch는 클라이언트 axios → Firebase RTDB. Next는 **라우팅·metadata·빌드·배포 셸** 역할이 중심.

### 9-1. 지금 구조

```text
사용자 리그 선택 (Zustand · sessionStorage)
  → leagueId 확정
    → React Query fetch (팀/선수 ID · 선수 상세)
      → hover prefetch (usePrefetchLeagueData)
```

| 계층 | 역할 |
| ---- | ---- |
| **Next `<Link>` prefetch** | 라우트 JS/RSC 페이로드 (데이터 아님) |
| **React Query `prefetchQuery`** | API 응답 → `QueryClient` 캐시 (`Providers` 하위 client navigation 유지) |
| **RQ persist** | `queryKey[0] === 'persist'` → localStorage 24h |

**서버가 leagueId를 모르는 이유:** `sessionStorage`는 브라우저 전용 → SSR/RSC 시점에 접근 불가.  
→ **첫 방문·리그 선택 전**에는 Next 서버 fetch/SSG 이점이 거의 없음 (Vite SPA와 유사).

hover prefetch는 Next 한계가 아니라 **RQ 클라이언트 캐시** 패턴이라 Next에서도 유효.

### 9-2. 서버 이점을 쓰려면

관문: **서버가 leagueId를 알게 만들 것** (cookie, URL param, middleware).

| 방향 | 개요 | 기대 효과 |
| ---- | ---- | --------- |
| **cookie + submission Server prefetch** | 리그 선택 시 cookie 저장 → `/submission` RSC에서 fetch → RQ `dehydrate` | 재방문·직링크 시 첫 paint 단축 |
| **middleware 가드** | cookie 없으면 `/` redirect (HTML 전) | `ProtectedRoute` null 깜빡임 감소 |
| **Route Handler + `revalidate`** | RTDB 조회를 `app/api/...` + 서버 캐시 | RTDB hit 감소, BFF·rate limit 여지 |
| **Server / Client UI 분리** | Cover·Header 정적 부분 RSC, modal·퀴즈는 client island | JS 번들·hydration 비용 감소 |
| **Server Actions** | 리그 선택 시 `cookies().set` + `redirect` | cookie 패턴과 자연스럽게 연결 |

**클라이언트 유지가 맞는 것:** prefix 자동완성, 퀴즈·정답 처리, hover prefetch, 입력 state.

### 9-3. 추천 순서 (미적용 · 선택)

```text
1. Server UI 분리 (비용 낮음)
2. cookie + middleware 가드
3. cookie + submission Server prefetch + dehydrate
4. Route Handler + revalidate
```

현재 PL(id: 39) 단일 리그면 (3)을 cookie 없이 서버 기본값으로 단순화할 수 있으나, 멀티 리그 확장 시 cookie 패턴 권장.
