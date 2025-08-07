import { Link } from "@tanstack/react-router";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CourseCard({
  title,
  description,
  schoolSlug,
  courseSlug,
  lectureSlug,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Link
            to="/schools/$schoolSlug/$courseSlug/$lectureSlug"
            params={{ schoolSlug, courseSlug, lectureSlug }}
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
  );
}

interface Props {
  title: string;
  description: string;
  schoolSlug: string;
  courseSlug: string;
  lectureSlug: string;
}
