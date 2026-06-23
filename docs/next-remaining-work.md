# Next.js 전환 — 남은 작업

> **완료·이력·상세 가이드**는 [`next-migration.md`](./next-migration.md) 를 참고합니다.  
> 본 문서는 **아직 하지 않은 작업**만 모아 우선순위와 함께 정리합니다. (2026-06-22 갱신)

---

## 프로젝트 상태 요약

- **핵심 마이그레이션 완료** — App Router, CSS Modules, Zustand, `proxy.ts` 가드, cookie `leagueId`
- **배포·동작을 막는 블로커 없음**
- 상세 이력: [`next-migration.md`](./next-migration.md)

---

## 현재까지 완료 요약

| 영역 | 완료 |
| ---- | ---- |
| App Router · FSD widget | `app/page`, `app/submission`, layout, metadata |
| 스타일 | CSS Modules 전환, styled-components 제거 |
| 상태 | Recoil → Zustand, quiz store · RQ 분리, `leagueId` cookie |
| 가드 | `proxy.ts` (cookie 검증·invalid 삭제), flash toast, `selectLeagueAction` (API 목록 검증) |
| 홈 데이터 | RSC `fetchLeagueList` → `CoverView` |
| 모달 | ref-only + `mounted` hydration gate (§10) |
| 알림 | `FlashToastView` (redirect flash) · `NotificationView` (in-app, 리그 선택·목록 실패) |
| submission 데이터 | server prefetch **제거** → modal hover prefetch + client skeleton (§9-9-5) |
| P0 신뢰성·보안 | `leagueId` 검증, `leagueDto` empty/fetch 정책, proxy fetch fail-closed |
| 전역 route boundary | `app/loading.tsx` (스피너), `app/error.tsx` — `widget/route-state/` |
| proxy (Next 16) | 루트 `proxy.ts`, `export async function proxy` (named export) |
| CoverView a11y | sr-only `h2` 제거 → `LeagueSelectModalTrigger` `aria-label` |

**P0 정책 요약**

| 계층 | fetch/empty 실패 | invalid id |
| ---- | ---------------- | ---------- |
| 홈 RSC | `[]` → Game Start 시 Notification | — |
| `selectLeagueAction` | `LEAGUE_LIST_UNAVAILABLE` Notification | `LEAGUE_SELECT_UNAVAILABLE` |
| `proxy.ts` | flash + redirect (cookie 유지) | flash + cookie 삭제 |

---

## 남은 작업 — 우선순위

### P1 — API·성능

| # | 작업 | 현재 | 기대 효과 |
| - | ---- | ---- | --------- |
| 1 | ~~**axios → fetch 전환**~~ ✅ | `rtdbRequest` + `client/`·`server/` native fetch, 앱 `axios` 제거 | 번들·일관성 |
| 2 | ~~**서버 fetch 모듈 분리**~~ ✅ | `shared/api/server` (`fetchLeagueListServer`) / `shared/api/client` 분리 | RSC·proxy vs React Query |
| 3 | **Route Handler BFF + `revalidate`** (§9 Phase 5) | 클라이언트 RTDB 직접 호출, `app/api/` 없음 | 서버 캐시, RTDB hit 감소, URL 비노출 |
| 4 | **홈 리그 목록 캐시** | `fetchLeagueListServer`에 `revalidate: 1h` 적용됨 | 나머지 API·`unstable_cache` 검토 |

**관련 파일:** `src/shared/api/`, `app/page.tsx`, `app/api/` (신규)

---

### P2 — UX·체감 성능

| # | 작업 | 현재 | 기대 효과 |
| - | ---- | ---- | --------- |
| 5 | **전역 loading / error** | ✅ `app/loading.tsx`, `app/error.tsx` | — |
| 6 | **`app/submission/loading.tsx`** | 없음 | submission 전용 스트리밍·로딩 |
| 7 | **`app/submission/error.tsx`** | 없음 | submission 전용 복구 UI |
| 8 | ~~**`next/image`**~~ ✅ | `remotePatterns` + 5개 컴포넌트 전환, submission LCP `priority` | LCP·전송량 (submission LCP **-12%**, 이미지 **-94%**) |
| 9 | **Suspense 경계** | `ClubSquadModal` lazy만 | `ClubViews` / `SubmissionGameContainer` 등 구간별 스트리밍 |
| 10 | **submission cold visit** | server prefetch 제거 상태 | 직접 URL·새로고침 시 ID 목록 지연 — 가벼운 RSC prefetch 재검토 (§9-9) |

**관련 파일:** `app/submission/`, `LeagueSelectItem.tsx`, `widget/submission/`, `widget/club/`

---

### P3 — 배포·운영

