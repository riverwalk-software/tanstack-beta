/**
 * @vitest-environment node
 */
import { BoundedPercentageSchema } from "@prelude"
import * as fc from "fast-check"
import { describe, expect, it } from "vitest"
import { ZodFastCheck } from "zod-fast-check"
import { calculateProgress } from "../../src/logic/userStoreLogic"
import { ChapterAndLectureSchema } from "../../src/types/UserStore"

const ChapterAndLectureArbitrary = ZodFastCheck().inputOf(
  ChapterAndLectureSchema,
)
const ChaptersAndLecturesArbitrary = fc.array(ChapterAndLectureArbitrary)

describe("calculateProgress", () => {
  it("ChapterAndLecture[] => BoundedPercentage", () => {
    fc.assert(
      fc.property(ChaptersAndLecturesArbitrary, chaptersAndLectures => {
        const result = calculateProgress(chaptersAndLectures)
        BoundedPercentageSchema.parse(result)
      }),
    )
  })

  it("returns proper percentage scale (0-100)", () => {
    fc.assert(
      fc.property(ChapterAndLectureArbitrary, chapterAndLecture => {
        const result = calculateProgress([chapterAndLecture])
        expect(result).toBeOneOf([0, 100])
      }),
    )
  })
})
