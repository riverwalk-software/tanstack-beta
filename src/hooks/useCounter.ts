import { atom } from "jotai";
import { useAtom } from "jotai/react";
import { atomFamily } from "jotai/utils";
import { useMemo } from "react";
import z from "zod";
import { clamp, validateRange } from "@/utils/prelude";

/**
 * A counter hook with configurable bounds and step size.
 * Uses global state that can be shared across components via atomKey.
 *
 * @param params - Counter configuration options
 * @returns Object with current count and action functions
 */
export function useCounter(params: Params = {}): Return {
  const { initialValue, maxValue, minValue, resetValue, step, key } =
    ParamsSchema.parse(params);
  const atomKey = useMemo(() => key ?? crypto.randomUUID(), [key]);
  const atom = counterAtomFamily({ initialValue, atomKey });
  const [state, setState] = useAtom(atom);
  const clampToRange = clamp(minValue, maxValue);
  const actions: Actions = {
    increment: () =>
      setState((prevState) => ({
        count: clampToRange(prevState.count + step),
      })),
    decrement: () =>
      setState((prevState) => ({
        count: clampToRange(prevState.count - step),
      })),
    reset: () => setState(() => ({ count: resetValue })),
  };
  return { ...state, ...actions };
}

const counterAtomFamily = atomFamily(
  (params: { initialValue: number; atomKey: string }) =>
    atom({ count: params.initialValue }),
  (a, b) => a.atomKey === b.atomKey,
);

const ParamsSchema = z
  .object({
    initialValue: z.number().default(0),
    resetValue: z.number().optional(),
    minValue: z.number().default(0),
    maxValue: z.number().default(Infinity),
    step: z.number().positive().default(1),
    key: z.string().optional(),
  })
  .transform((params) => ({
    ...params,
    resetValue: params.resetValue ?? params.initialValue,
  }))
  .refine((params) => params.minValue <= params.maxValue, {
    message: "minValue must be less than or equal to maxValue",
    path: ["minValue"],
  })
  .superRefine((params, ctx) => {
    const isInRange = validateRange(params.minValue, params.maxValue);
    if (!isInRange(params.initialValue)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "initialValue must be between minValue and maxValue",
        path: ["initialValue"],
      });
    }
    if (!isInRange(params.resetValue)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "resetValue must be between minValue and maxValue",
        path: ["resetValue"],
      });
    }

    // if (!divisibleBy(params.initialValue, params.step)) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "initialValue must be divisible by step",
    //     path: ["initialValue"],
    //   });
    // }
  });
type Params = z.input<typeof ParamsSchema>;
interface State {
  count: number;
}
interface Actions {
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}
interface Return extends State, Actions {}
