# Find Football Player Quiz

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success)](https://find-player-next.vercel.app/) [![previous GitHub](https://img.shields.io/badge/Previous-GitHub-181717)](https://github.com/swjeon-dev/find-player-game) [![previous  Live](https://img.shields.io/badge/Previous-GitHub%20Pages-lightgrey)](https://swjeon-dev.github.io/find-player-game/)

블러 처리된 프리미어리그 선수 사진을 보고 이름을 맞히는 퀴즈입니다.  
Vite SPA를 **Next.js App Router**로 옮기며, 외부 API 제약 속에서도 검색·퀴즈가 끊기지 않게 맞춘 프로젝트입니다.

## Demo

- [시연 영상](https://github.com/user-**attachments**/assets/37036cd6-3ea5-42fa-837c-c987919557b6)

## Work

- **조회 경로** — 클라이언트가 외부 API를 직접 치지 않고, Cloud Functions가 적재한 Realtime Database만 읽습니다.
- **Next 경계** — 검색·퀴즈·hover prefetch는 클라이언트(React Query·Zustand). proxy·cookie·Server Action만 서버에 둡니다.
- **검색 UX** — 한 페이지에서 조회·처리를 모두 하던 구조를 홈 / 퀴즈로 나누고, 리그 선택 시 prefetch로 체감 대기를 줄였습니다. (Lighthouse 홈 LCP 24.5s → 3.2s — Vite 구조 변경 기준)
- **이미지** — `/submission` LCP 선수 사진을 `next/image`로 리사이즈·WebP. (`remotePatterns`: `media.api-sports.io`)

## 코드 구조

Vite 레포에서 나눈 FSD를 App Router에 맞춰 옮겼습니다. 루트 `app/`은 라우트·metadata, `src/`는 도메인 코드입니다.

```text
app/                 Next 라우트 · layout · metadata
src/
  app/               Providers, global CSS (라우트 아님)
  widget/            화면 조합: home, club, submission
  features/          기능: search, league-select, squad-select, submission
  entities/          도메인: club, league
  shared/            공용 api · ui · config
common/              프론트 · Functions 공유 타입
functions/           Football API → RTDB 적재
```

```text
app/ (routes) → widget/ → features/ → entities/ → shared/
```

역할별 폴더(`components/`, `hooks/`)에서 `widget` / `features` / `entities` / `shared`로 나눈 뒤, 위 구조로 옮겼습니다.

## 기능

- 블러 이미지 퀴즈, prefix 자동완성
- 팀 hover로 선수 목록 확인·선택
- 오답 힌트, 정답 시 원본 이미지·입력 비활성화

## 스택

Next.js (App Router) · TypeScript · React Query · Zustand · CSS Modules · Firebase (Cloud Functions + Realtime Database)

## 실행

```bash
npm install
npm run dev
```
