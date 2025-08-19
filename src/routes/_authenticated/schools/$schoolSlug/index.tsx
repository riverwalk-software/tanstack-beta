import { createFileRoute } from "@tanstack/react-router";
import { CourseCard } from "@/components/CourseCard";
import { useCourses } from "@/utils/schools";

export const Route = createFileRoute("/_authenticated/schools/$schoolSlug/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { schoolSlug } = Route.useParams();
  const { courses } = useCourses({ schoolSlug });
  return (
    <div>
      <h1>Courses</h1>
      <ul>
        {courses.map(({ slug: courseSlug, title, description, chapters }) => {
          const firstChapter = chapters[0];
          const firstLecture = firstChapter.lectures[0];
          return (
            <li key={courseSlug}>
              <CourseCard
                title={title}
                description={description}
                schoolSlug={schoolSlug}
                courseSlug={courseSlug}
                chapterSlug={firstChapter.slug}
                lectureSlug={firstLecture.slug}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
