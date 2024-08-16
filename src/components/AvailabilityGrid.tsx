'use client'
import React, { useState, useEffect } from 'react'
import { generateTimeRange } from '@/utils/timeUtils'
import { months } from '@/utils/dateUtils'

interface GridProps {
  earliestTime: string
  latestTime: string
  isAvailable: boolean // Determines if the grid is selectable (selection mode)
  mode: string
  config: string[]
  setConfig: React.Dispatch<React.SetStateAction<string[]>>
  responders?: {
    users: { name: string }
    timesegments: {
      [key: string]: {
        beginning: string
        end: string
        type: string
      }[]
    }
  }[]
  onCellHover?: (day: string, time: string) => void // Callback function when hovering over a cell
}

const Grid = ({
  earliestTime,
  latestTime,
  isAvailable,
  mode,
  config,
  setConfig,
  responders,
  onCellHover,
}: GridProps) => {
  // Generate time array for row headings
  const timeArray = generateTimeRange(earliestTime, latestTime)

  // Grid dimensions
  const dimensions = {
    width: config.length || 1, // default to 1 if daysOfWeek is empty
    height: timeArray.length,
  }

  // Function to Initialize and populate an empty 2d array
  const initialGrid = () => {
    return Array(dimensions.height)
      .fill(null)
      .map(() => Array(dimensions.width).fill(false))
  }

  const [grid, setGrid] = useState(initialGrid)
  const [isSelecting, setIsSelecting] = useState(false) // When user is selecting cells
  const [dates, setDates] = useState<string[]>([])
  const [hoveredCell, setHoveredCell] = useState<{
    // hovered cell on grid used for styling
    rowIndex: number
    colIndex: number
  } | null>(null)

  // Populate the grid with creator's availability times saved in the database (view-event)
  useEffect(() => {
    console.log('Config: ', config)
    console.log('Responders: ', responders)

    if (mode === 'weekly') {
      const order = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      //const sortedConfig = config.sort((a, b) => order.indexOf(a) - order.indexOf(b))
      setDates(config)
    } else {
      // Sort dates in ascending order
      let newConfig = config
      newConfig = config.sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime(),
      )
      newConfig = newConfig.map(
        (date) =>
          months[new Date(date).getMonth()] + ' ' + new Date(date).getDate(),
      )
      setDates(newConfig)
    }

    // Only populate grid if in view mode and responder's time segments is not empty
    if (!isAvailable && responders) {
      const newGrid = initialGrid()

      // Debugging: Log initial grid
      console.log('Initial Grid:', newGrid)

      // loop through each day and each responder's timesegments
      config.forEach((day, colIndex) => {
        responders?.forEach((responder) => {
          const times = responder.timesegments[day] || []

          // Debugging: Log day and times
          console.log(`Day: ${day}, Times:`, times)

          times.forEach((timeSlot) => {
            const startIndex = timeArray.indexOf(timeSlot.beginning)
            let endIndex = timeArray.indexOf(timeSlot.end)

            // Handle case where end time is not found in the timeArray (endIndex being -1)
            if (endIndex === -1) {
              endIndex = timeArray.length // Set to the end of the timeArray
            }

            // Debugging: Log start and end indices
            console.log(
              `Time Slot: ${timeSlot.beginning} - ${timeSlot.end}, Start Index: ${startIndex}, End Index: ${endIndex}`,
            )

            // Check if the start and end index are valid
            if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
              for (let i = startIndex; i < endIndex; i++) {
                // Instead of just setting to true, increment a counter
                newGrid[i][colIndex] = (newGrid[i][colIndex] || 0) + 1
              }
            }
          })
        })
      })
      setGrid(newGrid)
    } else {
      // initialize grid when dimensions change when filling in event form (create-event)
      setGrid(initialGrid())
    }
  }, [
    isAvailable,
    config.length,
    timeArray.length,
    earliestTime,
    latestTime,
    responders,
  ])

  // Function is called when the mouse is pressed down on a cell
  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    if (!isAvailable) {
      setHoveredCell({ rowIndex, colIndex })
      return
    }
    setIsSelecting(true)
    toggleCell(rowIndex, colIndex)
  }

  /* 
    Function is called when the mouse enters a cell while 
    the mouse button is pressed 
  */
  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    if (!isAvailable) {
      setHoveredCell({ rowIndex, colIndex })
      if (onCellHover) {
        // Only call onCellHover if it's provided
        onCellHover(config[colIndex], timeArray[rowIndex])
      }
    }
    if (isSelecting) {
      toggleCell(rowIndex, colIndex)
    }
  }

  // Function is called when the mouse button is released
  const handleMouseUp = () => {
    setIsSelecting(false)
    // Only clear the hovered cell if in selection mode
    if (isAvailable) {
      setHoveredCell(null)
    }
  }

  // Function to handle when the mouse leaves the grid area
  const handleMouseLeaveGrid = () => {
    if (!isAvailable) {
      setHoveredCell(null) // Clear hovered cell when mouse leaves grid in view mode
    }

    if (onCellHover) {
      onCellHover('', '') // Clear hovered cell when mouse leaves grid
    }
  }

  // Function toggles the value of a cell
  const toggleCell = (rowIndex: number, colIndex: number) => {
    const newGrid = [...grid]
    newGrid[rowIndex][colIndex] = !newGrid[rowIndex][colIndex]
    setGrid(newGrid)
  }

  return (
    <div onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeaveGrid}>
      <div
        className="grid-container"
        style={{ display: 'grid', gridTemplateColumns: 'auto 1fr' }}
      >
        {/* Time row headers */}
        <div
          className="grid-time-headers"
          style={{
            display: 'grid',
            gridTemplateRows: `repeat(${dimensions.height}, 64px)`,
            alignItems: 'flex-start',
          }}
        >
          {timeArray.map((time, index) => (
            <div
              key={index}
              className="flex items-start justify-end border-gray-300 pr-2 text-xs text-gray-600"
              style={{ height: '64px', lineHeight: '64px' }}
            >
              {time}
            </div>
          ))}
        </div>

        <div>
          {/* Grid Column header displaying days of the week */}
          <div
            className="grid-header"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${dimensions.width}, 1fr)`,
            }}
          >
            {dates.map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-center border-gray-300 text-sm text-gray-600"
                style={{ height: '2rem' }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Main Grid body cells for selecting and deselecting */}
          <div
            className={`grid h-full border border-gray-300 ${
              isAvailable ? 'bg-red-50' : ''
            }`}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${dimensions.width}, 1fr)`,
              gridTemplateRows: `repeat(${dimensions.height}, 1fr)`,
              width: '100%',
              height: `${dimensions.height * 64 + 1}px`, // 64px height per row and add 1px to height to account for border
            }}
            onMouseLeave={handleMouseLeaveGrid} // Handle mouse leave for grid body
          >
            {grid.map((row, rowIndex) =>
              row.map((isSelected, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`flex h-16 items-center justify-center border-[0.5px] border-gray-200 ${
                    isSelected ? 'bg-emerald-300' : ''
                  } ${
                    // Change cursor to pointer if grid is selectable
                    isAvailable ? 'cursor-pointer' : 'cursor-default'
                  } ${
                    // Add border-dashed to cell if it is the hovered cell
                    hoveredCell?.rowIndex === rowIndex &&
                    hoveredCell?.colIndex === colIndex
                      ? 'border-1 border-dashed ring-1 ring-gray-900 ring-opacity-10 drop-shadow-md hover:border-black'
                      : ''
                  }`}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                ></div>
              )),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Grid
