import ms from "ms";
import { useCallback } from "react";
import z from "zod";
import { useCounter } from "./useCounter";
import { useInterval } from "./useInterval";

export const useCountdown = (params: Params = {}): Return => {
  const { autoStart, initialCount } = ParamsSchema.parse(params);
  const { count, decrement, reset } = useCounter();
  const {
    isActive: isIntervalActive,
    start: startInterval,
    stop: stopInterval,
    toggle: toggleInterval,
  } = useInterval(decrement, ms("1s"), {
    autoStart,
  });

  const start = useCallback(() => {
    const
  }, []);
};

const ParamsSchema = z.object({
  initialCount: z.number().int().positive().default(60),
  autoStart: z.boolean().default(true),
});

type Params = z.input<typeof ParamsSchema>;
interface State {
  count: number;
}
interface Actions {
  start: () => void;
  pause: () => void;
  stop: () => void;
  reset: () => void;
  toggle: () => void;
}

interface Status {
  status: "idle" | "running" | "stopped";
  isIdle: boolean;
  isRunning: boolean;
  isStopped: boolean;
}

interface Return extends State, Actions {}

// type CountDownStatus = "idle" | "running" | "stopped";
// const countStopDurationS = s("0s");
// export const useCountdown = ({
//   countStart,
//   startOnInit,
// }: {
//   countStart: number;
//   startOnInit?: boolean;
// }) => {
//   const initialStatus: CountDownStatus = startOnInit ? "running" : "idle";
//   const [status, setStatus] = useState<CountDownStatus>(initialStatus);
//   const statusPredicates = useMemo(
//     () => ({
//       isIdle: status === "idle",
//       isRunning: status === "running",
//       isStopped: status === "stopped",
//     }),
//     [status],
//   );
//   const [
//     count,
//     { startCountdown: start, resetCountdown: reset, stopCountdown: stop },
//   ] = useHooksCountdown({
//     countStart,
//     countStop: countStopDurationS,
//   });
//   const isFinished = count === countStopDurationS;
//   const startCountdown = useCallback(() => {
//     setStatus("running");
//     start();
//   }, [start]);

//   const stopCountdown = useCallback(() => {
//     setStatus("stopped");
//     stop();
//   }, [stop]);

//   const resetCountdown = useCallback(() => {
//     setStatus("idle");
//     reset();
//   }, [reset]);

//   const restartCountdown = useCallback(() => {
//     setStatus("running");
//     reset();
//     start();
//   }, [reset, start]);

//   useEffect(() => {
//     if (startOnInit) startCountdown();
//   }, [startOnInit, startCountdown]);

//   return {
//     ...statusPredicates,
//     count,
//     startCountdown,
//     resetCountdown,
//     restartCountdown,
//     stopCountdown,
//     isFinished,
//   };
// };
