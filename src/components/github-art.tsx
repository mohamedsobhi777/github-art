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
import { Download, Moon, Palette, Sun, Sparkles } from 'lucide-react'
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

  const generateRandomArt = () => {
    setGrid((current) => {
      const newGrid = JSON.parse(JSON.stringify(current)) as GridData;
      // Clear the grid first
      newGrid.cells.forEach(week => week.forEach(day => day.level = 0));

      const patterns = [
        generateSquare,
        generateCircle,
        generateTriangle,
        generateDiamond,
        generateCombinedShapes
      ];
      
      const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
      return randomPattern(newGrid);
    });
  };

  const generateSquare = (grid: GridData) => {
    const size = Math.floor(Math.random() * 10) + 5; // Random size between 5 and 15
    const startX = Math.floor((grid.cells.length - size) / 2);
    const startY = Math.floor((grid.cells[0].length - size) / 2);
    const intensity = (Math.floor(Math.random() * 3) + 2) as ContributionLevel; // Random intensity between 2-4

    for (let x = startX; x < startX + size && x < grid.cells.length; x++) {
      for (let y = startY; y < startY + size && y < grid.cells[0].length; y++) {
        if (grid.cells[x] && grid.cells[x][y]) {
          grid.cells[x][y].level = intensity;
        }
      }
    }

    grid.totalContributions = grid.cells.flat().reduce((acc, cell) => acc + cell.level, 0);
    return grid;
  };

  const generateCircle = (grid: GridData) => {
    const centerX = Math.floor(grid.cells.length / 2);
    const centerY = Math.floor(grid.cells[0].length / 2);
    const radius = Math.floor(Math.random() * 5) + 3; // Random radius between 3 and 8
    const intensity = (Math.floor(Math.random() * 3) + 2) as ContributionLevel;

    for (let x = 0; x < grid.cells.length; x++) {
      for (let y = 0; y < grid.cells[x].length; y++) {
        const distance = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );
        if (distance <= radius) {
          grid.cells[x][y].level = intensity;
        }
      }
    }

    grid.totalContributions = grid.cells.flat().reduce((acc, cell) => acc + cell.level, 0);
    return grid;
  };

  const generateTriangle = (grid: GridData) => {
    const height = Math.floor(Math.random() * 8) + 4; // Random height between 4 and 12
    const centerX = Math.floor(grid.cells.length / 2);
    const baseY = Math.floor(grid.cells[0].length / 2) + Math.floor(height / 2);
    const intensity = (Math.floor(Math.random() * 3) + 2) as ContributionLevel;

    for (let y = 0; y < height; y++) {
      const width = (y * 2) + 1; // Width increases by 2 for each row
      const startX = centerX - Math.floor(width / 2);
      
      for (let x = startX; x < startX + width; x++) {
        if (grid.cells[x] && grid.cells[baseY - y]) {
          grid.cells[x][baseY - y].level = intensity;
        }
      }
    }

    grid.totalContributions = grid.cells.flat().reduce((acc, cell) => acc + cell.level, 0);
    return grid;
  };

  const generateDiamond = (grid: GridData) => {
    const size = Math.floor(Math.random() * 6) + 3; // Random size between 3 and 9
    const centerX = Math.floor(grid.cells.length / 2);
    const centerY = Math.floor(grid.cells[0].length / 2);
    const intensity = (Math.floor(Math.random() * 3) + 2) as ContributionLevel;

    for (let x = 0; x < grid.cells.length; x++) {
      for (let y = 0; y < grid.cells[x].length; y++) {
        const manhattanDist = Math.abs(x - centerX) + Math.abs(y - centerY);
        if (manhattanDist <= size) {
          grid.cells[x][y].level = intensity;
        }
      }
    }

    grid.totalContributions = grid.cells.flat().reduce((acc, cell) => acc + cell.level, 0);
    return grid;
  };

  const generateCombinedShapes = (grid: GridData) => {
    // Randomly choose 2-3 shapes to combine
    const numShapes = Math.floor(Math.random() * 2) + 2;
    const shapes = [generateSquare, generateCircle, generateTriangle, generateDiamond];
    
    // Shuffle and take first numShapes
    const selectedShapes = shapes
      .sort(() => Math.random() - 0.5)
      .slice(0, numShapes);

    // Apply each shape with different intensities
    selectedShapes.forEach((shapeGenerator, index) => {
      const intensity = ((index + 2) % 4 + 1) as ContributionLevel;
      const tempGrid = shapeGenerator(JSON.parse(JSON.stringify(grid)));
      
      // Merge the shape into the main grid
      for (let x = 0; x < grid.cells.length; x++) {
        for (let y = 0; y < grid.cells[x].length; y++) {
          if (tempGrid.cells[x][y].level > 0) {
            grid.cells[x][y].level = intensity;
          }
        }
      }
    });

    grid.totalContributions = grid.cells.flat().reduce((acc, cell) => acc + cell.level, 0);
    return grid;
  };

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
              onClick={generateRandomArt}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
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
          <div className="flex text-sm mb-2 justify-between ml-[25px] w-[722px]">
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
