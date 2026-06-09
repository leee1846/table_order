# CLAUDE.md — packages/api

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 코드 작성 시 `docs/conventions.md`의 규칙을 따른다.

## 패키지 역할

앱 전체의 API 통신 계층. 두 앱(`admin`, `menu`) 모두 이 패키지만 통해 서버와 통신한다.

```
src/
├── cores/         # axios 인스턴스 팩토리 및 엔드포인트 상수
├── types/         # 요청·응답 타입 (도메인별 파일)
├── fetchers/      # axios 호출 순수 함수 (도메인별 파일)
├── queries/       # TanStack Query 훅 (도메인별 폴더)
│   └── queryKeys.ts
├── auth/          # 토큰 관리, 갱신 로직
└── globalErrorHandler.ts
```

---

## Axios 인스턴스 선택

| 인스턴스명 | 용도 |
|-----------|------|
| `'private'` | 인증이 필요한 모든 요청 (JWT 자동 첨부, 401 시 토큰 갱신) |
| `'public'` | 로그인 등 비인증 요청 |
| `'raw'` | 토큰 갱신 자체 등 인터셉터를 우회해야 하는 경우 |

```ts
const axiosInstance = getAxiosInstance('private');
```

---

## 새 API 엔드포인트 추가 — 전체 흐름

### 1. 엔드포인트 상수 (`cores/endpoints.ts`)

```ts
export const ENDPOINTS = {
  PRODUCT: {
    LIST: '/products/list',
    DETAIL: (id: string) => `/products/${id}`,
    CREATE: '/products',
  },
};
```

### 2. 타입 정의 (`types/product.ts`)

```ts
import type { IApiResponse } from './common';

export interface IProductListParams { categoryId?: string; }

export interface IProduct { productSeq: number; productName: string; }

export type TGetProductListResponse = IApiResponse<{ content: IProduct[] }>;

export interface ICreateProductRequest { productName: string; }
```

`types/index.ts`에 `export * from './product'` 추가.

### 3. Fetcher 작성 (`fetchers/product.ts`)

```ts
import { getAxiosInstance } from '../cores/axios';
import { ENDPOINTS } from '../cores/endpoints';
import type { IProductListParams, TGetProductListResponse } from '../types/product';
import type { TVoidApiResponse } from '../types/common';

/** 제품 리스트 조회 */
export const getProductList = async (
  params: IProductListParams
): Promise<TGetProductListResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TGetProductListResponse>({
    method: 'GET',
    url: ENDPOINTS.PRODUCT.LIST,
    params,
  });
  return response.data;
};

/** 제품 생성 */
export const createProduct = async (
  data: ICreateProductRequest
): Promise<TVoidApiResponse> => {
  const axiosInstance = getAxiosInstance('private');
  const response = await axiosInstance<TVoidApiResponse>({
    method: 'POST',
    url: ENDPOINTS.PRODUCT.CREATE,
    data,
  });
  return response.data;
};
```

`fetchers/index.ts`에 `export * from './product'` 추가.

### 4. Query Key 등록 (`queries/queryKeys.ts`)

```ts
export const queryKeys = {
  product: {
    all: ['product'] as const,
    list: (categoryId?: string) => [...queryKeys.product.all, 'list', categoryId ?? 'all'] as const,
  },
};
```

### 5. Query 훅 작성

**GET — `queries/product/useGetProductList.ts`**

```ts
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { getProductList } from '../../fetchers/product';
import { queryKeys } from '../queryKeys';
import type { IProductListParams, TGetProductListResponse } from '../../types/product';
import type { IApiError } from '../../types/common';

/** 제품 리스트 조회 훅 */
export const useGetProductList = (
  params: IProductListParams,
  options?: Omit<UseQueryOptions<TGetProductListResponse, AxiosError<IApiError>>, 'queryKey' | 'queryFn'>
) =>
  useQuery<TGetProductListResponse, AxiosError<IApiError>>({
    queryKey: queryKeys.product.list(params.categoryId),
    queryFn: () => getProductList(params),
    ...options,
  });
```

**POST/PUT/DELETE — `queries/product/usePostCreateProduct.ts`**

```ts
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { createProduct } from '../../fetchers/product';
import type { ICreateProductRequest } from '../../types/product';
import type { IApiError, TVoidApiResponse } from '../../types/common';

export const usePostCreateProduct = () =>
  useMutation<TVoidApiResponse, AxiosError<IApiError>, ICreateProductRequest>({
    mutationFn: createProduct,
  });
```

`queries/product/index.ts` 생성 후 각 훅 export. `queries/index.ts`에 `export * from './product'` 추가.

---

## 주요 타입 패턴

```ts
// 모든 응답은 IApiResponse<T>로 래핑됨
type IApiResponse<T> = { status: IApiStatus; data: T };

// 응답 데이터 없는 엔드포인트
type TVoidApiResponse = IApiResponse<null>;

// 에러 타입
type IApiError = { code: string; message: string };
```

## 파일 업로드 (FormData)

```ts
const formData = new FormData();
formData.append('request', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));
formData.append('files', file);

await axiosInstance({ method: 'POST', url: ENDPOINTS.XXX, data: formData,
  headers: { 'Content-Type': 'multipart/form-data' } });
```

## 글로벌 에러 핸들링 제어

```ts
// 특정 상태 코드만 무시 (나머지는 전역 에러 다이얼로그 표시)
ignoreGlobalErrors: [401]

// 전역 에러 처리 완전 비활성화
skipGlobalErrorHandling: true
```
