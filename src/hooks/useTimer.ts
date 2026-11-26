
import { useEffect } from "react";

import {
  useTimerStore,
  selectProgress,
  selectFormattedTime,
} from "../store/timerStore";

export function useTimer() {
  const status = useTimerStore((state) => state.status);
  const remainingMs = useTimerStore(
    (state) => state.remainingMs
  );
  const setDuration = useTimerStore((state) => state.setDuration);
  const start = useTimerStore((state) => state.start);
  const pause = useTimerStore((state) => state.pause);
  const reset = useTimerStore((state) => state.reset);
  const sync = useTimerStore((state) => state.sync);

  const progress = useTimerStore(selectProgress);
  const formattedTime = useTimerStore(selectFormattedTime);

  useEffect(() => {
    if (status !== "running") return;

    const interval = window.setInterval(() => {
      sync();
    }, 250);

    return () => window.clearInterval(interval);
  }, [status, sync]);

  return {
    status,
    remainingMs,
    progress,
    formattedTime,
    start,
    pause,
    reset,
    setDuration
  };
}
