'use client'
import React, { useState, useEffect } from 'react'
import { generateTimeRange } from '@/utils/timeUtils'
import {
  months,
  convertDateStringToDateObject,
  formattedDate,
} from '@/utils/dateUtils'
import { addAttendee, TimeSegment, Schedule } from '@/utils/attendeesUtils'
import { userAgent } from 'next/server'

interface GridProps {
  earliestTime: string
  latestTime: string
  isAvailable: boolean // Determines if the grid is selectable (selection mode)
  responders?: {
    users: { name: string }
    timesegments: Schedule
  }[]
  mode: string
  config: string[] | null
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
  schedule,
  setSchedule,
  userAvailability,
  setUserAvailability,
  onCellHover,
}: GridProps) => {
  // Generate time array for row headings
  const timeArray = generateTimeRange(earliestTime, latestTime)
  const respondentCount = responders?.length || 0

  // Grid dimensions
  const dimensions = {
    width: config?.length || 1, // default to 1 if daysOfWeek is empty
    height: timeArray.length - 1, // -1 to not add extra row at the end of the grid
  }

  // Function to Initialize and populate an empty 2d array
  const initialGrid = () => {
    return Array(dimensions.height)
      .fill(null)
      .map(() => Array(dimensions.width).fill(false))
  }

  const [grid, setGrid] = useState(initialGrid)
  const [isSelecting, setIsSelecting] = useState(false) // When user is selecting cells
  const [dates, setDates] = useState<string[] | null>([])
  const [hoveredCell, setHoveredCell] = useState<{
    // hovered cell on grid used for styling
    rowIndex: number
    colIndex: number
  } | null>(null)

  const addDateToSchedule = (date: string, timeSegments: TimeSegment[]) => {
    const newSchedule = { ...schedule }
    newSchedule[date] = timeSegments
    setSchedule(newSchedule)
  }

  // Populate the grid with creator's availability times saved in the database (view-event)
  useEffect(() => {
    if (mode === 'weekly') {
      const order = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      let sortedConfig = config as string[]
      sortedConfig = sortedConfig?.sort(
        (a, b) => order.indexOf(a) - order.indexOf(b),
      )
      setDates(sortedConfig as string[])
      !userAvailability && setSchedule({}) // if user chooses new dates, clear the schedule
    } else {
      // Sort dates in ascending order
      let newConfig: string[] = config as string[]
      newConfig = newConfig?.sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime(),
      ) as string[]
      newConfig = newConfig?.map((date) => {
        return (
          months[new Date(date).getUTCMonth()] +
          ' ' +
          new Date(date).getUTCDate()
        )
      })
      setDates(newConfig)
      !userAvailability && setSchedule({}) // if user chooses new dates, clear the schedule
    }

    // Only populate grid if in view mode and responder's time segments is not empty
    if (!isAvailable && responders) {
      const newGrid = initialGrid()

      // loop through each day and each responder's timesegments
      config?.forEach((day, colIndex) => {
        responders?.forEach((responder) => {
          const times =
            responder.timesegments[
              mode === 'weekly'
                ? day
                : convertDateStringToDateObject(day).toString()
            ] || []

          times.forEach((timeSlot) => {
            const startIndex = timeArray.indexOf(timeSlot.beginning)
            let endIndex = timeArray.indexOf(timeSlot.end)

            // Instead of just setting to true, increment a counter to keep track of how many people are available at that time
            for (let i = startIndex; i < endIndex; i++) {
              newGrid[i][colIndex] = (newGrid[i][colIndex] || 0) + 1
            }

            // edge case where start and end times are the same so endIndex is 0 and startIndex is timeArray.length - 2
            if (endIndex === 0) {
              newGrid[startIndex][colIndex] =
                (newGrid[startIndex][colIndex] || 0) + 1
            }
          })
        })
      })
      setGrid(newGrid)
    } else {
      // initialize grid when dimensions change when filling in event form (create-event)
      !userAvailability ? setGrid(initialGrid()) : setGrid(grid)
    }
  }, [
    isAvailable,
    config?.length,
    timeArray.length,
    earliestTime,
    latestTime,
    responders,
    userAvailability,
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
      if (onCellHover && config) {
        const date = formattedDate(config[colIndex])
        onCellHover(date, timeArray[rowIndex])
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
    const timeSlot = `${rowIndex}-${colIndex}` // Define the time slot key

    // Update userAvailability state
    setUserAvailability &&
      setUserAvailability((prevAvailability) => {
        const newAvailability = { ...prevAvailability }
        if (newGrid[rowIndex][colIndex]) {
          // Add the time slot to userAvailability
          newAvailability[timeSlot] = [selectedTimeSegment]
        } else {
          // Remove the time slot from userAvailability
          delete newAvailability[timeSlot]
        }
        return newAvailability
      })

    if (
      config &&
      (convertDateStringToDateObject(config[colIndex]).toString() !==
      'Invalid Date'
        ? convertDateStringToDateObject(config[colIndex]).toString()
        : config[colIndex]) in schedule
    ) {
      const date = formattedDate(config[colIndex])
      let timeSegments = schedule[date]

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

      schedule[date] = timeSegments
    } else if (config) {
      const date = formattedDate(config[colIndex])
      addDateToSchedule(date, [selectedTimeSegment])
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
            gridTemplateRows: `repeat(${dimensions.height}, 32px)`,
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
            {(dates?.length as number) > 0 ? (
              dates?.map((day, index) => (
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
            className={`grid h-full border border-gray-300`}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${dimensions.width}, 1fr)`,
              gridTemplateRows: `repeat(${dimensions.height}, 1fr)`,
              width: '100%',
              height: `${dimensions.height * 32 + 1}px`, // 32px height per row and add 1px to height to account for border
            }}
            onMouseLeave={handleMouseLeaveGrid} // Handle mouse leave for grid body
          >
            {grid.map((row, rowIndex) =>
              row.map((isSelected, colIndex) => {
                console.log('userAvailability', userAvailability)
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`flex h-8 items-center justify-center border-[0.5px] border-gray-200 ${
                      isAvailable
                        ? isSelected
                          ? 'bg-emerald-300'
                          : 'bg-red-50'
                        : isSelected
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
                      (dates?.length as number) > 0
                        ? () => handleMouseDown(rowIndex, colIndex)
                        : undefined
                    }
                    onMouseEnter={
                      (dates?.length as number) > 0
                        ? () => handleMouseEnter(rowIndex, colIndex)
                        : undefined
                    }
                  ></div>
                )
              }),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Grid
