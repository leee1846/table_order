import { useState, useEffect } from 'react';
import { StoreInfoTab } from '@/feature/AdminWeb/Stores/StoreInfoTab';
import { MemberInfoTab } from '@/feature/AdminWeb/Stores/MemberInfoTab';
import { SettingInfoTab } from '@/feature/AdminWeb/Stores/SettingInfoTab';
import { ChangeHistoryDialog } from '../ChangeHistoryDialog';
import * as S from './stores.style';
import type {
  ICreateAdminMemberRequest,
  IGetAdminShopDetail,
} from '@repo/api/types';
import { DEFAULT_MEMBER_DATA, DEFAULT_SHOP_DATA } from './constants';
import { Button } from '@/feature/AdminWeb/components';

type TabType = 'storeInfo' | 'memberInfo' | 'settingInfo';
type Mode = 'create' | 'edit';

interface Props {
  mode: Mode;
  initialData?: IGetAdminShopDetail;
  memberInitialData?: ICreateAdminMemberRequest;
  onSave: (
    shopData: IGetAdminShopDetail,
    memberData: ICreateAdminMemberRequest
  ) => Promise<void>;
}

export const Stores = ({
  mode,
  initialData,
  memberInitialData,
  onSave,
}: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>('storeInfo');
  const [formData, setFormData] =
    useState<IGetAdminShopDetail>(DEFAULT_SHOP_DATA);
  const [memberFormData, setMemberFormData] =
    useState<ICreateAdminMemberRequest>(DEFAULT_MEMBER_DATA);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);

  useEffect(() => {
    if (memberInitialData) {
      setMemberFormData((prev) => {
        return {
          ...prev,
          ...memberInitialData,
        };
      });
      return;
    }
  }, [memberInitialData]);

  useEffect(() => {
    if (initialData) {
      // posLinkType이 null인 경우 'NONE'으로 설정
      const normalizedData = {
        ...initialData,
        settingInfo: {
          ...initialData.settingInfo,
          posLinkType: initialData.settingInfo?.posLinkType || 'NONE',
        },
      };
      setFormData(normalizedData);
      setMemberFormData((prev) => ({
        ...prev,
        shopSeq: initialData?.shopSeq ?? 0,
      }));
    }
  }, [initialData]);

  const updateFormData = (updates: Partial<IGetAdminShopDetail>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    await onSave(formData, memberFormData);
  };

  const handleHistory = () => {
    setIsHistoryDialogOpen(true);
  };

  const handleCloseHistoryDialog = () => {
    setIsHistoryDialogOpen(false);
  };

  const title = mode === 'create' ? '생성' : '수정';

  return (
    <S.PageWrapper>
      <S.Container>
        <S.TitleContainer>
          <S.Title>
            매장 관리
            <div />
            <span>{title}</span>
          </S.Title>
          <S.ButtonGroup>
            {mode === 'edit' && (
              <Button variant="outline" onClick={handleHistory}>
                변경 이력
              </Button>
            )}
            <Button variant="default" onClick={handleSave}>
              저장
            </Button>
          </S.ButtonGroup>
        </S.TitleContainer>

      <S.TabContainer>
        <S.TabButton
          type="button"
          isActive={activeTab === 'storeInfo'}
          onClick={() => setActiveTab('storeInfo')}
        >
          매장 정보
        </S.TabButton>
        <S.TabButton
          type="button"
          isActive={activeTab === 'settingInfo'}
          onClick={() => setActiveTab('settingInfo')}
        >
          세팅 정보
        </S.TabButton>
        {mode === 'edit' && (
          <S.TabButton
            type="button"
            isActive={activeTab === 'memberInfo'}
            onClick={() => setActiveTab('memberInfo')}
          >
            계정 정보
          </S.TabButton>
        )}
      </S.TabContainer>

      <S.TabContent>
        {activeTab === 'storeInfo' && (
          <StoreInfoTab
            mode={mode}
            formData={formData}
            updateFormData={updateFormData}
          />
        )}

        {activeTab === 'settingInfo' && (
          <SettingInfoTab formData={formData} updateFormData={updateFormData} />
        )}

        {activeTab === 'memberInfo' && mode === 'edit' && (
          <MemberInfoTab
            formData={memberFormData}
            updateFormData={(updates) =>
              setMemberFormData((prev) => ({ ...prev, ...updates }))
            }
          />
        )}
      </S.TabContent>
      {mode === 'edit' && (
        <ChangeHistoryDialog
          isOpen={isHistoryDialogOpen}
          onClose={handleCloseHistoryDialog}
          histories={[
            {
              code: 'SHOP',
              id: initialData?.shopCode ?? '',
              label: '매장 변경 이력',
            },
            ...(memberInitialData?.memberId
              ? [
                  {
                    code: 'MEMBER' as const,
                    id: memberFormData?.memberId || memberInitialData?.memberId,
                    label: '계정 변경 이력',
                  },
                ]
              : []),
          ]}
        />
      )}
      </S.Container>
    </S.PageWrapper>
  );
};
