'use client'
import React from 'react'
import { UUID } from 'crypto'

interface EventFormViewProps {
  title: string
  description: string
  location: string
  mode: 'weekly' | 'specific'
  config: { [key: string]: boolean } | { days: string[] }
  timezone: string
}

const EventFormView = ({
  title,
  description,
  location,
  mode,
  config,
  timezone,
}: EventFormViewProps) => {
  const formatDays = () => {
    // Helper function to format a date in 'MMM DD'
    const formatDate = (dateString: string) =>
      new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })

    // Helper function to format the weekday
    const formatWeekday = (dateString: string) =>
      new Date(dateString).toLocaleDateString('en-US', { weekday: 'short' })

    // Checks if the mode is weekly and the config is an object
    if (mode === 'weekly' && !Array.isArray(config)) {
      const days = Object.keys(config).filter(
        (day) => (config as { [key: string]: boolean })[day],
      )
      return (
        <span className="flex flex-row flex-wrap items-start text-sm">
          {days.map((day, index) => (
            <span key={day} className="pr-1 font-medium text-gray-700">
              {day.slice(0, 3)}
              {index < days.length - 1 && (
                <span className="px-2 font-bold text-gray-400">•</span>
              )}
            </span>
          ))}
        </span>
      )
    }

    // Checks if the mode is specific and the config is an array of days
    if (mode === 'specific' && 'days' in config && Array.isArray(config.days)) {
      return (
        <div className="flex flex-wrap">
          {config.days.map((dateString, index) => (
            <div key={dateString} className="flex flex-row items-start text-sm">
              <span className="pr-1 font-medium text-gray-700">
                {formatWeekday(dateString)}
              </span>
              <span className="font-normal text-gray-700">
                {formatDate(dateString)}
              </span>
              <span className="px-2 font-bold text-gray-400">
                {Array.isArray(config.days) &&
                  index < config.days.length - 1 &&
                  '•'}
              </span>
            </div>
          ))}
        </div>
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
