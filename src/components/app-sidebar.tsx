import Confetti from "react-confetti";
import ExampleMdx from "@/components/prose/ExampleMdx.mdx";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useCourseCursor } from "@/hooks/useCourseCursor";
import { useNavigation } from "@/hooks/useNavigation";
import { useUserStore } from "@/hooks/useUserStore";
import type { UserStoreSlugs } from "@/utils/userStore";
import { CourseSwitcher } from "./CourseSwitcher";
import { NavMain } from "./nav-main";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ResetProgressButton } from "./userStore/ResetProgressButton";
import { VideoPlayer } from "./VideoPlayer";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { current } = useCourseCursor();
  const { getProgress } = useUserStore();
  const { progress: courseProgress, isComplete: isCourseComplete } =
    getProgress({
      ...current.slugs,
      _tag: "COURSE",
    });
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
            <Progress value={courseProgress} className="h-4 w-full" />
          </div>
          <span className="whitespace-nowrap text-sm">
            {Math.round(courseProgress)}% Complete
          </span>
          {isCourseComplete && (
            <Confetti
            // width={width}
            // height={height}
            />
          )}
          <ResetButtons {...current.slugs} />
        </div>
        <LectureNavigationButtons />
        <div className="relative aspect-video w-full">
          {current.lecture.video && (
            <VideoPlayer
              videoId={current.lecture.video.storageId}
            ></VideoPlayer>
          )}
        </div>
        {current.lecture.attachments.map((attachment) => (
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
        <ExampleMdx />
      </div>
    </>
  );
}

function ResetButtons(slugs: UserStoreSlugs) {
  return (
    <div className="flex gap-4">
      <ResetProgressButton _tag="LECTURE" {...slugs} />
    </div>
  );
}

function LectureNavigationButtons() {
  return (
    <div className="flex gap-4">
      <PreviousLectureButton />
      <NextLectureButton />
    </div>
  );
}

function PreviousLectureButton() {
  const { previous } = useCourseCursor();
  const { isNavigating, navigate, toggleIsNavigating } = useNavigation();
  return (
    previous && (
      <Button
        className="bg-gray-400"
        disabled={isNavigating}
        onClick={async () => {
          toggleIsNavigating();
          try {
            await navigate({
              to: "/schools/$schoolSlug/$courseSlug/$chapterSlug/$lectureSlug",
              params: previous.slugs,
            });
          } finally {
            await new Promise((resolve) => setTimeout(resolve, 500));
            toggleIsNavigating();
          }
        }}
      >
        {isNavigating ? "Loading..." : "Previous Lecture"}
      </Button>
    )
  );
}

function NextLectureButton() {
  const { next } = useCourseCursor();
  const { isNavigating, navigate, toggleIsNavigating } = useNavigation();
  return (
    next && (
      <Button
        className="bg-sky-500"
        disabled={isNavigating}
        onClick={async () => {
          toggleIsNavigating();
          try {
            await navigate({
              to: "/schools/$schoolSlug/$courseSlug/$chapterSlug/$lectureSlug",
              params: next.slugs,
            });
          } finally {
            await new Promise((resolve) => setTimeout(resolve, 500));
            toggleIsNavigating();
          }
        }}
      >
        {isNavigating ? "Loading..." : "Next Lecture"}
      </Button>
    )
  );
}
