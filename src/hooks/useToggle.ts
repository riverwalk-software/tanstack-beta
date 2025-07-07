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
 * A hook for toggling between two values with fallback behavior.
 *
 * @param firstValue - The first toggle option
 * @param secondValue - The second toggle option
 * @param initialValue - Which value to start with ("first" | "second")
 * @param defaultValue - Which value to fallback to in situations where T has more than two possible values
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
