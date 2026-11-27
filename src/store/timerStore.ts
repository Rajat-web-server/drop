import { create } from "zustand";
import { saveSession } from "../services/database";
import { getSessions } from "../services/database";

import {
  getRemainingTime,
  getProgress,
  formatTime,
  type TimerStatus,
} from "../services/timerEngine";

export interface Session {
  id: string;
  tag: string;
  durationMs: number;
  startedAt: number;
  completedAt: number;
}

interface TimerState {
  durationMs: number;
  remainingMs: number;
  endsAt: number | null;
  status: TimerStatus;

  start: (tag?: string) => void;
  pause: () => void;
  reset: () => void;
  setDuration: (minutes: number) => void;
  sync: () => void;
  loadSessions: () => Promise<void>;

  currentStartedAt: number | null;
  currentTag: string;
  sessions: Session[];
}

const DEFAULT_DURATION = 3 * 1000;

export const useTimerStore = create<TimerState>((set, get) => ({
  durationMs: DEFAULT_DURATION,
  remainingMs: DEFAULT_DURATION,
  endsAt: null,
  status: "idle",

  currentStartedAt: null,
  currentTag: "Coding",
  sessions: [],
  loadSessions: async () => {
    try {
      const sessions = await getSessions();
      set({ sessions });
    } catch (error) {
      console.error("Failed to load sessions:", error);
    }
  },

  start: (tag) => {
    const state = get();

    if (state.status === "running") return;
    if (state.remainingMs <= 0) return;

    set({
      endsAt: Date.now() + state.remainingMs,
      status: "running",

      currentStartedAt: state.currentStartedAt ?? Date.now(),

      currentTag:
        state.currentStartedAt !== null
          ? state.currentTag
          : (tag ?? "Uncategorized"),
    });
  },

  pause: () => {
    const state = get();

    if (state.status !== "running") return;

    const remainingMs = getRemainingTime(state.endsAt, state.remainingMs);

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
      currentStartedAt: null,
      currentTag: "Coding",
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
      currentStartedAt: null,
    });
  },

  sync: () => {
    const state = get();

    // Only sync an active timer
    if (state.status !== "running") return;

    const remainingMs = getRemainingTime(state.endsAt, state.remainingMs);

    // Timer is still running
    if (remainingMs > 0) {
      set({ remainingMs });
      return;
    }

    // Timer has completed
    const completedAt = Date.now();

    const newSession: Session = {
      id: crypto.randomUUID(),
      tag: state.currentTag,
      durationMs: state.durationMs,
      startedAt: state.currentStartedAt ?? completedAt,
      completedAt,
    };
    void saveSession(newSession).catch((error) => {
      console.error("Failed to save session:", error);
    });

    set({
      remainingMs: 0,
      endsAt: null,
      status: "completed",
      sessions: [newSession, ...state.sessions],
      currentStartedAt: null,
    });
  },
}));

// Selectors for derived values

export const selectProgress = (state: TimerState) =>
  getProgress(state.remainingMs, state.durationMs);

export const selectFormattedTime = (state: TimerState) =>
  formatTime(state.remainingMs);
