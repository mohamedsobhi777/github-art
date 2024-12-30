import { useState, useCallback } from 'react';

interface HeatmapProps {
  rows?: number;
  cols?: number;
}

export default function Heatmap({ rows = 7, cols = 52 }: HeatmapProps) {
  const [activeBoxes, setActiveBoxes] = useState<Set<string>>(new Set());

  const toggleBox = useCallback((row: number, col: number) => {
    const key = `${row}-${col}`;
    setActiveBoxes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const getColor = (isActive: boolean) => {
    return isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700';
  };

  return (
    <div className="inline-block p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: rows }, (_, row) =>
          Array.from({ length: cols }, (_, col) => {
            const key = `${row}-${col}`;
            const isActive = activeBoxes.has(key);
            return (
              <button
                key={key}
                className={`w-4 h-4 rounded-sm transition-colors ${getColor(isActive)}`}
                onClick={() => toggleBox(row, col)}
                aria-label={`Toggle cell at row ${row + 1}, column ${col + 1}`}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
