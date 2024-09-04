'use client'
import React from 'react'
import { days, months, modeOptions } from '@/utils/dateUtils'
import { useState } from 'react'
import Calendar from 'react-calendar'
import { times, sortedTimeZones } from '@/utils/timeUtils'
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

  const maxDaysAhead = 60
  const maxDaysSelectable = 7

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
          className={`input w-full border-gray-300 bg-white text-xl font-normal focus-visible:ring-0 ${
            title !== null && 'mb-6'
          }`}
        />
        {title === null && (
          <p className="mb-3 p-0 text-error">Title is required</p>
        )}

        <textarea //Event Description text input
          rows={3}
          value={description}
          placeholder="Event Description (optional)"
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered mb-6 w-full border-gray-300 bg-white text-base font-normal focus-visible:ring-0"
        ></textarea>

        <input //Event Location text input
          type="text"
          value={location as string}
          placeholder="Location"
          onChange={(e) => setLocation(e.target.value)}
          className={`input w-full border-gray-300 bg-white text-base font-normal focus-visible:ring-0 ${
            location !== null && 'mb-6'
          }`}
        />
        {location === null && (
          <p className="mb-3 p-0 text-error">Location is required</p>
        )}

        <div //Event EarliestTime to LatestTime row container
          className="flex w-full flex-row items-center justify-center gap-3"
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
            className="text-normal mb-6 font-normal text-gray-400"
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
        <div className={`${config !== null && 'mb-6'}`}>
          {mode === 'specific' ? (
            <div>
              <Calendar // Specific days
                minDate={new Date()}
                maxDate={
                  new Date(
                    new Date().setDate(new Date().getUTCDate() + maxDaysAhead),
                  )
                } // only allow users to select dates within the next 60 days
                onChange={(value) => {
                  const dateValue = value as Date
                  dateValue.setHours(0, 0, 0, 0)
                  const monthDateYear =
                    months[(value as Date).getUTCMonth()] +
                    ' ' +
                    (value as Date).getUTCDate() +
                    ' ' +
                    (value as Date).getUTCFullYear()
                  let newSpecificDays: string[] = config ? config : []
                  if (
                    !newSpecificDays?.some((day) => {
                      const month = months[new Date(day).getUTCMonth()]
                      const dateDay = new Date(day).getUTCDate()
                      const year = new Date(day).getUTCFullYear()
                      return (
                        month + ' ' + dateDay + ' ' + year === monthDateYear
                      )
                    }) &&
                    (newSpecificDays?.length as number) < maxDaysSelectable
                  ) {
                    // 7 day limit
                    // Add the value date to the specificDays array
                    if (config) {
                      newSpecificDays = [
                        ...(config as string[]),
                        dateValue.toString(),
                      ]
                    } else {
                      newSpecificDays = [dateValue.toString()]
                    }
                    setConfig(newSpecificDays)
                  } else {
                    // Remove the value date from the specificDays array
                    newSpecificDays = newSpecificDays?.filter((day) => {
                      const month = months[new Date(day).getUTCMonth()]
                      const dateDay = new Date(day).getUTCDate()
                      const year = new Date(day).getUTCFullYear()
                      return (
                        month + ' ' + dateDay + ' ' + year === monthDateYear
                      )
                    })
                    setConfig(
                      (prevConfig) =>
                        prevConfig?.filter((day) => {
                          const month = months[new Date(day).getUTCMonth()]
                          const dateDay = new Date(day).getUTCDate()
                          const year = new Date(day).getUTCFullYear()
                          return (
                            month + ' ' + dateDay + ' ' + year === monthDateYear
                          )
                        }) || [],
                    )
                  }

                  if (
                    newSpecificDays.length >= maxDaysSelectable &&
                    config?.length === maxDaysSelectable
                  ) {
                    // Message for maximum selectable days limit
                    setPassSpecificDaysLimitMessage(
                      `You can only select up to ${maxDaysSelectable} days`,
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
                  today.setHours(0, 0, 0, 0)
                  if (
                    // Disable past dates and days past 60 days of today
                    today.getTime() > date.getTime() ||
                    new Date(
                      new Date().setDate(
                        new Date().getUTCDate() + maxDaysAhead,
                      ),
                    ).getTime() < date.getTime()
                  ) {
                    return 'btn-active btn-error btn-gap'
                  }
                  return view === 'month' && config?.includes(date.toString())
                    ? 'btn-active btn-success btn-gap'
                    : 'btn-primary available'
                }}
              />

              <p className="text-error">{passSpecificDaysLimitMessage}</p>
            </div>
          ) : (
            <div //Days of the week
              className={`join flex w-full space-x-1.5 ${
                config !== null && 'mb-6'
              }`}
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
        {config === null && (
          <p className="mb-3 p-0 text-error">At least one day required</p>
        )}

        <select //Timezone dropdown
          value={timezone as string}
          onChange={(e) => setTimezone(e.target.value)}
          className="select w-full border-gray-300 bg-white text-base font-normal"
        >
          <option disabled value="">
            Timezone
          </option>
          {sortedTimeZones.map(({ value, label }, key) => (
            <option key={key} value={value}>
              {label}
            </option>
          ))}
        </select>
        {timezone === null && (
          <p className="mt-0 p-0 text-error">Timezone is required</p>
        )}
      </form>
    </>
  )
}

export default EventForm
