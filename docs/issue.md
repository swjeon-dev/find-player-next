# src·functions 공유 코드 common 분리

## 배경

Next.js 마이그레이션 전에 `src`(Vite)와 `functions`(Firebase)에 중복·분산되어 있던 타입·상수를 `common/`으로 모아 단일 소스로 관리합니다.

## 공유 대상

| 항목       | 경로                           | 내용                                      |
| ---------- | ------------------------------ | ----------------------------------------- |
| 선수 타입  | `common/model/player.types.ts` | `IPlayer`, `IFirebasePlayer`, `Position`  |
| API 기본값 | `common/config/params.ts`      | `DEFAULT_API_PARAMS` (`league`, `season`) |

## 구조

```
common/
├── config/
│   ├── index.ts
│   └── params.ts
├── model/
│   ├── index.ts
│   └── player.types.ts
└── tsconfig.json          # CommonJS → dist/ 컴파일
```

## import 방식

```ts
import type { IFirebasePlayer, IPlayer } from '@common/model'
import { Position } from '@common/model'
import { DEFAULT_API_PARAMS } from '@common/config'
```

- **src**: `tsconfig.json`·`vite.config.js`의 `@common` alias → 소스(`common/`) 직접 참조
- **functions (개발)**: `tsconfig.json`의 `@common` → `../common` 소스 참조
- **functions (배포)**: `prepare-common` → `common/dist`를 `_common`에 복사 → `tsc` 후 `lib/_common`에 복사 → `tsc-alias`로 상대 경로 치환

## 빌드 스크립트 (functions)

| 스크립트                | 역할                                                       |
| ----------------------- | ---------------------------------------------------------- |
| `prepare-common.js`     | `common` 컴파일 후 `functions/_common`에 복사              |
| `copy-common-to-lib.js` | `_common`을 `lib/_common`에 복사 (`tsc-alias` 경로 해석용) |

## 제거·이전

- `src/shared/types/player.types.ts` → `common/model/player.types.ts`
- `functions/src/constant/params.ts` → `common/config/params.ts`
- `functions/src/api/api.types.ts` → `@common/model`로 대체

## 검증

```bash
npm run build              # src
cd functions && npm run build
```

## 후속 (Next.js)

`next.config`에 `@common` alias만 추가하면 동일 패키지를 재사용할 수 있습니다.
