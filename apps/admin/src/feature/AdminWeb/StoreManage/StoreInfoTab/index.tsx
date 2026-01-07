import { Input, CheckButton, Dropdown } from '@repo/ui/components';
import type { StoreFormData } from '../types';
import * as S from './storeInfoTab.style';

type Mode = 'create' | 'edit';

interface Props {
  mode: Mode;
  formData: StoreFormData;
  updateFormData: (updates: Partial<StoreFormData>) => void;
}

const businessTypeOptions = [
  { value: 'restaurant', label: '음식점' },
  { value: 'cafe', label: '카페' },
  { value: 'bar', label: '바' },
  { value: 'bakery', label: '베이커리' },
  { value: 'other', label: '기타' },
];

const businessCategoryOptions = [
  { value: 'individual', label: '개인사업자' },
  { value: 'corporation', label: '법인사업자' },
  { value: 'franchise', label: '프랜차이즈' },
];

export const StoreInfoTab = ({ mode, formData, updateFormData }: Props) => {
  return (
    <S.Container>
      {mode === 'edit' && (
        <S.Section>
          <S.HorizontalLayout>
            <S.FieldGroup>
              <S.Label>계정정보</S.Label>
              <Input
                placeholder="계정정보"
                value={formData.accountInfo || ''}
                onChange={() => {
                  // readOnly
                }}
                disabled
              />
            </S.FieldGroup>
            <S.FieldGroup>
              <S.Label>SID</S.Label>
              <Input
                placeholder="SID"
                value={formData.sid || ''}
                onChange={() => {
                  // readOnly
                }}
                disabled
              />
            </S.FieldGroup>
          </S.HorizontalLayout>
        </S.Section>
      )}

      <S.Section>
        <S.HorizontalLayout>
          <S.FieldGroup>
            <S.Label>
              매장명 <span>*</span>
            </S.Label>
            <Input
              placeholder="매장명을 입력하세요"
              value={formData.storeName}
              onChange={(value) => updateFormData({ storeName: value })}
            />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.Label>검색용 매장명</S.Label>
            <Input
              placeholder="검색용 매장명을 입력하세요"
              value={formData.searchStoreName}
              onChange={(value) => updateFormData({ searchStoreName: value })}
            />
          </S.FieldGroup>
        </S.HorizontalLayout>
      </S.Section>

      <S.Section>
        <S.FieldGroup>
          <S.Label>
            사업자등록번호 <span>*</span>
          </S.Label>
          <S.BusinessNumberContainer>
            <Input
              placeholder="사업자등록번호를 입력하세요"
              value={formData.businessNumber}
              onChange={(value) => updateFormData({ businessNumber: value })}
            />
            <CheckButton
              checked={formData.isCorporation}
              onChange={(checked) => updateFormData({ isCorporation: checked })}
              customStyle={S.LargeCheckboxStyle}
            >
              <p>법인 여부</p>
            </CheckButton>
          </S.BusinessNumberContainer>
        </S.FieldGroup>
      </S.Section>

      <S.Section>
        <S.FieldGroup>
          <S.Label>
            기본 주소 <span>*</span>
          </S.Label>
          <Input
            placeholder="기본 주소를 입력하세요"
            value={formData.address}
            onChange={(value) => updateFormData({ address: value })}
          />
        </S.FieldGroup>

        <S.FieldGroup>
          <S.Label>나머지 주소</S.Label>
          <Input
            placeholder="나머지 주소를 입력하세요"
            value={formData.detailAddress}
            onChange={(value) => updateFormData({ detailAddress: value })}
          />
        </S.FieldGroup>
      </S.Section>

      <S.Section>
        <S.FieldGroup>
          <S.Label>매장 이메일</S.Label>
          <Input
            placeholder="매장 이메일을 입력하세요"
            value={formData.storeEmail}
            onChange={(value) => updateFormData({ storeEmail: value })}
          />
        </S.FieldGroup>
      </S.Section>

      <S.Section>
        <S.HorizontalLayout>
          <S.FieldGroup>
            <S.Label>
              대표자명 <span>*</span>
            </S.Label>
            <Input
              placeholder="대표자명을 입력하세요"
              value={formData.representativeName}
              onChange={(value) =>
                updateFormData({ representativeName: value })
              }
            />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.Label>
              대표자 연락처 <span>*</span>
            </S.Label>
            <Input
              placeholder="대표자 연락처를 입력하세요"
              value={formData.representativeContact}
              onChange={(value) =>
                updateFormData({ representativeContact: value })
              }
            />
          </S.FieldGroup>
        </S.HorizontalLayout>
      </S.Section>

      <S.Section>
        <S.HorizontalLayout>
          <S.FieldGroup>
            <S.Label>실무 담당자명</S.Label>
            <Input
              placeholder="실무 담당자명을 입력하세요"
              value={formData.managerName}
              onChange={(value) => updateFormData({ managerName: value })}
            />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.Label>실무 담당자 연락처</S.Label>
            <Input
              placeholder="실무 담당자 연락처를 입력하세요"
              value={formData.managerContact}
              onChange={(value) => updateFormData({ managerContact: value })}
            />
          </S.FieldGroup>
        </S.HorizontalLayout>
      </S.Section>

      <S.Section>
        <S.HorizontalLayoutLeft>
          <S.FieldGroup>
            <S.Label>업종</S.Label>
            <Dropdown
              options={businessTypeOptions}
              value={formData.businessType}
              onChange={(value) => updateFormData({ businessType: value })}
              placeholder="업종을 선택하세요"
            />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.Label>업태</S.Label>
            <Dropdown
              options={businessCategoryOptions}
              value={formData.businessCategory}
              onChange={(value) => updateFormData({ businessCategory: value })}
              placeholder="업태를 선택하세요"
            />
          </S.FieldGroup>
        </S.HorizontalLayoutLeft>
      </S.Section>

      <S.Section>
        <S.CheckboxGroup>
          <CheckButton
            checked={formData.isActive}
            onChange={(checked) => updateFormData({ isActive: checked })}
            customStyle={S.LargeCheckboxStyle}
          >
            활성화
          </CheckButton>
          <CheckButton
            checked={formData.isTestStore}
            onChange={(checked) => updateFormData({ isTestStore: checked })}
            customStyle={S.LargeCheckboxStyle}
          >
            테스트 매장
          </CheckButton>
          <CheckButton
            checked={formData.isOfficialUpdate}
            onChange={(checked) =>
              updateFormData({ isOfficialUpdate: checked })
            }
            customStyle={S.LargeCheckboxStyle}
          >
            공식 업데이트
          </CheckButton>
          <CheckButton
            checked={formData.isBetaUpdate}
            onChange={(checked) => updateFormData({ isBetaUpdate: checked })}
            customStyle={S.LargeCheckboxStyle}
          >
            베타 업데이트
          </CheckButton>
        </S.CheckboxGroup>
      </S.Section>
    </S.Container>
  );
};
