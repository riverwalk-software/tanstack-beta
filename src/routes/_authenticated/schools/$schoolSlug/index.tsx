import { useCourses } from "@schools"
import { createFileRoute } from "@tanstack/react-router"
import { CourseCard } from "@/components/CourseCard"

export const Route = createFileRoute("/_authenticated/schools/$schoolSlug/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { schoolSlug } = Route.useParams()
  const { courses } = useCourses({ schoolSlug })
  return (
    <div>
      <h1>Courses</h1>
      <ul>
        {courses.map(({ slug: courseSlug, title, description, chapter }) => {
          return (
            <li key={courseSlug}>
              <CourseCard
                title={title}
                description={description}
                schoolSlug={schoolSlug}
                courseSlug={courseSlug}
                chapterSlug={chapter.slug}
                lectureSlug={chapter.lecture.slug}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
