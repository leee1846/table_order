import * as S from '@/feature/backoffice/Stores/StoreInfoTab/storeInfoTab.style';
import type { IGetAdminShopDetail } from '@repo/api/types';
import { Input, Dropdown } from '@/feature/backoffice/components';

interface Props {
  formData: IGetAdminShopDetail;
  updateFormData: (updates: Partial<IGetAdminShopDetail>) => void;
}

const posLinkTypeOptions = [
  { value: 'NONE', label: '미연동' },
  { value: 'OKPOS', label: '오케이포스' },
];

export const SettingInfoTab = ({ formData, updateFormData }: Props) => {
  const settingInfo = formData.settingInfo || {
    shopSeq: 0,
    vanId: '',
    usePrepayment: false,
    ipAddress: '',
    useOnlinePosMode: false,
    routerId: '',
    routerPw: '',
    wifiSsid: '',
    wifiPw: '',
    windowAspId: '',
    windowAspPw: '',
    chargerType: '',
    posLinkType: 'NONE' as const,
    updateDate: '',
    updateMemberUuid: '',
  };

  const updateSettingInfo = (updates: Partial<typeof settingInfo>) => {
    updateFormData({
      settingInfo: {
        ...settingInfo,
        ...updates,
      },
    });
  };

  return (
    <S.Container>
      <S.Section>
        <S.FormContent>
          <S.FieldGroup>
            <S.Label>결제형태</S.Label>
            <Input
              placeholder="결제형태"
              value={settingInfo.usePrepayment ? '선불' : '후불'}
              onChange={() => {
                // readOnly
              }}
              disabled
            />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.Label>VAN TID</S.Label>
            <Input
              placeholder="VAN TID를 입력하세요"
              value={settingInfo.vanId || ''}
              onChange={(value) => updateSettingInfo({ vanId: value })}
            />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.Label>로컬아이피</S.Label>
            <Input
              placeholder="로컬아이피"
              value={settingInfo.ipAddress || ''}
              onChange={() => {
                // readOnly
              }}
              disabled
            />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.Label>포스연동방식</S.Label>
            <Dropdown
              options={posLinkTypeOptions}
              value={settingInfo.posLinkType || 'NONE'}
              onChange={(value) =>
                updateSettingInfo({ posLinkType: value as 'NONE' | 'OKPOS' })
              }
              placeholder="포스연동방식을 선택하세요"
            />
          </S.FieldGroup>

          <S.HorizontalLayout>
            <S.FieldGroup>
              <S.Label>공유기 ID</S.Label>
              <Input
                placeholder="공유기 ID를 입력하세요"
                value={settingInfo.routerId || ''}
                onChange={(value) => updateSettingInfo({ routerId: value })}
              />
            </S.FieldGroup>

            <S.FieldGroup>
              <S.Label>공유기 PW</S.Label>
              <Input
                placeholder="공유기 PW를 입력하세요"
                value={settingInfo.routerPw || ''}
                onChange={(value) => updateSettingInfo({ routerPw: value })}
              />
            </S.FieldGroup>
          </S.HorizontalLayout>
        </S.FormContent>
      </S.Section>
    </S.Container>
  );
};
