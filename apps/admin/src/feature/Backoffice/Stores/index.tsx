import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  Button,
  Space,
  Form,
  Flex,
  Typography,
  type TabsProps,
} from 'antd';
//import type { TabsProps } from 'antd';
import { StoreInfoTab } from '@/feature/backoffice/Stores/StoreInfoTab';
import { MemberInfoTab } from '@/feature/backoffice/Stores/MemberInfoTab';
import { SettingInfoTab } from '@/feature/backoffice/Stores/SettingInfoTab';
import { ChangeHistoryDialog } from '@/feature/backoffice/ChangeHistoryDialog';
import { StoreAdInfoTab } from '@/feature/backoffice/Stores/StoreAdInfoTab';
import type {
  ICreateAdminMemberRequest,
  IGetAdminShopDetail,
} from '@repo/api/types';
import {
  DEFAULT_MEMBER_DATA,
  DEFAULT_SHOP_DATA,
} from '@/feature/backoffice/Stores/constants';
import PageTitle from '@/feature/Backoffice/components/PageTitle';
import styled from '@emotion/styled';

const FormWrapper = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border-top: 2px solid #e2e8f0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

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
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formData, setFormData] =
    useState<IGetAdminShopDetail>(DEFAULT_SHOP_DATA);
  const [memberFormData, setMemberFormData] =
    useState<ICreateAdminMemberRequest>(DEFAULT_MEMBER_DATA);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);

  useEffect(() => {
    let finalShopData = { ...DEFAULT_SHOP_DATA };
    let finalMemberData = { ...DEFAULT_MEMBER_DATA };

    if (initialData) {
      finalShopData = {
        ...finalShopData,
        ...initialData,
        settingInfo: {
          ...finalShopData.settingInfo,
          ...initialData.settingInfo,
          posLinkType: initialData.settingInfo?.posLinkType || 'NONE',
        },
      };
      finalMemberData.shopSeq = initialData.shopSeq ?? 0;
    }

    if (memberInitialData) {
      finalMemberData = { ...finalMemberData, ...memberInitialData };
    }

    setFormData(finalShopData);
    setMemberFormData(finalMemberData);
    form.setFieldsValue({ ...finalShopData, ...finalMemberData });
  }, [initialData, memberInitialData, form]);

  const updateFormData = (updates: Partial<IGetAdminShopDetail>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    form.setFieldsValue(updates);
  };

  const updateMemberFormData = (
    updates: Partial<ICreateAdminMemberRequest>
  ) => {
    setMemberFormData((prev) => ({ ...prev, ...updates }));
    form.setFieldsValue(updates);
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

  const subTitle = mode === 'create' ? '등록' : '수정';

  const tabItems: TabsProps['items'] = [
    {
      key: 'storeInfo',
      label: '매장 정보',
      children: (
        <StoreInfoTab
          mode={mode}
          formData={formData}
          updateFormData={updateFormData}
        />
      ),
    },
    {
      key: 'settingInfo',
      label: '세팅 정보',
      children: (
        <SettingInfoTab formData={formData} updateFormData={updateFormData} />
      ),
    },
  ];

  if (mode === 'edit') {
    tabItems.push({
      key: 'memberInfo',
      label: '계정 정보',
      children: (
        <MemberInfoTab
          formData={memberFormData}
          updateFormData={updateMemberFormData}
        />
      ),
    });
    tabItems.push({
      key: 'storeAdInfo',
      label: '매장 광고 정보',
      children: (
        <StoreAdInfoTab
          //formData={memberFormData}
          updateFormData={updateMemberFormData}
        />
      ),
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Flex
        justify="space-between"
        align="center" /* style={{ marginBottom: 24 }} */
      >
        <PageTitle title="매장 관리" subtitle={subTitle} />
        {mode === 'edit' && <Button onClick={handleHistory}>변경 이력</Button>}
      </Flex>
      <FormWrapper>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <Tabs
            defaultActiveKey="storeInfo"
            items={tabItems}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
              marginTop: 40,
            }}
          >
            <Button
              size="large"
              onClick={() => navigate(-1)}
              style={{ width: '100px' }}
            >
              취소
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ width: '100px' }}
            >
              {mode === 'create' ? '저장' : '수정'}
            </Button>
          </div>

          <>
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
                          id:
                            memberFormData?.memberId ||
                            memberInitialData?.memberId,
                          label: '계정 변경 이력',
                        },
                      ]
                    : []),
                ]}
              />
            )}
          </>
        </Form>
      </FormWrapper>
    </div>
  );
};
