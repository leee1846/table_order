import React from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  type FormInstance,
} from 'antd';
import { CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';

// 임시 메뉴 선택 옵션 데이터
const MENU_OPTIONS = [
  { label: '참이슬', value: '참이슬' },
  { label: '처음처럼', value: '처음처럼' },
  { label: '진로', value: '진로' },
  { label: '새로', value: '새로' },
  { label: '카스', value: '카스' },
  { label: '테라', value: '테라' },
  { label: '수박화채', value: '수박화채' },
];

export interface MenuGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'new' | 'edit';
  form: FormInstance;
  onSuccess?: () => void;
}

const MenuGroupModal: React.FC<MenuGroupModalProps> = ({
  isOpen,
  onClose,
  mode,
  form,
  onSuccess,
}) => {
  const handleSave = async () => {
    try {
      await form.validateFields();
      message.success(
        mode === 'new'
          ? '메뉴 그룹이 등록되었습니다.'
          : '메뉴 그룹이 수정되었습니다.'
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={700}
      //centered
      title={
        <span style={{ color: '#fff', fontSize: '18px', fontWeight: 600 }}>
          {mode === 'new' ? '메뉴 그룹 등록' : '메뉴 그룹 수정'}
        </span>
      }
      closeIcon={<CloseOutlined style={{ color: '#fff' }} />}
      styles={{
        header: {
          backgroundColor: '#1d2a6d',
          padding: '20px 24px',
          margin: 0,
          borderRadius: '8px 8px 0 0',
        },
        //content: { padding: 0, borderRadius: '8px' },
        body: { padding: '32px 24px' },
      }}
      footer={
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
          }}
        >
          <Button size="large" onClick={onClose}>
            취소
          </Button>
          <Button size="large" type="primary" onClick={handleSave}>
            저장
          </Button>
        </div>
      }
    >
      <style>
        {`
          .ant-modal,
          .ant-modal-container {
            padding: 0 !important;
          }
        `}
      </style>
      <Form form={form} layout="vertical">
        <Form.Item
          name="menuGroupName"
          label={
            <span style={{ fontWeight: 600, fontSize: '15px' }}>
              메뉴 그룹명
            </span>
          }
          rules={[{ required: true, message: '메뉴 그룹명을 입력해주세요.' }]}
        >
          <Input size="large" placeholder="메뉴 그룹명을 입력하세요" />
        </Form.Item>

        <Form.Item
          name="menus"
          label={
            <span style={{ fontWeight: 600, fontSize: '15px' }}>
              추가된 메뉴
            </span>
          }
          extra={
            <span
              style={{
                color: '#8c8c8c',
                fontSize: '13px',
                marginTop: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <InfoCircleOutlined />
              메뉴 그룹에 포함할 메뉴를 선택해주세요. (복수 선택 가능)
            </span>
          }
        >
          <Select
            mode="multiple"
            size="large"
            placeholder="메뉴를 선택해주세요"
            options={MENU_OPTIONS}
            allowClear
            showSearch
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MenuGroupModal;
