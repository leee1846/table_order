import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  type FormInstance,
} from 'antd';
import {
  CloseOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  useGetMenuSearch,
  usePostCreateMenuGroup,
  usePatchUpdateMenuGroup,
} from '@repo/api/queries';

export interface MenuGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'new' | 'edit';
  menuGroupSeq?: number | null; // 수정 시 필요한 시퀀스
  form: FormInstance;
  onSuccess?: () => void;
}

interface MenuOption {
  label: string;
  value: number;
}

const MenuGroupModal: React.FC<MenuGroupModalProps> = ({
  isOpen,
  onClose,
  mode,
  menuGroupSeq,
  form,
  onSuccess,
}) => {
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  // API 연동: 메뉴 그룹 등록 훅
  const createMutation = usePostCreateMenuGroup();
  const updateMutation = usePatchUpdateMenuGroup();

  // 디바운싱: 입력이 멈춘 후 300ms 뒤에 검색어 상태 업데이트
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // API 연동: 메뉴 검색
  const { data: searchResponse, isFetching } = useGetMenuSearch(
    { name: debouncedKeyword || undefined },
    { enabled: !!debouncedKeyword }
  );

  const handleSearch = (newValue: string) => {
    setKeyword(newValue);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // labelInValue 속성으로 인해 values.menus는 [{ label: string, value: number }] 형태이므로 value만 추출합니다.
      const menuIds = values.menus?.map((m: MenuOption) => m.value) || [];

      if (mode === 'new') {
        await createMutation.mutateAsync({
          menuGroupName: values.menuGroupName,
          menus: menuIds,
        });
      } else {
        if (menuGroupSeq) {
          await updateMutation.mutateAsync({
            menuGroupSeq,
            menuGroupName: values.menuGroupName,
            menus: menuIds,
            isDeleted: false,
          });
        }
      }

      message.success(
        mode === 'new'
          ? '메뉴 그룹이 등록되었습니다.'
          : '메뉴 그룹이 수정되었습니다.'
      );
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      open={isOpen}
      wrapClassName="menu-group-modal-wrap"
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
          <Button
            size="large"
            type="primary"
            onClick={handleSave}
            loading={createMutation.isPending || updateMutation.isPending}
          >
            저장
          </Button>
        </div>
      }
    >
      <style>
        {`
          .menu-group-modal-wrap .ant-modal,
          .menu-group-modal-wrap .ant-modal-container {
            padding: 0 !important;
          }
        `}
      </style>
      <Form form={form} layout="vertical">
        <Form.Item
          name="menuGroupName"
          required
          label={
            <span style={{ fontWeight: 600, fontSize: '15px' }}>
              메뉴 그룹명{' '}
              <span
                style={{ fontWeight: 400, fontSize: '13px', color: '#8c8c8c' }}
              >
                (최대 50자)
              </span>
            </span>
          }
          rules={[{ required: true, message: '메뉴 그룹명을 입력해주세요.' }]}
        >
          <Input
            size="large"
            placeholder="메뉴 그룹명을 입력하세요."
            maxLength={50}
          />
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
              검색 후 메뉴 그룹에 포함할 메뉴를 선택해주세요. (복수 선택 가능)
            </span>
          }
        >
          <Select
            mode="multiple"
            size="large"
            labelInValue
            showSearch={{ filterOption: false, onSearch: handleSearch }}
            loading={isFetching}
            allowClear
            suffixIcon={<SearchOutlined />}
            placeholder="검색 후 메뉴를 선택해주세요"
            notFoundContent={isFetching ? '검색 중...' : null}
            options={searchResponse?.data || []}
            fieldNames={{ label: 'menuName', value: 'menuSeq' }}
            maxTagCount="responsive"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MenuGroupModal;
