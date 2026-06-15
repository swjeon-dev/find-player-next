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

- [x] `app/layout.tsx` + `src/app/providers/Providers.tsx` (Query, Recoil, Theme, `global.css`)
- [x] `src/pages/*` → `app/page.tsx`, `app/submission/page.tsx`, `app/not-found.tsx`
- [x] `Header` — `react-router-dom` Link → `next/link`
- [x] `tsconfig` include에 `app` 추가
- [x] Vite SPA 진입점 제거 (`src/index.tsx`, `index.html`, `index.html__`)

### 3-2. 라우팅·셸 정리 ✅

- [x] `LeagueSelectModal` — `useNavigate` → `next/navigation` `useRouter`
- [x] `ProtectedRoute` — `Outlet`/`Navigate` 제거, `children` + `useRouter` 패턴으로 전환
- [x] `app/submission/layout.tsx` — submission 라우트에 리그 선택 가드 연결
- [x] `app/layout.tsx` — `modal-root` portal 대상 추가
- [x] `metadata` — root layout `title.template`, 하위 page는 `title` 문자열만 지정
- [x] `app/` 페이지 UI → FSD `widget/` 슬라이스 이동 (`CoverView`, `NotFoundView`, `SubmissionView`)
- [x] `app/not-found.tsx` — 조기 `return` 버그 수정
- [x] `react-router-dom`, `react-helmet-async` 의존성 제거
- [x] SPA 레거시 제거 (`AppRouter_`, FSD `RootLayout.tsx`)
- [x] SSR 호환 — `recoil-persist`/`query persist`의 `sessionStorage`·`localStorage` 접근을 클라이언트로 지연
- [x] `app/submission/page.tsx` — `dynamic = 'force-dynamic'` (Recoil 상태 의존 라우트)
- [x] styled-components FOUC 대응 — `compiler.styledComponents` + `StyledComponentsRegistry` (`src/app/providers/`)

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

| 환경         | import `@/shared/lib/dev`             | 동작                            |
| ------------ | ------------------------------------- | ------------------------------- |
| `next dev`   | `index.ts` → `Profiler.tsx`           | 콘솔에 렌더 시간 출력           |
| `next build` | `index.prod.ts` → `Profiler.prod.tsx` | children만 반환 (오버헤드 없음) |

> barrel import (`@/shared`)는 alias를 타지 않습니다. Profiler 사용 시 `@/shared/lib/dev`로 직접 import하세요.

Next 16에서는 `next dev` / `next build` 모두 Turbopack이 기본입니다. webpack fallback이 필요하면 `--webpack` 플래그를 사용합니다.

### 미완료

- [ ] **배포** — Vercel 프로젝트 연동 (루트 배포 시 `basePath` 불필요; 서브패스 배포 시 `next.config` `basePath` + env 검토)

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

`ProtectedRoute`에서 리그 선택 가드를 CI 때만 우회:

```typescript
if (process.env.NEXT_PUBLIC_LHCI === 'true') {
  return <>{children}</>
}
```

- `lighthouse.yml` Build step: `env.NEXT_PUBLIC_LHCI: 'true'` → 번들에 `"true"`로 인라인
- CI에서 `NEXT_PUBLIC_LHCI`를 할당하지 않으면 → `=== 'true'`가 false → 리그 가드 정상 동작 (의도된 동작)

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

실무적으로는 **page(`app/`)에서는 `@/widget/home`처럼 슬라이스 단위 import**, **widget 내부에서는 형제 슬라이스를 `@/widget/club`처럼 직접 import**하는 절충이 무난합니다. layout에서 `@/shared/ui/layout`처럼 세그먼트 직접 import가 필요한 경우는 §6-5 참고.

## 6. styled-components + App Router

### 6-1. Next에서 쓸 수는 있는데, 효율적이진 않음

Next App Router에서 styled-components **쓸 수는 있음**. 다만 기본은 Server Component + 빌드 타임 CSS라, 지금처럼 쓰려면 Registry·`'use client'` 경계가 추가로 필요하고 런타임 주입 비용도 있음. **Next에 가장 잘 맞는 스타일 방식은 아님.**

| 방식                        | App Router | 메모                   |
| --------------------------- | ---------- | ---------------------- |
| CSS Modules                 | ◎          | Next 기본, RSC 그대로  |
| Tailwind                    | ◎          | 빌드 타임, 트리 쉐이킹 |
| styled-components           | △          | 가능. Registry 필요    |
| Panda CSS / Vanilla Extract | ○          | zero-runtime 쪽        |

