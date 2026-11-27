
import type { Session } from "../../store/timerStore";

interface SessionHistoryProps {
  sessions: Session[];
}

export function SessionHistory({
  sessions,
}: SessionHistoryProps) {
  function formatDuration(ms: number) {
    const totalMinutes = Math.round(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  }

  return (
    <section className="w-full border-t border-white/10 pt-3 default ">
      <h2 className="mb-3 text-xs font-semibold text-gray-300">
        Recent sessions
      </h2>

      {sessions.length === 0 ? (
        <p className="text-xs text-gray-500">
          No completed sessions yet.
        </p>
      ) : (
        <div className="flex max-h-36 flex-col gap-2 overflow-y-auto scrollbar-none">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between rounded-lg bg-white/5 p-2"
            >
              <div>
                <p className="text-xs font-medium text-white">
                  {session.tag}
                </p>

                <p className="text-[10px] text-gray-500">
                  {new Date(session.completedAt).toLocaleString()}
                </p>
              </div>

              <span className="text-xs font-semibold text-sky-400">
                {formatDuration(session.durationMs)}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
