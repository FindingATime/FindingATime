'use client'
import React, { useState, useEffect } from 'react'
import { generateTimeRange } from '@/utils/timeUtils'
import { months } from '@/utils/dateUtils'
import { addAttendee, TimeSegment, Schedule } from '@/utils/attendeesUtils'

interface GridProps {
  earliestTime: string
  latestTime: string
  isAvailable: boolean // Determines if the grid is selectable (selection mode)
  responders?: {
    users: { name: string }
    timesegments: Schedule
  }[]
  mode: string
  config: string[]
  setConfig: React.Dispatch<React.SetStateAction<string[]>>
  schedule: Schedule
  setSchedule: React.Dispatch<React.SetStateAction<Schedule>>
  userAvailability?: Schedule
  setUserAvailability?: React.Dispatch<React.SetStateAction<Schedule>>
  onCellHover?: (day: string, time: string) => void // Callback function when hovering over a cell
}

const Grid = ({
  earliestTime,
  latestTime,
  isAvailable,
  responders,
  mode,
  config,
  setConfig,
  schedule,
  setSchedule,
  onCellHover,
}: GridProps) => {
  // Generate time array for row headings
  const timeArray = generateTimeRange(earliestTime, latestTime)
  const respondentCount = responders?.length || 0

  // Grid dimensions
  const dimensions = {
    width: config.length || 1, // default to 1 if daysOfWeek is empty
    height: timeArray.length - 1,
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

  const addDateToSchedule = (date: string, timeSegments: TimeSegment[]) => {
    schedule[date] = timeSegments
  }

  // Populate the grid with creator's availability times saved in the database (view-event)
  useEffect(() => {
    if (mode === 'weekly') {
      const order = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const sortedConfig = config.sort(
        (a, b) => order.indexOf(a) - order.indexOf(b),
      )
      setDates(sortedConfig)
      // setDates(config)
      setSchedule({})
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
      setSchedule({})
    }

    // Only populate grid if in view mode and responder's time segments is not empty
    if (!isAvailable && responders) {
      const newGrid = initialGrid()

      // loop through each day and each responder's timesegments
      config.forEach((day, colIndex) => {
        responders?.forEach((responder) => {
          const times = responder.timesegments[day] || []

          times.forEach((timeSlot) => {
            const startIndex = timeArray.indexOf(timeSlot.beginning)
            let endIndex = timeArray.indexOf(timeSlot.end)

            // Handle case where end time is not found in the timeArray (endIndex being -1)
            if (endIndex === -1) {
              endIndex = timeArray.length // Set to the end of the timeArray
            }

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
    const selectedTimeSegment = {
      beginning: timeArray[rowIndex],
      end: timeArray[rowIndex + 1],
      type: 'Regular',
    }
    if (config[colIndex] in schedule) {
      let timeSegments = schedule[config[colIndex]]

      // Check if the time segment is already in the schedule
      const segmentIndex = timeSegments.findIndex(
        (timeSegment) =>
          timeSegment.beginning === selectedTimeSegment.beginning &&
          timeSegment.end === selectedTimeSegment.end,
      )

      if (segmentIndex !== -1) {
        // Remove the time segment if it exists
        timeSegments.splice(segmentIndex, 1)
      } else {
        // Add the time segment if it does not exist
        timeSegments.push(selectedTimeSegment)
      }

      schedule[config[colIndex]] = timeSegments
    } else {
      addDateToSchedule(config[colIndex], [selectedTimeSegment])
    }
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
          {timeArray.map(
            (time, index) =>
              index !== timeArray.length && (
                <div
                  key={index}
                  className="flex items-start justify-start border-gray-300 pr-2 text-xs text-gray-600"
                  style={{ height: '64px', lineHeight: '64px' }}
                >
                  {time}
                </div>
              ),
          )}
        </div>

        <div>
          {/* Grid Column header displaying days of the week */}
          <div
            className="grid-header"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${dimensions.width || 1}, 1fr)`, // Ensure at least one column
            }}
          >
            {dates.length > 0 ? (
              dates.map((day, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center border-gray-300 text-sm text-gray-600"
                  style={{ height: '2rem' }}
                >
                  {day}
                </div>
              ))
            ) : (
              // Placeholder for grid header (fixes alignment of times and grid rows when no dates are present)
              <div
                className="flex items-center justify-center border-gray-300 text-sm text-gray-600"
                style={{ height: '2rem' }}
              ></div>
            )}
          </div>

          {/* Main Grid body cells for selecting and deselecting */}
          <div
            className={`grid h-full border border-gray-300 ${
              isAvailable ? 'bg-red-50' : ''
            }`}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${dimensions.width}, 1fr)`,
              gridTemplateRows: `repeat(${dimensions.height - 1}, 1fr)`,
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
                    isSelected
                      ? isSelected === (responders?.length || 0)
                        ? 'bg-emerald-600'
                        : 'bg-emerald-300'
                      : ''
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
                  onMouseDown={
                    dates.length > 0
                      ? () => handleMouseDown(rowIndex, colIndex)
                      : undefined
                  }
                  onMouseEnter={
                    dates.length > 0
                      ? () => handleMouseEnter(rowIndex, colIndex)
                      : undefined
                  }
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
