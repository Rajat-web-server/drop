
export type TimerStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed";

export function getRemainingTime(
  endsAt: number | null,
  fallbackTime: number
): number {
  if (endsAt === null) return fallbackTime;

  return Math.max(0, endsAt - Date.now());
}

export function getProgress(
  remainingMs: number,
  durationMs: number
): number {
  if (durationMs <= 0) return 0;

  return Math.min(
    1,
    Math.max(0, remainingMs / durationMs)
  );
}

//convert milliseconds into a readable countdown
export function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (value: number) =>
    String(value).padStart(2, "0");

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${pad(minutes)}:${pad(seconds)}`;
}
