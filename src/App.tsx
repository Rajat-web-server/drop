import { useTimer } from "./hooks/useTimer";
import { Play, Pause, RotateCcw, Grip } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { WaterAnimation } from "./components/floating/WaterAnimation";

function App() {
  const { status, progress, formattedTime, start, pause, reset, remainingMs } = useTimer();

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
          <WaterAnimation progress={progress} remainingMs={remainingMs} status={status} />

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold tracking-tight tabular-nums text-white">
              {formattedTime}
            </h1>

            <p className="text-[10px] text-gray-400">Focus session</p>
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
                onClick={start}
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
      </div>
    </main>
  );
}

export default App;
