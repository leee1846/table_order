import { create } from 'zustand';

interface ICounterStore {
  state: {
    count: number;
  };
  actions: {
    increment: () => void;
    decrement: () => void;
    incrementByAmount: (amount: number) => void;
  };
}

export const useCounterStore = create<ICounterStore>()((set) => ({
  state: {
    count: 0,
  },
  actions: {
    increment: () =>
      set((state) => ({ state: { count: state.state.count + 1 } })),
    decrement: () =>
      set((state) => ({ state: { count: state.state.count - 1 } })),
    incrementByAmount: (amount: number) =>
      set((state) => ({ state: { count: state.state.count + amount } })),
  },
}));
