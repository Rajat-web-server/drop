import { motion } from "motion/react";
import type { TimerStatus } from "../../services/timerEngine";

interface WaterAnimationProps {
  progress: number;
  remainingMs: number;
  status: TimerStatus;
}

export function WaterAnimation({
  progress,
  remainingMs,
  status,
}: WaterAnimationProps) {
  const waterColor =
    remainingMs <= 60_000
      ? "#ef4444"
      : remainingMs <= 300_000
        ? "#f59e0b"
        : "#38bdf8";

  const waterHeight = Math.max(0, Math.min(1, progress)) * 100;
  const waveDuration =
    status === "running"
      ? 3
      : status === "paused"
        ? 10
        : status === "completed"
          ? 1.5
          : 5;

  const isCompleted = status === "completed";
  return (
    <motion.div
      className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#252d36]"
      animate={{
        boxShadow: isCompleted
          ? [
              "0 0 5px rgba(239,68,68,0.2)",
              "0 0 16px rgba(239,68,68,0.7)",
              "0 0 5px rgba(239,68,68,0.2)",
            ]
          : "0 0 0px rgba(0,0,0,0)",
      }}
      transition={{
        duration: 2,
        repeat: isCompleted ? Infinity : 0,
        ease: "easeInOut",
      }}
    >
      {/* Liquid body */}
      <motion.div
        className="absolute bottom-0 left-0 w-full"
        animate={{ height: `${waterHeight}%` }}
        transition={{
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          background: `linear-gradient(to bottom, ${waterColor} 0%, ${waterColor} 55%, #0c4a6e 100%)`,
        }}
      >
        {/* Back wave */}
        <motion.div
          className="absolute -top-[5px] left-0 w-[200%]"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: waveDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg viewBox="0 0 200 14" className="block w-full">
            <path
              d="M0 7 C25 0 25 0 50 7 S75 14 100 7 S125 0 150 7 S175 14 200 7 V14 H0 Z"
              fill={waterColor}
              opacity="0.4"
            />
          </svg>
        </motion.div>

        {/* Front wave */}
        <motion.div
          className="absolute -top-[4px] left-0 w-[200%]"
          animate={{ x: ["-50%", "0%"] }}
          transition={{
            duration: waveDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg viewBox="0 0 200 14" className="block w-full">
            <path
              d="M0 7 C25 14 25 14 50 7 S75 0 100 7 S125 14 150 7 S175 0 200 7 V14 H0 Z"
              fill={waterColor}
              opacity="0.85"
            />
          </svg>
        </motion.div>

        {/* Floating bubbles */}
        {[
          { left: "25%", delay: 0, duration: 2.5 },
          { left: "65%", delay: 1, duration: 3 },
          { left: "45%", delay: 0.5, duration: 2 },
        ].map((bubble, index) => (
          <motion.span
            key={index}
            className="absolute bottom-1 block h-1 w-1 rounded-full bg-white/50"
            style={{ left: bubble.left }}
            animate={{
              y: [0, -18, -30],
              opacity: [0, 0.7, 0],
              scale: [0.6, 1, 0.5],
            }}
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Light reflection */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10" />
      </motion.div>

      {/* Glass reflection */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 via-transparent to-transparent" />
    </motion.div>
  );
}
