# Next.js 전환 — 남은 작업

> **완료·이력·상세 가이드**는 [`next-migration.md`](./next-migration.md) 를 참고합니다.  
> 본 문서는 **아직 하지 않은 작업**만 모아 우선순위와 함께 정리합니다. (2026-06 기준)

---

## 현재까지 완료 요약 (기준선)

마이그레이션 **핵심 전환은 완료**된 상태입니다. 배포·동작을 막는 블로커는 없습니다.

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

---

## 남은 작업 — 우선순위

### P0 — 신뢰성·보안

| # | 작업 | 상태 |
| - | ---- | ---- |
| 1 | **`leagueId` 검증** (Action + proxy) | ✅ `getValidLeagueIds` / `isValidLeagueId` 공유 |
| 2 | **`leagueDto` empty / fetch 정책** | ✅ `fetchLeaguesInfoServer` — 1회 retry, empty·fetch 실패 시 `LeagueListError` |
| 3 | **proxy fetch 실패** | ✅ fail-closed — `/` redirect + `LEAGUE_LIST_UNAVAILABLE` flash (cookie 유지) |

**정책 요약**

| 계층 | fetch/empty 실패 | invalid id |
| ---- | ---------------- | ---------- |
| 홈 RSC | `[]` → Game Start 시 Notification | — |
| `selectLeagueAction` | `LEAGUE_LIST_UNAVAILABLE` Notification | `LEAGUE_SELECT_UNAVAILABLE` |
| `proxy.ts` | flash + redirect (cookie 유지) | flash + cookie 삭제 |

**관련 파일:** `leagueList.server.ts`, `leagueValidation.ts`, `proxy.ts`, `app/page.tsx`, `selectLeagueAction.ts`

---

### P1 — API·성능 (axios → fetch 이후 파이프라인)

| # | 작업 | 현재 | 기대 효과 |
| - | ---- | ---- | --------- |
| 4 | **axios → fetch 전환** | `shared/api/client.ts` — `firebaseApiInstance` (axios). RSC·서버에서 **재사용 불가** | 서버/클라이언트 공용 fetch 계층, 번들·일관성 |
| 5 | **서버 fetch 모듈 분리** | `clientService.ts`가 client axios에 의존 | `shared/api/server` (RSC, Action, Route Handler) / client 분리 |
| 6 | **Route Handler BFF + `revalidate`** (§9 Phase 5) | 클라이언트가 RTDB URL(`NEXT_PUBLIC_`)로 **직접** 호출 | 서버 캐시, RTDB hit 감소, URL·키 **브라우저 비노출** |
| 7 | **홈 `fetchLeagueList` 캐시** | 요청마다 RSC fetch | `unstable_cache` / `revalidate` — 리그 목록은 변경 빈도 낮음 |

**관련 파일:** `shared/api/`, `app/page.tsx`, `app/api/` (신규)

---

### P2 — UX·체감 성능

| # | 작업 | 현재 | 기대 효과 |
| - | ---- | ---- | --------- |
| 8 | **`loading.tsx`** | 라우트별 없음 | `/submission` `router.refresh()`·첫 진입 시 **스트리밍·스켈레톤** |
| 9 | **`error.tsx`** | 라우트별 없음 | RSC fetch·치명 오류 시 **복구 UI** (지금은 widget 내부 loader/error 산발적) |
| 10 | **`next/image`** | 리그 엠블럼 `<img src={league.logo}>` | LCP·lazy·리사이즈 (`next.config` `images.remotePatterns` 필요) |
| 11 | **Suspense 경계** | `ClubSquadModal` lazy만 | `ClubViews` / `SubmissionGameContainer` 등 **구간별 스트리밍** |
| 12 | **submission cold visit** | server prefetch 제거 → modal prefetch 없으면 skeleton | 직접 URL·새로고침 시 **ID 목록 지연** — 가벼운 RSC prefetch **재검토** (§9-9) |

**관련 파일:** `app/submission/`, `LeagueSelectItem.tsx`, `widget/submission/`, `widget/club/`

---

### P3 — 배포·운영

| # | 작업 | 현재 |
| - | ---- | ---- |
| 13 | **Vercel(또는 호스트) 배포** | 미연동 |
| 14 | **env·도메인** | `NEXT_PUBLIC_*` RTDB URL — BFF 전환 전까지 클라이언트 노출 |
| 15 | **`next-migration.md` 진행 현황 동기화** | §9 `ToastView`·`league.constants` 등 구식 문구 — **2026-06 부분 반영** |

---

## 선택 과제 (트래픽·규모 증가 시)

| 작업 | 설명 |
| ---- | ---- |
| **동적 metadata** | submission 등 `generateMetadata` + cookie `leagueId` |
| **Parallel route `@modal`** | modal ↔ URL·뒤로가기 연동 |
| **quiz store SSR 패턴 통일** | league와 동일 `skipHydration` + rehydrate (§8-6, 실질 영향 제한적) |
| **barrel import 정리** | `@/widget` 등 client 번들 경계 (§5-3) |
| **리그 many 시** | modal 리스트 가상화 (§10) |

---

## 하지 말아야 할 것 (§9-7 요약)

- widget 전체에 `'use client'` — RSC 셸 이점 상실
- submission에서 **팀 상세 전부** 서버 prefetch — TTFB 악화
- server prefetch를 “hover 보완”이 아닌 **데이터 보장**으로만 쓰면 happy path에서 **중복 fetch** (§9-9)

---

## 추천 적용 순서

```text
1. axios → fetch + server fetch 모듈 분리          ← P1
2. Route Handler BFF + revalidate (리그·id 목록)    ← P1
3. loading / error boundary                        ← P2
4. next/image, Suspense 세분화                     ← P2
5. 배포                                              ← P3
```

---

## 체크리스트 (갱신용)

```text
[x] selectLeagueAction — API 목록 기반 leagueId 검증 + Notification
[x] proxy.ts — API 목록 기반 leagueId 검증 + invalid cookie 삭제 + FlashToast
[x] leagueDto empty / fetch 실패 — fetchLeaguesInfoServer + LeagueListError
[x] proxy fetch 실패 — fail-closed + LEAGUE_LIST_UNAVAILABLE flash
[ ] axios → fetch (shared/api)
[ ] server fetch 모듈 분리
[ ] Route Handler BFF + revalidate
[ ] 홈 fetchLeagueList 캐시
[ ] app/submission/loading.tsx
[ ] app/submission/error.tsx (또는 app/error.tsx)
[ ] next/image + remotePatterns
[ ] submission cold visit prefetch 재검토
[ ] Vercel 배포
[ ] next-migration.md 진행 현황 문구 동기화
```

---

## 문서 간 역할

| 문서 | 역할 |
| ---- | ---- |
| [`next-migration.md`](./next-migration.md) | 전환 **이력·완료·상세 가이드** (§8–§11) |
| **본 문서** | **남은 작업·우선순위·체크리스트** |
| [`portfolio.md`](./portfolio.md) | 포트폴리오·성과 요약 |

완료 시 본 문서 체크리스트와 `next-migration.md` **진행 현황**을 함께 갱신합니다.
