import { ModalBackground } from '@repo/ui/components';

interface Props {
  onClose: () => void;
}
export const SplitPaymentModal = ({ onClose }: Props) => {
  return (
    <ModalBackground onClick={onClose}>
      <div>
        <div>
          <p>분할 결제 방식을 선택하세요</p>
          <div>
            <button>메뉴별로 나누기</button>
            <button>인원 수로 나누기</button>
          </div>
        </div>
      </div>
    </ModalBackground>
  );
};
