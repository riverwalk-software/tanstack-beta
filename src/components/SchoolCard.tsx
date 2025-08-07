import { Link } from "@tanstack/react-router";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SchoolCard({ name, description, slug }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Link to="/schools/$schoolSlug" params={{ schoolSlug: slug }}>
            View School
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
  name: string;
  description: string;
  slug: string;
}
