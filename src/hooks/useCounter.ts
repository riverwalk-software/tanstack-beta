import { useReducer } from "react";
import { match } from "ts-pattern";

export function useCounter({
  initialValue = 0,
  resetValue = initialValue,
}: UseCounterProps): UseCounterReturn {
  const initialState: State = { count: initialValue };
  const [{ count }, dispatch] = useReducer(reducer, initialState);
  const increment = () => dispatch(counterActions.increment());
  const decrement = () => dispatch(counterActions.decrement());
  const reset = () => dispatch(counterActions.reset(resetValue));
  return { count, increment, decrement, reset };
}

const reducer = (state: State, action: Action): State =>
  match(action)
    .with({ tag: ActionTags.INCREMENT }, () => ({ count: state.count + 1 }))
    .with({ tag: ActionTags.DECREMENT }, () => ({ count: state.count - 1 }))
    .with({ tag: ActionTags.RESET }, ({ resetValue }) => ({
      count: resetValue,
    }))
    .exhaustive();

interface UseCounterProps {
  initialValue?: number;
  resetValue?: number;
}
interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}
type State = {
  count: number;
};

type Action =
  | { tag: typeof ActionTags.INCREMENT }
  | { tag: typeof ActionTags.DECREMENT }
  | { tag: typeof ActionTags.RESET; resetValue: number };

const counterActions = {
  increment: () => ({ tag: ActionTags.INCREMENT }) as const,
  decrement: () => ({ tag: ActionTags.DECREMENT }) as const,
  reset: (resetValue: number) =>
    ({
      tag: ActionTags.RESET,
      resetValue,
    }) as const,
};

const ActionTags = {
  INCREMENT: "counter/increment",
  DECREMENT: "counter/decrement",
  RESET: "counter/reset",
} as const;
