import { CheckButton } from '@repo/ui/components';
import { allowOnlyNumbers } from '@repo/util/string';
import * as S from '@/feature/backoffice/Stores/StoreInfoTab/storeInfoTab.style';
import type { IGetAdminShopDetail } from '@repo/api/types';
import { Input, Dropdown } from '@/feature/backoffice/components';

type Mode = 'create' | 'edit';

interface Props {
  mode: Mode;
  formData: IGetAdminShopDetail;
  updateFormData: (updates: Partial<IGetAdminShopDetail>) => void;
}

const AREA_CODE_OPTIONS = [
  { value: '02', label: '02 (서울)' },
  { value: '031', label: '031 (경기)' },
  { value: '032', label: '032 (인천)' },
  { value: '033', label: '033 (강원)' },
  { value: '041', label: '041 (충남)' },
  { value: '042', label: '042 (대전)' },
  { value: '043', label: '043 (충북)' },
  { value: '044', label: '044 (세종)' },
  { value: '051', label: '051 (부산)' },
  { value: '052', label: '052 (울산)' },
  { value: '053', label: '053 (대구)' },
  { value: '054', label: '054 (경북)' },
  { value: '055', label: '055 (경남)' },
  { value: '061', label: '061 (전남)' },
  { value: '062', label: '062 (광주)' },
  { value: '063', label: '063 (전북)' },
  { value: '064', label: '064 (제주)' },
];

export const StoreInfoTab = ({ mode, formData, updateFormData }: Props) => {
  return (
    <S.Container>
      <S.Section>
        <S.FormContent>
          {mode === 'edit' && (
            <S.HorizontalLayout>
              <S.FieldGroup>
                <S.Label>SID</S.Label>
                <Input
                  placeholder="SID"
                  value={formData.shopCode ?? ''}
                  onChange={() => {
                    // readOnly
                  }}
                  disabled
                />
              </S.FieldGroup>
            </S.HorizontalLayout>
          )}

          <S.HorizontalLayout>
            <S.FieldGroup>
              <S.Label>
                매장명 <span>*</span>
              </S.Label>
              <Input
                placeholder="매장명을 입력하세요"
                value={formData.shopName}
                onChange={(value) => updateFormData({ shopName: value })}
              />
            </S.FieldGroup>

            <S.FieldGroup>
              <S.Label>
                검색용 매장명 <span>*</span>
              </S.Label>
              <Input
                placeholder="검색용 매장명을 입력하세요"
                value={formData.shopSearchName}
                onChange={(value) => updateFormData({ shopSearchName: value })}
              />
            </S.FieldGroup>
          </S.HorizontalLayout>

          <S.HorizontalLayout>
            <S.FieldGroup>
              <S.Label>사업자등록번호</S.Label>
              <Input
                placeholder="사업자등록번호를 입력하세요"
                value={formData.businessNumber}
                onChange={(value) =>
                  updateFormData({ businessNumber: allowOnlyNumbers(value) })
                }
                type="tel"
                inputMode="numeric"
              />
            </S.FieldGroup>
            <S.FieldGroup>
              <CheckButton
                checked={formData.isCorporate}
                onChange={(checked) => updateFormData({ isCorporate: checked })}
                customStyle={S.LargeCheckboxStyle}
              >
                <p>법인 여부</p>
              </CheckButton>
            </S.FieldGroup>
          </S.HorizontalLayout>

          <S.FieldGroup>
            <S.Label>
              기본 주소 <span>*</span>
            </S.Label>
            <Input
              placeholder="기본 주소를 입력하세요"
              value={formData.address1}
              onChange={(value) => updateFormData({ address1: value })}
            />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.Label>나머지 주소</S.Label>
            <Input
              placeholder="나머지 주소를 입력하세요"
              value={formData.address2}
              onChange={(value) => updateFormData({ address2: value })}
            />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.Label>지역 코드</S.Label>
            <Dropdown
              options={AREA_CODE_OPTIONS}
              value={formData.areaCode || null}
              onChange={(value) => updateFormData({ areaCode: String(value) })}
              placeholder="지역 코드를 선택하세요"
            />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.Label>매장 이메일</S.Label>
            <Input
              placeholder="매장 이메일을 입력하세요"
              value={formData.shopEmail}
              onChange={(value) => updateFormData({ shopEmail: value })}
            />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.Label>
              매장 전화번호 <span>*</span>
            </S.Label>
            <Input
              placeholder="매장 전화번호를 입력하세요"
              value={formData.shopPhoneNumber}
              onChange={(value) =>
                updateFormData({ shopPhoneNumber: allowOnlyNumbers(value) })
              }
              type="tel"
              inputMode="numeric"
            />
          </S.FieldGroup>

          <S.HorizontalLayout>
            <S.FieldGroup>
              <S.Label>
                대표자명 <span>*</span>
              </S.Label>
              <Input
                placeholder="대표자명을 입력하세요"
                value={formData.ownerName}
                onChange={(value) => updateFormData({ ownerName: value })}
              />
            </S.FieldGroup>

            <S.FieldGroup>
              <S.Label>
                대표자 연락처 <span>*</span>
              </S.Label>
              <Input
                placeholder="대표자 연락처를 입력하세요"
                value={formData.ownerPhoneNumber}
                onChange={(value) =>
                  updateFormData({ ownerPhoneNumber: allowOnlyNumbers(value) })
                }
                type="tel"
                inputMode="numeric"
              />
            </S.FieldGroup>
          </S.HorizontalLayout>

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
                value={formData.managerPhoneNumber}
                onChange={(value) =>
                  updateFormData({
                    managerPhoneNumber: allowOnlyNumbers(value),
                  })
                }
                type="tel"
                inputMode="numeric"
              />
            </S.FieldGroup>
          </S.HorizontalLayout>

          <S.CheckboxGroup>
            <CheckButton
              checked={formData.isActive}
              onChange={(checked) => updateFormData({ isActive: checked })}
              customStyle={S.LargeCheckboxStyle}
            >
              활성화
            </CheckButton>
            <CheckButton
              checked={formData.isTestShop}
              onChange={(checked) => updateFormData({ isTestShop: checked })}
              customStyle={S.LargeCheckboxStyle}
            >
              테스트 매장
            </CheckButton>
            <CheckButton
              checked={formData.isEarlyUpdate}
              onChange={(checked) => updateFormData({ isEarlyUpdate: checked })}
              customStyle={S.LargeCheckboxStyle}
            >
              공식 업데이트
            </CheckButton>
            <CheckButton
              checked={formData.isEarlyBetaUpdate}
              onChange={(checked) =>
                updateFormData({ isEarlyBetaUpdate: checked })
              }
              customStyle={S.LargeCheckboxStyle}
            >
              베타 업데이트
            </CheckButton>
          </S.CheckboxGroup>
        </S.FormContent>
      </S.Section>
    </S.Container>
  );
};
