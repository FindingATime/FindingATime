'use client'
import React from 'react'
import { days, modeOptions } from '@/utils/dateUtils'
import { useState } from 'react'
import Calendar from 'react-calendar'

// Generate hourly time options array used for
// EarliestTime and LatestTime dropdownss
const times: string[] = []
for (let hour = 1; hour <= 24; hour++) {
  const suffix = hour <= 12 ? 'AM' : 'PM'
  const displayHour = hour <= 12 ? hour : hour - 12
  times.push(`${displayHour}:00 ${suffix}`)
}

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
  daysOfWeek: string[] | null
  setDaysOfWeek: React.Dispatch<React.SetStateAction<string[] | null>>
  specificDays: Date[]
  setSpecificDays: React.Dispatch<React.SetStateAction<Date[]>>
  timezone: string
  setTimezone: React.Dispatch<React.SetStateAction<string>>
  handleSubmit: () => void
}

type ValuePiece = Date | null

type Value = ValuePiece[]

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
  daysOfWeek,
  setDaysOfWeek,
  specificDays,
  setSpecificDays,
  timezone,
  setTimezone,
  handleSubmit,
}: EventFormProps) => {
  // Function to handle selected daysOfWeek array based on checkbox selection and deselection
  const handleSelectedDayOfWeek = (day: string) => {
    daysOfWeek = daysOfWeek || []
    const index = daysOfWeek.indexOf(day)
    if (index === -1) {
      // Day is not in the array, add it
      setDaysOfWeek([...daysOfWeek, day])
    } else {
      // Day is already in the array, remove it
      const updatedDays = [...daysOfWeek]
      updatedDays.splice(index, 1)
      setDaysOfWeek(updatedDays)
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
          className="input w-full border-gray-300 bg-white text-2xl font-medium focus-visible:ring-0"
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
            }}
          >
            Weekly Days
          </button>
          <button
            type="button"
            className={`btn ${mode === 'specific' ? 'btn-active' : ''}`}
            onClick={() => setMode('specific')}
          >
            Specific Days
          </button>
        </div>
        <div>
          {mode === 'specific' ? (
            <Calendar // Specific days
              minDate={new Date()}
              maxDate={new Date(new Date().setDate(new Date().getDate() + 60))}
              activeStartDate={new Date()}
              onChange={(value) => {
                console.log(value)
                const dateValue = value as Date
                if (
                  !specificDays?.some(
                    (day) => day.getTime() === dateValue.getTime(),
                  )
                ) {
                  // Add the value date to the specificDays array
                  setSpecificDays([...specificDays, dateValue])
                } else {
                  // Remove the value date from the specificDays array
                  const updatedDays = specificDays.filter(
                    (day) => day.getTime() !== dateValue.getTime(),
                  )
                  setSpecificDays(updatedDays)
                }
                console.log(specificDays)
              }}
            />
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
                  checked={daysOfWeek?.includes(day) || false}
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
      <button //Submit button
        onClick={handleSubmit}
        className="btn btn-primary mt-10 w-full"
      >
        Create Event
      </button>
    </>
  )
}

export default EventForm
