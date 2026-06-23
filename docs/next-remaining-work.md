# Next.js 전환 — 남은 작업

> **완료·이력·상세 가이드**는 [`next-migration.md`](./next-migration.md) 를 참고합니다.  
> 본 문서는 **아직 하지 않은 작업**만 모아 우선순위와 함께 정리합니다. (2026-06-23 갱신)

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
| submission 데이터 | server prefetch **제거** → modal hover prefetch + **in-component skeleton** (§10) |
| submission 로딩·오류 | segment `loading`/`error` **없음** — RQ skeleton + `ClubViewsError`/`SubmissionLoader` + 전역 `error.tsx` (§15) |
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
| 2 | ~~**서버 fetch 모듈 분리**~~ ✅ | `shared/api/server` (`fetchLeagueList`) / `shared/api/client` 분리 | RSC·proxy vs React Query |
| 3 | ~~**Route Handler BFF**~~ 보류 | 클라이언트 RTDB 직접 + RQ persist·prefetch (§12) | 규모·ROI상 전환 비용 대비 이점 없음 — **현상 유지** |
| 4 | ~~**홈 리그 목록 캐시**~~ ✅ | `server/` fetch + `revalidate: 1h` + tags | proxy·홈·검증 공유 (`unstable_cache` 불필요) |

**관련 파일:** `src/shared/api/`, `app/page.tsx`, `app/api/` (신규)

---

### P2 — UX·체감 성능

| # | 작업 | 현재 | 기대 효과 |
| - | ---- | ---- | --------- |
| 5 | ~~**전역 loading / error**~~ ✅ | `app/loading.tsx`, `app/error.tsx` | 라우트 전환·RSC throw |
| 6 | ~~**submission loading**~~ ✅ | segment `loading.tsx` **없음** — `ClubViewsContent`·`SubmissionCard` skeleton | segment fallback(스피너)와 중복 방지 |
| 7 | ~~**submission error**~~ ✅ | segment `error.tsx` **없음** — 전역 `error.tsx` + fetch 인라인 retry | RQ error는 boundary 밖 |
| 8 | ~~**`next/image`**~~ ✅ | `remotePatterns` + 5개 컴포넌트 전환, submission LCP `priority` | LCP·전송량 (submission LCP **-12%**, 이미지 **-94%**) |
| 9 | ~~**Suspense 세분화**~~ ✅ | `ClubSquadModal` **`next/dynamic`** | `useQuery`+skeleton — `useSuspenseQuery` 미사용 |
| 10 | ~~**submission cold visit**~~ ✅ | skeleton + RQ persist — server prefetch·segment loading **미도입** | 의도된 트레이드오프 (§10) |

**관련 파일:** `app/submission/`, `LeagueSelectItem.tsx`, `widget/submission/`, `widget/club/`

---

### P3 — 배포·운영

| # | 작업 | 현재 |
| - | ---- | ---- |
| 11 | **Vercel(또는 호스트) 배포** | 미연동 (`deploy.yml__` 비활성) |
| 12 | **env·도메인** | RTDB read-only 공개 카탈로그 — 클라이언트 직접 호출 수용 (BFF 보류) |
| 13 | ~~**`next-migration.md` 진행 현황 동기화**~~ ✅ | §9 prefetch 제거·submission UX(§15) 반영 |

---

## 선택 과제 (트래픽·규모 증가 시)

| 작업 | 설명 |
| ---- | ---- |
| **동적 metadata** | ~~submission `generateMetadata`~~ ✅ — cookie `leagueId` → title.template에 리그명 |
| **Parallel route `@modal`** | modal ↔ URL·뒤로가기 연동 |
| **quiz store SSR 패턴 통일** | `skipHydration` + `rehydrate` (§8-6) — league store 제거 후 **선택·우선순위 낮음** |
| ~~**barrel import 정리**~~ ✅ | `app/` → `@/widget/{home,submission,route-state,not-found}` — 루트 `widget/index.ts` 제거 |
| **리그 many 시** | modal 리스트 가상화 (§10) |
| **Route Handler BFF** | RTDB 트래픽·비용·동시 사용자 급증 시 id 목록 등 **부분** 도입 검토 (현재 보류) |
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
2. ~~Route Handler BFF~~ 보류 (규모·ROI — §12)
3. ~~submission UX (skeleton·error·Suspense·cold visit)~~ ✅ (§15)
4. ~~next/image~~ ✅
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
app/page.tsx              → @/widget/home
app/submission/page.tsx   → @/widget/submission
app/loading|error.tsx     → @/widget/route-state
app/not-found.tsx         → @/widget/not-found
proxy.ts                           ← leagueId 가드 (named export, 프로젝트 루트)
src/shared/api/rtdbRequest.ts      ← 공통 fetch 래퍼
src/shared/api/client/             ← 클라이언트 fetch (cache: no-store)
src/shared/api/server/             ← 서버 fetch (next.revalidate + tags)
src/shared/config/rtdbConfig.ts    ← RTDB base URL·headers
src/widget/club/ClubViewsContent.tsx   ← 팀 그리드 skeleton
src/widget/club/ui/ClubViewsError.tsx  ← 팀 fetch 인라인 retry
src/widget/submission/ui/SubmissionCard.tsx ← 선수 사진 skeleton
src/widget/club/ui/ClubWithSquadModal.tsx   ← ClubSquadModal next/dynamic + hover prefetch
src/widget/route-state/            ← LoadingView, ErrorView (전역 loading/error)
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
[ ] Route Handler BFF + revalidate — **보류** (규모·ROI, RQ persist·prefetch로 충분)
[x] 홈 리그 목록 캐시 — `server/` `revalidate: 1h` + tags
[x] next/image + remotePatterns (LeagueSelectItem, Club, SubmissionCard, HintUI, AutoSearchList)
[x] submission 로딩 — in-component skeleton (segment loading.tsx 없음)
[x] submission 오류 — 전역 error.tsx + ClubViewsError/SubmissionLoader 인라인 retry
[x] Suspense — ClubSquadModal next/dynamic (useQuery+skeleton 유지)
[x] submission cold visit — skeleton + persist (server prefetch·segment loading 미도입)
[x] submission generateMetadata — 리그명 title.template
[x] app/ widget barrel — 슬라이스 직접 import (`@/widget/home` 등)
[ ] Vercel 배포
[x] next-migration.md §9 진행 현황·아키텍처 표 동기화 (prefetch 제거·§15)
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
