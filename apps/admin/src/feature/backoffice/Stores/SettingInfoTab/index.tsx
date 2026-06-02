import { Form, Input, Select, Row, Col } from 'antd';
import type { IGetAdminShopDetail } from '@repo/api/types';

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
    <div style={{ marginTop: 24 }}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="결제형태">
            <Input
              placeholder="결제형태"
              value={settingInfo.usePrepayment ? '선불' : '후불'}
              disabled
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="VAN TID">
            <Input
              placeholder="VAN TID를 입력하세요"
              value={settingInfo.vanId || ''}
              onChange={(e) => updateSettingInfo({ vanId: e.target.value })}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="로컬아이피">
            <Input
              placeholder="로컬아이피"
              value={settingInfo.ipAddress || ''}
              disabled
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="포스연동방식">
            <Select
              options={posLinkTypeOptions}
              value={settingInfo.posLinkType || 'NONE'}
              onChange={(value) =>
                updateSettingInfo({ posLinkType: value as 'NONE' | 'OKPOS' })
              }
              placeholder="포스연동방식을 선택하세요"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="공유기 ID">
            <Input
              placeholder="공유기 ID를 입력하세요"
              value={settingInfo.routerId || ''}
              onChange={(e) => updateSettingInfo({ routerId: e.target.value })}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="공유기 PW">
            <Input
              placeholder="공유기 PW를 입력하세요"
              value={settingInfo.routerPw || ''}
              onChange={(e) => updateSettingInfo({ routerPw: e.target.value })}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
