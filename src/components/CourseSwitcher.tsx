import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "@tanstack/react-router";
import { ChevronsUpDown, GalleryVerticalEnd, Square } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { coursesQueryOptions } from "@/utils/schools";

export function CourseSwitcher() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const slugs = useParams({
    from: "/_authenticated/schools/$schoolSlug/$courseSlug/$chapterSlug/$lectureSlug/",
  });
  const { data: courses } = useSuspenseQuery(coursesQueryOptions(slugs));
  const currentCourse =
    courses.find((course) => course.slug === slugs.courseSlug) || courses[0];
  const [activeCourse, setActiveCourse] = React.useState(currentCourse);

  useEffect(() => {
    const urlCourse = courses.find(
      (course) => course.slug === slugs.courseSlug,
    );
    if (urlCourse) {
      setActiveCourse(urlCourse);
    }
  }, [courses, slugs.courseSlug]);

  if (!activeCourse) {
    return null;
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Square className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeCourse.title}
                </span>
                {/* <span className="truncate text-xs">{activeSchool.plan}</span> */}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Courses
            </DropdownMenuLabel>
            {courses.map((course, index) => {
              const firstChapter = course.chapters[0];
              const firstLecture = firstChapter.lectures[0];
              return (
                <DropdownMenuItem
                  key={course.title}
                  // onClick={() => setActiveCourse(course)}
                  onClick={() => {
                    setActiveCourse(course);
                    router.navigate({
                      to: "/schools/$schoolSlug/$courseSlug/$chapterSlug/$lectureSlug",
                      params: {
                        ...slugs,
                        courseSlug: course.slug,
                        chapterSlug: firstChapter.slug,
                        lectureSlug: firstLecture.slug,
                      },
                    });
                  }}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <GalleryVerticalEnd className="size-3.5 shrink-0" />
                  </div>
                  {course.title}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              );
            })}
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add course
              </div>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
