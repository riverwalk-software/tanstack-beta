import { ChevronsUpDown, GalleryVerticalEnd, Square } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useCourseCursor } from "@/hooks/useCourseCursor"
import { useNavigation } from "@/hooks/useNavigation"
import type { UserStoreIds } from "../lib/userStore"

export function CourseSwitcher({ slugs }: { slugs: UserStoreIds }) {
  const { isMobile } = useSidebar()
  const { current, courses } = useCourseCursor({ slugs })
  const { isNavigating, navigate, toggleIsNavigating } = useNavigation()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild={true}>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Square className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {current.course.title}
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
              const firstChapter = course.chapters[0]
              const firstLecture = firstChapter.lectures[0]
              return (
                <DropdownMenuItem
                  key={course.title}
                  disabled={isNavigating}
                  onClick={async () => {
                    toggleIsNavigating()
                    try {
                      await navigate({
                        to: "/schools/$schoolSlug/$courseSlug/$chapterSlug/$lectureSlug",
                        params: {
                          ...current.slugs,
                          courseSlug: course.slug,
                          chapterSlug: firstChapter.slug,
                          lectureSlug: firstLecture.slug,
                        },
                      })
                    } finally {
                      toggleIsNavigating()
                    }
                  }}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <GalleryVerticalEnd className="size-3.5 shrink-0" />
                  </div>
                  {course.title}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              )
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
  )
}
