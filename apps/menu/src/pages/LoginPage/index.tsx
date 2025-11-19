import { BasicButton, Input } from '@repo/ui/components';

export const LoginPage = () => {
  return (
    <div>
      <div>로고 이미지 영역</div>

      <div>
        <div>
          <span>아이디</span>
          <Input placeholder="아이디를 입력해주세요." />
        </div>
        <div>
          <span>비밀번호</span>
          <Input placeholder="비밀번호를 입력해주세요." />
        </div>
        <BasicButton variant="Solid_Navy_XL">로그인</BasicButton>
      </div>
    </div>
  );
};
