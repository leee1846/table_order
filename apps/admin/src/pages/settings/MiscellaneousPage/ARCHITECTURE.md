# MiscellaneousPage 매장 수정 로직 구조 설명서

## 📐 전체 구조 도면

```
┌─────────────────────────────────────────────────────────────────┐
│                    MiscellaneousPage (메인 페이지)                 │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 1. 데이터 가져오기 (useGetShopDetail, useGetCategoryList) │  │
│  │    → 서버에서 매장 정보와 카테고리 목록을 가져옴          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 2. 초기값 설정 (useEffect)                                │  │
│  │    → 가져온 데이터를 각 섹션의 초기값으로 설정            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 3. 각 섹션 컴포넌트들 (7개)                               │  │
│  │    ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │  │
│  │    │ Account  │ │ Network  │ │ StoreEnv │ │ MenuApp  │ │  │
│  │    │ (계정)   │ │ (네트워크)│ │ (매장환경)│ │ (메뉴기능)│ │  │
│  │    └──────────┘ └──────────┘ └──────────┘ └──────────┘ │  │
│  │    ┌──────────┐ ┌──────────┐ ┌──────────┐              │  │
│  │    │ Payment  │ │Integrate │ │ Language │              │  │
│  │    │ (결제)   │ │ (연동)   │ │ (언어)   │              │  │
│  │    └──────────┘ └──────────┘ └──────────┘              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 4. 변경사항 수집 (handleChange)                           │  │
│  │    → 각 섹션에서 변경된 내용을 Draft 상태에 저장           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 5. 저장하기 버튼 클릭 (handleSave)                        │  │
│  │    → 모든 변경사항을 서버에 전송                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 데이터 흐름도

```
[서버 API]
    ↓
[useGetShopDetail] → shopInfo (매장 정보)
    ↓
[useEffect] → 초기값 설정
    ├─→ shopSettingDraft (매장 설정 초안)
    ├─→ shopTimeDraft (매장 시간 초안)
    ├─→ shopNetworkDraft (네트워크 초안)
    └─→ useLocaleDraft (언어 설정 초안)

[각 섹션 컴포넌트]
    ↓ (사용자가 입력/변경)
[handleChange] → Draft 상태 업데이트
    ↓
[저장하기 버튼 클릭]
    ↓
[handleSave] → mergeDefined로 최종 데이터 합치기
    ↓
[API 호출] → 서버에 저장
    ├─→ updateShopSettingMutation
    └─→ updateCategoryFirstOrderMutation
