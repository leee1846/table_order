# 버전 체크 및 배포 시 자동 업데이트

배포 후 네이티브 앱(웹뷰)에서 주기적으로 서버 버전과 비교하여, 새 버전이 배포되면 자동으로 페이지를 갱신하는 기능입니다.

## 개요

- **목적**: 새 버전 배포 시 앱이 이전 번들을 캐시하고 있어도, 일정 주기로 서버 버전을 확인해 다르면 갱신하여 최신 버전 적용
- **대상**: 네이티브 앱만 동작 (CapacitorApp.isNative()일 때만). 웹에서는 동작하지 않음
- **동작**: 마지막 터치 이후 5분이 지나면 `/version.json` fetch → `__APP_VERSION__`과 비교 → 다르면 `window.location.replace()`로 현재 URL 재로드 (캐시버스터 포함). 터치할 때마다 5분 카운트 리셋
- **관련 코드**: `App.tsx`의 `AppContent`에서 `useAppVersionCheck()` 호출 (공용 패키지 `@repo/feature/hooks`), 빌드 시 `vite.config.ts`의 버전 파일 생성

## 전체 플로우

```mermaid
flowchart LR
  subgraph Build["빌드"]
    A[package.json] --> B[version.json + __APP_VERSION__]
  end

  subgraph Runtime["네이티브 앱"]
    C[마지막 터치로부터 5분 대기] --> D{버전 다름?}
    D -->|아니오| C
    D -->|예| E[replace로 갱신]
    T[터치 발생] --> C
  end

  Build --> Runtime
```

## 빌드 시 동작

| 단계 | 위치 | 설명 |
|------|------|------|
| 1 | `package.json` | `version` 필드가 단일 소스 |
| 2 | `vite.config.ts` | `generateVersionJson(pkg.version)` 플러그인으로 빌드 결과물에 `version.json` 생성 |
| 3 | `vite.config.ts` | `define: { __APP_VERSION__: JSON.stringify(pkg.version) }`로 런타임에 주입 |

### version.json 생성 (vite.config.ts)

```ts
function generateVersionJson(version: string): Plugin {
  return {
    name: 'generate-version-json',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ version }),
      });
    },
  };
}
```

- 빌드 시 `dist/version.json`이 생성되며, 배포 시 이 파일이 서버 루트(또는 SPA 기준 `/version.json`)로 제공되어야 합니다.

## 런타임 동작 (useAppVersionCheck)

- **구현**: `packages/feature/src/hooks/useAppVersionCheck.ts`
- **동작 조건**: `CapacitorApp.isNative()`가 true일 때만 동작 (웹에서는 no-op)
- **주기**: 마지막 터치 이후 `IDLE_INTERVAL_MS = 5 * 60 * 1000` (5분)이 지나면 한 번 체크. 터치 시 카운트 리셋
- **비교**: 서버의 `version.json.version` vs 번들에 주입된 `__APP_VERSION__`
- **갱신 방식**: `window.location.replace(현재 URL + _t 캐시버스터)` (reload 대신 사용해 웹뷰 메모리 스파이크 방지)
- **호출 위치**: `App.tsx` → `AppContent` 내부 (디바이스 스토어 hydration 이후 마운트되는 컴포넌트에서 호출)

## 요약

- **버전 소스**: `package.json` → 빌드 시 `version.json` 파일 + `__APP_VERSION__` 상수
- **체크**: 네이티브 앱에서만, 마지막 터치로부터 5분 후 `/version.json` fetch → 버전 불일치 시 replace로 갱신
- **목적**: 배포 후에도 앱이 일정 시간(5분 이상 미사용 시) 내에 최신 버전으로 자동 갱신되도록 함. 사용 중에는 터치로 인해 체크가 연기됨
