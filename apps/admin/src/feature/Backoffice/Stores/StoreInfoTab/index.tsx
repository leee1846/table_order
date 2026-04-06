import { Form, Input, Select, Checkbox, Row, Col, Space } from 'antd';
import { allowOnlyNumbers } from '@repo/util/string';
import type { IGetAdminShopDetail } from '@repo/api/types';

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
    <div style={{ marginTop: 24 }}>
      {mode === 'edit' && (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="SID">
              <Input
                placeholder="SID"
                value={formData.shopCode ?? ''}
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
      )}

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="매장명" required>
            <Input
              placeholder="매장명을 입력하세요"
              value={formData.shopName}
              onChange={(e) => updateFormData({ shopName: e.target.value })}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="검색용 매장명" required>
            <Input
              placeholder="검색용 매장명을 입력하세요"
              value={formData.shopSearchName}
              onChange={(e) =>
                updateFormData({ shopSearchName: e.target.value })
              }
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="사업자등록번호">
            <Input
              placeholder="사업자등록번호를 입력하세요"
              value={formData.businessNumber}
              onChange={(e) =>
                updateFormData({
                  businessNumber: allowOnlyNumbers(e.target.value),
                })
              }
              type="tel"
              inputMode="numeric"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          {/* 레이아웃 정렬을 위해 빈 라벨 속성 추가 */}
          <Form.Item label=" " colon={false}>
            <Checkbox
              checked={formData.isCorporate}
              onChange={(e) =>
                updateFormData({ isCorporate: e.target.checked })
              }
            >
              법인 여부
            </Checkbox>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="기본 주소" required>
        <Input
          placeholder="기본 주소를 입력하세요"
          value={formData.address1}
          onChange={(e) => updateFormData({ address1: e.target.value })}
        />
      </Form.Item>

      <Form.Item label="나머지 주소">
        <Input
          placeholder="나머지 주소를 입력하세요"
          value={formData.address2}
          onChange={(e) => updateFormData({ address2: e.target.value })}
        />
      </Form.Item>

      <Form.Item label="지역 코드">
        <Select
          options={AREA_CODE_OPTIONS}
          value={formData.areaCode || null}
          onChange={(value) => updateFormData({ areaCode: String(value) })}
          placeholder="지역 코드를 선택하세요"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item label="매장 이메일">
        <Input
          placeholder="매장 이메일을 입력하세요"
          value={formData.shopEmail}
          onChange={(e) => updateFormData({ shopEmail: e.target.value })}
        />
      </Form.Item>

      <Form.Item label="매장 전화번호" required>
        <Input
          placeholder="매장 전화번호를 입력하세요"
          value={formData.shopPhoneNumber}
          onChange={(e) =>
            updateFormData({
              shopPhoneNumber: allowOnlyNumbers(e.target.value),
            })
          }
          type="tel"
          inputMode="numeric"
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="대표자명" required>
            <Input
              placeholder="대표자명을 입력하세요"
              value={formData.ownerName}
              onChange={(e) => updateFormData({ ownerName: e.target.value })}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="대표자 연락처" required>
            <Input
              placeholder="대표자 연락처를 입력하세요"
              value={formData.ownerPhoneNumber}
              onChange={(e) =>
                updateFormData({
                  ownerPhoneNumber: allowOnlyNumbers(e.target.value),
                })
              }
              type="tel"
              inputMode="numeric"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="실무 담당자명">
            <Input
              placeholder="실무 담당자명을 입력하세요"
              value={formData.managerName}
              onChange={(e) => updateFormData({ managerName: e.target.value })}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="실무 담당자 연락처">
            <Input
              placeholder="실무 담당자 연락처를 입력하세요"
              value={formData.managerPhoneNumber}
              onChange={(e) =>
                updateFormData({
                  managerPhoneNumber: allowOnlyNumbers(e.target.value),
                })
              }
              type="tel"
              inputMode="numeric"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Space size="large" wrap>
          <Checkbox
            checked={formData.isActive}
            onChange={(e) => updateFormData({ isActive: e.target.checked })}
          >
            활성화
          </Checkbox>
          <Checkbox
            checked={formData.isTestShop}
            onChange={(e) => updateFormData({ isTestShop: e.target.checked })}
          >
            테스트 매장
          </Checkbox>
          <Checkbox
            checked={formData.isEarlyUpdate}
            onChange={(e) =>
              updateFormData({ isEarlyUpdate: e.target.checked })
            }
          >
            공식 업데이트
          </Checkbox>
          <Checkbox
            checked={formData.isEarlyBetaUpdate}
            onChange={(e) =>
              updateFormData({ isEarlyBetaUpdate: e.target.checked })
            }
          >
            베타 업데이트
          </Checkbox>
        </Space>
      </Form.Item>
    </div>
  );
};
