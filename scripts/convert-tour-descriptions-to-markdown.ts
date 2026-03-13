import { getTours, updateTour } from "@/lib/data"
import { normalizeTourDescriptionToMarkdown } from "@/lib/markdown"

async function run() {
  const tours = await getTours()
  let updatedCount = 0

  for (const tour of tours) {
    const normalized = normalizeTourDescriptionToMarkdown(tour.description || "")
    if (normalized !== (tour.description || "")) {
      await updateTour(tour.id, { description: normalized })
      updatedCount += 1
      console.log(`Updated tour ${tour.id}: ${tour.name}`)
    }
  }

  console.log(`Done. Updated ${updatedCount} tour description(s).`)
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to convert tour descriptions:", error)
    process.exit(1)
  })