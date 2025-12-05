import { useTableStore } from '@/stores/useTableStore';
import { ROUTES } from '@/constants/routes';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useTableData = () => {
  const navigate = useNavigate();
  const { table, setTable, clearTable } = useTableStore();

  //TODO: table이 null일경우 선택한 테이블 조회 api 호출 추후 적용 예정
  useEffect(() => {
    if (!!table && table?.tableNumber === 0) {
      navigate(ROUTES.TABLES.generate(), { replace: true });
    }
  }, [table, navigate]);

  return { table, setTable, clearTable };
};
