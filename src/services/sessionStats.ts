import type { Session } from "../store/timerStore";

export function getTotalFocusTime(sessions: Session[]) {
  return sessions.reduce(
    (total, session) => total + session.durationMs,
    0
  );
}

export function getCompletedSessionCount(sessions: Session[]) {
  return sessions.length;
}

export function getFocusTimeByTag(sessions: Session[]) {
  return sessions.reduce<Record<string, number>>(
    (totals, session) => {
      totals[session.tag] =
        (totals[session.tag] ?? 0) + session.durationMs;

      return totals;
    },
    {}
  );
}