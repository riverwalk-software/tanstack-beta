"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ChevronRight, SquareTerminal } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { chaptersAndLecturesQueryOptions } from "@/utils/schools";

export function NavMain() {
  const { schoolSlug, courseSlug, lectureSlug } = useParams({
    from: "/_authenticated/schools/$schoolSlug/$courseSlug/$lectureSlug/",
  });
  const { data: chaptersAndLectures } = useSuspenseQuery(
    chaptersAndLecturesQueryOptions(schoolSlug, courseSlug),
  );
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Chapters</SidebarGroupLabel>
      <SidebarMenu>
        {chaptersAndLectures.map(({ title, lectures }) => (
          <Collapsible
            key={title}
            asChild
            defaultOpen={lectures.some(
              (lecture) => lecture.slug === lectureSlug,
            )}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={title}>
                  {<SquareTerminal />}
                  <span>{title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {lectures.map((lecture) => (
                    <SidebarMenuSubItem
                      key={lecture.title}
                      className={
                        lecture.slug === lectureSlug ? "underline" : undefined
                      }
                    >
                      <SidebarMenuSubButton asChild>
                        <Link
                          to={"/schools/$schoolSlug/$courseSlug/$lectureSlug"}
                          params={{
                            schoolSlug,
                            courseSlug,
                            lectureSlug: lecture.slug,
                          }}
                        >
                          <span>{lecture.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
