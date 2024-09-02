'use client'
import React from 'react'
import { UUID } from 'crypto'

interface EventFormViewProps {
  title: string
  description: string
  location: string
  earliestTime: string
  latestTime: string
  mode: 'weekly' | 'specific'
  config: { [key: string]: boolean } | string[]
  timezone: string
}

const EventFormView = ({
  title,
  description,
  location,
  earliestTime,
  latestTime,
  mode,
  config,
  timezone,
}: EventFormViewProps) => {
  const formatDays = () => {
    console.log('Mode:', mode)
    console.log('Config:', config)
    // Helper function to format dates in the format 'MMM DD'
    const formatDate = (dateString: string) =>
      new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })

    // Helper function to format weekdays
    const formatWeekday = (dateString: string) =>
      new Date(dateString).toLocaleDateString('en-US', { weekday: 'short' })

    // Checks if the mode is weekly and the config is an object
    if (mode === 'weekly' && !Array.isArray(config)) {
      return Object.keys(config)
        .filter((day) => config[day])
        .map((day) => day.slice(0, 3))
        .join(', ')
    }

    // Checks if the mode is specific, has 'days' property, and the config is an array
    if (mode === 'specific' && 'days' in config && Array.isArray(config.days)) {
      const dates = config.days.map(formatDate).join(', ')
      const weekdays = config.days.map(formatWeekday).join(', ')
      console.log('Dates:', dates)
      console.log('Weekdays:', weekdays)
      return (
        <>
          <div>{dates}</div>
          <div>({weekdays})</div>
        </>
      )
    }
    return ''
  }

  return (
    <div // Event Form Display Container
      className="flex w-full flex-col gap-6 break-words"
    >
      <div // Event Title
        className="text-2xl font-bold"
      >
        {title}
      </div>
      <div // Event Description
        className="text-base font-normal"
      >
        {description}
      </div>

      <div // Event Location
        className="text-base font-normal"
      >
        {location}
      </div>

      <hr // Divider
        className="my-4 border-t border-gray-300"
      />

      <div // Container for Earliest Time, Latest Time
        className="flex w-full flex-row items-center gap-3"
      >
        <div // Event Earliest Time
          className="text-base font-normal"
        >
          {earliestTime}
        </div>
        <p className="text-normal font-normal text-gray-400">to</p>
        <div // Event Latest Time
          className="text-base font-normal"
        >
          {latestTime}
        </div>
      </div>

      <div // Event Days (specific or weekly)
        className="text-base font-normal"
      >
        {formatDays()}
      </div>

      <div // Event Timezone
        className="text-base font-normal"
      >
        {timezone}
      </div>
    </div>
  )
}

export default EventFormView
