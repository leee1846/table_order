import * as S from '@/pages/settings/NoticesPage/Notices/notices.style';
import { KeyboardArrowDownIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { useState } from 'react';

const MOCK = [
  {
    id: 1,
    title:
      '공지사항 1ㅁㄴㅇㄴㅁㅇㅁㄴㅇㄴㅁㅁㄴㅁㄴㄴㅁㅇㅁㄴㄴㅇㅇㅁㅇㅁㄴㅇㅁㄴㅇㅇㅁㅇㅁㄴㅇㅁㄴㅁㄴㅇ',
    status: '일반',
    content: '공지사항 1 내용',
    createdAt: '2025-01-01 12:00:00',
  },
  {
    id: 2,
    title: '공지사항 2',
    status: '긴급',
    content:
      '공지사항 2 내용  공지사항 2 내용공지사항 2 내용공지사항 2 내용공지사항 2 내용공지사항 2 내용공지사항 2 내용공지사항 2 내용공지사항 2 내용공지사항 2 내용공지사항 2 내용공지사항 2 내용공지사항 2 내용공지사항 2 내용공지사항 2 내용공지사항 2 내용공지사항 2 내용공지사항 2 내용공지사항 2 내용공지사항 2 내용공지사항 2 내용공지사항 2 내용',
    createdAt: '2025-01-02 12:00:00',
  },
  {
    id: 3,
    status: '일반',
    title: '공지사항 3',
    content: '공지사항 3 내용',
    createdAt: '2025-01-03 12:00:00',
  },
  {
    id: 4,
    status: '일반',
    title: '공지사항 4',
    content: '공지사항 4 내용',
    createdAt: '2025-01-04 12:00:00',
  },
  {
    id: 5,
    status: '일반',
    title: '공지사항 5',
    content: '공지사항 5 내용',
    createdAt: '2025-01-05 12:00:00',
  },
];

export const Notices = () => {
  const [openNoticeId, setOpenNoticeId] = useState<number | null>(null);

  const handleOpenNotice = (id: number) => {
    if (openNoticeId === id) {
      setOpenNoticeId(null);
      return;
    }

    setOpenNoticeId(id);
  };

  return (
    <S.Container>
      {MOCK.map((notice) => (
        <S.Notice key={notice.id} isOpen={openNoticeId === notice.id}>
          <S.Header
            type="button"
            onClick={() => handleOpenNotice(notice.id)}
            isOpen={openNoticeId === notice.id}
          >
            <S.LeftContainer>
              <S.Num>{notice.id}</S.Num>
              <S.Status>{notice.status}</S.Status>
              <S.Title>{notice.title}</S.Title>
            </S.LeftContainer>
            <S.RightContainer isOpen={openNoticeId === notice.id}>
              <S.CreatedAt>{notice.createdAt}</S.CreatedAt>
              <KeyboardArrowDownIcon
                width={24}
                height={24}
                color={theme.colors.grey[500]}
              />
            </S.RightContainer>
          </S.Header>

          {/* 공지사항 내용은 추후에 html형식으로 변환하여 표시해야 할 수 있음 */}
          {openNoticeId === notice.id && (
            <S.Content>
              <p>{notice.content}</p>
            </S.Content>
          )}
        </S.Notice>
      ))}
    </S.Container>
  );
};