| # | 작업 | 현재 |
| - | ---- | ---- |
| 11 | **Vercel(또는 호스트) 배포** | 미연동 (`deploy.yml__` 비활성) |
| 12 | **env·도메인** | BFF 전까지 RTDB URL 클라이언트 노출 |
| 13 | **`next-migration.md` 진행 현황 동기화** | §9 등 구식 문구 잔존 |

---

## 선택 과제 (트래픽·규모 증가 시)

| 작업 | 설명 |
| ---- | ---- |
| **동적 metadata** | submission 등 `generateMetadata` + cookie `leagueId` |
| **Parallel route `@modal`** | modal ↔ URL·뒤로가기 연동 |
| **quiz store SSR 패턴 통일** | league와 동일 `skipHydration` + rehydrate (§8-6) |
| **barrel import 정리** | `@/widget` 등 client 번들 경계 (§5-3) |
| **리그 many 시** | modal 리스트 가상화 (§10) |
| **functions 리그 동기화** | `functions/src` 리그 목록 동기화 TODO |

---

## 하지 말아야 할 것 (§9-7 요약)

- widget 전체에 `'use client'` — RSC 셸 이점 상실
- submission에서 **팀 상세 전부** 서버 prefetch — TTFB 악화
- server prefetch를 “hover 보완”이 아닌 **데이터 보장**으로만 쓰면 happy path에서 **중복 fetch** (§9-9)

---

## 추천 적용 순서

```text
1. ~~axios → fetch + server fetch 모듈 분리~~ ✅
2. Route Handler BFF + revalidate (리그·id 목록)    ← P1
3. submission loading/error (필요 시)              ← P2
4. ~~next/image~~ ✅, Suspense 세분화                     ← P2
5. Vercel 배포                                     ← P3
```

---

## 알려진 이슈 (앱 버그 아님)

| 증상 | 원인·대응 |
| ---- | --------- |
| React DevTools 콘솔 경고 (`Suspense boundary`) | React 19 + `useTransition` / `router.refresh()` + DevTools 확장 — 시크릿·확장 비활성으로 재현 확인 |
| `adapterFn is not a function` (proxy) | Turbopack 캐시·중복 dev 서버 — `.next` 삭제, dev 단일 인스턴스, `export async function proxy` 유지 |

---

## 주요 파일 맵

```text
app/loading.tsx, app/error.tsx     ← 전역 boundary
proxy.ts                           ← leagueId 가드 (named export, 프로젝트 루트)
src/shared/api/rtdbRequest.ts      ← 공통 fetch 래퍼
src/shared/api/client/             ← 클라이언트 fetch (cache: no-store)
src/shared/api/server/             ← 서버 fetch (next.revalidate + tags)
src/shared/config/rtdbConfig.ts    ← RTDB base URL·headers
src/widget/route-state/            ← LoadingView, ErrorView
next.config.ts                     ← images.remotePatterns (media.api-sports.io)
scripts/compare-next-image-lighthouse.mjs  ← img vs next/image Lighthouse 비교 (로컬)
```

---

## 체크리스트 (갱신용)

```text
[x] selectLeagueAction — API 목록 기반 leagueId 검증 + Notification
[x] proxy.ts — API 목록 기반 leagueId 검증 + invalid cookie 삭제 + FlashToast
[x] leagueDto empty / fetch 실패 — fetchLeaguesInfoServer + LeagueListError
[x] proxy fetch 실패 — fail-closed + LEAGUE_LIST_UNAVAILABLE flash
[x] proxy.ts — Next 16 named export (`export async function proxy`)
[x] app/loading.tsx — 전역 LoadingView (스피너)
[x] app/error.tsx — 전역 ErrorView
[x] widget/route-state 슬라이스
[x] axios → fetch (shared/api) — `rtdbRequest`, `client/`, 앱 `axios` 의존성 제거
[x] server fetch 모듈 분리 — `server/` vs `client/`, `firebase*` → `rtdb*` config
[ ] Route Handler BFF + revalidate
[x] next/image + remotePatterns (LeagueSelectItem, Club, SubmissionCard, HintUI, AutoSearchList)
[ ] 홈 fetchLeagueList 캐시 (unstable_cache 등 추가 검토)
[ ] app/submission/loading.tsx
[ ] app/submission/error.tsx
[ ] submission cold visit prefetch 재검토
[ ] Vercel 배포
[ ] next-migration.md 진행 현황 문구 동기화
```

---

## 문서 간 역할

| 문서 | 역할 |
| ---- | ---- |
| [`next-migration.md`](./next-migration.md) | 전환 **이력·완료·상세 가이드** (§8–§11) |
| [`tech-decisions.md`](./tech-decisions.md) | 기술·라이브러리 **선택 이유** (포트폴리오·면접) |
| **본 문서** | **남은 작업·우선순위·체크리스트** |
| [`portfolio.md`](./portfolio.md) | 포트폴리오·성과 요약 |

완료 시 본 문서 체크리스트와 `next-migration.md` **진행 현황**을 함께 갱신합니다.
