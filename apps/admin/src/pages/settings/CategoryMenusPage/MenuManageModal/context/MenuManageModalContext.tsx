import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react';
import type { IMenu, IUpdateMenuRequest } from '@repo/api/types';
import {
  queryKeys,
  usePostCreateMenu,
  usePutUpdateMenu,
} from '@repo/api/queries';
import { useQueryClient } from '@repo/api/tanstack-query';
import type {
  FormValues,
  MenuManageModalContextValue,
  ModalMode,
} from './types';
import { getInitialFormValues, buildMenuData, buildUpdateData } from './utils';
import { useMenuImagesState } from './useMenuImagesState';

export type { MenuImageData, FileWithId, FormValues } from './types';

/**
 * 메뉴 관리 모달의 전역 상태를 관리하는 Context
 * 메뉴 생성/수정 시 폼 데이터, 이미지 상태, 제출 로직 등을 제공
 */
const MenuManageModalContext =
  createContext<MenuManageModalContextValue | null>(null);

/**
 * 메뉴 폼 상태를 초기화/업데이트하는 전용 훅
 *
 * @param menu - 수정 모드일 때 기존 메뉴 데이터 (없으면 생성 모드)
 * @param categorySeq - 카테고리 시퀀스 번호
 * @returns formValues: 현재 폼 값, updateFormValues: 폼 값 업데이트 함수
 *
 * 동작:
 * 1. menu와 categorySeq에 따라 초기 폼 값을 설정
 * 2. menu나 categorySeq가 변경되면 폼 값을 재초기화
 * 3. 부분 업데이트를 지원하는 updateFormValues 함수 제공
 */
const useMenuFormState = (menu: IMenu | undefined, categorySeq: number) => {
  // 초기 폼 값 설정: menu가 있으면 기존 값으로, 없으면 기본값으로 초기화
  const [formValues, setFormValues] = useState<FormValues>(() =>
    getInitialFormValues(menu, categorySeq)
  );

  // menu나 categorySeq가 변경되면 폼 값을 재초기화
  // (예: 다른 메뉴를 수정하거나 다른 카테고리로 변경 시)
  useEffect(() => {
    setFormValues(getInitialFormValues(menu, categorySeq));
  }, [menu, categorySeq]);

  // 폼 값을 부분 업데이트하는 함수 (병합 방식)
  const updateFormValues = useCallback(
    (nextValue: FormValues) => {
      setFormValues((prev) => {
        const updated = { ...prev, ...nextValue };

        // selectedLanguageCode가 변경되면 해당 언어의 메뉴 이름과 설명으로 업데이트
        if (
          'selectedLanguageCode' in nextValue &&
          prev.selectedLanguageCode !== updated.selectedLanguageCode &&
          updated.selectedLanguageCode
        ) {
          if (menu?.localeMenuName) {
            const menuNameForLanguage =
              menu.localeMenuName[updated.selectedLanguageCode] || '';
            if (menuNameForLanguage) {
              updated.menuName = menuNameForLanguage;
            }
          }
          if (menu?.localeMenuDescription) {
            const menuDescriptionForLanguage =
              menu.localeMenuDescription[updated.selectedLanguageCode] || '';
            updated.menuDescription = menuDescriptionForLanguage;
          }
        }

        return updated;
      });
    },
    [menu]
  );

  return { formValues, updateFormValues };
};

interface Props {
  menu?: IMenu; // 수정 모드일 때 기존 메뉴 데이터
  categorySeq: number; // 카테고리 시퀀스
  onClose: () => void; // 모달 닫기 콜백
  children: ReactNode; // 하위 컴포넌트
}

/**
 * 메뉴 관리 모달의 Context Provider
 *
 * 주요 기능:
 * 1. 메뉴 생성/수정 모드 관리
 * 2. 폼 상태 관리 (메뉴명, 가격, 설명 등)
 * 3. 이미지 상태 관리 (메인 이미지, 추가 이미지)
 * 4. 메뉴 생성/수정 API 호출 및 쿼리 무효화
 *
 * @param menu - 수정 모드일 때 전달되는 기존 메뉴 데이터
 * @param categorySeq - 메뉴가 속한 카테고리 시퀀스
 * @param onClose - 모달 닫기 핸들러
 */
