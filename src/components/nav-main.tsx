import { Link } from "@tanstack/react-router";
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
import { useChapterAndLectureCursor } from "@/hooks/useChapterAndLectureCursor";
import { useOpenChapters } from "@/hooks/useOpenChapters";

export function NavMain() {
  const { current, chapters } = useChapterAndLectureCursor();
  const openChapters = useOpenChapters();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Chapters</SidebarGroupLabel>
      <SidebarMenu>
        {chapters.map((chapter) => (
          <Collapsible
            key={chapter.id}
            asChild
            open={openChapters.contains(chapter.slug)}
            onOpenChange={(isOpen) =>
              isOpen
                ? openChapters.open(chapter.slug)
                : openChapters.close(chapter.slug)
            }
            className="group/collapsible text-sky-700 dark:text-sky-100"
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
                    // const isCompleted = userStore.schools
                    //   .find((school) => school.slug === schoolSlug)!
                    //   .courses.find((course) => course.slug === courseSlug)!
                    //   .chapters.find((c) => c.slug === chapter.slug)!
                    //   .lectures.find((l) => l.slug === lecture.slug)!.completed;
                    return (
                      <SidebarMenuSubItem key={lecture.id}>
                        <SidebarMenuSubButton
                          asChild
                          // className={
                          //   isCompleted
                          //     ? "text-emerald-700 dark:text-emerald-100"
                          //     : ""
                          // }
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
                              ...current.slugs,
                              chapterSlug: chapter.slug,
                              lectureSlug: lecture.slug,
                            }}
                          >
                            <span>
                              {lecture.title}
                              {/* {isCompleted ? "☆" : ""} */}
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
