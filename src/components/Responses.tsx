'use client'
import React from 'react'
import { times } from '@/utils/timeUtils' // Import these from where they're defined

interface Responder {
  users: { name: string }
  timesegments: {
    [key: string]: {
      beginning: string
      end: string
      type: string
    }[]
  }
}

interface ResponsesProps {
  responders: Responder[]
  hoveredCell?: { day: string; time: string } | null // day and time of the hovered cell in availability grid
}

const Responses = ({ responders, hoveredCell }: ResponsesProps) => {
  // Function to check if a time is within a range
  const isTimeInRange = (time: string, start: string, end: string): boolean => {
    const timeIndex = times.indexOf(time)
    const startIndex = times.indexOf(start)
    let endIndex = times.indexOf(end)

    if (endIndex <= startIndex) {
      endIndex += 24 // Handle cases spanning midnight
    }

    return timeIndex >= startIndex && timeIndex < endIndex
  }

  // Filter responders based on availability for the hovered cell
  const availableResponders = hoveredCell // AD: refactor
    ? responders.filter((responder) => {
        const daySegments = responder.timesegments[hoveredCell.day]
        return daySegments?.some((slot) =>
          isTimeInRange(hoveredCell.time, slot.beginning, slot.end),
        )
      })
    : []

  return (
    <div>
      <h3 className="pb-3 text-sm font-medium text-gray-600">
        Responses ({availableResponders.length}/{responders.length})
      </h3>
      <ul className="text-xs text-gray-500">
        {responders.map((responder, index) => (
          <li
            key={index}
            className={
              availableResponders.includes(responder)
                ? 'font-mediums text-emerald-400'
                : 'text-gray-500'
            }
          >
            {responder.users.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Responses
