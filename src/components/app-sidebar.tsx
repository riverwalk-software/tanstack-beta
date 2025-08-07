import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import type * as React from "react";
import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { lectureQueryOptions } from "@/utils/schools";
import { CourseSwitcher } from "./CourseSwitcher";
import { VideoPlayer } from "./VideoPlayer";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { schoolSlug, courseSlug, lectureSlug } = useParams({
    from: "/_authenticated/schools/$schoolSlug/$courseSlug/$lectureSlug/",
  });
  const { data: lecture } = useSuspenseQuery(
    lectureQueryOptions(schoolSlug, courseSlug, lectureSlug),
  );
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
      <div className="relative m-auto ml-25 flex aspect-video w-full max-w-3xl items-center justify-center">
        <VideoPlayer videoId={lecture.video!.videoId}></VideoPlayer>
      </div>{" "}
    </>
  );
}
