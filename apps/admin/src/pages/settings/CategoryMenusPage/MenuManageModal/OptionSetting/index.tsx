import { useState } from 'react';
import { theme } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import { AddIcon, DeleteIcon, EditIcon } from '@repo/ui/icons';
import * as S from '@/pages/settings/CategoryMenusPage/MenuManageModal/OptionSetting/optionSetting.style';
import { OptionGroupManageModal } from '../../OptionGroupManageModal';

const OPTIONS = [
  {
    id: 1,
    name: '옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름',
    options: ['옵션 이름', '옵션 이름'],
  },
  {
    id: 2,
    name: '옵션 그룹 이름2',
    options: ['옵션 이름', '옵션 이름', '옵션 이름', '옵션 이름', '옵션 이름'],
  },
  {
    id: 3,
    name: '옵션 그룹 이름3',
    options: ['옵션 이름', '옵션 이름', '옵션 이름', '옵션 이름'],
  },
];

export const OptionSetting = () => {
  const [isOptionGroupManageModalOpen, setIsOptionGroupManageModalOpen] =
    useState(false);

  if (OPTIONS.length === 0) {
    return (
      <S.Container>
        <S.Header>
          <p>옵션 그룹 설정</p>
        </S.Header>
        <S.AddOptionGroupButton
          type="button"
          onClick={() => setIsOptionGroupManageModalOpen(true)}
        >
          <AddIcon width={20} height={20} color={theme.colors.grey[600]} />
          <span>옵션 그룹 추가</span>
        </S.AddOptionGroupButton>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Header>
        <p>옵션 그룹 설정</p>
        <BasicButton
          variant="Solid_Navy_M"
          icon={
            <AddIcon width={16} height={16} color={theme.colors.grey[200]} />
          }
          onClick={() => setIsOptionGroupManageModalOpen(true)}
        >
          옵션 그룹 추가하기
        </BasicButton>
      </S.Header>

      <S.OptionGroups>
        {OPTIONS.map((option) => (
          <S.OptionGroup key={option.id}>
            <S.OptionNames>
              <p>{option.name}</p>

              <span>
                {option.options.map((optionName) => optionName).join(',')}
              </span>
            </S.OptionNames>

            <S.OptionButtons>
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
              />
            </S.OptionButtons>
          </S.OptionGroup>
        ))}
      </S.OptionGroups>

      {isOptionGroupManageModalOpen && (
        <OptionGroupManageModal
          onClose={() => setIsOptionGroupManageModalOpen(false)}
        />
      )}
    </S.Container>
  );
};
