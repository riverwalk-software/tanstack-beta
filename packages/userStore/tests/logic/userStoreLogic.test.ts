import { BoundedPercentageSchema } from "@prelude";
import * as fc from "fast-check";
import { describe, expect, it } from "vitest";
import { calculateProgress } from "../../src/logic/userStoreLogic";

const chapterAndLectureArbitrary = fc.record({
  chapter: fc.record({
    id: fc.nat(),
  }),
  lecture: fc.record({
    id: fc.nat(),
  }),
  isComplete: fc.option(fc.boolean(), { nil: undefined }),
});

const chaptersAndLecturesArbitrary = fc.array(chapterAndLectureArbitrary);

describe("calculateProgress", () => {
  it("Output is BoundedPercentage", () => {
    fc.assert(
      fc.property(chaptersAndLecturesArbitrary, (chaptersAndLectures) => {
        const result = calculateProgress(chaptersAndLectures);
        const x = BoundedPercentageSchema.safeParse(result);
        expect(x.success).toBe(true);
      }),
    );
  });
});
