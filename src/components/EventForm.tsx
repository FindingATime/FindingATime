'use client'
import React from 'react'
import { days, modeOptions } from '@/utils/dateUtils'
import { useState } from 'react'
import Calendar from 'react-calendar'
// import 'react-calendar/dist/Calendar.css'
import { times } from '@/utils/timeUtils'
// import calendarstyles
import '@/app/calendarStyles.css'

interface EventFormProps {
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  description: string
  setDescription: React.Dispatch<React.SetStateAction<string>>
  location: string
  setLocation: React.Dispatch<React.SetStateAction<string>>
  earliestTime: string
  setEarliestTime: React.Dispatch<React.SetStateAction<string>>
  latestTime: string
  setLatestTime: React.Dispatch<React.SetStateAction<string>>
  mode: string
  setMode: React.Dispatch<React.SetStateAction<string>>
  config: string[]
  setConfig: React.Dispatch<React.SetStateAction<string[]>>
  timezone: string
  setTimezone: React.Dispatch<React.SetStateAction<string>>
}

const EventForm = ({
  title,
  setTitle,
  description,
  setDescription,
  location,
  setLocation,
  earliestTime,
  setEarliestTime,
  latestTime,
  setLatestTime,
  mode,
  setMode,
  config,
  setConfig,
  timezone,
  setTimezone,
}: EventFormProps) => {
  const [passSpecificDaysLimitMessage, setPassSpecificDaysLimitMessage] =
    useState('')

  // Function to handle selected daysOfWeek array based on checkbox selection and deselection
  const handleSelectedDayOfWeek = (day: string) => {
    config = config || []
    const index = config.indexOf(day)
    if (index === -1) {
      // Day is not in the array, add it
      setConfig([...config, day])
    } else {
      // Day is already in the array, remove it
      const updatedDays = [...config]
      updatedDays.splice(index, 1)
      setConfig(updatedDays)
    }
  }

  // Function to handle checkbox change for Days of the week
  const handleChange = (day: string) => {
    if (mode === 'weekly') {
      handleSelectedDayOfWeek(day)
    }
  }

  return (
    <>
      <form //Form to enter Event data (Title, Description...etc)
        className="flex w-full flex-col gap-6"
      >
        <input //Event Title text input
          type="text"
          value={title}
          placeholder="New Event Title"
          onChange={(e) => setTitle(e.target.value)}
          className="input w-full border-gray-300 bg-white text-xl font-normal focus-visible:ring-0"
        />

        <textarea //Event Description text input
          value={description}
          placeholder="Event Description"
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full border-gray-300 bg-white text-base font-normal focus-visible:ring-0"
        ></textarea>

        <input //Event Location text input
          type="text"
          value={location}
          placeholder="Location"
          onChange={(e) => setLocation(e.target.value)}
          className="input w-full border-gray-300 bg-white text-base font-normal focus-visible:ring-0"
        />

        <div //Event EarliestTime to LatestTime row container
          className="flex w-full flex-row items-center gap-3"
        >
          <select //EarliestTime dropdown
            value={earliestTime}
            onChange={(e) => setEarliestTime(e.target.value)}
            className="select w-full max-w-xl border-gray-300 bg-white text-base font-normal"
          >
            <option disabled value="">
              Earliest Time
            </option>
            {times.map((time) => (
              <option key={time}>{time}</option>
            ))}
          </select>
          <p //"to"
            className="text-normal font-normal text-gray-400"
          >
            to
          </p>
          <select //LatestTime dropdown
            value={latestTime}
            onChange={(e) => setLatestTime(e.target.value)}
            className="select w-full max-w-xl border-gray-300 bg-white text-base font-normal"
          >
            <option disabled value="">
              Latest Time
            </option>
            {times.map((time) => (
              <option key={time}>{time}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <button
            type="button"
            className={`btn ${mode === 'weekly' ? 'btn-active' : ''}`}
            onClick={() => {
              setMode('weekly')
              setConfig([])
            }}
          >
            Weekly Days
          </button>
          <button
            type="button"
            className={`btn ${mode === 'specific' ? 'btn-active' : ''}`}
            onClick={() => {
              setMode('specific')
              setConfig([])
            }}
          >
            Specific Days
          </button>
        </div>
        <div>
          {mode === 'specific' ? (
            <div>
              <Calendar // Specific days
                minDate={new Date()}
                maxDate={
                  new Date(new Date().setDate(new Date().getDate() + 60))
                } // only allow users to select dates within the next 60 days
                activeStartDate={new Date()}
                onChange={(value) => {
                  console.log(value)
                  const dateValue = (value as Date).toString()
                  let newSpecificDays = config
                  console.log('Old specific days: ', config)
                  if (
                    !config?.some((day) => day === dateValue) &&
                    config.length < 7
                  ) {
                    // 7 day limit
                    // Add the value date to the specificDays array
                    newSpecificDays = [...config, dateValue]
                    setConfig(newSpecificDays)
                  } else {
                    // Remove the value date from the specificDays array
                    console.log('Removing date: ', dateValue)
                    newSpecificDays = newSpecificDays.filter(
                      (day) => day !== dateValue,
                    )
                    setConfig((prevConfig) =>
                      prevConfig.filter((day) => day !== dateValue),
                    )
                  }

                  if (newSpecificDays.length >= 7 && config.length === 7) {
                    // Message for 7 day limit
                    setPassSpecificDaysLimitMessage(
                      'You can only select up to 7 days',
                    )
                  } else if (newSpecificDays.length < 1) {
                    // Message for at least 1 day
                    setPassSpecificDaysLimitMessage(
                      'You must choose at least 1 day',
                    )
                  } else {
                    setPassSpecificDaysLimitMessage('')
                  }
                  console.log('New specific days: ', newSpecificDays)
                }}
                tileClassName={({ activeStartDate, date, view }) => {
                  if (Date.now() > date.getTime()) {
                    return 'disabled'
                  }
                  return view === 'month' && config.includes(date.toString())
                    ? 'active'
                    : null
                }}
                view="month"
              />

              <p className="text-error">{passSpecificDaysLimitMessage}</p>
            </div>
          ) : (
            <div //Days of the week
              className="join w-full"
            >
              {days.map((day) => (
                <input
                  key={day}
                  className="btn join-item border-gray-300 bg-white"
                  type="checkbox"
                  name="options"
                  aria-label={day}
                  checked={config?.includes(day) || false}
                  onChange={() => handleChange(day)}
                />
              ))}
            </div>
          )}
        </div>

        <select //Timezone dropdown
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="select w-full border-gray-300 bg-white text-base font-normal"
        >
          <option disabled value="">
            Timezone
          </option>
          <option>PST (Pacific Standard Time)</option>
          <option>EST (Eastern Standard Time)</option>
          <option>GMT (Greenwich Mean Time)</option>
          <option>CET (Central European Time)</option>
          <option>IST (Indian Standard Time)</option>
          <option>JST (Japan Standard Time)</option>
        </select>
      </form>
    </>
  )
}

export default EventForm
