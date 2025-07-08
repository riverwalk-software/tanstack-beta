/**
 * Custom React hook for managing a countdown timer with status control.
 *
 * This hook wraps the `useCountdown` hook from `usehooks-ts` and adds status management
 * (idle, running, stopped), as well as utility functions for starting, stopping, resetting,
 * and restarting the countdown. It also provides predicates for the current status and a flag
 * indicating if the countdown has finished.
 *
 * @param countStart - The initial value (in seconds) from which the countdown starts.
 * @param startOnInit - Optional. If true, the countdown starts automatically on initialization.
 *
 * @returns An object containing:
 * - `count`: The current countdown value.
 * - `startCountdown`: Function to start the countdown and set status to "running".
 * - `resetCountdown`: Function to reset the countdown and set status to "idle".
 * - `restartCountdown`: Function to reset and immediately start the countdown, setting status to "running".
 * - `stopCountdown`: Function to stop the countdown and set status to "stopped".
 * - `isFinished`: Boolean indicating if the countdown has reached its stop value.
 * - `isIdle`: Boolean indicating if the countdown is idle.
 * - `isRunning`: Boolean indicating if the countdown is running.
 * - `isStopped`: Boolean indicating if the countdown is stopped.
 *
 * @example
 * ```tsx
 * const {
 *   count,
 *   startCountdown,
 *   resetCountdown,
 *   restartCountdown,
 *   stopCountdown,
 *   isFinished,
 *   isIdle,
 *   isRunning,
 *   isStopped,
 * } = useCountdown({ countStart: 60, startOnInit: true });
 * ```
 */
import { useCallback, useEffect, useMemo, useState } from "react";
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
  const startCountdown = useCallback(() => {
    setStatus("running");
    start();
  }, [start]);

  const stopCountdown = useCallback(() => {
    setStatus("stopped");
    stop();
  }, [stop]);

  const resetCountdown = useCallback(() => {
    setStatus("idle");
    reset();
  }, [reset]);

  const restartCountdown = useCallback(() => {
    setStatus("running");
    reset();
    start();
  }, [reset, start]);

  useEffect(() => {
    if (startOnInit) {
      startCountdown();
    }
  }, [startOnInit, startCountdown]);

  return {
    ...statusPredicates,
    count,
    startCountdown,
    resetCountdown,
    restartCountdown,
    stopCountdown,
    isFinished,
  };
};
