import { useState } from 'react';
import { theme } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import { AddIcon, EditIcon, DeleteIcon } from '@repo/ui/icons';
import { toast } from '@repo/feature/utils';
import * as S from '@/pages/settings/CategoryMenusPage/MenuManageModal/OptionSetting/optionSetting.style';
import { OptionGroupManageModal } from './OptionGroupManageModal';
import { useMenuManageModal } from '../context/MenuManageModalContext';

export const OptionSetting = () => {
  const { formValues, updateFormValues, mode } = useMenuManageModal();
  const [isOptionGroupManageModalOpen, setIsOptionGroupManageModalOpen] =
    useState(false);
  const [editingOptionGroupSeq, setEditingOptionGroupSeq] = useState<
    number | null
  >(null);

  const optionGroupList = formValues.optionGroupList || [];

  const handleOpenModal = (optionGroupSeq?: number) => {
    setEditingOptionGroupSeq(optionGroupSeq ?? null);
    setIsOptionGroupManageModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsOptionGroupManageModalOpen(false);
    setEditingOptionGroupSeq(null);
  };

  const handleEditOptionGroup = (optionGroupSeq: number) => {
    handleOpenModal(optionGroupSeq);
  };

  const handleCreated = () => {
    // 생성된 옵션 그룹이 context에 저장되었으므로 모달을 닫음
    handleCloseModal();
  };

  const handleDeleteOptionGroup = (optionGroupSeq: number) => {
    if (mode === 'edit') {
      // 수정 모드: isDeleted 값 변경
      const updatedList = (formValues.optionGroupList || []).map((group) =>
        group.optionGroupSeq === optionGroupSeq
          ? { ...group, isDeleted: true }
          : group
      );
      updateFormValues({ optionGroupList: updatedList });
    } else {
      // 생성 모드: 리스트에서 해당 객체 제거
      const updatedList = (formValues.optionGroupList || []).filter(
        (group) => group.optionGroupSeq !== optionGroupSeq
      );
      updateFormValues({ optionGroupList: updatedList });
    }

    toast('옵션 그룹이 삭제되었습니다.');
  };

  return (
    <S.Container>
      <S.Header>
        <p>옵션 그룹 설정</p>
      </S.Header>
      <S.AddOptionGroupButton onClick={() => handleOpenModal()}>
        <AddIcon width={22} height={22} color={theme.colors.grey[600]} />
        <span>옵션 그룹 추가</span>
      </S.AddOptionGroupButton>

      {optionGroupList.length > 0 && (
        <S.OptionGroups>
          {optionGroupList.map((optionGroup, index) => {
            // optionGroupSeq가 유효한 값인 경우에만 사용, 그 외에는 고유 key 생성
            const hasValidOptionGroupSeq =
              optionGroup.optionGroupSeq != null &&
              optionGroup.optionGroupSeq !== 0;
            const key = hasValidOptionGroupSeq
              ? optionGroup.optionGroupSeq
              : `temp-${index}`;
            return (
              <S.OptionGroup key={key}>
                <S.OptionNames>
                  <p>{optionGroup.optionGroupName}</p>
                  <span>
                    {optionGroup.optionList?.map((option, optionIndex) => {
                      // optionSeq가 유효한 값(양수)인 경우에만 사용, 그 외에는 고유 key 생성
                      const hasValidOptionSeq =
                        option.optionSeq != null && option.optionSeq > 0;
                      const key = hasValidOptionSeq
                        ? option.optionSeq
                        : `option-${index}-${optionIndex}`;
                      return (
                        <span key={key}>
                          {option.optionName}
                          {optionIndex <
                          (optionGroup.optionList?.length ?? 0) - 1
                            ? ', '
                            : ''}
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
                      handleEditOptionGroup(optionGroup.optionGroupSeq)
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
                      handleDeleteOptionGroup(optionGroup.optionGroupSeq)
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
          onCreated={handleCreated}
        />
      )}
    </S.Container>
  );
};
