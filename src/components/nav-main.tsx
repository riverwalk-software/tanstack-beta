import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
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
import { TEST_USER } from "@/utils/constants";
import { getCloudflareBindings } from "@/utils/getCloudflareBindings";
import { courseQueryOptions } from "@/utils/schools";
import type { UserStore } from "@/utils/userStore";

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
    const newActiveChapter = chapters.find((chapter) =>
      chapter.lectures.some((lecture) => lecture.slug === lectureSlug),
    )!;
    setOpenChapters(new Set([newActiveChapter.title]));
  }, [lectureSlug, chapters]);
  const handleChapterToggle = (chapterTitle: string, isOpen: boolean) => {
    setOpenChapters((prev) => {
      const newSet = new Set(prev);
      if (isOpen) {
        newSet.add(chapterTitle);
      } else {
        newSet.delete(chapterTitle);
      }
      return newSet;
    });
  };
  const { data: progressLectures } = useSuspenseQuery({
    queryKey: ["progressLectures", schoolSlug, courseSlug],
    queryFn: async () =>
      getProgressLectures({
        data: { schoolSlug, courseSlug },
      }),
  });
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Chapters</SidebarGroupLabel>
      <SidebarMenu>
        {chapters.map(({ title, lectures }) => (
          <Collapsible
            key={title}
            asChild
            open={openChapters.has(title)}
            onOpenChange={(isOpen) => handleChapterToggle(title, isOpen)}
            className="group/collapsible text-sky-100"
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
                    <SidebarMenuSubItem key={lecture.title}>
                      <SidebarMenuSubButton
                        asChild
                        // className={
                        //   progressLectures.find(
                        //     (progressLecture) =>
                        //       progressLecture.lectureSlug === lecture.slug,
                        //   )!.completed
                        //     ? "text-green-300"
                        //     : ""
                        // }
                      >
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

const getProgressLectures = createServerFn()
  .validator((data: { schoolSlug: string; courseSlug: string }) => data)
  .handler(async ({ data: { schoolSlug, courseSlug } }) => {
    const { USER_STORE } = getCloudflareBindings();
    const store = await USER_STORE.get<UserStore>(TEST_USER.email, {
      type: "json",
    });
    if (!store) return [];
    const course = store.schools
      .find((school) => school.slug === schoolSlug)
      ?.courses.find((course) => course.slug === courseSlug);
    if (!course) return [];
    const { lectures } = course;
    return lectures;
  });
