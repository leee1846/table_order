# NEXA

모노레포 구조의 프로젝트입니다.

## 📋 프로젝트 구조

이 프로젝트는 **Turborepo**와 **pnpm workspace**를 사용하는 모노레포입니다.

```
nexa/
├── apps/          # 애플리케이션 프로젝트
│   ├── admin/     # 관리자 웹/앱앱 애플리케이션
│   └── menu/      # 메뉴판판 애플리케이션
└── packages/      # 공유 패키지
    ├── api/       # API 클라이언트
    ├── eslint-config/      # ESLint 설정
    ├── feature/   # 공유 기능
    ├── prettier-config/    # Prettier 설정
    ├── typescript-config/  # TypeScript 설정
    ├── ui/        # UI 컴포넌트 및 스타일일 라이브러리
    └── util/      # 유틸리티 함수
```

## 🛠️ 사용 기술

- **모노레포 관리**: [Turborepo](https://turbo.build/repo)
- **패키지 매니저**: [pnpm](https://pnpm.io/) (v9.0.0)
- **Node.js**: v24.11.1

## pnpm 설치
```bash
npm install -g pnpm@9.0.0
```

## 📦 설치

루트 디렉토리에서 다음 명령어를 실행하세요:

```bash
pnpm install
```

이 명령어는 `pnpm-workspace.yaml`에 정의된 모든 워크스페이스(`apps/*`, `packages/*`)의 의존성을 설치합니다. pnpm은 워크스페이스 내부 패키지 간 의존성을 자동으로 링크합니다.

## 🚀 실행

### 모든 프로젝트 실행

루트에서 다음 명령어로 모든 프로젝트를 동시에 실행할 수 있습니다:

```bash
# 개발 모드로 모든 앱 실행
pnpm dev

# 모든 프로젝트 린트 검사
pnpm lint

# 모든 프로젝트 포맷팅
pnpm format

# 모든 프로젝트 타입 체크
pnpm check-types
```

### 특정 프로젝트 실행

루트에서 `--filter` 옵션을 사용하여 특정 프로젝트만 실행할 수 있습니다:

```bash
# admin 앱 실행
pnpm --filter admin dev

# menu 앱 실행
pnpm --filter menu dev

# 특정 패키지 개발서버 빌드
pnpm --filter menu build:dev

# 여러 프로젝트 동시 실행
pnpm --filter admin --filter menu dev
```

## 📚 각 프로젝트 문서

각 프로젝트의 상세한 설명과 사용법은 해당 디렉토리의 README를 참고하세요:
