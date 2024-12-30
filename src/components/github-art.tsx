"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Download, Moon, Palette, Sun } from 'lucide-react'
import { ContributionLevel, GridCell, GridData, TooltipData } from "@/types/github-art"
import { DAYS, MONTHS, createEmptyGrid, getContributionColor } from "@/utils/grid"
import { cn } from "@/lib/utils"

export default function GithubArt() {
  const [grid, setGrid] = React.useState<GridData>(() => createEmptyGrid(53, 7))
  const [theme, setTheme] = React.useState<"github" | "custom">("github")
  const [isDark, setIsDark] = React.useState(false)
  const [tooltipData, setTooltipData] = React.useState<TooltipData | null>(null)

  const toggleCell = (x: number, y: number) => {
    setGrid((current) => {
      const newGrid = JSON.parse(JSON.stringify(current)) as GridData
      const currentLevel = newGrid.cells[x][y].level
      const newLevel = ((currentLevel + 1) % 5) as ContributionLevel
      
      newGrid.cells[x][y] = {
        ...newGrid.cells[x][y],
        level: newLevel,
      }

      newGrid.totalContributions = newGrid.cells.flat().reduce((acc, cell) => acc + cell.level, 0)
      
      return newGrid
    })
  }

  const handleMouseEnter = (cell: GridCell) => {
    const date = new Date()
    date.setDate(date.getDate() - ((52 - cell.x) * 7 + (6 - cell.y)))
    
    setTooltipData({
      x: cell.x,
      y: cell.y,
      level: cell.level,
      date,
    })
  }

  const handleMouseLeave = () => {
    setTooltipData(null)
  }

  const downloadAsPNG = () => {
    const svg = document.querySelector(".contribution-grid") as SVGElement
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const data = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    
    canvas.width = svg.clientWidth * 2
    canvas.height = svg.clientHeight * 2
    
    img.onload = () => {
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const a = document.createElement("a")
        a.download = "github-art.png"
        a.href = canvas.toDataURL("image/png")
        a.click()
      }
    }
    
    img.src = "data:image/svg+xml;base64," + btoa(data)
  }

  return (
    <div className={`p-8 min-h-screen ${isDark ? "dark" : ""}`}>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {grid.totalContributions} contributions in the last year
          </h1>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Palette className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("github")}>
                  GitHub Theme
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("custom")}>
                  Custom Theme
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDark(!isDark)}
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={downloadAsPNG}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="flex text-sm mb-2 justify-between">
            {MONTHS.map((month) => (
              <div key={month} className="text-muted-foreground">
                {month}
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col justify-between text-sm py-2">
              {DAYS.map((day, index) => (
                <div key={index} className="text-muted-foreground h-[10px]">
                  {day}
                </div>
              ))}
            </div>
            <TooltipProvider>
              <svg
                className="contribution-grid"
                width="722"
                height="112"
                viewBox="0 0 722 112"
              >
                {grid.cells.map((week, x) =>
                  week.map((day, y) => (
                    <Tooltip key={`${x}-${y}`}>
                      <TooltipTrigger asChild>
                        <rect
                          x={x * 14}
                          y={y * 14}
                          width="10"
                          height="10"
                          rx="2"
                          ry="2"
                          color="red"
                          fill={getContributionColor(
                            day.level,
                            theme
                          )}
                          className={cn(
                            "cursor-pointer transition-colors duration-300"
                          )}
                          onClick={() => toggleCell(x, y)}
                          onMouseEnter={() => handleMouseEnter(day)}
                          onMouseLeave={handleMouseLeave}
                        />
                      </TooltipTrigger>
                      {tooltipData?.x === x && tooltipData?.y === y && (
                        <TooltipContent>
                          <div className="text-sm">
                            <div>
                              {tooltipData.level} contribution
                              {tooltipData.level !== 1 ? "s" : ""} on{" "}
                              {tooltipData.date.toLocaleDateString()}
                            </div>
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))
                )}
              </svg>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2 mt-4 justify-end text-sm">
            <span className="text-muted-foreground">Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-[10px] h-[10px] rounded-sm ${getContributionColor(
                  level as ContributionLevel,
                  theme
                )}`}
              />
            ))}
            <span className="text-muted-foreground">More</span>
          </div>
        </div>
      </div>
    </div>
  )
}

