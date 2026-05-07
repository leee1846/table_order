import { BasicButton, ModalBackground, NumberInput } from '@repo/ui/components';
import * as S from '@/pages/MainPage/StaffCallModal/staffCallModal.style';
import { CloseIcon, DeleteIcon } from '@repo/ui/icons';
import { css } from '@emotion/react';
import { TYPOGRAPHY, useThemeMode } from '@repo/ui';
import type { IApiError, ICategoryWithMenus, IMenuBase } from '@repo/api/types';
import { type RefObject, useState, useEffect, useRef } from 'react';
import type { ICartMenu } from '@/types/cart';
import { usePostTableOrder } from '@repo/api/queries';
import {
  toast,
  openDualActionDialog,
  openConfirmDialog,
  closeDialog,
} from '@repo/feature/utils';
import { usePosOrderStore } from '@repo/feature/stores';
import { useCustomerLanguageStore } from '@/stores/useCustomerLanguageStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useDisableStaffCallStore } from '@/stores/useDisableStaffCallStore';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { useShopStore } from '@/stores/useShopStore';
import { useShopDetailStore } from '@/stores/useShopDetailStore';
import { useDeviceStore } from '@/stores/useDeviceStore';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import { IdleTimerMessage } from '@/feature/IdleTimerMessage';
import { TABLE_REMOVED_STATUS_CODE } from '@/constants/common';
import type { AxiosError } from '@repo/api/axios';

// 사용자 액션으로 다이얼로그가 닫힐 때 추적 id만 비움(Global이 closeDialog 호출).
const clearStaffRequestConfirmDialogTracking = (
  idRef: RefObject<string | null>
): void => {
  idRef.current = null;
};

// 추적 중인 직원 요청 확인 dual 다이얼로그만 닫고 ref를 비움.
const closeStaffRequestConfirmDialogIfTracked = (
  idRef: RefObject<string | null>
): void => {
  const id = idRef.current;
  if (id === null) {
    return;
  }
  closeDialog(id);
  idRef.current = null;
};

interface Props {
  onClose: () => void;
  category: ICategoryWithMenus;
}

