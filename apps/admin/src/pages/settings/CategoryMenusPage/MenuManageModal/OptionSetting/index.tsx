import { theme } from '@repo/ui';
import { BasicButton } from '@repo/ui/components';
import { AddIcon, DeleteIcon, EditIcon } from '@repo/ui/icons';
import { css } from '@emotion/react';
import * as S from '@/pages/settings/CategoryMenusPage/MenuManageModal/OptionSetting/optionSetting.style';

const optionButtonCss = css`
  width: 42px;
  height: 42px;
  & > span {
    margin-right: 0 !important;
  }
`;

export const OptionSetting = () => {
  const OPTIONS = [
    {
      id: 1,
      name: '옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름옵션 그룹 이름',
      options: ['옵션 이름', '옵션 이름'],
    },
    {
      id: 2,
      name: '옵션 그룹 이름2',
      options: [
        '옵션 이름',
        '옵션 이름',
        '옵션 이름',
        '옵션 이름',
        '옵션 이름',
      ],
    },
    {
      id: 3,
      name: '옵션 그룹 이름3',
      options: ['옵션 이름', '옵션 이름', '옵션 이름', '옵션 이름'],
    },
  ];

  if (OPTIONS.length === 0) {
    return (
      <S.Container>
        <S.Header>
          <p>옵션 그룹 설정</p>
        </S.Header>
        <S.AddOptionGroupButton type="button">
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
                customStyle={optionButtonCss}
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
                customStyle={optionButtonCss}
              />
            </S.OptionButtons>
          </S.OptionGroup>
        ))}
      </S.OptionGroups>
    </S.Container>
  );
};
