import { useTimer } from "./hooks/useTimer";
import { Play, Pause, RotateCcw, Grip } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { WaterAnimation } from "./components/floating/WaterAnimation";
import { useState } from "react";
import { TagManager } from "./components/dashboard/TagManager";
import { SessionHistory } from "./components/dashboard/SessionHistory";
import { useEffect } from "react";
import { useTimerStore } from "./store/timerStore";
import { AnalyticsPanel } from "./components/dashboard/AnalyticsPanel";

function App() {
  const loadSessions = useTimerStore((state) => state.loadSessions);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);
  const [customMinutes, setCustomMinutes] = useState("30");
  const [selectedTag, setSelectedTag] = useState("Coding");
  const {
    status,
    progress,
    formattedTime,
    start,
    pause,
    reset,
    remainingMs,
    setDuration,
    sessions,
  } = useTimer();

  {
    console.log("session", sessions);
  }
  return (
    <main className="h-full w-full bg-transparent p-2">
      <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-[#15191f]/95 p-3 shadow-2xl">
        {/* Drag region */}
        <div
          onMouseDown={() => {
            getCurrentWindow().startDragging().catch(console.error);
          }}
          className="flex items-center justify-between cursor-grab"
        >
          <span className="text-[10px] font-semibold tracking-[2px] text-gray-400">
            DROP
          </span>

          <Grip size={15} className="text-gray-500" />
        </div>

        {/* Timer */}
        <div className="flex items-center gap-3">
          {/* Water placeholder */}
          <WaterAnimation
            progress={progress}
            remainingMs={remainingMs}
            status={status}
          />

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold tracking-tight tabular-nums text-white">
              {formattedTime}
            </h1>

            <p className="text-[10px] text-gray-400">{selectedTag} </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            {status === "running" ? (
              <button
                onClick={pause}
                className="rounded-lg p-2 text-white transition hover:bg-white/10"
                title="Pause"
              >
                <Pause size={15} />
              </button>
            ) : (
              <button
                onClick={() => start(selectedTag)}
                disabled={status === "completed"}
                className="rounded-lg p-2 text-sky-400 transition hover:bg-white/10 disabled:opacity-40"
                title="Start"
              >
                <Play size={15} />
              </button>
            )}

            <button
              onClick={reset}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
              title="Reset"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          {[1, 15, 25, 45, 60].map((minutes) => (
            <button
              key={minutes}
              onClick={() => setDuration(minutes)}
              disabled={status === "running"}
              className="rounded-lg border border-white/10 px-3 py-1 text-xs text-gray-400 transition hover:border-sky-400/50 hover:bg-sky-400/10 hover:text-sky-400 disabled:cursor-not-allowed disabled:opacity-40 mb-1 mt-1"
            >
              {minutes}m
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 mb-1">
          <input
            type="number"
            min="1"
            max="1440"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            disabled={status === "running"}
            placeholder="Minutes"
            className="w-20 rounded-lg border border-white/10 bg-[#252d36] px-2 py-1 text-sm text-white outline-none focus:border-sky-400 disabled:opacity-40"
          />

          <button
            onClick={() => {
              const minutes = Number(customMinutes);

              if (
                Number.isInteger(minutes) &&
                minutes >= 1 &&
                minutes <= 1440
              ) {
                setDuration(minutes);
              }
            }}
            disabled={status === "running"}
            className="rounded-lg bg-sky-500 px-4 py-1 text-xs font-semibold text-white transition hover:bg-sky-400 disabled:opacity-40"
          >
            Set timer
          </button>
        </div>
        <div className="border-t border-white/10 pt-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-gray-500">
            Activity
          </p>

          <TagManager selectedTag={selectedTag} onSelectTag={setSelectedTag} />
          <SessionHistory sessions={sessions} />
          <AnalyticsPanel sessions={sessions} />
        </div>
      </div>
    </main>
  );
}

export default App;
