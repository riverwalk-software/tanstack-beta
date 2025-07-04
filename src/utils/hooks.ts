import { useState } from "react";
import { useCountdown as useHooksCountdown } from "usehooks-ts";
import { s } from "./time";

type CountDownStatus = "idle" | "running" | "stopped";
const countStopDurationS = s("0s");
export const useCountdown = ({ countStart }: { countStart: number }) => {
  const [status, setStatus] = useState<CountDownStatus>("idle");
  const isIdle = status === "idle";
  const isRunning = status === "running";
  const isStopped = status === "stopped";

  const [
    count,
    { startCountdown: start, resetCountdown: reset, stopCountdown: stop },
  ] = useHooksCountdown({
    countStart,
    countStop: countStopDurationS,
  });
  const isFinished = count === countStopDurationS;
  const startCountdown = () => {
    setStatus("running");
    start();
  };
  const stopCountdown = () => {
    setStatus("stopped");
    stop();
  };
  const resetCountdown = () => {
    setStatus("idle");
    reset();
  };
  const restartCountdown = () => {
    setStatus("running");
    reset();
    start();
  };
  return {
    count,
    startCountdown,
    resetCountdown,
    restartCountdown,
    stopCountdown,
    isRunning,
    isFinished,
    isIdle,
    isStopped,
  };
};
