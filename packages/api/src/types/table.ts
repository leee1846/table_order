import { IApiResponse } from './common';

// ============================================================================
// 테이블 정보 타입
// ============================================================================

export interface ITableInfo {
  tableSeq: number; // 테이블 SEQ
  shopSeq: number; // 매장 SEQ
  tableNumber: string; // 테이블 번호
  mappedTableId?: string; // (연동) 테이블 ID
  tableGroupSeq: number; // 테이블 그룹 SEQ
  mappedGroupId?: string; // (연동) 테이블 그룹 ID
  tableName?: string; // 테이블 이름
  mappedUptDt?: string; // (연동) 업데이트 일시
  isMapped: boolean; // (연동) 연동 데이터 여부
  tablePositionX: number; // 테이블 위치_X 좌표
  tablePositionY: number; // 테이블 위치_Y 좌표
  createDate: string; // 생성일시
  createMemberUuid: string; // 생성 회원 UUID
  updateDate: string; // 수정일시
  updateMemberUuid?: string; // 수정 회원 UUID
  orderGroup?: unknown; // 현재 주문 그룹 (필요시 타입 정의)
}

// ============================================================================
// 테이블 그룹 타입
// ============================================================================

export interface ITableGroup {
  tableGroupSeq: number; // 테이블 그룹 SEQ
  shopSeq: number; // 매장 SEQ
  tableGroupName: string; // 테이블 그룹 이름
  mappedGroupId?: string; // (연동) 테이블 그룹 ID
  isMapped: boolean; // (연동) 연동 데이터 여부
  createDate: string; // 생성일시
  createMemberUuid: string; // 생성 회원 UUID
  updateDate: string; // 수정일시
  updateMemberUuid?: string; // 수정 회원 UUID
  tableList?: ITableInfo[]; // 하위 테이블 목록
}

// ============================================================================
// GET /table-group/{shopCode}
// ============================================================================

export interface IGetTableGroupListParams {
  shopCode: string;
}

export type TGetTableGroupListResponse = IApiResponse<ITableGroup[]>;

// ============================================================================
// POST /table-group
// ============================================================================

export interface ICreateTableGroupRequest {
  shopSeq: number;
  tableGroupName: string;
}

// ============================================================================
// PUT /table-group
// ============================================================================

export interface IUpdateTableGroupRequest {
  tableGroupSeq: number;
  tableGroupName: string;
}

// ============================================================================
// DELETE /table-group
// ============================================================================

export interface IDeleteTableGroupRequest {
  tableGroupSeq: number;
  shopSeq: number;
}

// ============================================================================
// POST /table
// ============================================================================

export interface ICreateTableRequest {
  shopSeq: number;
  tableNumber: string;
  tableGroupSeq: number;
  tableName?: string;
  tablePositionX?: number;
  tablePositionY?: number;
}

// ============================================================================
// PUT /table
// ============================================================================

export interface IUpdateTableRequest {
  tableSeq: number;
  shopSeq: number;
  tableNumber: string;
  tableGroupSeq: number;
  tableName?: string;
  tablePositionX?: number;
  tablePositionY?: number;
}

// ============================================================================
// DELETE /table
// ============================================================================

export interface IDeleteTableRequest {
  tableSeq: number;
  shopSeq: number;
  tableNumber: string;
}
