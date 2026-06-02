import { Form, Input, Button, Row, Col, Typography, App } from 'antd';
import { allowOnlyNumbers } from '@repo/util/string';
import { usePostAdminMemberPWReset } from '@repo/api/queries';
import type { ICreateAdminMemberRequest } from '@repo/api/types';

interface Props {
  formData: ICreateAdminMemberRequest;
  updateFormData: (updates: Partial<ICreateAdminMemberRequest>) => void;
}

export const MemberInfoTab = ({ formData, updateFormData }: Props) => {
  const hasMember = !!formData.memberId;
  const resetPasswordMutation = usePostAdminMemberPWReset();
  const { message, modal } = App.useApp();

  const handleResetPassword = async () => {
    if (!formData.memberId) {
      message.warning('관리자 ID가 없습니다.');
      return;
    }

    modal.confirm({
      title: '비밀번호 초기화',
      content: '비밀번호를 초기화하시겠습니까?',
      okText: '확인',
      cancelText: '취소',
      onOk: async () => {
        await resetPasswordMutation.mutateAsync({
          memberId: formData.memberId!,
        });
        message.success('비밀번호가 초기화되었습니다.');
      },
    });
  };

  return (
    <div style={{ marginTop: 24 }}>
      {!hasMember && (
        <Typography.Text
          type="secondary"
          style={{ display: 'block', marginBottom: 24 }}
        >
          계정이 존재하지 않습니다. 계정을 생성하세요
        </Typography.Text>
      )}

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="아이디" required>
            <Input
              placeholder="아이디"
              value={formData.memberId ?? ''}
              disabled
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="회원 이름" required>
            <Input
              placeholder="회원 이름을 입력하세요"
              value={formData.memberName || ''}
              onChange={(e) => updateFormData({ memberName: e.target.value })}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="회원 전화번호" required>
            <Input
              placeholder="회원 전화번호를 입력하세요"
              value={formData.memberTel || ''}
              onChange={(e) =>
                updateFormData({ memberTel: allowOnlyNumbers(e.target.value) })
              }
              type="tel"
              inputMode="numeric"
            />
          </Form.Item>
        </Col>
      </Row>

      {hasMember && (
        <Form.Item>
          <Button onClick={handleResetPassword}>비밀번호 초기화</Button>
        </Form.Item>
      )}
    </div>
  );
};
