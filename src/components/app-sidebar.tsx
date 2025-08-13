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
  const { schoolSlug, courseSlug, lectureSlug } = useParams({
    from: "/_authenticated/schools/$schoolSlug/$courseSlug/$lectureSlug/",
  });
  const {
    data: { chapters },
  } = useSuspenseQuery(courseQueryOptions(schoolSlug, courseSlug));
  const lectures = chapters.flatMap((chapter) => chapter.lectures);
  const lecture = lectures.find((lecture) => lecture.slug === lectureSlug)!;
  const currentIndex = lectures.indexOf(lecture);
  const prevLecture = currentIndex > 0 ? lectures[currentIndex - 1] : null;
  const nextLecture =
    currentIndex < lectures.length - 1 ? lectures[currentIndex + 1] : null;
  const { getProgress, completeLectureMt, resetLectureMt, resetCourseMt } =
    useUserStore();
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
        <div className="relative aspect-video w-full">
          {lecture.video && (
            <VideoPlayer videoId={lecture.video.videoId}></VideoPlayer>
          )}
        </div>
        <div className="flex gap-4">
          {prevLecture && (
            <Button
              className="bg-gray-400"
              disabled={false}
              onClick={() => {
                router.navigate({
                  to: "/schools/$schoolSlug/$courseSlug/$lectureSlug",
                  params: {
                    schoolSlug,
                    courseSlug,
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
                  lectureSlug: lecture.slug,
                });
                if (nextLecture === null) return;
                await router.navigate({
                  to: "/schools/$schoolSlug/$courseSlug/$lectureSlug",
                  params: {
                    schoolSlug,
                    courseSlug,
                    lectureSlug: nextLecture.slug,
                  },
                });
              }}
            >
              {nextLecture ? "Complete and Continue" : "Complete"}
            </Button>
          }
        </div>
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
              resetLectureMt.mutate({ schoolSlug, courseSlug, lectureSlug })
            }
          >
            Reset Lecture
          </Button>
          <Button
            className="bg-gray-400 text-gray-800"
            disabled={resetCourseMt.isPending}
            onClick={() => resetCourseMt.mutate({ schoolSlug, courseSlug })}
          >
            Reset All
          </Button>
        </div>
      </div>
    </>
  );
}
