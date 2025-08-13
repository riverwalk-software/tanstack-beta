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
import { courseQueryOptions } from "@/utils/schools";

export function NavMain() {
  const { schoolSlug, courseSlug, lectureSlug } = useParams({
    from: "/_authenticated/schools/$schoolSlug/$courseSlug/$lectureSlug/",
  });
  const {
    data: { chapters },
  } = useSuspenseQuery(courseQueryOptions(schoolSlug, courseSlug));
  const activeChapter = chapters.find((chapter) =>
    chapter.lectures.some((lecture) => lecture.slug === lectureSlug),
  )!;
  const [openChapters, setOpenChapters] = useState<Set<string>>(
    new Set([activeChapter.title]),
  );
  useEffect(() => {
    setOpenChapters(new Set([activeChapter.title]));
  }, [activeChapter.title]);
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Chapters</SidebarGroupLabel>
      <SidebarMenu>
        {chapters.map(({ title, lectures }) => (
          <Collapsible
            key={title}
            asChild
            open={openChapters.has(title)}
            onOpenChange={(isOpen) =>
              setOpenChapters((prev) =>
                isOpen
                  ? new Set([...prev, title])
                  : new Set([...prev].filter((t) => t !== title)),
              )
            }
            className="group/collapsible text-sky-100"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={title}>
                  <SquareTerminal />
                  <span>{title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {lectures.map((lecture) => (
                    <SidebarMenuSubItem key={lecture.title}>
                      <SidebarMenuSubButton asChild>
                        <Link
                          activeProps={{
                            className: "font-bold underline",
                          }}
                          activeOptions={{ exact: true }}
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
