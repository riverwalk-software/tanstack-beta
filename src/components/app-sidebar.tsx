import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type * as React from "react";
import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import { Progress } from "@/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { ProgressStore } from "@/db/main/seed";
import { getCloudflareBindings } from "@/utils/getCloudflareBindings";
import { courseQueryOptions } from "@/utils/schools";
import { CourseSwitcher } from "./CourseSwitcher";
import { Button } from "./ui/button";
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
  const router = useRouter();
  const { data: progress } = useSuspenseQuery({
    queryKey: ["progress", schoolSlug, courseSlug],
    queryFn: async () =>
      getProgressFn({
        data: { schoolSlug, courseSlug },
      }),
  });
  const queryClient = useQueryClient();
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
              disabled={false}
              onClick={async () => {
                await updateProgressFn({
                  data: { schoolSlug, courseSlug, lectureSlug: lecture.slug },
                });
                await queryClient.invalidateQueries({
                  queryKey: ["progress", schoolSlug, courseSlug],
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
            disabled={false}
            onClick={async () => {
              await resetLectureFn({
                data: { schoolSlug, courseSlug, lectureSlug },
              });
              queryClient.invalidateQueries({
                queryKey: ["progress", schoolSlug, courseSlug],
              });
            }}
          >
            Reset Lecture
          </Button>
          <Button
            className="bg-gray-400 text-gray-800"
            disabled={false}
            onClick={async () => {
              await resetProgressFn();
              queryClient.invalidateQueries({
                queryKey: ["progress", schoolSlug, courseSlug],
              });
            }}
          >
            Reset All
          </Button>
        </div>
      </div>
    </>
  );
}

const getProgressFn = createServerFn()
  .validator((data: { schoolSlug: string; courseSlug: string }) => data)
  .handler(async ({ data: { schoolSlug, courseSlug } }) => {
    const { PROGRESS_STORE } = getCloudflareBindings();
    const store = await PROGRESS_STORE.get<ProgressStore>("TestUser", {
      type: "json",
    });
    if (!store) return 0;
    const lectures = store.schools
      .find((school) => school.schoolSlug === schoolSlug)!
      .courses.find((course) => course.courseSlug === courseSlug)!.lectures;
    const { length: totalLectures } = lectures;
    const completedLectures = lectures.reduce(
      (acc, lecture) => acc + (lecture.completed ? 1 : 0),
      0,
    );
    const progress = (completedLectures / totalLectures) * 100;
    return progress;
  });

const updateProgressFn = createServerFn({ method: "POST" })
  .validator(
    (data: { schoolSlug: string; courseSlug: string; lectureSlug: string }) =>
      data,
  )
  .handler(async ({ data: { schoolSlug, courseSlug, lectureSlug } }) => {
    const { PROGRESS_STORE } = getCloudflareBindings();
    const store = await PROGRESS_STORE.get<ProgressStore>("TestUser", {
      type: "json",
    });
    if (!store) return;
    await PROGRESS_STORE.put(
      "TestUser",
      JSON.stringify({
        ...store,
        schools: [
          ...store.schools.filter((school) => school.schoolSlug !== schoolSlug),
          {
            schoolSlug,
            courses: [
              ...store.schools
                .find((school) => school.schoolSlug === schoolSlug)!
                .courses.filter((course) => course.courseSlug !== courseSlug),
              {
                courseSlug,
                lectures: [
                  ...store.schools
                    .find((school) => school.schoolSlug === schoolSlug)!
                    .courses.find((course) => course.courseSlug === courseSlug)!
                    .lectures.filter(
                      (lecture) => lecture.lectureSlug !== lectureSlug,
                    ),
                  { lectureSlug, completed: true },
                ],
              },
            ],
          },
        ],
      } as ProgressStore),
    );
  });

const resetProgressFn = createServerFn({ method: "POST" }).handler(async () => {
  const { PROGRESS_STORE } = getCloudflareBindings();
  const store = await PROGRESS_STORE.get<ProgressStore>("TestUser", {
    type: "json",
  });
  if (!store) return;
  await PROGRESS_STORE.put(
    "TestUser",
    JSON.stringify({
      ...store,
      schools: store.schools.map((school) => ({
        ...school,
        courses: school.courses.map((course) => ({
          ...course,
          lectures: course.lectures.map((lecture) => ({
            ...lecture,
            completed: false,
          })),
        })),
      })),
    } as ProgressStore),
  );
});

const resetLectureFn = createServerFn({ method: "POST" })
  .validator(
    (data: { schoolSlug: string; courseSlug: string; lectureSlug: string }) =>
      data,
  )
  .handler(async ({ data: { lectureSlug } }) => {
    const { PROGRESS_STORE } = getCloudflareBindings();
    const store = await PROGRESS_STORE.get<ProgressStore>("TestUser", {
      type: "json",
    });
    if (!store) return;
    await PROGRESS_STORE.put(
      "TestUser",
      JSON.stringify({
        ...store,
        schools: store.schools.map((school) => ({
          ...school,
          courses: school.courses.map((course) => ({
            ...course,
            lectures: course.lectures.map((lecture) => ({
              ...lecture,
              completed:
                lecture.lectureSlug === lectureSlug ? false : lecture.completed,
            })),
          })),
        })),
      } as ProgressStore),
    );
  });
