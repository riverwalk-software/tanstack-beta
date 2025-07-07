import { useEffect, useMemo, useState } from "react";
import { useCountdown as useHooksCountdown } from "usehooks-ts";
import { s } from "../utils/time";

type CountDownStatus = "idle" | "running" | "stopped";
const countStopDurationS = s("0s");
export const useCountdown = ({
  countStart,
  startOnInit,
}: {
  countStart: number;
  startOnInit?: boolean;
}) => {
  const initialStatus: CountDownStatus = startOnInit ? "running" : "idle";
  const [status, setStatus] = useState<CountDownStatus>(initialStatus);
  const statusPredicates = useMemo(
    () => ({
      isIdle: status === "idle",
      isRunning: status === "running",
      isStopped: status === "stopped",
    }),
    [status],
  );

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

  useEffect(() => {
    if (startOnInit) {
      setStatus("running");
      start();
    }
  }, [startOnInit, start]);

  return {
    count,
    startCountdown,
    resetCountdown,
    restartCountdown,
    stopCountdown,
    isFinished,
    ...statusPredicates,
  };
};
