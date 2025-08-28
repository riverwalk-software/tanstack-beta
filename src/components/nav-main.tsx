import { Link } from "@tanstack/react-router"
import { ChevronRight, SquareTerminal } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useChapterAndLectureCursor } from "@/hooks/useChapterAndLectureCursor"
import { useOpenChapters } from "@/hooks/useOpenChapters"
import { useUserStore } from "@/hooks/useUserStore"
import type { UserStoreIds } from "../lib/userStore"

export function NavMain({ slugs }: { slugs: UserStoreIds }) {
  const { current, chapters } = useChapterAndLectureCursor({ slugs })
  const openChapters = useOpenChapters({ slugs: current.slugs })
  const { getIsComplete } = useUserStore()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Chapters</SidebarGroupLabel>
      <SidebarMenu>
        {chapters.map(chapter => (
          <Collapsible
            key={chapter.id}
            asChild={true}
            open={openChapters.contains(chapter.slug)}
            onOpenChange={isOpen =>
              isOpen
                ? openChapters.open(chapter.slug)
                : openChapters.close(chapter.slug)
            }
            className="group/collapsible text-sky-700 dark:text-sky-100"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild={true}>
                <SidebarMenuButton tooltip={chapter.title}>
                  <SquareTerminal />
                  <span>{chapter.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {chapter.lectures.map(lecture => {
                    const isComplete = getIsComplete({
                      ...slugs,
                      chapterSlug: chapter.slug,
                      lectureSlug: lecture.slug,
                    })
                    return (
                      <SidebarMenuSubItem key={lecture.id}>
                        <SidebarMenuSubButton
                          asChild={true}
                          className={
                            isComplete
                              ? "text-emerald-700 dark:text-emerald-100"
                              : ""
                          }
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
                              {isComplete ? "☆" : ""}
                            </span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
