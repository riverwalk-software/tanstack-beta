import { match } from "ts-pattern";
import { useUserStore } from "@/hooks/useUserStore";
import type { SetUserStoreParams } from "@/utils/userStore";
import { Button } from "../ui/button";

export function ResetProgressButton({
  params,
}: {
  params: SetUserStoreParams;
}) {
  const { resetAllMt, resetSchoolMt, resetCourseMt, resetLectureMt } =
    useUserStore();

  const handleClick = () => {
    match(params)
      .with({ _tag: "ALL" }, () => resetAllMt.mutate())
      .with({ _tag: "SCHOOL" }, ({ schoolSlug }) =>
        resetSchoolMt.mutate({
          schoolSlug: schoolSlug,
        }),
      )
      .with({ _tag: "COURSE" }, ({ schoolSlug, courseSlug }) => {
        resetCourseMt.mutate({
          schoolSlug: schoolSlug,
          courseSlug: courseSlug,
        });
      })
      .with(
        { _tag: "LECTURE" },
        ({ schoolSlug, courseSlug, chapterSlug, lectureSlug }) => {
          resetLectureMt.mutate({
            schoolSlug: schoolSlug,
            courseSlug: courseSlug,
            chapterSlug: chapterSlug,
            lectureSlug: lectureSlug,
          });
        },
      )
      .exhaustive();
  };

  const mutation = match(params._tag)
    .with("ALL", () => resetAllMt)
    .with("SCHOOL", () => resetSchoolMt)
    .with("COURSE", () => resetCourseMt)
    .with("LECTURE", () => resetLectureMt)
    .exhaustive();

  return (
    <Button
      disabled={mutation.isPending}
      className="bg-gray-400"
      onClick={handleClick}
    >
      {`Reset ${params._tag}`}
    </Button>
  );
}