export const MenuManageModalProvider = ({
  menu,
  categorySeq,
  onClose,
  children,
}: Props) => {
  const queryClient = useQueryClient();

  // menu가 있으면 수정 모드, 없으면 생성 모드
  const mode: ModalMode = menu ? 'edit' : 'create';

  // 저장 중 상태
  const [isSaving, setIsSaving] = useState(false);

  // 메뉴 생성/수정을 위한 mutation 훅
  const { mutateAsync: createMenu } = usePostCreateMenu();

  const { mutateAsync: updateMenu } = usePutUpdateMenu();

  // 폼 상태 관리 (메뉴명, 가격, 설명 등)
  const { formValues, updateFormValues } = useMenuFormState(menu, categorySeq);

  // 이미지 상태 관리 (메인 이미지, 추가 이미지, 삭제된 이미지 추적)
  const images = useMenuImagesState({ menu, mode });

  /**
   * 메뉴 목록 쿼리를 무효화하여 최신 데이터를 다시 가져오도록 함
   * 메뉴 생성/수정 후 목록을 갱신하기 위해 사용
   */
  const invalidateMenuList = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.menu.list(categorySeq),
    });
  }, [queryClient, categorySeq]);

  /**
   * mutation 실행 후 공통 처리 로직
   * 1. mutation 실행 (생성 또는 수정)
   * 2. 모달 닫기
   * 3. 메뉴 목록 쿼리 무효화하여 최신 데이터 반영
   */
  const runMutation = useCallback(
    async (mutation: () => Promise<unknown>) => {
      await mutation();
      onClose();
      invalidateMenuList();
    },
    [onClose, invalidateMenuList]
  );

  /**
   * 메뉴 생성 핸들러
   * 1. 업로드할 파일 목록 추출
   * 2. 폼 데이터와 이미지 정보를 조합하여 메뉴 생성 요청 데이터 구성
   * 3. API 호출 및 후처리
   */
  const handleCreate = useCallback(async () => {
    // 새로 추가된 이미지 파일들만 추출 (기존 이미지는 없음)
    const files = images.getFiles();

    // 폼 값과 이미지 정보를 조합하여 메뉴 생성 요청 데이터 구성
    const menuData = buildMenuData(
      formValues,
      categorySeq,
      images.getMenuImageList()
    );

    await runMutation(() => createMenu({ menu: menuData, files }));
  }, [formValues, categorySeq, images, runMutation, createMenu]);

  /**
   * 메뉴 수정 핸들러
   * 1. 업로드할 파일 목록 추출 (새로 추가된 이미지만)
   * 2. 기존 이미지와 새 이미지를 조합하여 수정 요청 데이터 구성
   * 3. 삭제된 이미지는 isDeleted 플래그로 표시
   * 4. API 호출 및 후처리
   */
  const handleUpdate = useCallback(async () => {
    if (!menu) return;

    // 새로 추가된 이미지 파일들만 추출
    const files = images.getFiles();

    // 기존 이미지와 새 이미지를 조합하여 수정 요청 데이터 구성
    // 삭제된 이미지는 isDeleted: true로 포함됨
    const menuImageList = images.getUpdateMenuImageList(menu.menuSeq);

    // 폼 값과 기존 메뉴 데이터를 병합하여 수정 요청 데이터 구성
    const updateData: IUpdateMenuRequest = buildUpdateData(
      menu,
      formValues,
      menuImageList
    );

    await runMutation(() => updateMenu({ menu: updateData, files }));
  }, [menu, formValues, images, runMutation, updateMenu]);

  /**
   * 메뉴 제출 핸들러 (생성/수정 통합)
   * 모드에 따라 handleCreate 또는 handleUpdate를 호출
   * 에러 발생 시 콘솔에 로그 출력 (사용자에게는 다른 곳에서 처리될 수 있음)
   */
  const handleSubmit = useCallback(async () => {
    // 저장 중일 때는 중복 호출 방지
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    if (mode === 'create') {
      await handleCreate();
    } else {
      await handleUpdate();
    }
    setIsSaving(false);
  }, [isSaving, mode, handleCreate, handleUpdate]);

  /**
   * Context에 제공할 값들을 메모이제이션
   * 의존성 배열의 값들이 변경될 때만 재계산하여 불필요한 리렌더링 방지
   */
  const value = useMemo<MenuManageModalContextValue>(
    () => ({
      mode, // 'create' | 'edit'
      menu, // 수정 모드일 때 기존 메뉴 데이터
      categorySeq, // 카테고리 시퀀스
      formValues, // 폼 값 (메뉴명, 가격, 설명 등)
      updateFormValues, // 폼 값 업데이트 함수
      mainImage: images.mainImage, // 메인 이미지 데이터
      additionalImages: images.additionalImages, // 추가 이미지 목록
      setMainImage: images.setMainImage, // 메인 이미지 설정
      removeMainImage: images.removeMainImage, // 메인 이미지 제거
      addAdditionalImages: images.addAdditionalImages, // 추가 이미지 추가
      removeAdditionalImage: images.removeAdditionalImage, // 추가 이미지 제거
      handleSubmit, // 메뉴 제출 핸들러 (생성/수정)
      isSaving, // 저장 중 상태
      onClose, // 모달 닫기 핸들러
    }),
    [
      mode,
      menu,
      categorySeq,
      formValues,
      updateFormValues,
      images.mainImage,
      images.additionalImages,
      images.setMainImage,
      images.removeMainImage,
      images.addAdditionalImages,
      images.removeAdditionalImage,
      handleSubmit,
      isSaving,
      onClose,
    ]
  );

  return (
    <MenuManageModalContext.Provider value={value}>
      {children}
    </MenuManageModalContext.Provider>
  );
};

