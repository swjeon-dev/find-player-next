# 기술 선택 이유 (포트폴리오·면접용)

> **목적:** “왜 이 기술을 썼는가”를 한곳에 모아, 서류·면접·회고에서 바로 인용할 수 있게 합니다.  
> **상세 이력·체크리스트:** [`next-migration.md`](./next-migration.md) · [`next-remaining-work.md`](./next-remaining-work.md)  
> **과거(Vite·FSD·prefetch) 맥락:** [`portfolio.md`](./portfolio.md)

---

## 읽는 법

각 항목은 아래 형식입니다.

| 항목 | 설명 |
| ---- | ---- |
| **문제** | 해결하려던 제약 |
| **선택** | 채택한 기술·패턴 |
| **이유** | 왜 이쪽인가 (핵심 1~3줄) |
| **대안** | 검토했으나 채택하지 않은 것 |
| **트레이드오프** | 감수한 비용 |

---

## 1. 선택 리그 ID — HTTP cookie (`league-id`)

| | |
| --- | --- |
| **문제** | `/submission` 진입 시 “리그를 골랐는지”를 **페이지 렌더 전**에 판단해야 함. RSC·Edge·Server Action도 같은 `leagueId`를 읽어야 함. |
| **선택** | `selectLeagueAction`이 `league-id` cookie set → `proxy.ts` · RSC `cookies()` · Action이 공유 |
| **이유** | cookie는 **요청 헤더에 실려 서버·Edge가 React 실행 전에 읽을 수 있음**. RQ·Zustand·sessionStorage는 브라우저 JS 안에만 있어 proxy·RSC가 접근 불가. |
| **대안** | ① Zustand + sessionStorage (§8) ② React Query persist ③ URL query (`/submission?league=1`) |
| **트레이드오프** | cookie 조작 가능 → **API 목록 기반 검증**(`getValidLeagueIds`)으로 보완. httpOnly 미사용(클라이언트에서 읽을 필요는 없으나 현재는 일반 cookie). |

**한 줄 (면접):**  
리그 ID는 **세션·가드용 서버 가독 상태**라서 cookie이고, 팀·선수 목록 같은 **조회 데이터**는 React Query가 담당합니다.

```text
leagueId     → cookie     (누가 읽나: proxy, RSC, Server Action)
team/player  → React Query (누가 읽나: client, persist 24h)
```

---

## 2. `/submission` 가드 — `proxy.ts` (Next 16)

| | |
| --- | --- |
| **문제** | 예전 `ProtectedRoute`는 **hydration 이후**에야 `leagueId`를 알 수 있어 null 깜빡임·`alert`·늦은 redirect 발생. |
| **선택** | 루트 `proxy.ts`, matcher `/submission` — cookie 없음·invalid 시 **HTML 내려주기 전** `/` redirect |
| **이유** | Edge에서 요청을 가로채 **렌더링 전** 차단. GitHub Pages CSR 시절 “새로고침하면 404/가드 실패”와 달리, **서버(Edge)가 먼저 판단**. |
| **대안** | Client `useRouter.replace` + layout 가드 |
| **트레이드오프** | invalid id 검증 시 RTDB fetch 필요 → `fetchLeagueListServer` + `revalidate: 1h`. fetch 실패 시 **fail-closed**(홈 redirect + flash). |

**한 줄:**  
가드는 **UX(깜빡임 제거)** 와 **보안(직링크 차단)** 모두를 위해 **렌더 전 계층(proxy)** 에 둡니다.

---

## 3. 리그 선택 — Server Action + `redirect`

| | |
| --- | --- |
| **문제** | 리그 선택 시 cookie set과 `/submission` 이동을 **신뢰할 수 있는 서버 경로**에서 처리해야 함. 클라이언트만 믿으면 잘못된 id 저장 가능. |
| **선택** | `selectLeagueAction`: API 목록 검증 → cookie set → `redirect('/submission')`. 실패 시 `{ ok: false, reason }` → `NotificationView`. |
| **이유** | 검증·cookie 쓰기를 **서버에서 강제**. `redirect()`는 soft navigation으로 modal prefetch RQ 캐시와도 잘 맞음(§9-9-3). |
| **대안** | `router.push` + client cookie `document.cookie` |
| **트레이드오프** | `redirect()`는 throw → client에서 `unstable_rethrow` 필요. |

---

## 4. 알림 — FlashToast vs Notification (이중 채널)

| | |
| --- | --- |
| **문제** | 실패·안내가 **redirect 직후**인지 **같은 페이지**인지에 따라 UX가 달라야 함. |
| **선택** | **FlashToast** — proxy redirect 후 cookie 1회 읽기·표시·삭제. **Notification** — `showNotificationReason` + Zustand, in-app. |
| **이유** | redirect는 React state가 초기화됨 → **flash cookie**가 유일하게 안정적. 모달 안 선택 실패는 redirect 없음 → **Notification**이 자연스러움. |
| **대안** | sonner 등 단일 toast 라이브러리 하나로 통합 |
| **트레이드오프** | 채널 두 개 유지·메시지 맵(`flashToast.ts` / `notification.ts`) 분리. |

