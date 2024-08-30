'use client'
import React from 'react'
import { days, months, modeOptions } from '@/utils/dateUtils'
import { useState } from 'react'
import Calendar from 'react-calendar'
import { times } from '@/utils/timeUtils'
import '@/app/calendarStyles.css'

interface EventFormProps {
  title: string | null
  setTitle: React.Dispatch<React.SetStateAction<string | null>>
  description: string
  setDescription: React.Dispatch<React.SetStateAction<string>>
  location: string | null
  setLocation: React.Dispatch<React.SetStateAction<string | null>>
  earliestTime: string
  setEarliestTime: React.Dispatch<React.SetStateAction<string>>
  latestTime: string
  setLatestTime: React.Dispatch<React.SetStateAction<string>>
  mode: string
  setMode: React.Dispatch<React.SetStateAction<string>>
  config: string[] | null
  setConfig: React.Dispatch<React.SetStateAction<string[] | null>>
  timezone: string | null
  setTimezone: React.Dispatch<React.SetStateAction<string | null>>
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
        className="flex w-full flex-col"
      >
        <input //Event Title text input
          type="text"
          value={title as string}
          placeholder="New Event Title"
          onChange={(e) => setTitle(e.target.value)}
          className="input w-full border-gray-300 bg-white text-xl font-normal focus-visible:ring-0"
        />
        {title === null && (
          <p className="mb-6 p-0 text-error">Title is required</p>
        )}

        <textarea //Event Description text input
          value={description}
          placeholder="Event Description (optional)"
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full border-gray-300 bg-white text-base font-normal focus-visible:ring-0"
        ></textarea>

        <input //Event Location text input
          type="text"
          value={location as string}
          placeholder="Location"
          onChange={(e) => setLocation(e.target.value)}
          className="input mb-6 w-full border-gray-300 bg-white text-base font-normal focus-visible:ring-0"
        />
        {location === null && (
          <p className="mb-6 p-0 text-error">Location is required</p>
        )}

        <div //Event EarliestTime to LatestTime row container
          className="flex w-full flex-row items-center gap-3"
        >
          <select //EarliestTime dropdown
            value={earliestTime}
            onChange={(e) => setEarliestTime(e.target.value)}
            className="select mb-6 w-full max-w-xl border-gray-300 bg-white text-base font-normal"
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
            className="select mb-6 w-full max-w-xl border-gray-300 bg-white text-base font-normal"
          >
            <option disabled value="">
              Latest Time
            </option>
            {times.map((time) => (
              <option key={time}>{time}</option>
            ))}
          </select>
        </div>

        {config === null && (
          <p className="text-error">At least one day required</p>
        )}
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
                  const dateValue =
                    months[(value as Date).getUTCMonth()] +
                    ' ' +
                    (value as Date).getUTCDate()
                  let newSpecificDays: string[] = config as string[]
                  if (
                    !config?.some((day) => day === dateValue) &&
                    (config?.length as number) < 7
                  ) {
                    // 7 day limit
                    // Add the value date to the specificDays array
                    newSpecificDays = [...(config as string[]), dateValue]
                    setConfig(newSpecificDays)
                  } else {
                    // Remove the value date from the specificDays array
                    newSpecificDays = newSpecificDays.filter(
                      (day) => day !== dateValue,
                    )
                    setConfig(
                      (prevConfig) =>
                        prevConfig?.filter((day) => day !== dateValue) || [],
                    )
                  }

                  if (newSpecificDays.length >= 7 && config?.length === 7) {
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
                }}
                tileClassName={({ activeStartDate, date, view }) => {
                  const today = new Date()
                  if (
                    today.getTime() > date.getTime() &&
                    !(
                      today.getUTCDate() === date.getUTCDate() &&
                      today.getUTCMonth() === date.getUTCMonth() &&
                      today.getUTCFullYear() === date.getUTCFullYear()
                    ) // Allow today's date to be selected
                  ) {
                    return 'disabled'
                  }
                  return view === 'month' &&
                    config?.includes(
                      months[date.getUTCMonth()] + ' ' + date.getUTCDate(),
                    )
                    ? 'active'
                    : null
                }}
              />

              <p className="text-error">{passSpecificDaysLimitMessage}</p>
            </div>
          ) : (
            <div //Days of the week
              className="join mb-6 flex w-full space-x-1.5"
            >
              {days.map((day) => (
                <input
                  key={day}
                  className="btn btn-circle btn-sm h-10 w-10 border-gray-300 bg-white text-sm font-normal"
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

        {timezone === null && (
          <p className="mt-0 p-0 text-error">Timezone is required</p>
        )}
        <select //Timezone dropdown
          value={timezone as string}
          onChange={(e) => setTimezone(e.target.value)}
          className="select w-full border-gray-300 bg-white text-base font-normal"
        >
          <option disabled value="">
            Timezone
          </option>
          <option value="PST">PST (Pacific Standard Time)</option>
          <option value="MST">MST (Mountain Standard Time)</option>
          <option value="CST">CST (Central Standard Time)</option>
          <option value="EST">EST (Eastern Standard Time)</option>
          <option value="AKST">AKST (Alaska Standard Time)</option>
          <option value="HST">HST (Hawaii-Aleutian Standard Time)</option>
          <option value="GMT">GMT (Greenwich Mean Time)</option>
          <option value="CET">CET (Central European Time)</option>
          <option value="EET">EET (Eastern European Time)</option>
          <option value="CST">CST (China Standard Time)</option>
          <option value="AST">AST (Atlantic Standard Time)</option>
          <option value="IST">IST (Indian Standard Time)</option>
          <option value="JST">JST (Japan Standard Time)</option>
          <option value="AEST">AEST (Australian Eastern Standard Time)</option>
        </select>
      </form>
    </>
  )
}

export default EventForm
