import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ChevronRight, SquareTerminal } from "lucide-react";
import { useEffect, useState } from "react";
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
import { useUserStore } from "@/hooks/useUserStore";
import { courseQueryOptions } from "@/utils/schools";

export function NavMain() {
  const { schoolSlug, courseSlug, chapterSlug, lectureSlug } = useParams({
    from: "/_authenticated/schools/$schoolSlug/$courseSlug/$chapterSlug/$lectureSlug/",
  });
  const {
    data: { chapters },
  } = useSuspenseQuery(courseQueryOptions(schoolSlug, courseSlug));
  // const activeChapter = chapters.find((chapter) =>
  //   chapter.lectures.some((lecture) => lecture.slug === lectureSlug),
  // )!;
  const activeChapter = chapters.find(
    (chapter) => chapter.slug === chapterSlug,
  )!;
  const [openChapters, setOpenChapters] = useState<Set<number>>(
    new Set([activeChapter.id]),
  );
  useEffect(
    () => setOpenChapters(new Set([activeChapter.id])),
    [activeChapter.id],
  );
  const { userStore } = useUserStore();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Chapters</SidebarGroupLabel>
      <SidebarMenu>
        {chapters.map((chapter) => (
          <Collapsible
            key={chapter.id}
            asChild
            open={openChapters.has(chapter.id)}
            onOpenChange={(isOpen) =>
              setOpenChapters((prev) =>
                isOpen
                  ? new Set([...prev, chapter.id])
                  : new Set([...prev].filter((id) => id !== chapter.id)),
              )
            }
            className="group/collapsible text-sky-100"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={chapter.title}>
                  <SquareTerminal />
                  <span>{chapter.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {chapter.lectures.map((lecture) => {
                    const isCompleted = userStore.schools
                      .find((school) => school.slug === schoolSlug)!
                      .courses.find((course) => course.slug === courseSlug)!
                      .chapters.find((c) => c.slug === chapter.slug)!
                      .lectures.find((l) => l.slug === lecture.slug)!.completed;
                    return (
                      <SidebarMenuSubItem key={lecture.id}>
                        <SidebarMenuSubButton
                          asChild
                          className={isCompleted ? "text-emerald-100" : ""}
                        >
                          <Link
                            activeProps={{
                              className: "font-bold underline",
                            }}
                            activeOptions={{ exact: true }}
                            to={
                              "/schools/$schoolSlug/$courseSlug/$chapterSlug/$lectureSlug"
                            }
                            params={{
                              schoolSlug,
                              courseSlug,
                              chapterSlug: chapter.slug,
                              lectureSlug: lecture.slug,
                            }}
                          >
                            <span>
                              {lecture.title}
                              {isCompleted ? "☆" : ""}
                            </span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
