import { t } from '@/config/i18n';
import { useState } from 'react';
import { theme } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import { AddIcon, EditIcon, DeleteIcon } from '@repo/ui/icons';
import { toast } from '@repo/feature/utils';
import * as S from '@/pages/settings/CategoryMenusPage/MenuManageModal/OptionSetting/optionSetting.style';
import { OptionGroupManageModal } from './OptionGroupManageModal';
import { useMenuManageModal } from '../context/MenuManageModalContext';

/**
 * 메뉴 옵션 그룹 추가/수정/삭제를 관리하는 설정 섹션.
 * 컨텍스트 기반으로 모달 상태를 제어하고, 옵션 그룹 리스트 변경을 반영한다.
 */
export const OptionSetting = () => {
  const { formValues, updateFormValues, mode } = useMenuManageModal();
  const [isOptionGroupManageModalOpen, setIsOptionGroupManageModalOpen] =
    useState(false);
  const [editingOptionGroupSeq, setEditingOptionGroupSeq] = useState<
    number | null
  >(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const optionGroupList = formValues.optionGroupList ?? [];
  const activeOptionGroupList = optionGroupList.filter(
    (group) => !group.isDeleted
  );
  const isMenuCreateMode = mode === 'create';

  const handleOpenModal = (
    optionGroupSeq: number | null = null,
    index: number | null = null
  ) => {
    setEditingOptionGroupSeq(optionGroupSeq ?? null);
    setEditingIndex(index ?? null);
    setIsOptionGroupManageModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsOptionGroupManageModalOpen(false);
    setEditingOptionGroupSeq(null);
    setEditingIndex(null);
  };

  const handleEditOptionGroup = (optionGroupSeq: number, index: number) => {
    handleOpenModal(isMenuCreateMode ? null : optionGroupSeq, index);
  };

  const handleCreated = () => {
    handleCloseModal();
  };

  const updateOptionGroups = (
    updater: (groups: typeof optionGroupList) => typeof optionGroupList
  ) => {
    updateFormValues({ optionGroupList: updater(optionGroupList) });
  };

  const handleDeleteOptionGroup = (optionGroupSeq: number, index: number) => {
    if (optionGroupSeq) {
      updateOptionGroups((groups) =>
        groups.map((group) =>
          group.optionGroupSeq === optionGroupSeq
            ? { ...group, isDeleted: true }
            : group
        )
      );
    } else {
      updateOptionGroups((groups) => groups.filter((_, i) => i !== index));
    }

    toast(
      t(
        '옵션 그룹이 삭제되었습니다.'
      )
    );
  };

  const getOptionGroupKey = (
    optionGroupSeq: number | null | undefined,
    index: number
  ) =>
    optionGroupSeq && optionGroupSeq !== 0 ? optionGroupSeq : `temp-${index}`;

  const getOptionKey = (
    optionSeq: number | null | undefined,
    groupIndex: number,
    optionIndex: number
  ) =>
    optionSeq && optionSeq > 0
      ? optionSeq
      : `option-${groupIndex}-${optionIndex}`;

  return (
    <S.Container>
      <S.Header>
        <p>{t('옵션 그룹 설정')}</p>
      </S.Header>
      <S.AddOptionGroupButton onClick={() => handleOpenModal(null)}>
        <AddIcon width={22} height={22} color={theme.colors.grey[600]} />
        <span>{t('옵션 그룹 추가')}</span>
      </S.AddOptionGroupButton>

      {activeOptionGroupList.length > 0 && (
        <S.OptionGroups>
          {activeOptionGroupList.map((optionGroup, index) => {
            const optionList = optionGroup.optionList ?? [];
            const key = getOptionGroupKey(optionGroup.optionGroupSeq, index);

            return (
              <S.OptionGroup key={key}>
                <S.OptionNames>
                  <p>{optionGroup.optionGroupName}</p>
                  <span>
                    {optionList.map((option, optionIndex) => {
                      const optionKey = getOptionKey(
                        option.optionSeq,
                        index,
                        optionIndex
                      );

                      return (
                        <span key={optionKey}>
                          {option.optionName}
                          {optionIndex < optionList.length - 1 ? ', ' : ''}
                        </span>
                      );
                    })}
                  </span>
                </S.OptionNames>

                <S.OptionButtons onClick={(e) => e.stopPropagation()}>
                  <BasicButton
                    variant="Outline_Grey_XL"
                    icon={
                      <EditIcon
                        width={22}
                        height={22}
                        color={theme.colors.grey[700]}
                      />
                    }
                    customStyle={S.optionButtonCss}
                    onClick={() =>
                      handleEditOptionGroup(optionGroup.optionGroupSeq, index)
                    }
                  />

                  <BasicButton
                    variant="Outline_Grey_XL"
                    icon={
                      <DeleteIcon
                        width={22}
                        height={22}
                        color={theme.colors.grey[700]}
                      />
                    }
                    customStyle={S.optionButtonCss}
                    onClick={() =>
                      handleDeleteOptionGroup(optionGroup.optionGroupSeq, index)
                    }
                  />
                </S.OptionButtons>
              </S.OptionGroup>
            );
          })}
        </S.OptionGroups>
      )}

      {isOptionGroupManageModalOpen && (
        <OptionGroupManageModal
          onClose={handleCloseModal}
          optionGroupSeq={editingOptionGroupSeq}
          optionGroupIndex={isMenuCreateMode ? editingIndex : null}
          onCreated={handleCreated}
        />
      )}
    </S.Container>
  );
};
