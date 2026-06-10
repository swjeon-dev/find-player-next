# Find Football Player Quiz

<!-- 서류·면접에서 **왜 이렇게 만들었는지**를 설명하기 위한 문서입니다.
[README.md](../README.md)는 짧은 소개이고, 여기는 **이슈 → 어떻게 풀었는지 → 결과** 순으로 적었습니다. -->

블러 처리된 프리미어리그 선수 사진을 보고 이름을 맞히는 퀴즈 웹 서비스입니다.

## 요약

### 프로젝트 목적

CRA + JavaScript로 만들어 두었던 퀴즈를 **Vite + TypeScript**로 옮기면서, 외부 API·DB 구조 제약 속에서도 프론트만으로 **안정적으로 돌아가고**, 검색·퀴즈 이용 시 **덜 답답하게** 느껴지게 맞추는 것이 목표였습니다.

1. **개발 환경** — 빌드·타입·유지보수가 수월한 스택으로 정리
2. **서비스 안정성** — Rate Limit 등으로 흔들리지 않게 조회 구조 바꾸기
3. **사용자 체감** — 검색·퀴즈 입력이 자연스럽게 이어지게 만들기

### 개선

| 구분          | 내용                                                                                                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **조회 구조** | 클라이언트 → 외부 API 직접 호출 대신 **Firebase(Functions + RTDB)** 로 조회 경로 분리                                                                                         |
| **검색·입력** | 적재 데이터·Functions 수정 대신(서버 제어 한계 가정), **prefix 검색 + hover 보조 + React Query prefetch** 로 체감 대기 완화                                                   |
| **화면·흐름** | **커버 → 리그 선택 모달 → 팀 hover** 로 중간 단계를 두고, 퀴즈 전에 필요한 id·상세를 prefetch ([선수 검색 데이터 구조 제약](#issue-search) 참고)                              |
| **체감 성능** | 조회·페이지 구조 변경 후 Lighthouse 기준(리팩터링 전 빌드 vs 현재, 홈): **LCP 24.5s → 3.2s**, **TBT 690ms → 0ms**, Performance **53 → 87** ([상세 비교](#perf-compare)) |
| **코드 구조** | 역할별 폴더(`components/`, `hooks/`) 한계를 느끼고 **FSD 기준 리팩터링** (`pages` → `widget` → `entities`, `features`는 규모상 미도입)                                        |

전체 선수 일괄 조회 시 첫 이용이 **10초 이상** 걸리던 시기를 거친 뒤, 위 조회·화면 흐름으로 바꾸면서 **화면이 채워지는 시점(LCP)** 과 **메인 스레드 블로킹(TBT)** 이 가장 크게 줄었습니다. 번들 gzip은 메인 엔트리만 보면 소폭 감소했지만, 홈 첫 JS 합은 청크 분리로 비슷한 수준입니다.

### 사용 기술 · 배포

**사용 기술** — React, TypeScript, Vite, React Query, Recoil, Styled Components, Firebase

**배포** — GitHub Pages (CSR 라우팅 이슈 경험 포함)

## 이슈

### 1. 외부 API 직접 의존 구조의 한계

초기 구조는 클라이언트가 외부 API를 직접 호출하는 방식이었습니다.

```text
Client → External API
```

만들기는 단순했지만, 아래 문제가 있었습니다.

- 외부 API Rate Limit
- 요청 실패 시 사용자 경험 저하
- 클라이언트에서 외부 API 안정성에 직접 영향받는 구조

<a id="issue-search"></a>

### 2. 선수 검색 데이터 구조 제약

Firebase Realtime Database는 선수·팀 정보가 **id 중심 노드**로 나뉘어 저장됩니다.

```text
/leagues/{leagueId}/teamIds     → [teamId, ...]
/leagues/{leagueId}/playerIds   → [playerId, ...]

/teams/{teamId}/info            → 팀 상세
/teams/{teamId}/playerIds       → [playerId, ...]

/players/{playerId}/info        → 선수 상세
/players                        → 이름 prefix 검색 대상
```

실제 화면에서 필요한 데이터는 보통 한 번에 오지 않고, 아래처럼 **여러 단계**를 거칩니다.

```text
리그 선택
  → league의 teamIds / playerIds prefetch

팀 hover 또는 선택
  → team의 playerIds 조회

선수 목록·상세 표시
  → playerIds 기준으로 각 player info 조회
```

이 구조 때문에 다음 제약이 생겼습니다.

- 입력 값을 **포함(contains)** 하는 선수 검색을 유연하게 하기 어려움
- 전체 선수 데이터를 먼저 가져와 클라이언트에서 필터링하면 첫 조회가 10초 이상 소요
- 이름 검색은 **prefix(접두사) 일치** 쿼리로 우회해야 함

데이터 구조를 바꾸면 contains 검색을 맞출 여지는 있었습니다.  
다만 **이미 쌓인 RTDB 데이터와 Cloud Functions·적재 코드를 고치는 비용**이 크고, **서버·DB를 마음대로 제어하기 어렵다**는 환경(프론트 담당에 가깝게)이라고 보고, **프론트에서 할 수 있는 범위** 안에서만 개선했습니다.  
그래서 contains를 억지로 맞추기보다, **prefix 쿼리·화면 흐름·prefetch**로 체감 대기를 줄이는 쪽에 맞췄습니다.

### 3. 입력 과정의 렌더링·요청 비용

자동완성은 입력할 때마다 바로 반응할수록:

- 불필요한 연산
- 잦은 렌더링
- 중복 요청

이 늘어나기 쉬운 구조였습니다.

## 해결

### 1. CRA → Vite + TypeScript 마이그레이션

기존 CRA(deprecated) + JavaScript 프로젝트를 Vite + TypeScript 환경으로 옮겼습니다.

- 빌드가 빨라짐
- 타입으로 실수 줄이기
- 이후 수정·추가가 수월해짐

### 2. Firebase 기반 서버리스 구조로 전환

클라이언트가 외부 API를 직접 치지 않고, **Cloud Functions가 밖에서 데이터를 받아 RTDB에 넣고, 화면은 RTDB만 읽는** 구조로 바꿨습니다. 별도 백엔드 서버 대신 Firebase로 중간 계층을 둔 선택입니다.

```text
Client → Firebase Realtime Database
        ↑
Cloud Functions
        ↑
External API
```

이 전환으로 Rate Limit·불안정한 직접 호출을 클라이언트 밖으로 분리했습니다.

### 3. 검색 UX 다시 맞추기

검색도 [선수 검색 데이터 구조 제약](#issue-search)과 같은 전제로 맞췄습니다. RTDB 스키마나 Functions·적재 로직을 크게 바꾸기보다, **prefix 쿼리·화면 흐름·prefetch**처럼 **프론트에서 손댈 수 있는 부분**으로 풀었습니다.

- 서버 쿼리는 **prefix(접두사) 일치 선수만 조회**
- **hover 기반 prefetch**로 다음 단계에 필요한 id·상세 데이터를 미리 준비
- 사용자는 **왼쪽 팀 메뉴 hover**로 선수 이름을 먼저 확인
- 이후 입력창에서 후보를 빠르게 좁히는 흐름으로 보완

검색 정확도만 억지로 올리기보다, **지금 DB로도 쓸 수 있는 경험**을 먼저 맞췄습니다.

### 4. React Query 기반 캐싱·prefetch

서버 상태는 React Query로 관리했습니다. 이 프로젝트에서 체감에 더 크게 작용한 건 **번들 분리보다 prefetch**였습니다.

- 리그 선택 모달 hover 시 `teamIds`, `playerIds`를 `prefetchQuery`로 미리 조회
- 팀 hover 시 `playerIds`와 모달 코드를 선로딩
- `localStorage` persist로 재방문 시 캐시 재사용
- 중복 요청 감소 및 비동기 상태 흐름 단순화

데이터가 `id 조회 → 상세 조회` 흐름을 거치기 때문에, 사용자가 다음 액션을 하기 전에 필요한 데이터를 미리 채워 두는 편이 체감 UX에 더 직접적인 효과가 있었습니다.

<a id="lazy-chunk"></a>

### 5. lazy·chunk 분리 (메인 엔트리 JS 경량화)

`lazy loading`과 `manualChunks`로 **첫 접속 시 받는 메인 엔트리 JS**(`index-*.js`)에서 화면·라이브러리 일부를 빼 냈습니다. 퀴즈(`Submission`)·모달 등은 필요할 때 따로 받도록 나눴습니다.

**분리 전·후 (번들 분석 기준, gzip)**  
분리 전 수치는 lazy·`manualChunks` 미적용 때와 비교해 환산한 값입니다.

| 구분                      | 분리 전                                                                               | 분리 후 (현재 빌드)                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 메인 엔트리 JS            | Submission·React Query 등이 한 덩어리에 가깝게 실림 (엔트리 **약 141 KiB** 수준 추정) | **약 136.5 KiB** (`index-*.js`)                                                            |
| `Submission`              | 홈 첫 진입 시 메인에 포함                                                             | 메인에서 분리 → 엔트리 **약 4.59 KiB↓**, 이동 시 별도 청크 **약 4.7 KiB** 추가 로드        |
| React Query (`@tanstack`) | 메인에 포함                                                                           | `vendor-query` 청크 **약 15.3 KiB** (루트에서 로드, **첫 방문 총 다운로드량은 거의 동일**) |
| `ClubSquadModal`          | `Submission` 쪽 번들에 포함                                                           | hover 시 **약 1.3 KiB** 별도 로드, `Submission` 청크 **약 0.52 KiB↓**                      |

| 적용                            | 사용 위치                       |
| ------------------------------- | ------------------------------- |
| `Submission` lazy               | `src/app/routes/AppRouter.tsx`  |
| `ClubSquadModal` lazy           | `src/entities/club/ui/Club.tsx` |
| `vendor-query` (`manualChunks`) | `vite.config.js`                |

**이 서비스 규모에서는 체감상 큰 차이는 거의 없었습니다.** 메인 JS는 줄었지만, React Query는 여전히 첫 로드에 필요하고 화면도 많지 않아서입니다.  
다만 **라우트·기능·의존성이 많아지는 React 앱**에서는 같은 방식으로 메인 엔트리를 가볍게 두고 청크를 나누는 편이 **초기 접속·재배포 후 캐시**에 도움이 될 수 있다고 봅니다.

<a id="debounce"></a>

### 6. Debounce로 자동완성 입력 정리

자동완성은 입력할 때마다 검색·렌더가 바로 붙으면 요청과 화면 갱신이 과하게 늘어납니다. Debounce 로직을 `shared/lib` 커스텀 훅으로 빼 두고, 자동완성·리그 hover prefetch 등에 같이 썼습니다.

- 입력이 멈춘 뒤에만 검색 요청 (지연 시간 조절)
- 같은 값이 반복 반영되지 않게 처리
- 입력 중 불필요한 자동완성 렌더 줄이기

### 7. 상태 기반 UI 전환

퀴즈는 맞춤/틀림에 따라 화면이 바로 바뀌도록 짰습니다.

```text
오답 -> 힌트 제공
정답 -> 원본 이미지 제공 + 입력 비활성화
```

이 흐름을 통해 사용자가 현재 상황을 바로 이해할 수 있도록 했습니다.

<a id="fsd-refactor"></a>

### 8. `src/` 구조 FSD 기준 리팩터링

처음부터 FSD 구조로 시작한 프로젝트는 아닙니다.  
Vite·TypeScript 마이그레이션과 기능 추가가 진행된 뒤, **`components/`, `hooks/`, `utils/`, `constant/`처럼 역할별로만 나뉜 구조**에서 유지보수가 점점 불편해져서 **기존 코드를 FSD에 맞게 리팩터링**했습니다.

#### 리팩터링하게 된 이유

역할별 폴더는 파일을 찾기는 쉬울 때가 많지만, 아래 같은 **추적·파악 비용**이 커졌습니다.

- `hooks/`에 있는 함수가 **퀴즈 전용인지, 검색 전용인지, 여러 화면에서 쓰는지** 파일명만으로는 구분이 어려움
- `components/`의 컴포넌트 **사용처를 따라가려면** import 그래프를 여러 폴더에서 돌아봐야 함
- 비슷한 이름의 훅·상태가 늘어나면서 **“이건 어디서 쓰이지?”**를 확인하는 데 시간이 많이 듦
- 기능 단위로 코드를 묶어 수정하려 해도, **도메인 경계가 폴더 구조에 드러나지 않아** 범위를 잡기 어려움

즉, 동작은 문제없어도 **사용처 추적·기능 파악·수정 범위 결정**이 반복적으로 어려웠습니다.

#### FSD를 참고해 리팩터링한 방향

**Feature-Sliced Design**을 처음부터 전부 따르기보다, 위 불편을 줄이는 데 도움이 되는 부분을 기준으로 `src/`를 **도메인·레이어 단위로 다시 나눴습니다.**

리팩터링 과정에서는 우선 **`pages` → `widget` → `entities`(UI·model)** 순으로 화면 흐름에 맞게 정리했습니다.  
라우트 진입은 `pages`, 화면 블록 조합은 `widget`, 도메인별 UI·상태·데이터 접근은 `entities` 슬라이스에 두었습니다.

- **도메인별 슬라이스** (`entities/club`, `entities/league`, `entities/search` 등)로 묶어, 컴포넌트·훅·상태가 **무슨 목적의 코드인지** 폴더만 봐도 드러나게 함
- 화면 조합은 `widget/`, 라우트 진입은 `pages/`, 공용은 `shared/`로 분리해 **기능 단위로 읽기** 쉽게 함
- 슬라이스마다 `index.ts` public API를 두고, FSD **레이어·슬라이스 의존 방향**에 맞춰 import를 정리함

#### `features` 레이어를 두지 않은 이유

FSD에는 `features` 레이어도 있지만, **이번에는 넣지 않았습니다.**

지금 규모에서는 **Feature로 쪼갤 만큼 로직이 많지 않다**고 봤습니다.  
선수 검색·리그 선택·퀴즈도 `entities`와 `widget` 안에서 같이 두는 편이, **어디를 고칠지 찾기**에 더 수월했습니다.

나중에 기능이 늘고 **로직이 복잡해지거나 여러 화면에서 같은 흐름을 재사용**해야 하면, 그때 `features` 분리를 다시 볼 생각입니다.

#### 리팩터링 후 체감한 점

- **도메인별로 나누기 쉬움** — 리그·팀·검색·퀴즈처럼 경계를 정할 때, 해당 슬라이스 안의 `ui` / `model`만 보면 됨
- **컴포넌트·함수의 목적이 분명해짐** — 예: 선수명 필터는 `entities/search`, 퀴즈 상태는 `widget/submission/model`
- **가독성** — “이 화면 블록은 widget, 이 도메인 데이터는 entities”처럼 **읽는 순서가 정해짐**
- **기능 파악이 빨라짐** — submission 화면은 `pages` → `widget` → `entities` 순으로만 따라가면 됨
- **사용처 추적 부담 감소** — 슬라이스 public API(`@/entities/search` 등) 기준으로 import가 모임

#### 리팩터링 전·후

| 구분                 | 이전                                     | 이후                                 |
| -------------------- | ---------------------------------------- | ------------------------------------ |
| 공통 설정·API        | `constant/`, `lib/`, `services/` 등 분산 | `shared/config`, `shared/api`        |
| 전역 스타일·Provider | 루트·`styles/` 혼재                      | `app/styles`, `app/providers`        |
| 도메인 UI·상태       | `components/club` 등 기능별 혼합         | `entities/{club,league,search}`      |
| 화면 단위 조합       | 페이지에 로직·UI 혼재                    | `widget/{club,submission}` + `pages` |
| 유틸                 | `src/utils/`                             | `shared/lib`, `shared/ui`            |

#### 현재 `src/` 레이어 구조

```text
src/
├── app/           # 앱 조립: 라우터, Provider, persist, GlobalStyle
├── pages/         # 라우트 단위 페이지 (cover, submission, not-found)
├── widget/        # 화면 블록: club(팀 목록), submission(퀴즈)
├── entities/      # 도메인 슬라이스: club, league, search
├── shared/        # 공용: api, config, lib, ui, types
└── index.tsx      # 엔트리: Provider·테마·라우터만 연결
```

의존은 위에서 아래로만 흐르게 맞췄습니다.

```text
app → pages → widget → entities → shared
         └─ (features 없음 — entities + widget에서 함께 관리)
```

리팩터링 커밋은 club / league / search / widget / shared처럼 **slice 단위**로 나눠, 변경 범위를 히스토리에서 추적하기 쉽게 했습니다.

## 성과

- **Vite + TypeScript**로 옮기며 개발·타입 안정성을 높였습니다.
- **Firebase 서버리스 조회**로 클라이언트가 외부 API Rate Limit에 덜 묶이게 했습니다.
- **prefetch + UX**로 id 여러 번 타는 DB에서도, 사용자가 “기다린다”는 느낌을 줄였습니다 ([리팩터링 전·후 빌드 비교](#perf-compare) — LCP **약 24s → 3s**대).
- **상태별 UI**로 오답·정답 흐름을 분명하게 맞췄습니다.
- **lazy·chunk 분리**로 메인 엔트리 JS를 줄였습니다 ([lazy·chunk 분리](#lazy-chunk) 참고, 이 서비스에서는 체감 차이는 작음).
- **`components/`·`hooks/` → FSD 리팩터링**으로 코드 위치·사용처를 찾기 쉬워졌습니다 ([FSD 리팩터링](#fsd-refactor)).

## 회고

이 프로젝트를 통해 정리할 수 있었던 질문은 다음과 같습니다.

- 데이터 요청 책임을 어디에 둬야 하는가
- 입력 UX를 어떻게 자연스럽게 쓰게 만들 것인가
- API·DB 제약이 있을 때 어떤 방향으로 구조를 바꿔야 하는가
- **프론트엔드 관점에서** 성능·체감 문제를 어떻게 풀어야 하는가
- `components/`, `hooks/`처럼 역할만 나눈 구조에서 **사용처 추적이 어려울 때**, 도메인 기준으로 어떻게 다시 나눠야 하는가

검색, 다단계 데이터 조회, 번들 모두에서 비슷한 결론에 도달했습니다.  
기술을 화려하게 쓰는 것보다, **제약이 있어도 쓰기 덜 답답한 화면**이 우선이었습니다. 검색·조회는 prefix·hover·prefetch, 번들은 메인 엔트리 경량화(lazy·chunk)로 그 방향에 맞췄습니다.

### 성능 최적화

이 프로젝트에서는 **데이터 조회 구조 때문에 prefetch가 체감에 더 크게 작용**했습니다.

**이번에 한 일**

- prefetch로 다단계 조회(`id → 상세`)의 체감 대기 시간 완화
- Debounce 훅으로 자동완성 입력·요청 빈도 정리 ([Debounce](#debounce))
- `lazy` + `manualChunks`로 메인 엔트리 JS 경량화 ([lazy·chunk 분리](#lazy-chunk)) — 이 서비스에서는 체감 차이는 작았음

<a id="perf-compare"></a>

#### 리팩터링 전·후 빌드 비교 (`dist_old` vs 현재)

조회·prefetch·커버·리그 모달 등을 넣기 **전**에 보관해 둔 production 빌드(`dist_old`, JS 단일 청크)와, **현재** `master` 빌드를 같은 조건으로 맞춰 비교했습니다.

- **번들**: Vite 빌드 산출물 기준 (gzip)
- **Lighthouse**: Lighthouse 12.x, 로컬 headless, URL `/find-player-game/`·`/submission` (LHCI와 동일 카테고리·엔진, 1회 측정)
- **재현**: `node scripts/compare-lighthouse.mjs` (결과 `.lighthouseci/compare/summary.json`)

**번들 (홈 첫 로드 기준)**

| 구분                     | 리팩터링 전 (`dist_old`) | 현재 (`dist`)                           |
| ------------------------ | ------------------------ | --------------------------------------- |
| 구조                     | JS **1개**               | 메인 + `vendor-query` + Submission lazy |
| 메인/단일 JS (gzip)      | **144.2 KiB**            | **136.3 KiB** (메인 엔트리)             |
| 홈에서 받는 JS 합 (gzip) | **144.2 KiB**            | **약 151 KiB** (메인 + `vendor-query`)  |
| Submission               | 메인에 포함              | 라우트 이동 시 **약 4.7 KiB** 추가      |

메인 엔트리 단일 파일은 줄었지만, React Query를 `vendor-query`로 나누면서 **홈 첫 요청 gzip 합은 소폭 늘었습니다.** 체감·Lighthouse에서 드러난 차이는 번들보다 **런타임 조회·렌더** 쪽이 더 컸습니다.

**Lighthouse (카테고리 점수 0–100)**

| 페이지     | 지표        | 리팩터링 전 | 현재      |
| ---------- | ----------- | ----------- | --------- |
| 홈         | Performance | 53          | **87**    |
| 홈         | LCP         | **24.5 s**  | **3.2 s** |
| 홈         | TBT         | 690 ms      | **0 ms**  |
| submission | Performance | 41          | **85**    |
| submission | LCP         | **25.6 s**  | **3.4 s** |
| submission | Speed Index | 8.0 s       | **3.3 s** |

FCP·Speed Index는 **0.3~0.4초 정도 느리게** 나왔습니다. 첫 페인트는 비슷한데, **화면이 채워지는 시점(LCP)** 과 **메인 스레드 블로킹(TBT)** 이 크게 나아진 패턴입니다. 구버전은 루트에서 무거운 데이터 조회가 붙었을 때와 맞는 결과로 봤습니다.

> 네트워크·Firebase 응답에 따라 LCP는 실행마다 달라질 수 있습니다. 수치는 “완벽한 재현”보다 **개선 방향을 보여 주는 1회 측정**입니다.

**규모가 큰 React 서비스라면**

화면·라이브러리가 많아질수록, 같은 패턴의 의미가 커질 수 있습니다.

- **lazy loading** — 첫 접속 때 메인 JS에 실리는 코드를 줄이고, 라우트·기능 단위로 나눠 받기
- **vendor chunk 분리** — 앱 코드만 배포될 때 라이브러리 청크 캐시 재사용
- **prefetch** — 조회가 여러 단계인 API·DB에서는 여전히 우선순위가 높음

### CSR·GitHub Pages 배포 이슈

GitHub Pages에 배포한 뒤, `/submission`은 **앱 안에서 이동할 때는 정상**인데 **새로고침·직접 접근 시 GitHub 404**가 났습니다.

처음에는 `ProtectedRoute`나 `Navigate` 문제라고 생각했지만,  
실제로는 **React가 실행되기 전에 GitHub Pages가 `/submission` 경로의 정적 파일을 찾다가 404를 내는 구조**가 원인이었습니다.

앱이 이미 실행된 뒤 `/submission`으로 이동하면 `ProtectedRoute`는 정상 동작합니다.  
직접 접근·새로고침은 정적 서버가 먼저 파일을 찾기 때문에, `NotFound`도 React가 뜨기 전에는 쓰이지 않습니다.

**현재는** `BrowserRouter`를 유지하고,

- 앱 실행 후 잘못된 경로 → `NotFound`
- `/submission` 직접 요청·새로고침 → fallback으로 앱 재실행 후, session 없으면 홈으로 리다이렉트

로 처리했습니다. “로컬에서는 되는데 배포에서는 안 되는 이유”를 React 코드가 아니라 **호스팅 서버 동작**으로 설명할 수 있게 된 점이 의미 있었습니다.

<!--
면접 답변 예시 - 개발 전용 Profiler 코드 분리

질문: 개발에서만 쓰는 React Profiler를 왜 분리했나요?
답변: 처음에는 컴포넌트 내부에서 PROD 분기로 우회했지만, 그 경우 파일 자체는 번들에 남을 수 있다고 생각했습니다.
그래서 Profiler를 dev/prod 파일로 나누고, Vite alias를 build 시점에 전환하도록 설정했습니다.
결과적으로 컴포넌트 사용 코드는 그대로 유지하면서 운영 번들에서는 개발용 로깅 코드를 제외할 수 있었습니다.
이 과정에서 실행 분기 책임을 런타임 코드가 아니라 빌드 설정으로 올린 점이 핵심입니다.
-->

<!--
검토했던 방법

1. HashRouter
- /#/submission 형태가 되어 서버는 루트 경로만 보고, hash 뒤는 브라우저가 해석
- 직접 접근 404를 피할 수 있음
- 다만 URL이 덜 깔끔해서 데스크톱 웹 서비스 포트폴리오 관점에서는 아쉽다고 생각했다

2. 404.html fallback
- index.html을 404.html로도 제공하면 GitHub Pages의 404 응답을 앱 재진입 지점으로 사용 가능
- 현재 구조를 크게 바꾸지 않고 새로고침 문제를 우회할 수 있음
- 다만 배포 산출물에 fallback 파일을 별도로 관리해야 하고, 정적 404 페이지가 아니라 앱을 다시 실행시키는 우회 엔트리라는 점에서 특수한 처리

참고 메모: 우선순위는 낮지만, 배포/라우팅 제약 설명이 필요할 때 다시 살릴 수 있는 내용

React Router의 BrowserRouter는 기본적으로:

index.html 로드
-> JS 실행
-> Router가 현재 URL 해석
-> ProtectedRoute / 페이지 컴포넌트 렌더

같은 흐름을 기대합니다.

하지만 GitHub Pages 같은 정적 호스팅은:

/submission 요청
-> 서버가 /submission 에 해당하는 실제 정적 파일 탐색
-> 없으면 GitHub 404 반환

처럼 동작합니다.

즉, 정적 서버에서는 React 앱이 실행되기 전에 먼저 파일 존재 여부를 확인하기 때문에,
직접 URL 접근이나 새로고침 시에는 ProtectedRoute, Navigate, NotFound 같은 React 컴포넌트까지 도달하지 못할 수 있습니다.

반면 Vercel, Netlify, Firebase Hosting처럼 rewrite 설정이 가능한 호스팅은 보통:

모든 경로 요청
-> index.html 반환
-> React 앱 실행
-> 클라이언트 라우터가 URL 해석

흐름으로 처리할 수 있어, 같은 CSR 구조라도 새로고침 문제를 덜 겪습니다.

rewrite:
사용자가 어떤 경로로 들어오더라도 서버가 그 경로에 대응하는 실제 파일을 찾는 대신,
앱 엔트리 파일(index.html)을 반환하도록 바꾸는 처리

fallback:
정적 서버의 404 응답을 앱 재진입 지점으로 바꾸는 우회 방식
예: /submission -> 파일 없음 -> 404.html 반환 -> React 앱 실행 -> 라우터가 URL 다시 해석

HashRouter:
URL에서 서버가 해석하는 부분과 클라이언트가 해석하는 부분을 분리하는 방식
예: /find-player-game/#/submission
서버는 /find-player-game/ 까지만 보고, # 이후는 브라우저/클라이언트가 해석
-->

## 향후 개선 방향

- 테스트 코드 추가 (슬라이스·public API 기준으로 어디까지 쓸지 정하기)
- 문제·리그 다양성 확장
- 점수·랭킹 시스템
- Next.js로 옮길 때 App Router와 레이어 매핑 보기
- `features` 분리 (로직·재사용이 커질 때 — 지금은 `pages` → `widget` → `entities`)
- rewrite 되는 호스팅으로 옮기거나, fallback 범위 넓히기