| 상황 | 채널 | 예 |
| ---- | ---- | --- |
| cookie 없이 `/submission` | FlashToast | `NO_LEAGUE` |
| invalid cookie | FlashToast | `INVALID_LEAGUE` |
| 목록 fetch 실패 (proxy) | FlashToast | `LEAGUE_LIST_UNAVAILABLE` |
| 모달에서 잘못된 리그 선택 | Notification | `LEAGUE_SELECT_UNAVAILABLE` |
| 리그 목록 empty (홈) | Notification | `LEAGUE_LIST_UNAVAILABLE` |

---

## 5. 서버 상태 — React Query

| | |
| --- | --- |
| **문제** | RTDB는 `id 목록 → 상세` **다단계 조회**. 매번 네트워크 타면 체감 대기 큼. |
| **선택** | React Query + `prefetchQuery`(모달 hover·팀 hover) + `localStorage` persist(`queryKey[0] === 'persist'`, 24h). |
| **이유** | **클라이언트 캐시·중복 제거·백그라운드 refetch**에 적합. 퀴즈·검색 등 **사용자 세션에 묶인 조회**에 잘 맞음. |
| **대안** | SWR, raw fetch + useState |
| **트레이드오프** | 서버 `QueryClient`(RSC prefetch)와 **캐시 공유 안 됨** — modal prefetch ≠ server prefetch (§9-9-2). |

**RQ에 넣지 않는 것**

| 데이터 | 저장소 | 이유 |
| ------ | ------ | ---- |
| 선택 리그 id | cookie | 서버·proxy 가독 |
| 퀴즈 중인 선수 id | Zustand persist | UI 상호작용·가벼운 세션 |
| 검색어 | Zustand (input store) | 입력 상태 |

**카탈로그 데이터(팀/선수 id·상세)** 는 RQ. 향후 BFF 도입 시 **서버 캐시(1차) + RQ(2차)** 겹쳐 쓸 예정 (§9 Phase 5).

---

## 6. UI 상호작용 상태 — Zustand (quiz·input)

| | |
| --- | --- |
| **문제** | Recoil 제거 후 **가벼운 클라이언트 UI 상태**가 필요. 퀴즈 “지금 맞추는 선수 id”는 API 응답과 별개. |
| **선택** | `useQuizStore` — `selectedPlayerId`만 persist (`quiz-player-id`). 선수 **객체**는 RQ. |
| **이유** | §8-8에서 **선택 ID ≠ 선수 데이터** 분리. persist 용량·stale 객체 방지. |
| **대안** | Recoil(deprecated 경로), RQ에 UI 상태 혼합 |
| **트레이드오프** | league id는 §9에서 Zustand **제거** → cookie로 이전 (서버 가독 필요). |

---

## 7. 스타일 — CSS Modules (styled-components 제거)

| | |
| --- | --- |
| **문제** | styled-components는 SSR 시 Registry·hydration className 맞춤 비용. Next App Router와 **RSC 셸** 이점과 결이 다름. |
| **선택** | 컴포넌트별 `.module.css` + `global.css` (`var(--color-*)`). |
| **이유** | **빌드 타임 CSS**, RSC 컴포넌트와 궁합 좋음, 런타임 style injection 제거. |
| **대안** | styled-components 유지 + Registry |
| **트레이드오프** | 동적 테마·styled props 패턴 포기. |

---

## 8. 아키텍처 — App Router + FSD

| | |
| --- | --- |
| **문제** | Next `app/`은 라우팅·metadata, 도메인 코드는 FSD `widget`·`entities`에 두고 싶음. |
| **선택** | `app/page` → `widget/home/CoverView` (RSC) → `entities/league/LeagueSelectModal` (client island). |
| **이유** | **홈 HTML·metadata는 서버**, 모달·퀴즈 JS만 클라이언트. FSD로 도메인 경계·public API 유지. |
| **대안** | page 전체 `'use client'`, features 레이어 추가 |
| **트레이드오프** | `features` 미도입(규모상 `entities`+`widget`으로 충분). |

---

## 9. 리그 목록 검증 — API 단일 소스 (`league.constants` 제거)

| | |
| --- | --- |
| **문제** | UI용 상수 목록과 실제 RTDB 리그가 **어긋나면** 잘못된 id 저장·가드 누락. |
| **선택** | `fetchLeaguesInfoServer` → `leagueDto` → `getValidLeagueIds` / `isValidLeagueId`. Action·proxy **공유**. |
| **이유** | **한 소스(RTDB)** 로 UI·검증·가드 일치. empty·fetch 실패는 `LeagueListError` + 계층별 정책. |
| **대안** | `LEAGUE_LIST` 하드코딩 상수 |
| **트레이드오프** | 목록 조회마다(또는 캐시 TTL 내) RTDB 의존. |

---

## 10. submission 데이터 — server prefetch 제거 (현재)

