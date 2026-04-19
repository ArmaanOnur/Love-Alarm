import { create } from 'zustand';
import type { NearbyUser } from '../types/user';
import type { AlarmHistory, DailyTask } from '../types/alarm';

interface AlarmState {
  isActive: boolean;
  nearbyUsers: NearbyUser[];
  nearbyCount: number;
  history: AlarmHistory[];
  dailyTasks: DailyTask[];
  streakCount: number;
  boostActive: boolean;
  boostEndsAt: string | null;

  setActive: (v: boolean) => void;
  setNearbyUsers: (users: NearbyUser[]) => void;
  addHistory: (entry: AlarmHistory) => void;
  setDailyTasks: (tasks: DailyTask[]) => void;
  completeTask: (id: string) => void;
  setStreakCount: (n: number) => void;
  setBoost: (active: boolean, endsAt?: string | null) => void;
}

export const useAlarmStore = create<AlarmState>((set) => ({
  isActive: false,
  nearbyUsers: [],
  nearbyCount: 0,
  history: [],
  dailyTasks: [],
  streakCount: 0,
  boostActive: false,
  boostEndsAt: null,

  setActive: (isActive) => set({ isActive }),
  setNearbyUsers: (nearbyUsers) =>
    set({ nearbyUsers, nearbyCount: nearbyUsers.length }),
  addHistory: (entry) =>
    set((state) => ({ history: [entry, ...state.history].slice(0, 100) })),
  setDailyTasks: (dailyTasks) => set({ dailyTasks }),
  completeTask: (id) =>
    set((state) => ({
      dailyTasks: state.dailyTasks.map((t) =>
        t.id === id ? { ...t, isCompleted: true } : t,
      ),
    })),
  setStreakCount: (streakCount) => set({ streakCount }),
  setBoost: (boostActive, boostEndsAt?: string | null) =>
    set({ boostActive, boostEndsAt: boostEndsAt ?? null }),
}));