/**
 * 메뉴 관리 모달 Context를 사용하는 커스텀 훅
 *
 * @returns MenuManageModalContextValue - 메뉴 관리 모달의 모든 상태와 함수
 * @throws Error - Provider 외부에서 사용 시 에러 발생
 *
 * 사용 예시:
 * ```tsx
 * const { formValues, updateFormValues, handleSubmit } = useMenuManageModal();
 * ```
 */
export const useMenuManageModal = (): MenuManageModalContextValue => {
  const context = useContext(MenuManageModalContext);
  if (!context) {
    // HMR 이슈로 인한 에러 방지를 위해 기본값 반환 대신 에러 throw
    // 개발 중 이 에러가 발생하면 페이지를 새로고침하세요
    throw new Error(
      'useMenuManageModal must be used within MenuManageModalProvider. Try refreshing the page.'
    );
  }
  return context;
};

/**
 * 폼 관련 기능만 추출하는 커스텀 훅
 * 폼 값과 업데이트 함수만 필요한 컴포넌트에서 사용
 *
 * @returns { formValues, updateFormValues }
 *
 * 사용 예시:
 * ```tsx
 * const { formValues, updateFormValues } = useMenuForm();
 * ```
 */
export const useMenuForm = () => {
  const { formValues, updateFormValues } = useMenuManageModal();
  return { formValues, updateFormValues };
};

/**
 * 이미지 관련 기능만 추출하는 커스텀 훅
 * 이미지 관리만 필요한 컴포넌트에서 사용
 *
 * @returns 이미지 상태 및 관리 함수들
 *
 * 사용 예시:
 * ```tsx
 * const { mainImage, setMainImage, addAdditionalImages } = useMenuImages();
 * ```
 */
export const useMenuImages = () => {
  const {
    mainImage,
    additionalImages,
    setMainImage,
    removeMainImage,
    addAdditionalImages,
    removeAdditionalImage,
  } = useMenuManageModal();

  return {
    mainImage,
    additionalImages,
    setMainImage,
    removeMainImage,
    addAdditionalImages,
    removeAdditionalImage,
  };
};
