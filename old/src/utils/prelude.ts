export const min =
  (a: number) =>
  (b: number): number =>
    Math.min(a, b)

export const max =
  (a: number) =>
  (b: number): number =>
    Math.max(a, b)

/**
 * Creates a function that clamps a number within the inclusive range specified by `minValue` and `maxValue`.
 *
 * @param minValue - The lower bound of the range.
 * @param maxValue - The upper bound of the range.
 * @returns A function that takes a number and returns it clamped between `minValue` and `maxValue`.
 *
 * @example
 * ```typescript
 * const clampToRange = clamp(0, 10);
 * clampToRange(5);   // returns 5
 * clampToRange(-3);  // returns 0
 * clampToRange(15);  // returns 10
 * ```
 */
export const clamp =
  (minValue: number) =>
  (maxValue: number) =>
  (value: number): number =>
    min(maxValue)(max(minValue)(value))

/**
 * Creates a validator function that checks if a given number is within a specified range.
 *
 * @param minValue - The minimum value of the range.
 * @param maxValue - The maximum value of the range.
 * @param options - Configuration for inclusivity of bounds.
 * @returns A function that takes a number and returns `true` if it is within the range, otherwise `false`.
 *
 * @example
 * ```typescript
 * // Inclusive on both ends (default)
 * const validateInclusive = validateRange(0, 10);
 * validateInclusive(0);   // true
 * validateInclusive(10);  // true
 *
 * // Exclusive on both ends
 * const validateExclusive = validateRange(0, 10, {
 *   minInclusive: false,
 *   maxInclusive: false
 * });
 * validateExclusive(0);   // false
 * validateExclusive(10);  // false
 * validateExclusive(5);   // true
 *
 * // Mixed inclusivity
 * const validateMixed = validateRange(0, 10, {
 *   minInclusive: false,
 *   maxInclusive: true
 * });
 * validateMixed(0);   // false
 * validateMixed(10);  // true
 * ```
 */
export const validateRange =
  (minValue: number, maxValue: number, options: RangeOptions = {}) =>
  (value: number): boolean => {
    const { minInclusive = true, maxInclusive = true } = options
    const minCheck = minInclusive ? value >= minValue : value > minValue
    const maxCheck = maxInclusive ? value <= maxValue : value < maxValue
    return minCheck && maxCheck
  }

interface RangeOptions {
  /** Whether the minimum value is inclusive (default: true) */
  minInclusive?: boolean
  /** Whether the maximum value is inclusive (default: true) */
  maxInclusive?: boolean
}
