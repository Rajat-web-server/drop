
import { useTimer } from "./hooks/useTimer";

function App() {
  const {
    status,
    progress,
    formattedTime,
    start,
    pause,
    reset,
  } = useTimer();

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b0d10] p-6 text-white">

      <div className="w-[360px] rounded-2xl border border-[#292e36] bg-[#171a20] p-8 text-center shadow-2xl">

        <p className="text-[11px] tracking-[2px] text-gray-400">
          DROP / FOCUS TIMER
        </p>

        <h1 className="my-8 text-6xl font-medium tabular-nums">
          {formattedTime}
        </h1>

        <div className="h-2 overflow-hidden rounded-full bg-[#303640]">
          <div
            className="h-full rounded-full bg-sky-400 transition-all duration-300"
            style={{
              width: `${progress * 100}%`,
            }}
          />
        </div>

        <p className="my-6 text-sm text-gray-400">
          Status: {status}
        </p>

        <div className="flex justify-center gap-3">

          {status === "running" ? (
            <button
              onClick={pause}
              className="rounded-lg bg-sky-400 px-6 py-3 font-semibold text-black transition hover:bg-sky-300"
            >
              Pause
            </button>
          ) : (
            <button
              onClick={start}
              disabled={status === "completed"}
              className="rounded-lg bg-sky-400 px-6 py-3 font-semibold text-black transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Start
            </button>
          )}

          <button
            onClick={reset}
            className="rounded-lg bg-[#303640] px-6 py-3 font-semibold text-white transition hover:bg-[#414955]"
          >
            Reset
          </button>

        </div>
      </div>
    </main>
  );
}

export default App;