| | |
| --- | --- |
| **문제** | RSC `QueryClient` prefetch와 client RQ **캐시가 공유되지 않음**. happy path(hover → 선택)에서 **중복 fetch + 전환 지연**. |
| **선택** | server prefetch 제거 → modal hover prefetch + skeleton. `leagueId`는 RSC prop(`cookies()`). |
| **이유** | hover 후 선택이 주 경로일 때 **modal 캐시 hit이 더 빠름**. cold visit(직링크)만 skeleton 감수. |
| **대안** | server prefetch 유지, BFF+공유 캐시 |
| **트레이드오프** | URL 직접 입력·새로고침 시 id 목록 로딩 지연 — `loading.tsx`·가벼운 prefetch 재검토 여지(§9-9-5). |

---

## 11. RTDB fetch — axios → native `fetch` (`shared/api`) ✅

| | |
| --- | --- |
| **문제** | `clientService.ts` + axios → RSC·proxy·Edge·번들에서 불리. 서버·클라이언트 캐시 정책이 다름. |
| **선택** | `rtdbRequest` 공통 레이어 + `client/` (`cache: 'no-store'`) / `server/` (`next: { revalidate, tags }`) 분리. 앱 루트 `axios` 제거. config `firebase*` → `rtdb*`. |
| **이유** | 서버는 Next Data Cache, 클라이언트는 React Query persist. 동일 RTDB URL·에러 처리를 한곳에서 유지. |
| **대안** | axios 유지, Route Handler BFF만 |
| **트레이드오프** | 동일 endpoint를 양쪽에서 쓸 때 진입점 2개 필요. 클라이언트는 `next` 옵션 불가 → BFF(§12)로 서버 캐시 공유는 별도 과제. |

---

## 12. (선택) RTDB BFF + 서버 캐시 — 아직 미적용

| | |
| --- | --- |
| **문제** | 브라우저가 RTDB URL 직접 호출 → 사용자마다 RTDB hit, URL 노출. |
| **선택 (예정)** | `app/api/...` Route Handler → RTDB → `revalidate`. 클라이언트 RQ는 `/api` 호출. |
| **이유** | **서버 캐시는 사용자 간 공유** (리그·팀 id 목록). 클라이언트 RQ는 **개인 재방문** 담당. |
| **대안** | 현状 client 직결 + RQ persist만 |
| **트레이드오프** | Next 서버 홉·구현 비용. 트래픽·비용 이슈 전에는 Phase 4 수준으로 충분(§9 Phase 5). |

```text
[지금]  브라우저 ──fetch(no-store)──► RTDB   (React Query 캐시)
        RSC/proxy ──fetch(revalidate)──► RTDB (Next Data Cache)
[BFF]   브라우저 ──RQ──► /api ──캐시──► RTDB  (서버+클라이언트 캐시)
```

---

## 13. 모달 — ref-only + `mounted` hydration gate (§10)

| | |
| --- | --- |
| **문제** | `<dialog>` + `createPortal`은 SSR HTML과 client 첫 render가 다르면 **hydration mismatch**. |
| **선택** | open/close는 `dialogRef`만. portal은 `mounted === true` 이후. `isOpen` state 제거. |
| **이유** | **역할 분리**: ref = open/close, mounted = SSR 안전. |
| **대안** | `isOpen`으로 조건부 mount (우연히 통과하지만 역할 혼재) |
| **트레이드오프** | hydration 직후 아주 빠른 클릭 시 한 번 no-op 가능. |

---

## 요약 표 (면접 스캔용)

| 영역 | 선택 | 핵심 이유 |
| ---- | ---- | --------- |
| 리그 ID | HTTP cookie | proxy·RSC가 **렌더 전** 읽음 |
| submission 가드 | `proxy.ts` | hydration 전 redirect, flash 안내 |
| 리그 선택 | Server Action | 서버 검증 + cookie |
| 조회 데이터 | React Query | prefetch·persist·다단계 RTDB |
| 퀴즈 UI 상태 | Zustand | 가벼운 선택 id만 persist |
| redirect 안내 | FlashToast | redirect 후 state 없음 |
| same-page 오류 | Notification | 모달·홈 in-app |
| 스타일 | CSS Modules | RSC·빌드 타임 CSS |
| 리그 검증 | API 목록 | 상수·UI·RTDB 불일치 방지 |
| submission prefetch | client 우선 | server·client RQ 캐시 비공유 |

---

## 문서 간 역할

| 문서 | 역할 |
| ---- | ---- |
| **본 문서** | **왜(Why)** — 기술·패턴 선택 근거 |
| [`portfolio.md`](./portfolio.md) | **무엇을·어떻게** — 이슈·해결·성과( Vite 시절 + 일부 Next) |
| [`next-migration.md`](./next-migration.md) | **전환 이력·상세 가이드** |
| [`next-remaining-work.md`](./next-remaining-work.md) | **남은 작업·우선순위** |

새 기술 선택 시 **본 문서에 항목 추가** → 필요 시 `portfolio.md` 요약·`next-migration.md` 체크리스트와 동기화합니다.