export const StaffCallModal = ({ onClose, category }: Props) => {
  const { t } = useCustomerTranslation();
  const { theme } = useThemeMode();
  const { remainingSeconds } = useIdleTimeout(onClose);

  // "요청을 완료하시겠습니까?" dual 다이얼로그 id만 보관해 언마운트 시 해당 창만 닫음.
  const staffRequestConfirmDialogIdRef = useRef<string | null>(null);

  // 유휴 만료·배경 클릭 등으로 언마운트될 때 남은 요청 확인 창이 있으면 같이 제거.
  useEffect(() => {
    return () =>
      closeStaffRequestConfirmDialogIfTracked(staffRequestConfirmDialogIdRef);
  }, []);

  const { data: languageData } = useCustomerLanguageStore();
  const { disableStaffCall } = useDisableStaffCallStore();

  const [selectedMenuList, setSelectedMenuList] = useState<ICartMenu[]>([]);

  // 선택된 메뉴의 현재 수량을 반환
  const getMenuQuantity = (menuSeq: number): number => {
    const selectedMenu = selectedMenuList.find(
      (item) => item.menuSeq === menuSeq
    );

    return selectedMenu?.quantity ?? 0;
  };

  // 수량 변경 핸들러: 수량 증가/감소 및 0일 때 제거 처리
  const handleQuantityChange = (menuSeq: number, newQuantity: number) => {
    if (newQuantity < 1) {
      return;
    }

    setSelectedMenuList((currentList) => {
      const existingMenuIndex = currentList.findIndex(
        (item) => item.menuSeq === menuSeq
      );

      // 이미 선택된 메뉴인 경우
      if (existingMenuIndex >= 0) {
        // 수량 업데이트
        const updatedList: ICartMenu[] = currentList.map((menu, index) =>
          index === existingMenuIndex
            ? { ...menu, quantity: newQuantity }
            : menu
        );
        return updatedList;
      }

      // 새로운 메뉴를 추가하는 경우 (수량이 0보다 클 때만)
      if (newQuantity > 0) {
        const sourceMenu = category.menuInfoList.find(
          (menu) => menu.menuSeq === menuSeq
        );

        if (sourceMenu) {
          const newCartMenu: ICartMenu = {
            categorySeq: sourceMenu.categorySeq,
            menuSeq: sourceMenu.menuSeq,
            menuName:
              sourceMenu.localeMenuName?.[languageData.currentLanguage] ??
              sourceMenu.menuName,
            menuPrice: sourceMenu.menuPrice,
            quantity: newQuantity,
            selectedOptions: [],
            localeMenuName: sourceMenu.localeMenuName,
          };
          return [...currentList, newCartMenu];
        }
      }

      return currentList;
    });
  };

  // 메뉴 삭제 핸들러: 선택된 메뉴 목록에서 제거
  const handleDeleteMenu = (menuSeq: number) => {
    setSelectedMenuList((currentList) =>
      currentList.filter((item) => item.menuSeq !== menuSeq)
    );
  };

  const handleSelectMenu = (menu: IMenuBase) => {
    const currentQuantity = getMenuQuantity(menu.menuSeq);

    // 이미 선택된 메뉴이고 수량이 1 이상이면 선택 해제
    if (currentQuantity >= 1) {
      return;
    }

    if (currentQuantity === 0) {
      handleQuantityChange(menu.menuSeq, 1);
    }
  };

  const { data: shopData } = useShopStore();
  const navigate = useNavigate();

  const { mutateAsync: createTableOrder } = usePostTableOrder({
    skipGlobalErrorHandling: true,
  });
  const { refresh: refreshTableOrderHistoriesData } =
    useTableOrderHistoriesData({ skipInitialRequest: true });
  const { data: customerCountData } = useCustomerCountStore();
  const requestOrder = () => {
    if (!shopData) {
      return;
    }

    if (selectedMenuList.length < 1) {
      toast(t('선택한 요청사항이 없어요.'), {
        position: 'center-center',
        duration: 1000,
      });
      return;
    }

    // 같은 플로우로 다시 열 때 이전에 남은 요청 확인 창이 있으면 먼저 닫음.
    closeStaffRequestConfirmDialogIfTracked(staffRequestConfirmDialogIdRef);

    const dialogId = openDualActionDialog({
      title: t('요청하기'),
      content: t('요청을 완료하시겠습니까?'),
      primaryText: t('예'),
      secondaryText: t('아니오'),
      onCancel: () => {
        // 아니오: GlobalDialog가 닫으므로 추적 id만 정리.
        clearStaffRequestConfirmDialogTracking(staffRequestConfirmDialogIdRef);
      },
      onConfirm: async () => {
        // 예: GlobalDialog가 닫으므로 추적 id만 정리.
        clearStaffRequestConfirmDialogTracking(staffRequestConfirmDialogIdRef);
        const finishStaffRequest = async () => {
          await refreshTableOrderHistoriesData();
          disableStaffCall();
          toast(t('요청이 완료되었습니다.'), {
            position: 'center-center',
            duration: 1500,
          });
          onClose();
        };

        try {
          const orderResponse = await createTableOrder({
            shopCode: shopData.shopCode,
            tableNumber: useDeviceStore.getState().data?.tableNumber ?? '',
            orderType: 'MENU',
            customerCount: customerCountData?.adultCount ?? 1,
            kidsCustomerCount: customerCountData?.childCount ?? 0,
            totalAmount: '0',
            orders: selectedMenuList.map((menu) => ({
              menuSeq: menu.menuSeq,
              menuName: menu.menuName,
              menuPrice: 0,
              quantity: menu.quantity,
              selectedOptions: [],
            })),
          });

          const shopSnapshot = useShopDetailStore.getState().data;
          const isPosLinked =
            !!shopSnapshot?.shopSetting?.shopPosCode &&
            shopSnapshot.shopSetting.shopPosCode !== 'NONE';
          const orderUuid =
            orderResponse.data.orderInfoList.at(-1)?.orderUuid ?? '';

          if (isPosLinked && orderUuid) {
            const shopCode = String(
              useShopStore.getState().data?.shopCode ?? ''
            );
            usePosOrderStore
              .getState()
              .register(orderUuid, shopCode, finishStaffRequest, async () => {
                openConfirmDialog({
                  title: t('POS 오류'),
                  content: t(
                    '주문 요청에 실패하였습니다. 직원에게 문의해주세요.'
                  ),
                  confirmText: t('확인'),
                });
                onClose();
              });
            return;
          }

          await finishStaffRequest();
        } catch (error: unknown) {
          const axiosError = error as AxiosError<IApiError>;

          // 테이블이 삭제된 경우
          if (
            axiosError?.response?.data?.status?.code ===
            TABLE_REMOVED_STATUS_CODE
          ) {
            navigate(ROUTES.TABLES.generate());
            return;
          }

          openConfirmDialog({
            title: t('오류'),
            content: t('주문에 실패했습니다. 다시 시도해주세요.'),
            confirmText: t('확인'),
          });
        }
      },
    });
    // 방금 연 요청 확인 다이얼로그 id를 저장해 언마운트 시 closeDialog에 사용.
    staffRequestConfirmDialogIdRef.current = dialogId;
  };

  // 목록에 보이지 않는 메뉴(isHidden, isOutOfStock)는 선택 목록에서 제거
  // 선택중 메뉴 정보가 바뀌는 경우
  useEffect(() => {
    const visibleMenuSeqs = new Set(
      category.menuInfoList
        .filter((menu) => !menu.isHidden && !menu.isOutOfStock)
        .map((menu) => menu.menuSeq)
    );

    setSelectedMenuList((currentList) =>
      currentList.filter((item) => visibleMenuSeqs.has(item.menuSeq))
    );
  }, [category.menuInfoList]);

  return (
    <ModalBackground onClick={onClose}>
      <S.Container
        role="dialog"
        aria-modal="true"
        aria-labelledby="staff-call-title"
      >
        <S.TopHeaderActions>
          <IdleTimerMessage remainingSeconds={remainingSeconds} />
          <S.CloseButton
            type="button"
            onClick={onClose}
            aria-label={t('모달 닫기')}
          >
            <CloseIcon width={32} height={32} color={theme.mode.grey[700]} />
          </S.CloseButton>
        </S.TopHeaderActions>

        <S.LeftContainer>
          <h2 id="staff-call-title">{category.categoryName} </h2>
          <S.MenuListScrollArea>
            {category.menuInfoList.length < 1 && (
              <S.noContent>
                <p>{t('메뉴가 존재하지 않아요.')}</p>
              </S.noContent>
            )}

            {category.menuInfoList.length > 0 && (
              <S.MenuList role="list">
                {category.menuInfoList
                  .filter((menu) => !menu.isHidden && !menu.isOutOfStock)
                  .map((menu, index) => {
                    const currentQuantity = getMenuQuantity(menu.menuSeq);
                    const menuName =
                      menu.localeMenuName?.[languageData.currentLanguage] ??
                      menu.menuName;
                    const isMenuSelected = currentQuantity >= 1;

                    return (
                      <li key={`menu-${index + 1}`} role="listitem">
                        <S.menuButton
                          onClick={() => handleSelectMenu(menu)}
                          isSelected={isMenuSelected}
                          aria-label={menuName}
                          aria-pressed={isMenuSelected}
                        >
                          <p>{menuName}</p>
                          {isMenuSelected && (
                            <div>
                              <S.DeleteButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMenu(menu.menuSeq);
                                }}
                                aria-label={t('메뉴 삭제')}
                              >
                                <DeleteIcon
                                  width={20}
                                  height={20}
                                  color={theme.mode.grey[600]}
                                />
                              </S.DeleteButton>
                              <NumberInput
                                variant="square"
                                size="M"
                                min={1}
                                max={999}
                                value={currentQuantity}
                                onChange={(newValue) => {
                                  handleQuantityChange(menu.menuSeq, newValue);
                                }}
                                customStyle={css`
                                  min-width: 116px;
                                  width: 116px;
                                  & > input {
                                    min-width: 34px;
                                    ${TYPOGRAPHY.ST_3}
                                  }
                                `}
                              />
                            </div>
                          )}
                        </S.menuButton>
                      </li>
                    );
                  })}
              </S.MenuList>
            )}
          </S.MenuListScrollArea>
        </S.LeftContainer>
        <S.OrderButton>
          <BasicButton variant="Solid_Blue_2XL" onClick={requestOrder}>
            {t('요청하기')}
          </BasicButton>
        </S.OrderButton>
      </S.Container>
    </ModalBackground>
  );
};
