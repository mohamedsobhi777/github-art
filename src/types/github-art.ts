export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export interface GridCell {
  x: number
  y: number
  level: ContributionLevel
}

export interface GridData {
  cells: GridCell[][]
  totalContributions: number
}

export interface TooltipData {
  x: number
  y: number
  level: ContributionLevel
  date: Date
}

