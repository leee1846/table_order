import { t } from '@/config/i18n';
import { useAuth } from '@/hooks/useAuth';
import { queryKeys, usePutUpdateMenuTranslation } from '@repo/api/queries';
import { useQueryClient } from '@repo/api/tanstack-query';
import { openDualActionDialog } from '@repo/feature/utils';
import { theme } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import { AddIcon } from '@repo/ui/icons';
import { CapacitorApp } from '@repo/util/app';
import * as S from '@/pages/settings/CategoryMenusPage/Header/header.style';

interface Props {
  onClickAddMenu: () => void;
  categoryName?: string;
  isPosLinked: boolean;
}

export const Header = ({
  onClickAddMenu,
  categoryName,
  isPosLinked,
}: Props) => {
  const queryClient = useQueryClient();
  const { shopCode } = useAuth();
  const { mutateAsync: updateMenuTranslation } = usePutUpdateMenuTranslation();

  const handleClick = () => {
    if (isPosLinked) {
      return;
    }
    onClickAddMenu();
  };

  const handleTranslateMenus = () => {
    if (!shopCode) {
      return;
    }

    openDualActionDialog({
      title: t('자동 번역'),
      content: (
        <S.ModalContent>
          <S.Content>
            {t(
              '메뉴 일괄 번역 기능을 사용하면 모든 메뉴가 영어, 중국어, 일어, 러시아어로 자동 번역됩니다. 번역된 내용 중 일부는 실제 의미와 다르게 번역될 수 있으며, 수동으로 수정이 가능합니다. 메뉴 자동 번역을 사용하시겠습니까?'
            )}
          </S.Content>
          <S.Span>*현재 러시아어는 지원하지 않습니다.</S.Span>
        </S.ModalContent>
      ),
      primaryText: t('번역하기'),
      secondaryText: '취소',
      onConfirm: async () => {
        if (!shopCode) {
          return;
        }

        await updateMenuTranslation({ shopCode });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.menu.all,
        });
      },
    });
  };

  return (
    <S.Header>
      <S.TitleContainer>
        <S.TextContainer>
          <h1>{t('메뉴 관리')}</h1>
          <div />
          {categoryName && <h2>{categoryName}</h2>}
        </S.TextContainer>
        <BasicButton
          variant="Solid_Navy_2XL"
          onClick={handleClick}
          icon={<AddIcon color={theme.colors.white} />}
          disabled={isPosLinked}
        >
          {t('메뉴 추가하기')}
        </BasicButton>
      </S.TitleContainer>

      {!CapacitorApp.isNative() && (
        <BasicButton
          variant="Solid_Grey_M"
          onClick={handleTranslateMenus}
          customStyle={S.TranslateButton}
        >
          {t('메뉴 일괄 번역하기')}
        </BasicButton>
      )}
    </S.Header>
  );
};
