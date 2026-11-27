
import type { Session } from "../../store/timerStore";
import {
  getTotalFocusTime,
  getCompletedSessionCount,
  getFocusTimeByTag,
} from "../../services/sessionStats";

interface AnalyticsPanelProps {
  sessions: Session[];
}

function formatDuration(ms: number) {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function AnalyticsPanel({ sessions }: AnalyticsPanelProps) {
  const totalFocusTime = getTotalFocusTime(sessions);
  const completedCount = getCompletedSessionCount(sessions);
  const focusByTag = getFocusTimeByTag(sessions);

  const tagEntries = Object.entries(focusByTag);
  const maxFocusTime = Math.max(
    ...tagEntries.map(([, duration]) => duration),
    1
  );

  return (
    <section className="w-full space-y-4 border-t border-white/10 pt-4">
      <h2 className="text-sm font-semibold text-white">
        Focus analytics
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-xs text-gray-400">Total focus time</p>
          <p className="mt-1 text-xl font-semibold text-sky-400">
            {formatDuration(totalFocusTime)}
          </p>
        </div>

        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-xs text-gray-400">Completed sessions</p>
          <p className="mt-1 text-xl font-semibold text-white">
            {completedCount}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium text-gray-300">
          Focus time by activity
        </p>

        {tagEntries.length === 0 ? (
          <p className="text-xs text-gray-500">
            Complete a session to see your statistics.
          </p>
        ) : (
          tagEntries.map(([tag, duration]) => (
            <div key={tag} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300">{tag}</span>
                <span className="text-gray-400">
                  {formatDuration(duration)}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-sky-400 transition-all"
                  style={{
                    width: `${(duration / maxFocusTime) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
