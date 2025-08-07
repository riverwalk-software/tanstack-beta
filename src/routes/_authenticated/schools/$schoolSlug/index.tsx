import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CourseCard } from "@/components/CourseCard";
import { coursesQueryOptions } from "@/utils/schools";

export const Route = createFileRoute("/_authenticated/schools/$schoolSlug/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { schoolSlug } = Route.useParams();
  const { data: courses } = useSuspenseQuery(coursesQueryOptions(schoolSlug));
  return (
    <div>
      <h1>Courses</h1>
      <ul>
        {courses.map(({ slug: courseSlug, title, description, chapters }) => (
          <li key={courseSlug}>
            <CourseCard
              title={title}
              description={description}
              schoolSlug={schoolSlug}
              courseSlug={courseSlug}
              lectureSlug={chapters[0].lectures[0].slug}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
