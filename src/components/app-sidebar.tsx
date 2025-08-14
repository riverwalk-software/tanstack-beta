import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "@tanstack/react-router";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUserStore } from "@/hooks/useUserStore";
import { courseQueryOptions } from "@/utils/schools";
import { CourseSwitcher } from "./CourseSwitcher";
import { NavMain } from "./nav-main";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { VideoPlayer } from "./VideoPlayer";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { schoolSlug, courseSlug, chapterSlug, lectureSlug } = useParams({
    from: "/_authenticated/schools/$schoolSlug/$courseSlug/$chapterSlug/$lectureSlug/",
  });
  const {
    data: { chapters },
  } = useSuspenseQuery(courseQueryOptions(schoolSlug, courseSlug));
  const lectures = chapters.flatMap((chapter) => chapter.lectures);
  const currentLecture = lectures.find(
    (lecture) => lecture.slug === lectureSlug,
  )!;
  const currentIndex = lectures.indexOf(currentLecture);
  const prevLecture = currentIndex > 0 ? lectures[currentIndex - 1] : null;
  const prevChapter = chapters.find(
    (chapter) => chapter.id === prevLecture?.chapterId,
  );
  const nextLecture =
    currentIndex < lectures.length - 1 ? lectures[currentIndex + 1] : null;
  const nextChapter = chapters.find(
    (chapter) => chapter.id === nextLecture?.chapterId,
  );
  const {
    getProgress,
    completeLectureMt,
    resetLectureMt,
    resetCourseMt,
    resetSchoolMt,
  } = useUserStore();
  const progress = getProgress({
    _tag: "COURSE",
    schoolSlug,
    courseSlug,
  });
  const router = useRouter();
  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher />
          <CourseSwitcher />
        </SidebarHeader>
        <SidebarContent>
          <NavMain />
          {/* <NavProjects projects={data.projects} /> */}
        </SidebarContent>
        {/* <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter> */}
        <SidebarRail />
      </Sidebar>
      <div className="m-auto ml-25 flex w-full max-w-3xl flex-col items-center justify-center gap-4">
        <div className="flex w-full items-center gap-4">
          <div className="w-[60%]">
            <Progress value={progress} className="h-4 w-full" />
          </div>
          <span className="whitespace-nowrap text-sm">
            {Math.round(progress)}% Complete
          </span>
          <Button
            className="bg-gray-400 text-gray-800"
            disabled={resetLectureMt.isPending}
            onClick={() =>
              resetLectureMt.mutate({
                schoolSlug,
                courseSlug,
                chapterSlug,
                lectureSlug,
              })
            }
          >
            Reset Lecture
          </Button>
          <Button
            className="bg-gray-400 text-gray-800"
            disabled={resetCourseMt.isPending}
            onClick={() => resetCourseMt.mutate({ schoolSlug, courseSlug })}
          >
            Reset Course
          </Button>
          <Button
            className="bg-gray-400 text-gray-800"
            disabled={resetSchoolMt.isPending}
            onClick={() => resetSchoolMt.mutate({ schoolSlug })}
          >
            Reset All
          </Button>
        </div>
        <div className="flex gap-4">
          {prevLecture && prevChapter && (
            <Button
              className="bg-gray-400"
              disabled={false}
              onClick={() => {
                router.navigate({
                  to: "/schools/$schoolSlug/$courseSlug/$chapterSlug/$lectureSlug",
                  params: {
                    schoolSlug,
                    courseSlug,
                    chapterSlug: prevChapter.slug,
                    lectureSlug: prevLecture.slug,
                  },
                });
              }}
            >
              Previous Lecture
            </Button>
          )}
          {
            <Button
              className="bg-blue-400"
              disabled={completeLectureMt.isPending}
              onClick={async () => {
                completeLectureMt.mutate({
                  schoolSlug,
                  courseSlug,
                  chapterSlug,
                  lectureSlug,
                });
                if (nextLecture === null || nextChapter === undefined) return;
                await router.navigate({
                  to: "/schools/$schoolSlug/$courseSlug/$chapterSlug/$lectureSlug",
                  params: {
                    schoolSlug,
                    courseSlug,
                    chapterSlug: nextChapter.slug,
                    lectureSlug: nextLecture.slug,
                  },
                });
              }}
            >
              {nextLecture ? "Complete and Continue" : "Complete"}
            </Button>
          }
        </div>
        <div className="relative aspect-video w-full">
          {currentLecture.video && (
            <VideoPlayer videoId={currentLecture.video.storageId}></VideoPlayer>
          )}
        </div>
        {/* <Example /> */}
        {currentLecture.attachments.map((attachment) => (
          <a
            key={attachment.id}
            href={`/api/attachments/${encodeURIComponent(attachment.storageId)}`}
            download
          >
            Download:{" "}
            <span className="underline">
              {attachment.storageId.split("/").pop()}
            </span>
          </a>
        ))}
        {/* <ClientPdf file="/docs/backus.pdf" width={800} /> */}
      </div>
    </>
  );
}
