'use client'
import React from 'react'
import { useState, useRef } from 'react'
import Calendar from 'react-calendar'
import { useRouter } from 'next/navigation'
import { UUID } from 'crypto'
import '@/app/calendarStyles.css'

import Username from '@/components/Username'
import { days, months, isSameDate } from '@/utils/dateUtils'
import { times, sortedTimeZones } from '@/utils/timeUtils'
import { addUserCreateEvent } from '@/utils/userUtils'
import { addAttendee, Schedule } from '@/utils/attendeesUtils'

interface EventFormProps {
  username: string | null
  setUsername: React.Dispatch<React.SetStateAction<string | null>>
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
  config: string[] | null
  setConfig: React.Dispatch<React.SetStateAction<string[] | null>>
  timezone: string | null
  setTimezone: React.Dispatch<React.SetStateAction<string | null>>
  isAvailable: boolean
  setIsAvailable: React.Dispatch<React.SetStateAction<boolean>>
  schedule: Schedule
}

const EventForm = ({
  username,
  setUsername,
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
  isAvailable,
  setIsAvailable,
  schedule,
}: EventFormProps) => {
  const [passSpecificDaysLimitMessage, setPassSpecificDaysLimitMessage] =
    useState('')
  const dialogRef = useRef<HTMLDialogElement>(null) // modal

  const [isButtonsVisible, setIsButtonsVisible] = useState(false) // New state to control visibility of buttons
  const [hasTitleBeenChanged, setHasTitleBeenChanged] = useState(false) // New state to control visibility of title error message
  const [hasLocationBeenChanged, setHasLocationBeenChanged] = useState(false) // New state to control visibility of location error message

  const maxDaysAhead = 60
  const maxDaysSelectable = 7

  //added router to redirect to view-event page after creating event
  const router = useRouter()

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

  // Function to open modal for after clicking "Sign In"
  const openModal = () => {
    if (dialogRef.current && !username) {
      dialogRef.current.showModal()
    } else {
      setIsAvailable(true)
      setIsButtonsVisible(true)
    }
  }

  const handleSubmit = async () => {
    const daysOfWeekJSON: { [key: string]: boolean } = {
      Mon: false,
      Tue: false,
      Wed: false,
      Thu: false,
      Fri: false,
      Sat: false,
      Sun: false,
    }

    let inputLengthError = false
    if (title.length === 0 || title.length > 120) {
      inputLengthError = true
    }
    if (description.length === 0 || description.length > 500) {
      inputLengthError = true
    }
    if (location.length === 0 || location.length > 120) {
      inputLengthError = true
    }
    if (config?.length === 0) {
      inputLengthError = true
      setConfig(null)
    }

    if (inputLengthError) {
      return
    }

    const configJSON: { [key: string]: string[] } = {
      days: [],
    }

    if (mode === 'weekly') {
      config?.forEach((day) => {
        if (daysOfWeekJSON.hasOwnProperty(day)) {
          daysOfWeekJSON[day] = true
        }
      })
    } else {
      config?.forEach((day) => {
        configJSON.days.push(day)
      })
    }

    try {
      await addUserCreateEvent(
        username ? username : 'Guest',
        title as string,
        description,
        earliestTime,
        latestTime,
        location as string,
        timezone as string,
        mode,
        mode === 'weekly'
          ? daysOfWeekJSON // for days of the week {Mon: true, Tue: false, ...}
          : JSON.parse(JSON.stringify({ days: configJSON.days })), // for specific days {days: [1, 2, 3, ...]}, days are numbers
      ).then((data) => {
        // Add attendee to the event
        addAttendee(
          data[0].id,
          localStorage.getItem('username') as UUID,
          schedule,
        )
        // Redirects to the event view page using the eventId
        router.push(`/view-event?eventId=${data[0].id}`)
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error.message)
      } else {
        console.error('Unexpected error:', error)
      }
    }
    // handleSaveResponse() // Call handleSaveResponse to save the response
    setIsAvailable(false) // Set availability to false when user creates event/saves their availability
  }

  return (
    <>
      <div className="mb-6">
        {username != null && isAvailable && (
          <Username username={username} setUsername={setUsername} />
        )}
      </div>
      <form //Form to enter Event data (Title, Description...etc)
        className="flex w-full flex-col"
      >
        <input //Event Title text input
          type="text"
          value={title as string}
          placeholder="New Event Title"
          onChange={(e) => {
            setHasTitleBeenChanged(true)
            setTitle(e.target.value)
          }}
          className={`input w-full border-gray-300 text-xl font-normal focus-visible:ring-0 ${
            (!hasTitleBeenChanged ||
              (title.length > 0 && title.length <= 120)) &&
            'mb-6'
          }`}
        />
        {hasTitleBeenChanged && (title.length === 0 || title.length > 120) && (
          <p className="mb-3 p-0 text-error">
            Title must be between 1 and 120 characters.
          </p>
        )}

        <textarea //Event Description text input
          rows={3}
          value={description}
          placeholder="Event Description (optional)"
          onChange={(e) => setDescription(e.target.value)}
          className={`textarea textarea-bordered w-full border-gray-300 text-base font-normal focus-visible:ring-0 ${
            description.length <= 500 && 'mb-6'
          }`}
        ></textarea>
        {description.length > 500 && (
          <p className="mb-3 p-0 text-error">
            Description must be less than 500 characters.
          </p>
        )}

        <input //Event Location text input
          type="text"
          value={location as string}
          placeholder="Location"
          onChange={(e) => {
            setHasLocationBeenChanged(true)
            setLocation(e.target.value)
          }}
          className={`input w-full border-gray-300 text-base font-normal focus-visible:ring-0 ${
            (!hasLocationBeenChanged ||
              (location.length > 0 && location.length <= 120)) &&
            'mb-6'
          }`}
        />
        {hasLocationBeenChanged &&
          (location.length === 0 || location.length > 120) && (
            <p className="mb-3 p-0 text-error">
              Location must be between 1 and 120 characters.
            </p>
          )}

        <div //Event EarliestTime to LatestTime row container
          className="flex w-full flex-row items-center justify-center gap-3"
        >
          <select //EarliestTime dropdown
            value={earliestTime}
            onChange={(e) => setEarliestTime(e.target.value)}
            className="select mb-6 w-full max-w-xl border-gray-300 text-base font-normal"
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
            className="select mb-6 w-full max-w-xl border-gray-300 text-base font-normal"
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
                    months[dateValue.getUTCMonth()] +
                    ' ' +
                    dateValue.getUTCDate() +
                    ' ' +
                    dateValue.getUTCFullYear()
                  let newSpecificDays: string[] = config ? config : []
                  if (
                    !newSpecificDays?.some((day) => {
                      return isSameDate(day, monthDateYear)
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
                      return !isSameDate(day, monthDateYear)
                    })
                    setConfig(
                      (prevConfig) =>
                        prevConfig?.filter((day) => {
                          return !isSameDate(day, monthDateYear)
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
                  className="btn btn-circle btn-sm h-10 w-10 border-gray-300 text-sm font-normal"
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
          className="select w-full border-gray-300 text-base font-normal"
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
      <div //button container for positioning button
        className="mx-4 flex justify-center pt-8"
      >
        {!isAvailable && ( //"Add Availability" button is only visible when user has not signed in and added their availability
          <button
            className="btn btn-primary ml-4 rounded-full px-4 py-2"
            onClick={openModal}
          >
            Add Availability
          </button>
        )}

        {isButtonsVisible && ( // Conditionally render buttons section
          <div //button container for positioning "Create Event" button
            className="flex flex-row justify-center gap-4"
          >
            <button
              className="btn btn-primary rounded-full px-4 py-2"
              onClick={() => {
                setIsButtonsVisible(false)
                handleSubmit()
              }}
            >
              Create Event
            </button>
          </div>
        )}

        <dialog ref={dialogRef} id="username_modal" className="modal">
          <div className="modal-box focus:outline-white ">
            <h3 className="py-4 text-lg font-bold">Sign In</h3>

            <input
              type="text"
              placeholder="Enter Your Name"
              className="input input-bordered w-full max-w-xs py-4"
              value={username ? username : ''}
              onChange={(e) => {
                setUsername(e.target.value)
              }}
            />

            <div className="modal-action">
              <form method="dialog">
                <button
                  className="btn btn-primary ml-4 rounded-full px-4 py-2"
                  onClick={() => {
                    setIsAvailable(true) // Update isAvailable to true when name is entered
                    setIsButtonsVisible(true) // Show buttons when user signs in
                  }}
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}

export default EventForm
