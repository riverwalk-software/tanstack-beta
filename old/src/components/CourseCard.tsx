import { Link } from "@tanstack/react-router"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CourseCard({
  title,
  description,
  schoolSlug,
  courseSlug,
  chapterSlug,
  lectureSlug,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Link
            to="/schools/$schoolSlug/$courseSlug/$chapterSlug/$lectureSlug"
            params={{ schoolSlug, courseSlug, chapterSlug, lectureSlug }}
          >
            View Course
          </Link>
        </CardAction>
      </CardHeader>
      {/* <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  )
}

interface Props {
  title: string
  description: string
  schoolSlug: string
  courseSlug: string
  chapterSlug: string
  lectureSlug: string
}
