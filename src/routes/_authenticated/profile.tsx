import { createFileRoute } from "@tanstack/react-router"
import z from "zod"

export const Route = createFileRoute("/_authenticated/profile")({
  component: RouteComponent,
})

function RouteComponent() {
  // https://www.better-auth.com/docs/concepts/users-accounts
  return <div>Hello "/_authenticated/profile"!</div>
}
const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(["student", "instructor", "admin"]),
  createdAt: z.date(),
  updatedAt: z.date(),
})

const CourseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  instructorId: z.string().uuid(), // Foreign key
  price: z.number().optional(),
  isPublished: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
})

const LectureSchema = z.object({
  id: z.string().uuid(),
  courseId: z.string().uuid(), // Foreign key
  title: z.string(),
  slug: z.string(),
  content: z.string().optional(),
  videoUrl: z.string().url().optional(),
  duration: z.number().optional(), // seconds
  position: z.number(), // Order within course
  isPreview: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
})

const EnrollmentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(), // Foreign key
  courseId: z.string().uuid(), // Foreign key
  enrolledAt: z.date(),
  completedAt: z.date().optional(),
  progress: z.number().min(0).max(100).default(0),
  lastAccessedAt: z.date().optional(),
})

const LectureProgressSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(), // Foreign key
  lectureId: z.string().uuid(), // Foreign key
  completed: z.boolean().default(false),
  watchTime: z.number().default(0), // seconds watched
  completedAt: z.date().optional(),
  lastAccessedAt: z.date(),
})

const QuizSchema = z.object({
  id: z.string().uuid(),
  lectureId: z.string().uuid(), // Foreign key
  title: z.string(),
  questions: z.array(
    z.object({
      id: z.string().uuid(),
      question: z.string(),
      type: z.enum(["multiple-choice", "true-false", "text"]),
      options: z.array(z.string()).optional(),
      correctAnswer: z.string(),
      points: z.number().default(1),
    }),
  ),
  passingScore: z.number().default(70),
  createdAt: z.date(),
  updatedAt: z.date(),
})
