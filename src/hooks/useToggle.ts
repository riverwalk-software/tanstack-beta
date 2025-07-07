import { useCallback, useState } from "react";

type ToggleOption = "first" | "second";

interface UseToggleParams<T> {
  firstValue: T;
  secondValue: T;
  initialValue?: ToggleOption;
  defaultValue?: ToggleOption;
}

interface UseToggleResult<T> {
  currentValue: T;
  toggle: () => void;
  setToFirst: () => void;
  setToSecond: () => void;
  isFirst: boolean;
  isSecond: boolean;
}

/**
 * useToggle is a custom React hook for toggling between two values of type `T`.
 * It provides utility functions to toggle, set, and check the current value.
 *
 * @template T - The type of the values to toggle between.
 *
 * @param {Object} params - The parameters object.
 * @param {T} params.firstValue - The first value to toggle to.
 * @param {T} params.secondValue - The second value to toggle to.
 * @param {"first" | "second"} [params.initialValue="first"] - The initial value to use ("first" or "second").
 * @param {"first" | "second"} [params.defaultValue="first"] - The default fallback value to use when toggling in situations where T has more than two possible values.
 *
 * @returns {Object} An object containing:
 * - `currentValue` (`T`): The current value.
 * - `toggle` (`() => void`): Function to toggle between the two values.
 * - `setToFirst` (`() => void`): Function to set the value to `firstValue`.
 * - `setToSecond` (`() => void`): Function to set the value to `secondValue`.
 * - `isFirst` (`boolean`): Whether the current value is `firstValue`.
 * - `isSecond` (`boolean`): Whether the current value is `secondValue`.
 *
 * @example
 * ```tsx
 * const { currentValue, toggle, setToFirst, setToSecond, isFirst, isSecond } = useToggle({
 *   firstValue: "on",
 *   secondValue: "off",
 *   initialValue: "second",
 * });
 * ```
 */
export const useToggle = <T>({
  firstValue,
  secondValue,
  initialValue = "first",
  defaultValue = "first",
}: UseToggleParams<T>): UseToggleResult<T> => {
  const [currentValue, setCurrentValue] = useState<T>(
    initialValue === "first" ? firstValue : secondValue,
  );

  const toggle = useCallback(() => {
    setCurrentValue((prev) =>
      defaultValue === "first"
        ? prev === firstValue
          ? secondValue
          : firstValue
        : prev === secondValue
          ? firstValue
          : secondValue,
    );
  }, [firstValue, secondValue, defaultValue]);

  const setToFirst = useCallback(
    () => setCurrentValue(firstValue),
    [firstValue],
  );
  const setToSecond = useCallback(
    () => setCurrentValue(secondValue),
    [secondValue],
  );

  const isFirst = currentValue === firstValue;
  const isSecond = currentValue === secondValue;

  return { currentValue, toggle, setToFirst, setToSecond, isFirst, isSecond };
};
