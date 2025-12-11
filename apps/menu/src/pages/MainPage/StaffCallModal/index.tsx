import { BasicButton, ModalBackground, NumberInput } from '@repo/ui/components';
import * as S from '@/pages/MainPage/StaffCallModal/staffCallModal.style';
import { CloseIcon, DeleteIcon } from '@repo/ui/icons';
import { css } from '@emotion/react';
import { TYPOGRAPHY, useThemeMode } from '@repo/ui';
import type { ICategoryWithMenus, IMenuBase } from '@repo/api/types';
import { useState } from 'react';
import type { ICartMenu } from '@/types/cart';
import { usePostTableOrder } from '@repo/api/queries';
import { useShopData } from '@/hooks/useShopData';
import { toast, openDualActionDialog } from '@repo/feature/utils';
import { useTableOrderHistoriesData } from '@/hooks/useTableOrderHistoriesData';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useCustomerCountStore } from '@/stores/useCustomerCountStore';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useDisableStaffCallStore } from '@/stores/useDisableStaffCallStore';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';

interface Props {
  onClose: () => void;
  category: ICategoryWithMenus;
}

export const StaffCallModal = ({ onClose, category }: Props) => {
  const { t } = useCustomerTranslation();
  const { theme } = useThemeMode();

  const { data: currentLanguage } = useLanguageStore();
  const { disableStaffCall } = useDisableStaffCallStore();

  const [selectedMenu, setSelectedMenu] = useState<IMenuBase | null>(null);
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
    if (newQuantity < 0) {
      return;
    }

    setSelectedMenuList((currentList) => {
      const existingMenuIndex = currentList.findIndex(
        (item) => item.menuSeq === menuSeq
      );

      // 이미 선택된 메뉴인 경우
      if (existingMenuIndex >= 0) {
        if (newQuantity === 0) {
          // 수량이 0이면 목록에서 제거
          return currentList.filter((item) => item.menuSeq !== menuSeq);
        }
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
              sourceMenu.localeMenuName?.[currentLanguage ?? 'ko'] ??
              sourceMenu.menuName,
            menuPrice: sourceMenu.menuPrice,
            quantity: newQuantity,
            selectedOptions: [],
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
    if (selectedMenu?.menuSeq === menu.menuSeq) {
      setSelectedMenu(null);
    } else {
      setSelectedMenu(menu);
    }
  };

  const { shopData } = useShopData();

  const { refresh: refreshTableOrderHistories } = useTableOrderHistoriesData();
  const { mutateAsync: createTableOrder } = usePostTableOrder();
  const { data: customerCountData } = useCustomerCountStore();
  const { data: deviceData } = useDeviceData();
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

    openDualActionDialog({
      title: t('요청하기'),
      content: t('요청을 완료하시겠습니까?'),
      primaryText: t('예'),
      secondaryText: t('아니오'),
      onConfirm: async () => {
        await createTableOrder({
          shopCode: shopData.shopCode,
          tableNumber: deviceData?.tableNumber ?? 0,
          orderType: 'MENU',
          // 객수 미사용시 1명으로 처리
          customerCount: customerCountData?.adultCount ?? 1,
          // 객수 미사용시 0명으로 처리
          kidsCustomerCount: customerCountData?.childCount ?? 0,
          // 직원호출 메뉴는 0원만 가능함
          totalAmount: 0,
          orders: selectedMenuList.map((menu) => ({
            menuSeq: menu.menuSeq,
            menuName: menu.menuName,
            menuPrice: menu.menuPrice,
            quantity: menu.quantity,
            selectedOptions: [],
          })),
        });

        await refreshTableOrderHistories();

        disableStaffCall();
        toast(t('요청이 완료되었습니다.'), {
          position: 'center-center',
          duration: 1500,
        });
        onClose();
      },
    });
  };

  return (
    <ModalBackground onClick={onClose}>
      <S.Container>
        <S.CloseButton type="button" onClick={onClose}>
          <CloseIcon width={32} height={32} color={theme.mode.grey[700]} />
        </S.CloseButton>

        <S.LeftContainer>
          <p>{t('어떤 도움이 필요하신가요?')} </p>
          {category.menuInfoList.length < 1 && (
            <S.noContent>
              <p>{t('메뉴가 존재하지 않아요.')}</p>
            </S.noContent>
          )}

          {category.menuInfoList.length > 0 && (
            <S.MenuList>
              {category.menuInfoList.map((menu, index) => {
                const currentQuantity = getMenuQuantity(menu.menuSeq);
                return (
                  <li key={`menu-${index + 1}`}>
                    <S.menuButton
                      type="button"
                      onClick={() => handleSelectMenu(menu)}
                      isSelected={selectedMenu?.menuSeq === menu.menuSeq}
                    >
                      <p>
                        {menu.localeMenuName?.[currentLanguage ?? 'ko'] ??
                          menu.menuName}
                      </p>
                      {selectedMenu?.menuSeq === menu.menuSeq && (
                        <div>
                          <S.DeleteButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMenu(menu.menuSeq);
                            }}
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
                            min={0}
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
        </S.LeftContainer>

        <S.RightContainer>
          <p> {t('선택한 요청사항')} </p>

          <S.ChosenMenuList>
            {selectedMenuList.length < 1 && (
              <S.noContent>
                <p>{t('선택한 요청사항이 없어요.')}</p>
              </S.noContent>
            )}

            {selectedMenuList.map((menu, index) => (
              <S.ChosenMenuItem key={`chosen-menu-${index + 1}`}>
                <p>
                  <span />
                  {menu.menuName} (+{menu.quantity})
                </p>
              </S.ChosenMenuItem>
            ))}
          </S.ChosenMenuList>

          <S.OrderButton>
            <BasicButton variant="Solid_Blue_2XL" onClick={requestOrder}>
              {t('요청하기')}
            </BasicButton>
          </S.OrderButton>
        </S.RightContainer>
      </S.Container>
    </ModalBackground>
  );
};
