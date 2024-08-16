'use client'
import { UUID } from 'crypto'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import EventView from '@/components/EventView'
import EventCard from '@/components/EventCard'
import Grid from '@/components/AvailabilityGrid'
import Responses from '@/components/Responses'

// Placeholder data for responders, including names and availability times
interface Attendee {
  user: { name: string }
  timesegments: {
    [key: string]: {
      beginning: string
      end: string
      type: string
    }[]
  }
}

// gets attendee data from the API and formats it
const getAttendeeData = (attendees: Attendee[]) => {
  return attendees.map((attendee) => ({
    user: attendee.user,
    timesegments: attendee.timesegments,
  }))
}

const placeholderResponders: Attendee[] = [
  {
    user: { name: 'John Doe' },
    timesegments: {
      Sun: [],
      Fri: [{ beginning: '2:00 PM', end: '5:00 PM', type: 'Regular' }],
      Sat: [
        { beginning: '1:00 PM', end: '2:00 PM', type: 'Regular' },
        { beginning: '5:00 PM', end: '7:00 PM', type: 'Regular' },
      ],
    },
  },
  {
    user: { name: 'Jane Smith' },
    timesegments: {
      Sun: [{ beginning: '1:00 PM', end: '4:00 PM', type: 'Regular' }],
      Fri: [{ beginning: '2:00 PM', end: '6:00 PM', type: 'Regular' }],
      Sat: [{ beginning: '3:00 PM', end: '5:00 PM', type: 'Regular' }],
    },
  },
  {
    user: { name: 'Bob Johnson' },
    timesegments: {
      Sun: [{ beginning: '3:00 PM', end: '5:00 PM', type: 'Regular' }],
      Fri: [{ beginning: '4:00 PM', end: '7:00 PM', type: 'Regular' }],
      Sat: [{ beginning: '2:00 PM', end: '6:00 PM', type: 'Regular' }],
    },
  },
]

const ViewEvent = () => {
  const searchParams = useSearchParams()
  const eventId = searchParams.get('eventId')

  const [events, setEvents] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const [isAvailable, setIsAvailable] = useState(false) // set to true when name is entered at sign in
  const [isButtonsVisible, setIsButtonsVisible] = useState(false) // New state to control visibility of buttons

  const [responders, setResponders] = useState<Attendee[]>(
    getAttendeeData(placeholderResponders),
  ) // Placeholder data for responders
  const [hoveredCell, setHoveredCell] = useState<{
    day: string
    time: string
  } | null>(null) // for cell hover in availability grid and responses

  // Callback Function to handle cell hover
  const handleCellHover = (day: string, time: string) => {
    setHoveredCell({ day, time })
  }

  // Converts the config object of days of the week to an array of strings
  const convertConfigToArray = (config: {
    [key: string]: boolean
  }): string[] => {
    const daysOfWeekArray: string[] = []
    for (const day in config) {
      if (config[day]) {
        daysOfWeekArray.push(day)
      }
    }
    return daysOfWeekArray
  }

  useEffect(() => {
    const getTheEvent = async () => {
      fetch(`/api/events?eventId=${eventId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => {
              throw new Error(err.message)
            })
          }
          return response.json()
        })
        .then((data) => {
          setEvents(data)
        })
        .catch((error) => {
          setError(error.message)
          console.error('Error:', error.message)
        })
    }

    if (eventId) {
      getTheEvent()
    } else {
      setError('No event found')
    }
  }, [eventId])

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div //main screen
      className="flex min-h-screen w-full flex-col gap-8 p-8 md:flex-row"
    >
      <section //Left side container (Event form)
        className="h-full w-full rounded-lg px-6 py-16 shadow-lg md:w-[30%]"
      >
        {events.map((event) => (
          <EventCard // Event Card to display Event Details
            title={event.title}
            starttime={event.starttime}
            endtime={event.endtime}
            key={event.id}
          />
        ))}

        <div //button container for positioning button
          className="mx-4 flex justify-center pt-8"
        >
          <EventView // Event View which has Copy Link button
          />
        </div>
      </section>

      <section //Middle side container (Availability Grid)
        className="w-full gap-8 md:w-[57%]"
      >
        {events.map((event) => (
          <Grid // Availability Grid
            earliestTime={event.starttime}
            latestTime={event.endtime}
            isAvailable={isAvailable}
            responders={responders}
            key={event.id}
            mode={event.mode}
            config={convertConfigToArray(event.config)}
            setConfig={event.setConfig}
            onCellHover={handleCellHover}
          />
        ))}
        <div //button container for positioning "Save" and "Cancel" buttons
          className="flex flex-row justify-center gap-4 pt-8 "
        >
          <button
            className="btn btn-primary ml-4 rounded-full px-4 py-2 text-white"
            onClick={() => {
              setIsAvailable(true)
              setIsButtonsVisible(true) // Show buttons when user signs in
            }}
          >
            Edit My Availability
          </button>

          {isButtonsVisible && (
            <>
              <button
                className="btn btn-outline rounded-full px-4 py-2 text-red-400 hover:!border-red-400 hover:bg-red-300"
                onClick={() => {
                  setIsAvailable(false)
                  setIsButtonsVisible(false)
                }} // Set availability selection mode to false when user cancels
              >
                Cancel
              </button>

              <button className="btn btn-primary rounded-full px-4 py-2 text-white">
                Save
              </button>
            </>
          )}
        </div>
      </section>

      <section //Right side container (Responses)
        className="w-full py-8 md:w-[13%]"
      >
        <Responses responders={responders} hoveredCell={hoveredCell} />
      </section>
    </div>
  )
}

const ViewEventWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ViewEvent />
  </Suspense>
)

export default ViewEventWrapper
