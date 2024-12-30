import { ContributionLevel, GridData } from "../types/github-art"

export function createEmptyGrid(weeks: number, daysPerWeek: number): GridData {
  const cells = Array.from({ length: weeks }, (_, x) =>
    Array.from({ length: daysPerWeek }, (_, y) => ({
      x,
      y,
      level: 0 as ContributionLevel,
    }))
  )

  return {
    cells,
    totalContributions: 0,
  }
}

export function getContributionColor(level: ContributionLevel, theme: "github" | "custom" = "github"): string {
  if (theme === "github") {
    return {
      0: "#ebedf0",
      1: "#9be9a8",
      2: "#40c463",
      3: "#30a14e",
      4: "#216e39",
    }[level]
  }

  // Custom theme (purple)
  return {
    0: "#ebedf0",
    1: "#d8b4fe",
    2: "#c084fc",
    3: "#a855f7",
    4: "#7e22ce",
  }[level]
}

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export const DAYS = ["Mon", "", "Wed", "", "Fri", "", ""]

