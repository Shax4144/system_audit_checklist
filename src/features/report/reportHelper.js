// routes/workspace/Reports/reportHelpers.js

// Strip leading roman numerals or arabic numbers + punctuation from section titles
export const stripSectionNumbering = (title = "") =>
  title.replace(/^[IVXLCDM]+\.\s*/i, "").replace(/^\d+\.\s*/, "").trim()

// Flatten a section's items (direct or via subsections) into one array
export const getSectionItems = (section) => {
  if (section["sub-sections"]) {
    return section["sub-sections"].flatMap((sub) => sub["sub-items"] ?? [])
  }
  return section.item ?? []
}

// Group sections' remarks by rounded rating bucket (1–5)
export const buildFindingsByRating = (sections) => {
  const buckets = { 5: [], 4: [], 3: [], 2: [], 1: [] }

  sections.forEach((section) => {
    const items = getSectionItems(section)
    const itemsByRating = { 5: [], 4: [], 3: [], 2: [], 1: [] }

    items.forEach((item) => {
      const ratingRaw = item.answer?.rating
      if (ratingRaw == null) return

      const rating = Math.round(Number(ratingRaw))
      if (!itemsByRating[rating]) return

      itemsByRating[rating].push({
        name: item.name,
        remarks: item.answer?.remarks ?? null,
      })
    })

    Object.keys(itemsByRating).forEach((rating) => {
      if (itemsByRating[rating].length > 0) {
        buckets[rating].push({
          sectionName: stripSectionNumbering(section.section),
          items: itemsByRating[rating],
        })
      }
    })
  })

  return buckets
}

// Overall rating as a percentage — average of all section average_ratings, scaled to 100
export const computeOverallPercentage = (sections) => {
  const rated = sections.filter((s) => s.average_rating != null)
  if (rated.length === 0) return 0
  const avg = rated.reduce((sum, s) => sum + s.average_rating, 0) / rated.length
  return ((avg / 5) * 100).toFixed(2)
}

// Unique auditors assigned across all sections
export const getAssignedAuditors = (sections) => {
  const seen = new Map()
  sections.forEach((section) => {
    const user = section.assigned_user
    if (user && !seen.has(user.id)) {
      seen.set(user.id, user)
    }
  })
  return Array.from(seen.values())
}