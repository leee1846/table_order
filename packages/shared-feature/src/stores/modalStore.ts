import { create } from 'zustand';
import type { ModalSize } from '@repo/ui/utils';

export type ModalType = 'confirm' | 'dualAction' | 'longContent';

export type { ModalSize };

export interface ModalConfig {
  id: string;
  type: ModalType;
  title?: string;
  content: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  primaryText?: string;
  secondaryText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  position?: 'center' | 'top';
  size?: ModalSize;
}

interface ModalStore {
  modals: ModalConfig[];
  openModal: (config: Omit<ModalConfig, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modals: [],
  openModal: (config) => {
    const id = `modal-${Date.now()}-${Math.random()}`;

    set((state) => ({
      modals: [...state.modals, { ...config, id }],
    }));
    return id;
  },
  closeModal: (id) => {
    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== id),
    }));
  },
  closeAllModals: () => {
    set({ modals: [] });
  },
}));
