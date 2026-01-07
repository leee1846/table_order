import { useState } from 'react';
import { Pagination, Input, Dropdown } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import { Table } from './Table';
import * as S from './storesPage.style';

interface StoreItem {
  sid: string;
  id: string;
  name: string;
  businessNumber: string;
  address: string;
  contact: string;
  version: string;
  isActive: boolean;
}

// Mock data
const MOCK_STORES: StoreItem[] = [
  {
    sid: 'SID001',
    id: 'store001',
    name: '강남점',
    businessNumber: '123-45-67890',
    address: '서울특별시 강남구 테헤란로 123',
    contact: '02-1234-5678',
    version: '1.0.0',
    isActive: true,
  },
  {
    sid: 'SID002',
    id: 'store002',
    name: '홍대점',
    businessNumber: '234-56-78901',
    address: '서울특별시 마포구 홍익로 456',
    contact: '02-2345-6789',
    version: '1.0.0',
    isActive: true,
  },
  {
    sid: 'SID003',
    id: 'store003',
    name: '명동점',
    businessNumber: '345-67-89012',
    address: '서울특별시 중구 명동길 789',
    contact: '02-3456-7890',
    version: '1.1.0',
    isActive: false,
  },
  {
    sid: 'SID004',
    id: 'store004',
    name: '이태원점',
    businessNumber: '456-78-90123',
    address: '서울특별시 용산구 이태원로 321',
    contact: '02-4567-8901',
    version: '1.0.0',
    isActive: true,
  },
  {
    sid: 'SID005',
    id: 'store005',
    name: '잠실점',
    businessNumber: '567-89-01234',
    address: '서울특별시 송파구 올림픽로 654',
    contact: '02-5678-9012',
    version: '1.2.0',
    isActive: true,
  },
  {
    sid: 'SID006',
    id: 'store006',
    name: '건대점',
    businessNumber: '678-90-12345',
    address: '서울특별시 광진구 능동로 987',
    contact: '02-6789-0123',
    version: '1.0.0',
    isActive: false,
  },
  {
    sid: 'SID007',
    id: 'store007',
    name: '신촌점',
    businessNumber: '789-01-23456',
    address: '서울특별시 서대문구 연세로 147',
    contact: '02-7890-1234',
    version: '1.1.0',
    isActive: true,
  },
  {
    sid: 'SID008',
    id: 'store008',
    name: '압구정점',
    businessNumber: '890-12-34567',
    address: '서울특별시 강남구 압구정로 258',
    contact: '02-8901-2345',
    version: '1.0.0',
    isActive: true,
  },
  {
    sid: 'SID009',
    id: 'store009',
    name: '청담점',
    businessNumber: '901-23-45678',
    address: '서울특별시 강남구 청담동 369',
    contact: '02-9012-3456',
    version: '1.2.0',
    isActive: true,
  },
  {
    sid: 'SID010',
    id: 'store010',
    name: '삼성점',
    businessNumber: '012-34-56789',
    address: '서울특별시 강남구 테헤란로 741',
    contact: '02-0123-4567',
    version: '1.0.0',
    isActive: false,
  },
];

const PAGE_SIZE = 10;

export const StoresPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [contractStatus, setContractStatus] = useState<string | number | null>(
    null
  );
  const [isPrePayment, setIsPrePayment] = useState<string | number | null>(
    null
  );

  const contractStatusOptions = [
    { value: 'all', label: '전체' },
    { value: 'active', label: '계약중' },
    { value: 'expired', label: '계약만료' },
    { value: 'pending', label: '계약대기' },
  ];

  const prePaymentOptions = [
    { value: 'all', label: '전체' },
    { value: 'yes', label: 'Y' },
    { value: 'no', label: 'N' },
  ];

  const totalPages = Math.ceil(MOCK_STORES.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentStores = MOCK_STORES.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStoreClick = (store: StoreItem) => {
    // TODO: 매장 상세 페이지로 리다이렉트
    // eslint-disable-next-line no-console
    console.log('Store clicked:', store);
  };

  return (
    <UIStyles.setting.TablePageContainer>
      <S.Container>
        <S.Title>
          매장 관리
          <div />
          <span>매장 목록</span>
        </S.Title>

        <S.SearchContainer>
          <S.SearchInputWrapper>
            <Input
              placeholder="검색어를 입력하세요"
              value={searchKeyword}
              onChange={(value) => setSearchKeyword(value)}
            />
          </S.SearchInputWrapper>

          <Dropdown
            options={contractStatusOptions}
            value={contractStatus}
            onChange={(value) => setContractStatus(value)}
            placeholder="계약상태"
          />

          <Dropdown
            options={prePaymentOptions}
            value={isPrePayment}
            onChange={(value) => setIsPrePayment(value)}
            placeholder="선결제 여부"
          />
        </S.SearchContainer>

        <Table stores={currentStores} onStoreClick={handleStoreClick} />
      </S.Container>

      <UIStyles.setting.Footer>
        <div />
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </UIStyles.setting.Footer>
    </UIStyles.setting.TablePageContainer>
  );
};
