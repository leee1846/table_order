import { BasicButton, Pagination } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/NoticesPage/noticePage.style';
import { Notices } from '@/pages/settings/NoticesPage/Notices';

export const NoticesPage = () => {
  return (
    <UIStyles.setting.TablePageContainer>
      <S.Container>
        <S.Header>
          <h1>공지사항</h1>
          <BasicButton variant="Solid_Grey_L" onClick={() => {}}>
            고객센터
          </BasicButton>
        </S.Header>

        <Notices />
      </S.Container>

      <UIStyles.setting.Footer>
        <div />
        <Pagination totalPages={10} currentPage={1} onPageChange={() => {}} />
      </UIStyles.setting.Footer>
    </UIStyles.setting.TablePageContainer>
  );
};
