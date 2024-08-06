'use client'
import React from 'react'
import Link from 'next/link'
import { Redirect } from 'next'

// Generate hourly time options array used for
// EarliestTime and LatestTime dropdowns
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
  timezone: string
  setTimezone: React.Dispatch<React.SetStateAction<string>>
  handleSubmit: () => void
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
  daysOfWeek,
  setDaysOfWeek,
  timezone,
  setTimezone,
  handleSubmit,
}: EventFormProps) => {
  // Function to handle selected daysOfWeek array based on checkbox selection and deselection
  const handleSelectedDayOfWeek = (day: string) => {
    setMode('weekly')
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

  return (
    <div className="flex w-full flex-col md:flex-row">
      <section //Left side container
        className="h-full w-full p-10 md:w-2/5"
      >
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

          <div //Days of the week
            className="join w-full"
          >
            <input
              className="btn join-item border-gray-300 bg-white"
              type="checkbox"
              name="options"
              aria-label="Mon"
              checked={daysOfWeek?.includes('Mon')}
              onChange={() => handleSelectedDayOfWeek('Mon')}
            />
            <input
              className="btn join-item border-gray-300 bg-white"
              type="checkbox"
              name="options"
              aria-label="Tue"
              checked={daysOfWeek?.includes('Tue')}
              onChange={() => handleSelectedDayOfWeek('Tue')}
            />
            <input
              className="btn join-item border-gray-300 bg-white"
              type="checkbox"
              name="options"
              aria-label="Wed"
              checked={daysOfWeek?.includes('Wed')}
              onChange={() => handleSelectedDayOfWeek('Wed')}
            />
            <input
              className="btn join-item border-gray-300 bg-white"
              type="checkbox"
              name="options"
              aria-label="Thu"
              checked={daysOfWeek?.includes('Thu')}
              onChange={() => handleSelectedDayOfWeek('Thu')}
            />
            <input
              className="btn join-item border-gray-300 bg-white"
              type="checkbox"
              name="options"
              aria-label="Fri"
              checked={daysOfWeek?.includes('Fri')}
              onChange={() => handleSelectedDayOfWeek('Fri')}
            />
            <input
              className="btn join-item border-gray-300 bg-white"
              type="checkbox"
              name="options"
              aria-label="Sat"
              checked={daysOfWeek?.includes('Sat')}
              onChange={() => handleSelectedDayOfWeek('Sat')}
            />
            <input
              className="btn join-item border-gray-300 bg-white"
              type="checkbox"
              name="options"
              aria-label="Sun"
              checked={daysOfWeek?.includes('Sun')}
              onChange={() => handleSelectedDayOfWeek('Sun')}
            />
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

        <button
          onClick={handleSubmit}
          className="btn btn-outline mt-6 w-full self-center"
        >
          Create Event
        </button>
      </section>

      <section //Right side container
        className="flex w-full bg-green-200 p-10 md:w-3/5"
      >
        <p>Right Panel</p>
      </section>
    </div>
  )
}

export default EventForm
