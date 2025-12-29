import { useRef, useState } from 'react';
import * as S from '@/pages/settings/MenuScreenPage/Logo/logo.style';
import { theme } from '@repo/ui';
import { PhotoIcon } from '@repo/ui/icons';
import { BasicButton } from '@repo/ui/components';

export const Logo = () => {
  // 파일 input 참조 (숨겨진 input 요소 제어용)
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 선택된 이미지 파일 상태
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // 이미지 미리보기 URL 상태
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 파일 선택 시 호출되는 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const file = files[0];
    if (!file) return;

    // 선택된 파일과 미리보기 URL 저장
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));

    // 같은 파일을 다시 선택할 수 있도록 input 값 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 이미지 섹션 클릭 시 파일 선택 다이얼로그 열기
  const handleImageSectionClick = () => {
    fileInputRef.current?.click();
  };

  // 변경 버튼 클릭 시 파일 선택 다이얼로그 열기
  const handleChangeClick = () => {
    fileInputRef.current?.click();
  };

  // 삭제 버튼 클릭 시 이미지 제거 및 메모리 정리
  const handleDeleteClick = () => {
    setSelectedImage(null);
    // 생성한 Object URL 메모리 해제
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  return (
    <S.Container>
      <p>로고 설정</p>
      {/* 숨겨진 파일 input (이미지 섹션 클릭 시 트리거됨) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <S.ImageSection onClick={handleImageSectionClick}>
        {selectedImage && imagePreview ? (
          // 이미지가 선택된 경우: 미리보기와 변경/삭제 버튼 표시
          <>
            {/* 버튼 클릭 시 이벤트 전파 방지 (섹션 클릭 이벤트와 충돌 방지) */}
            <S.ButtonContainer onClick={(e) => e.stopPropagation()}>
              <BasicButton variant="Outline_Grey_L" onClick={handleChangeClick}>
                변경
              </BasicButton>
              <BasicButton
                variant="Solid_Sky_Blue_L"
                onClick={handleDeleteClick}
              >
                삭제
              </BasicButton>
            </S.ButtonContainer>
            <S.ImagePreview src={imagePreview} alt="로고 미리보기" />
          </>
        ) : (
          // 이미지가 선택되지 않은 경우: 기본 안내 UI 표시
          <>
            <PhotoIcon
              width={36}
              height={36}
              color={theme.colors.primary[400]}
            />
            <p>메뉴판 상단에 보이는 로고를 추가할 수 있어요.</p>
            <span>400*144 px 이상의 가로가 긴 로고 권장</span>
          </>
        )}
      </S.ImageSection>
    </S.Container>
  );
};