이 프로젝트는 Vite 때부터 styled-components 써 와서 **당장 갈아엎기보단 유지**. 나중에 UI 많이 손볼 때 CSS Modules나 Tailwind 같은 **빌드 타임 CSS**로 옮기는 게 맞아 보임.

### 6-2. FOUC — client styled를 server layout이랑 같이 쓸 때

홈 들어가면 잠깐 스타일 없는 화면 나오는 거, **styled-components 때문이 맞음** (FOUC).

구조:

```text
app/layout.tsx          (Server)
  └─ StyledComponentsRegistry
       └─ Providers     ('use client')
            ├─ GlobalStyle      ← body #001d3d, reset
            ├─ ThemeProvider
            └─ main
                 └─ CoverView 등  ('use client', widget/)
```

styled-components는 원래 **브라우저에서 `<style>` 넣는 방식**. `GlobalStyle`이랑 페이지 styled가 전부 Client 트리 안에 있으면, **서버가 보내는 HTML에는 CSS가 거의 없음** → hydration 전까지 브라우저 기본 스타일로 그림.

Registry 없을 때 특히 눈에 띄는 건 `GlobalStyle` 쪽임. `Providers`가 client라 **body 배경(`#001d3d`)·reset·`box-sizing`이 첫 HTML에 안 들어감** → 홈 접속 시 흰 화면이 잠깐 보임. 그 아래 `LeagueSelectModal` 버튼 styled도 같은 이유로 늦게 붙음.

`next.config.ts`의 `compiler.styledComponents: true`만으로는 FOUC 안 잡힘. 클래스명 정리용이고, **첫 HTML에 CSS 실어 보내는 건 Registry**가 함.

### 6-3. 지금 적용해 둔 것

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

### 6-4. Registry가 하는 일 (헷갈리기 쉬운 부분)

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

### 6-5. 그 외

- styled + hooks 쓰는 UI는 `'use client'`. metadata는 server `page`/`layout`에서.
- layout에서 `@/shared` barrel 쓰면 hooks가 server에 끌려올 수 있음 → `@/shared/ui/layout`처럼 직접 import.
- Profiler stub은 `@/shared/lib/dev`로 직접 (barrel은 alias 안 탐).

## 7. GlobalStyle → `global.css` (styled-components reset 이전) ✅

styled-components `GlobalStyle` + `styled-reset`을 제거하고, **빌드 타임 global CSS**로 옮겼습니다. 컴포넌트 styled-components → CSS Modules 전환(§6-1)의 1단계입니다.

### 7-1. 변경 요약

| Before | After |
| ------ | ----- |
| `GlobalStyle.tsx` (`createGlobalStyle` + `styled-reset`) | `src/app/styles/global.css` |
| Client `Providers`에서 `<GlobalStyle />` mount | Server `app/layout.tsx`에서 `@/app/styles` import |
| Meyer reset (`styled-reset`, styled-components 의존) | `modern-normalize` (`@import` in CSS) |

### 7-2. `global.css`

```css
@import 'modern-normalize/modern-normalize.css';

* { box-sizing: border-box; }
body {
  width: 100%;
  height: 100%;
  background-color: #001d3d;
  color: white;
  margin: 0;
}
a { text-decoration: none; }
```

- **reset**: `styled-reset`(Meyer, 레거시 브라우저 대응) → **`modern-normalize`**(최신 브라우저 baseline, 파일 크기 작음 → 로딩 유리)
- **앱 토큰**: body 배경·글자색·`box-sizing`·링크 밑줨은 기존 `GlobalStyle`과 동일

### 7-3. import 경로

```typescript
// app/layout.tsx (Server)
import '@/app/styles' // → styles/index.ts → global.css side-effect
```

`Providers`에서는 `GlobalStyle` 제거. body 배경 FOUC는 layout import로 **첫 HTML `<head>`에 CSS 포함**됩니다.

### 7-4. 남은 작업

- [ ] 컴포넌트 `.style.ts` → CSS Modules (파일 단위 점진)
- [ ] `ThemeProvider` / `StyledComponentsRegistry` / `styled-components` 의존성 제거
- [ ] `styled-reset` 패키지 제거 (GlobalStyle 삭제 후 미사용)
