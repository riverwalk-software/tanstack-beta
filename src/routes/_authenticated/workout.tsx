import { createFileRoute } from "@tanstack/react-router"
import { useExerciseList } from "@/hooks/useExerciseList"

export const Route = createFileRoute("/_authenticated/workout")({
  component: RouteComponent,
})

function RouteComponent() {
  const { addExercise, exerciseList, removeExercise } = useExerciseList()
  return (
    <>
      <ul>
        {exerciseList.map(({ slug, name, description }) => (
          <li key={slug}>
            <h3>{name}</h3>
            <p>
              {description} - {slug}
            </p>
            <button type="button" onClick={() => removeExercise(slug)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() =>
          addExercise({
            slug: crypto.randomUUID(),
            name: "New Exercise",
            description: "A new exercise.",
          })
        }
      >
        Add Exercise
      </button>
    </>
  )
}
