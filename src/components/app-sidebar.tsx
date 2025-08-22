import { useNavigate } from "@tanstack/react-router";
import Confetti from "react-confetti";
import { match, P } from "ts-pattern";
import ExampleMdx from "@/components/prose/ExampleMdx.mdx";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useChapterAndLectureCursor } from "@/hooks/useChapterAndLectureCursor";
import { useNavigation } from "@/hooks/useNavigation";
import { useUserStore } from "@/hooks/useUserStore";
import type { UserStoreSlugs } from "@/lib/userStore";
import { CourseSwitcher } from "./CourseSwitcher";
import { NavMain } from "./nav-main";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ResetProgressButton } from "./userStore/ResetProgressButton";
import { VideoPlayer } from "./VideoPlayer";

export function AppSidebar({
  slugs,
  ...props
}: React.ComponentProps<typeof Sidebar> & { slugs: UserStoreSlugs }) {
  const { current } = useChapterAndLectureCursor({ slugs });
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
          <CourseSwitcher slugs={current.slugs} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain slugs={current.slugs} />
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
        <LectureNavigationButtons slugs={current.slugs} />
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

function LectureNavigationButtons({ slugs }: { slugs: UserStoreSlugs }) {
  return (
    <div className="flex gap-4">
      <PreviousLectureButton slugs={slugs} />
      <NextLectureButton slugs={slugs} />
    </div>
  );
}

function PreviousLectureButton({ slugs }: { slugs: UserStoreSlugs }) {
  const { previous } = useChapterAndLectureCursor({ slugs });
  const { isNavigating, navigate, toggleIsNavigating } = useNavigation();
  return (
    previous && (
      <Button
        className="bg-gray-400"
        disabled={isNavigating}
        onClick={async () => {
          toggleIsNavigating();
          await navigate({
            to: "/schools/$schoolSlug/$courseSlug/$chapterSlug/$lectureSlug",
            params: previous.slugs,
          });
          toggleIsNavigating();
        }}
      >
        {isNavigating ? "Loading..." : "Previous Lecture"}
      </Button>
    )
  );
}

function NextLectureButton({ slugs }: { slugs: UserStoreSlugs }) {
  const { next } = useChapterAndLectureCursor({ slugs });
  const { setProgressMt, getIsComplete } = useUserStore();
  const navigate = useNavigate();
  const isComplete = getIsComplete(slugs);

  if (next === undefined && isComplete) return null;

  return (
    <Button
      className={isComplete ? "bg-gray-400" : "bg-sky-500"}
      disabled={setProgressMt.isPending}
      onClick={async () =>
        setProgressMt.mutate(
          {
            _tag: "LECTURE",
            ...slugs,
            completed: true,
          },
          {
            onSuccess: async () => {
              if (next === undefined) return;
              await navigate({
                to: "/schools/$schoolSlug/$courseSlug/$chapterSlug/$lectureSlug",
                params: next.slugs,
              });
            },
          },
        )
      }
    >
      {match([setProgressMt.isPending, isComplete, next])
        .with([true, P._, P._], () => "Loading")
        .with([P._, true, P._], () => "Next Lecture")
        .with([P._, P._, P.nullish], () => "Complete")
        .otherwise(() => "Complete And Continue")}
    </Button>
  );
}
