import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react';
import * as S from './sortableList.style';

/**
 * SortableList 컴포넌트의 Props 타입
 * @template T - 리스트 아이템의 타입
 */
export interface SortableListProps<T> {
  /** 드래그 앤 드롭 가능한 아이템 배열 */
  items: T[];
  /** 순서가 변경되었을 때 호출되는 콜백 함수 */
  onReorder: (newOrder: T[], draggedItemId: string | number) => void;
  /** 각 아이템을 렌더링하는 함수 */
  renderItem: (item: T) => ReactNode;
  /** 아이템의 고유 ID를 추출하는 함수 */
  getId: (item: T) => string | number;
}

/**
 * 드래그 앤 드롭으로 순서를 변경할 수 있는 리스트 컴포넌트
 * 웹뷰와 태블릿 환경 모두에서 동작합니다.
 *
 * @template T - 리스트 아이템의 타입
 */
export function SortableList<T>({
  items,
  onReorder,
  renderItem,
  getId,
}: SortableListProps<T>) {
  /**
   * 드래그 이벤트를 감지하는 센서 설정
   * - PointerSensor: 마우스 및 터치 이벤트 지원 (웹뷰)
   * - TouchSensor: 터치 전용 이벤트 지원, delay 옵션으로 길게 누르기 지원 (태블릿)
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이동해야 드래그 시작 (실수 클릭 방지)
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 200ms 길게 누르기 (태블릿에서 실수 드래그 방지)
        tolerance: 5, // 5px 움직임 허용 (손 떨림 보정)
      },
    })
  );

  /**
   * 드래그가 종료되었을 때 호출되는 핸들러
   * 드래그한 아이템의 이전 위치와 새로운 위치를 계산하여 순서를 변경합니다.
   */
  const handleDragEnd = (event: DragEndEvent) => {
    //active :드래그 중인 요소, over : 드롭 위치의 요소
    const { active, over } = event;

    // 드롭 위치가 없거나 같은 위치에 드롭한 경우 무시
    if (!over || active.id === over.id) {
      return;
    }

    // 드래그한 아이템의 이전 인덱스 찾기
    const oldIndex = items.findIndex((item) => getId(item) === active.id);

    // 드롭한 위치의 새로운 인덱스 찾기
    const newIndex = items.findIndex((item) => getId(item) === over.id);

    // 유효한 인덱스이고 실제로 위치가 변경된 경우에만 순서 변경
    // -1 체크는 배열에서 해당 ID를 가진 아이템이 실제로 존재하는지 확인
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const newOrder = arrayMove(items, oldIndex, newIndex);
      onReorder(newOrder, active.id);
    }
  };

  // SortableContext에 전달할 아이템 ID 배열 생성
  const itemIds = items.map((item) => getId(item));

  return (
    <S.SortableListContainer>
      {/* 드래그 앤 드롭 컨텍스트: 드래그 이벤트를 관리 */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter} // 가장 가까운 아이템과 충돌 감지
        onDragEnd={handleDragEnd}
      >
        {/* 정렬 가능한 컨텍스트: 세로 방향 리스트 정렬 옵션 */}
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={getId(item)} id={getId(item)}>
              {renderItem(item)}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </S.SortableListContainer>
  );
}

/**
 * SortableItem 컴포넌트의 Props 타입
 */
interface SortableItemProps {
  /** 아이템의 고유 ID */
  id: string | number;
  /** 아이템의 내용 */
  children: ReactNode;
}

/**
 * 드래그 가능한 개별 아이템 컴포넌트
 * useSortable 훅을 사용하여 드래그 기능을 제공합니다.
 */
function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes, // 접근성을 위한 속성
    listeners, // 드래그 이벤트 리스너
    setNodeRef, // DOM 노드 참조
    transform, // 드래그 중 위치 변환 정보
    transition, // 애니메이션 전환 효과
    isDragging, // 현재 드래그 중인지 여부
  } = useSortable({ id });

  /**
   * 드래그 중인 아이템의 스타일
   * - transform: 드래그 중 위치 이동
   * - transition: 부드러운 애니메이션 효과
   * - opacity: 드래그 중 반투명 효과
   * - cursor: 마우스 커서 스타일
   */
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <S.SortableItem
      ref={setNodeRef}
      style={style}
      {...attributes} // 접근성 속성 적용
      {...listeners} // 드래그 이벤트 리스너 적용
    >
      {children}
    </S.SortableItem>
  );
}

/**
 * 배열의 요소를 한 위치에서 다른 위치로 이동시킵니다.
 *
 * @param array - 원본 배열
 * @param oldIndex - 이동할 요소의 현재 인덱스
 * @param newIndex - 이동할 요소의 새로운 인덱스
 * @returns 순서가 변경된 새로운 배열
 *
 * @example
 * ```ts
 * const arr = [1, 2, 3, 4, 5];
 * const result = arrayMove(arr, 0, 3); // [2, 3, 4, 1, 5]
 * ```
 */
function arrayMove<T>(array: T[], oldIndex: number, newIndex: number): T[] {
  const newArray = [...array];

  // oldIndex 위치의 요소를 제거
  const [removed] = newArray.splice(oldIndex, 1);

  // newIndex 위치에 요소를 삽입 (removed는 항상 정의됨)
  newArray.splice(newIndex, 0, removed!);
  return newArray;
}
