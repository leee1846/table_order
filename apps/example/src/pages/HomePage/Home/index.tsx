import { useNavigate } from 'react-router-dom';
import { BasicButton, Input, toast } from '@repo/ui/components';
import { TYPOGRAPHY } from '@repo/ui';
import { ROUTES } from '@/constants/routes';
import { UserList } from '@/pages/HomePage/UserList';
import { MenuIcon, ArrowBackIcon, ArrowForwardIcon } from '@repo/ui/icons';
import { useState } from 'react';
import { css } from '@emotion/react';
import {
  openConfirmDialog,
  openDualActionDialog,
  openLongContentDialog,
} from '@repo/feature/utils';

export const Home = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');

  const handleOpenConfirmDialog = () => {
    openConfirmDialog({
      title: '확인 모달',
      content: '타이틀을 입력해 주세요\n최대 두줄까지 입력할 수 있어요',
      confirmText: '확인',
      cancelText: '취소',
      size: 'small',
      onConfirm: () => {
        console.warn('확인 클릭');
      },
    });
  };

  const handleOpenDualActionDialog = () => {
    openDualActionDialog({
      title: '타이틀을 입력해 주세요',
      content:
        '서브 텍스트를 입력해 주세요 (Fallback)\n최대 두줄까지 입력할 수 있어요',
      primaryText: 'Button',
      secondaryText: 'Button',
      size: 'tiny',
      onConfirm: () => {
        console.warn('확인 클릭');
      },
      onCancel: () => {
        console.warn('취소 클릭');
      },
    });
  };

  const handleOpenDualActionDialogNoContent = () => {
    openDualActionDialog({
      title: '타이틀을 입력해 주세요',
      content: '',
      primaryText: 'Button',
      secondaryText: 'Button',
      size: 'tiny',
      onConfirm: () => {
        console.warn('취소 클릭');
      },
      onCancel: () => {
        console.warn('확인 클릭');
      },
    });
  };

  const handleOpenLongContentDialog = () => {
    const longContent = (
      <div>
        <p>타이틀을 입력해 주세요</p>
        <p>최대 두줄까지 입력할 수 있어요</p>
        <br />
        <p>서브 텍스트를 입력해 주세요 (Fallback)</p>
        <p>최대 두줄까지 입력할 수 있어요</p>
        <br />
        <p>긴 내용이 들어갈 수 있는 모달입니다.</p>
        <p>스크롤이 가능합니다.</p>
        <br />
        <p>더 많은 내용...</p>
        <p>더 많은 내용...</p>
        <p>더 많은 내용...</p>
        <p>더 많은 내용...</p>
        <p>더 많은 내용...</p>
      </div>
    );

    openLongContentDialog({
      title: 'Title',
      content: longContent,
      confirmText: 'Button',
      onConfirm: () => {
        console.warn('확인 클릭');
      },
      position: 'center',
      size: '2xlarge',
    });
  };

  const handleShowSuccessToast = () => {
    toast('작업이 성공적으로 완료되었습니다.');
  };

  return (
    <div>
      <h2>Welcome to Home Page??</h2>
      <p style={TYPOGRAPHY.MT_4}>Main Title 1</p>
      <MenuIcon color="red" />
      <ArrowBackIcon color="green" />
      <ArrowForwardIcon color="blue" />
      <div style={{ marginTop: '20px' }}>
        <BasicButton
          variant="Solid_Navy_M"
          onClick={() => navigate(ROUTES.ABOUT.path)}
          icon={<MenuIcon color="red" />}
          iconPosition="right"
        >
          Solid_Navy_M
        </BasicButton>
        <Input
          placeholder="Input"
          width="400px"
          value={inputValue}
          onChange={setInputValue}
          type="text"
          customStyle={css`
            width: 400px;
          `}
          name="text"
          errorMessage="에러 메시지"
        />
        <Input
          placeholder="Input"
          width="400px"
          value={inputValue}
          onChange={setInputValue}
          disabled
          customStyle={css`
            width: 400px;
          `}
          name="email"
        />
      </div>

      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <BasicButton variant="Solid_Navy_M" onClick={handleOpenConfirmDialog}>
          Confirm Modal 열기
        </BasicButton>
        <BasicButton
          variant="Solid_Navy_M"
          onClick={handleOpenDualActionDialog}
        >
          Dual Action Modal 내용 있는 버전 열기
        </BasicButton>
        <BasicButton
          variant="Solid_Navy_M"
          onClick={handleOpenDualActionDialogNoContent}
        >
          Dual Action Modal 내용 없는 버전 열기
        </BasicButton>
        <BasicButton
          variant="Solid_Navy_M"
          onClick={handleOpenLongContentDialog}
        >
          Long Content Modal 열기
        </BasicButton>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3 style={TYPOGRAPHY.ST_3}>Toast 메시지 예시</h3>
        <div
          style={{
            marginTop: '10px',
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          <BasicButton variant="Solid_Navy_M" onClick={handleShowSuccessToast}>
            Success Toast
          </BasicButton>
        </div>
      </div>

      <UserList />
    </div>
  );
};