```

## 📦 컴포넌트별 역할

### 1. MiscellaneousPage (메인 컴포넌트)
**역할**: 전체 페이지를 관리하는 큰 상자

**주요 함수들**:
- `mergeDefined`: 두 개의 객체를 합치는 함수 (기존 값 + 새 값)
  - 예: 기존 설정이 {A: 1, B: 2}이고 새 값이 {B: 3}이면 → {A: 1, B: 3}
  
- `handleChange`: 각 섹션에서 변경사항을 받아서 저장하는 함수
  - 예: 언어 섹션에서 "한국어"를 "영어"로 바꾸면 → 이 함수가 그 변경사항을 받아서 저장
  
- `handleSave`: 저장하기 버튼을 눌렀을 때 실행되는 함수
  - 모든 변경사항을 모아서 서버에 보내는 역할
  - 마치 편지를 쓰고 우체통에 넣는 것과 같음

**상태(State) 관리**:
- `shopSettingDraft`: 매장 설정의 임시 저장소 (아직 저장 안 함)
- `shopTimeDraft`: 매장 시간의 임시 저장소
- `shopNetworkDraft`: 네트워크 설정의 임시 저장소
- `useLocaleDraft`: 언어 설정의 임시 저장소
- `selectedCategorySeqs`: 선택된 카테고리 목록

### 2. Account (계정 섹션)
**역할**: 매장 이름, 사용자 ID, 매장 코드를 보여주는 섹션
- 읽기 전용 (수정 불가)
- 단순히 정보만 표시

### 3. Network (네트워크 섹션)
**역할**: 네트워크 설정을 관리하는 섹션

**주요 함수들**:
- `toNetworkSettingOption`: 네트워크 타입을 올바른 형식으로 변환
  - 예: "LAN" → "LAN", 없으면 → "AUTO"

**상태 관리**:
- `networkSetting`: 네트워크 타입 (자동/유선/무선)
- `ssid`: 와이파이 이름
- `ipAddress`: IP 주소

**동작 방식**:
1. 사용자가 네트워크 설정을 변경
2. `useEffect`가 변경사항을 감지
3. `onChange`를 통해 부모 컴포넌트에 변경사항 전달

### 4. StoreEnvironment (매장 환경 섹션)
**역할**: 매장의 영업 시간, 테이블 점유시간, 메뉴판 타입을 설정

**주요 함수들**:
- `toTimeString`: 시간과 분을 "HHMM" 형식으로 변환
  - 예: "9", "30" → "0930"

**상태 관리**:
- `tableOccupationTime`: 테이블 점유시간 표시 여부
- `menuboardType`: 메뉴판 타입 (플러스형/마이너스형)
- `startTime`, `endTime`: 영업 시작/종료 시간

### 5. MenuAppFeature (메뉴판 기능 섹션)
**역할**: 메뉴판의 다양한 기능들을 설정하는 가장 복잡한 섹션

**주요 함수들**:
- `toMinutes`: 시간 문자열을 분 단위로 변환
  - 예: "0930" → 570분 (9시간 30분)
  
- `formatTime`: 분을 시간 문자열로 변환
  - 예: 570분 → "0930"
  
- `calculateTimeBefore`: 기준 시간에서 몇 분 전을 계산
  - 예: "0930"에서 30분 전 → "0900"
  
- `toNumberOrUndefined`: 문자열을 숫자로 변환 (빈 문자열이면 undefined)
  
- `handleToggleCategoryRequired`: 카테고리 필수 여부를 토글
  - 체크하면 추가, 체크 해제하면 제거

**상태 관리** (많음!):
- `isOrderable`: 주문하기 사용 여부
- `firstOrderMinAmount`: 첫주문 최소 금액
- `useCustomerCount`: 객수 사용 여부
- `useBreakTime`: 브레이크타임 사용 여부
- `breakTimeRows`: 브레이크타임 목록
- `useClosureNotice`: 영업마감 안내 사용 여부
- ... 등등 (20개 이상!)

**특별한 기능**:
- CategoryModal: 카테고리 설정을 위한 모달 창
- BreakTimeRow: 브레이크타임을 여러 개 추가할 수 있음

### 6. Payment (결제 섹션)
**역할**: 결제 방식과 매출 관련 설정

**주요 함수들**:
- `toNumberOrUndefined`: 문자열을 숫자로 변환

**상태 관리**:
- `paymentType`: 결제 방식 (선불/후불)
- `vanCode`, `vanId`: VAN 관련 정보
- `shopCardTerminal`: 카드 단말기 종류
- `serviceChargeRate`: 봉사료율
- `isSalesTotalVisible`: 매출 총 금액 노출 여부
- `salesPassword`: 매출 비밀번호

### 7. Intergration (연동 섹션)
**역할**: POS 시스템 연동 설정

**상태 관리**:
- `shopPosCode`: POS 연동 코드

**동작 방식**:
- 매우 간단! POS 코드만 선택하면 됨

### 8. Language (언어 섹션)
**역할**: 매장에서 사용할 언어 설정

**상태 관리**:
- `mainLanguage`: 메인 언어 (한국어/영어/일본어 등)
- `locale`: 다국어 사용 여부
- `selectedLanguages`: 선택된 언어 목록
- `useLocaleBeforeOrder`: 주문 전 언어 선택 여부

**동작 방식**:
1. 메인 언어 선택
2. 다국어 사용 여부 토글
3. 사용할 언어들 체크박스로 선택
4. 주문 전 언어 선택 여부 설정

## 🔑 핵심 개념 설명

### Draft (초안) 패턴
- **왜 사용하나요?**: 사용자가 여러 곳을 수정하다가 실수로 새로고침하면 모든 변경사항이 사라질 수 있어요
- **어떻게 작동하나요?**: 
  1. 사용자가 변경하면 → Draft에 저장 (아직 서버에는 안 보냄)
  2. 저장하기 버튼 클릭 → 그때 서버에 보냄
  3. 마치 연필로 쓴 글을 지우개로 지울 수 있는 것처럼!

### mergeDefined 함수
- **역할**: 기존 값과 새 값을 합치는 함수
- **예시**:
  ```javascript
  기존: {name: "김철수", age: 20, city: "서울"}
  새 값: {age: 21, phone: "010-1234-5678"}
  결과: {name: "김철수", age: 21, city: "서울", phone: "010-1234-5678"}
  ```
- **왜 필요한가요?**: 일부만 수정해도 나머지는 그대로 유지하기 위해

### onChange 콜백 패턴
- **역할**: 자식 컴포넌트가 부모 컴포넌트에게 변경사항을 알려주는 방법
- **비유**: 아이가 엄마에게 "저 지금 밥 먹고 있어요!"라고 알려주는 것과 같아요
- **흐름**:
  1. 자식 컴포넌트에서 변경 발생
  2. `onChange` 함수 호출
  3. 부모 컴포넌트의 `handleChange` 실행
  4. Draft 상태 업데이트

## 📝 저장 프로세스 상세 설명

### 1단계: 사용자가 변경
```
사용자가 "한국어" → "영어"로 변경
```

### 2단계: 섹션 컴포넌트가 감지
```javascript
// Language 컴포넌트 내부
useEffect(() => {
  onChange({
    shopSetting: { shopLanguage: mainLanguage },
    useLocale: locale
  });
}, [mainLanguage, locale]);
```

### 3단계: 부모 컴포넌트가 받음
```javascript
// MiscellaneousPage의 handleChange
const handleChange = (change) => {
  if (change.shopSetting) {
    setShopSettingDraft((prev) => 
      mergeDefined(prev, change.shopSetting)
    );
  }
  // ... 다른 변경사항들도 처리
};
```

### 4단계: Draft 상태 업데이트
```
shopSettingDraft: { shopLanguage: "EN" } // 영어로 변경됨!
```

### 5단계: 저장하기 버튼 클릭
```javascript
// handleSave 함수 실행
const handleSave = async () => {
  // 1. 모든 Draft를 합치기
  const shopSetting = mergeDefined(
    shopInfo.shopSetting,  // 서버에서 가져온 원본
    shopSettingDraft       // 사용자가 변경한 내용
  );
  
  // 2. 서버에 보내기
  await updateShopSettingMutation.mutateAsync({
    ...shopInfo,
    shopSetting,
    shopTime,
    shopNetwork
  });
  
  // 3. 서버 데이터 새로고침
  await queryClient.invalidateQueries(...);
};
```

## 🎯 요약

1. **데이터 흐름**: 서버 → 초기값 설정 → 각 섹션 → Draft 저장 → 저장하기 → 서버
2. **핵심 패턴**: Draft 패턴 (임시 저장) + onChange 콜백 (부모-자식 통신)
3. **주요 함수**: 
   - `handleChange`: 변경사항 수집
   - `handleSave`: 최종 저장
   - `mergeDefined`: 데이터 합치기
4. **7개 섹션**: 각각 독립적으로 동작하지만, 모두 부모 컴포넌트를 통해 통신

## 💡 초등학생도 이해하는 비유

**전체 구조**: 큰 아파트(MiscellaneousPage)에 7개의 방(섹션)이 있어요

**Draft 패턴**: 
- 연필로 쓴 글(Draft)은 지우개로 지울 수 있어요
- 펜으로 쓴 글(서버 저장)은 지울 수 없어요
- 그래서 먼저 연필로 쓰고, 확인한 후에 펜으로 써요!

**onChange 패턴**:
- 아이(자식 컴포넌트)가 엄마(부모 컴포넌트)에게 "저 지금 밥 먹고 있어요!"라고 알려주는 것
- 엄마는 그 정보를 받아서 일기장에 기록해요

**mergeDefined**:
- 레고 블록을 합치는 것과 같아요
- 기존 블록(원본 데이터) + 새 블록(변경사항) = 완성된 작품!

