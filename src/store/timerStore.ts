
import { create } from "zustand";

import {
  getRemainingTime,
  getProgress,
  formatTime,
  type TimerStatus,
} from "../services/timerEngine";

interface TimerState {
  durationMs: number;
  remainingMs: number;
  endsAt: number | null;
  status: TimerStatus;

  start: () => void;
  pause: () => void;
  reset: () => void;
  setDuration: (minutes: number) => void;
  sync: () => void;
}

const DEFAULT_DURATION = 25 * 60 * 1000;

export const useTimerStore = create<TimerState>(
  (set, get) => ({
    durationMs: DEFAULT_DURATION,
    remainingMs: DEFAULT_DURATION,
    endsAt: null,
    status: "idle",

    start: () => {
      const state = get();

      if (state.status === "running") return;

      if (state.remainingMs <= 0) return;

      set({
        endsAt: Date.now() + state.remainingMs,
        status: "running",
      });
    },

    pause: () => {
      const state = get();

      if (state.status !== "running") return;

      const remainingMs = getRemainingTime(
        state.endsAt,
        state.remainingMs
      );

      set({
        remainingMs,
        endsAt: null,
        status: remainingMs > 0 ? "paused" : "completed",
      });
    },

    reset: () => {
      set((state) => ({
        remainingMs: state.durationMs,
        endsAt: null,
        status: "idle",
      }));
    },

    setDuration: (minutes) => {
      if (!Number.isFinite(minutes) || minutes <= 0) return;

      if (get().status === "running") return;

      const durationMs = minutes * 60 * 1000;

      set({
        durationMs,
        remainingMs: durationMs,
        endsAt: null,
        status: "idle",
      });
    },

    sync: () => {
      const state = get();

      if (state.status !== "running") return;

      const remainingMs = getRemainingTime(
        state.endsAt,
        state.remainingMs
      );

      if (remainingMs === 0) {
        set({
          remainingMs: 0,
          endsAt: null,
          status: "completed",
        });

        return;
      }

      set({ remainingMs });
    },
  })
);

// Selectors for derived values

export const selectProgress = (state: TimerState) =>
  getProgress(state.remainingMs, state.durationMs);

export const selectFormattedTime = (state: TimerState) =>
  formatTime(state.remainingMs);
