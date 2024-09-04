'use client'
import { UUID } from 'crypto'
import {
  addAttendee,
  Attendee,
  getAttendees,
  editAttendee,
} from '@/utils/attendeesUtils'

import { Suspense, useEffect, useState, useRef, lazy } from 'react'
import { useSearchParams } from 'next/navigation'
import { getEvent, Event } from '@/utils/eventsUtils'
import { Schedule } from '@/utils/attendeesUtils'
import { createUser } from '@/utils/userUtils'
import { days, months } from '@/utils/dateUtils'

import Header from '@/components/Header'
import EventView from '@/components/EventView'
import EventCard from '@/components/EventCard'
import Grid from '@/components/AvailabilityGrid'
import Responses from '@/components/Responses'
import { create } from 'domain'

const ViewEvent = () => {
  const searchParams = useSearchParams()
  const eventId = searchParams.get('eventId')
  const [event, setEvent] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [recentlyViewedEvents, setRecentlyViewedEvents] = useState<Event[]>([])
  const [schedule, setSchedule] = useState<Schedule>({})
  const [userName, setUserName] = useState<string>('') // set to name entered when adding availability
  const [userAvailability, setUserAvailability] = useState<Schedule>({}) // set to name entered when adding availability
  const [config, setConfig] = useState<string[]>([]) // set to name entered when adding availability

  const [isAvailable, setIsAvailable] = useState(false) // set to true when name is entered at sign in
  const [isButtonsVisible, setIsButtonsVisible] = useState(false) // New state to control visibility of buttons
  const [isNewUser, setIsNewUser] = useState(false) // New state to control visibility of buttons
  const [isSignedIn, setIsSignedIn] = useState(false) // New state to control visibility of buttons

  const [responders, setResponders] = useState<Attendee[]>([]) // Set the responders state with the fetched data
  const [hoveredCell, setHoveredCell] = useState<{
    day: string
    time: string
  } | null>(null) // for cell hover in availability grid and responses
  const dialogRef = useRef<HTMLDialogElement>(null) // modal

  // Callback Function to handle cell hover
  const handleCellHover = (day: string, time: string) => {
    setHoveredCell({ day, time })
  }

  // Converts the config object of days of the week to an array of strings
  const convertConfigToArray = (config: {
    [key: string]: boolean | string[]
  }): string[] => {
    if (!config || typeof config !== 'object') {
      console.error('Invalid config:', config)
      return []
    }
    return Array.isArray(config.days)
      ? config.days
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
          .map(
            (date) =>
              months[new Date(date).getMonth()] +
              ' ' +
              new Date(date).getDate(),
          )
      : Object.keys(config)
          .filter((day) => config[day])
          .sort((a, b) => days.indexOf(a) - days.indexOf(b)) // weekly
  }

  // gets attendee data from the API and formats it
  const formatAttendeeData = (attendees: Attendee[]): Attendee[] => {
    return attendees.map((attendee) => ({
      users: attendee.users, // Ensure this matches the expected structure
      attendee: attendee.attendee, // Ensure this matches the expected structure
      timesegments: attendee.timesegments, // Ensure this matches the expected structure
    }))
  }

  useEffect(() => {
    getEvent(eventId as UUID)
      .then(async (data) => {
        const newEvent: Event = {
          id: eventId as UUID,
          viewTime: new Date(),
          title: data[0].title,
          starttime: data[0].starttime,
          endtime: data[0].endtime,
          timezone: data[0].timezone,
          location: data[0].location,
          config: data[0].config || {},
          mode: data[0].mode || 'weekly', // TODO: need to modify to include both weekly & specific dates
        }

        setEvent(newEvent)
        // Update the recently viewed events in local storage
        if (!localStorage.getItem('FindingATimeRecentlyViewed')) {
          localStorage.setItem(
            'FindingATimeRecentlyViewed',
            JSON.stringify([newEvent]),
          )
          setRecentlyViewedEvents([newEvent])
        } else {
          let newRecentlyViewedEvents: Event[] = JSON.parse(
            localStorage.getItem('FindingATimeRecentlyViewed') as string,
          )
          newRecentlyViewedEvents = newRecentlyViewedEvents.filter((event) => {
            return event.id !== newEvent.id
          })
          newRecentlyViewedEvents.push(newEvent)
          newRecentlyViewedEvents = newRecentlyViewedEvents.sort((a, b) => {
            return (
              new Date(b.viewTime).getTime() - new Date(a.viewTime).getTime()
            )
          })
          localStorage.setItem(
            'FindingATimeRecentlyViewed',
            JSON.stringify(newRecentlyViewedEvents),
          )
          setRecentlyViewedEvents(newRecentlyViewedEvents)
        }
      })
      .catch((error) => {
        setError('No event found')
      })

    // Fetch attendees data
    getAttendees(eventId as UUID)
      .then((data) => {
        if (data) {
          //format attendee data
          const formattedData = formatAttendeeData(data)
          setResponders(formattedData) // Set the responders state with the fetched data
        } else {
          setError('No attendees found')
        }
        // If user is not an attendee of this event
        // allow them to add availability
        if (
          !data.some(
            (attendee: Attendee) =>
              (attendee.attendee as UUID) ===
              (localStorage.getItem('username') as UUID),
          ) &&
          !isSignedIn
        ) {
          setIsNewUser(true)
          setIsSignedIn(false)
        } else {
          setIsNewUser(false)
          setIsSignedIn(true)
          setSchedule(
            data.find(
              (attendee: Attendee) =>
                (attendee.attendee as UUID) ===
                (localStorage.getItem('username') as UUID),
            )?.timesegments,
          )
        }
      })
      .catch((error) => {
        setError('Failed to load attendees')
      })
    setIsAvailable(false)
  }, [eventId, userAvailability])

  const openModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal()
    } else {
      setIsAvailable(true)
      setIsButtonsVisible(true)
    }
  }

  return (
    <div className="w-full">
      <Header />
      <div //main screen
        className="flex min-h-screen w-full flex-col gap-8 p-8 md:flex-row"
      >
        <section //Left side container (Event form)
          className="h-full w-full rounded-lg px-6 py-16 shadow-lg md:w-[30%]"
        >
          {event && (
            <EventCard // Event Card to display Event Details
              eventId={event.id}
              title={event.title}
              starttime={event.starttime}
              endtime={event.endtime}
              location={event.location}
              timezone={event.timezone}
              key={event.id}
            />
          )}

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
          {event && (
            <Grid // Availability Grid
              earliestTime={event.starttime}
              latestTime={event.endtime}
              isAvailable={isAvailable}
              responders={responders}
              mode={event.mode}
              config={convertConfigToArray(event.config)}
              setConfig={setConfig}
              schedule={schedule}
              setSchedule={setSchedule}
              userAvailability={userAvailability}
              setUserAvailability={setUserAvailability}
              onCellHover={handleCellHover}
            />
          )}
          <div //button container for positioning "Save" and "Cancel" buttons
            className="flex flex-row justify-center gap-4 pt-8 "
          >
            {isNewUser && !isSignedIn ? (
              <div>
                <button
                  className="btn btn-primary ml-4 rounded-full px-4 py-2 text-white"
                  onClick={() => {
                    openModal()
                  }}
                >
                  Add Availability
                </button>
              </div>
            ) : (
              !isNewUser &&
              isSignedIn &&
              !isButtonsVisible && (
                <div>
                  <button
                    className="btn btn-primary ml-4 rounded-full px-4 py-2 text-white"
                    onClick={() => {
                      setIsAvailable(true)
                      setIsButtonsVisible(true) // Show buttons when user signs in
                    }}
                  >
                    Edit Availability
                  </button>
                </div>
              )
            )}
            <dialog ref={dialogRef} id="username_modal" className="modal">
              <div className="modal-box bg-white focus:outline-white ">
                <h3 className="py-4 text-lg font-bold">Sign In</h3>
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  className="input input-bordered w-full max-w-xs bg-white py-4"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value)
                  }}
                />

                <div className="modal-action">
                  <form method="dialog">
                    <button
                      className="btn btn-primary ml-4 rounded-full px-4 py-2 text-white"
                      onClick={() => {
                        setIsAvailable(true) // Update isAvailable to true when name is entered
                        setIsButtonsVisible(true) // Show buttons when user signs in
                        setUserName(userName)
                        setIsSignedIn(true)
                      }}
                    >
                      Sign In
                    </button>
                  </form>
                </div>
              </div>
            </dialog>

            {isButtonsVisible && (
              <>
                <button
                  className="btn btn-outline rounded-full px-4 py-2 text-red-400 hover:!border-red-400 hover:bg-red-300"
                  onClick={() => {
                    setIsAvailable(false)
                    setIsButtonsVisible(false)
                    setUserName('') // Reset username when user cancels
                    if (!localStorage.getItem('username')) {
                      setIsSignedIn(false)
                    }
                  }} // Set availability selection mode to false when user cancels
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary rounded-full px-4 py-2 text-white"
                  onClick={() => {
                    if (isNewUser) {
                      createUser(userName).then((data) => {
                        addAttendee(
                          eventId as UUID,
                          localStorage.getItem('username') as UUID,
                          schedule,
                        ).then(() => {
                          setIsAvailable(false)
                          setIsButtonsVisible(false)
                          setIsSignedIn(true)
                          setIsNewUser(false)
                          setUserName('') // Reset username when user saves
                          setUserAvailability(schedule)
                        })
                      })
                    } else {
                      editAttendee(
                        eventId as UUID,
                        localStorage.getItem('username') as UUID,
                        schedule,
                      ).then(() => {
                        setIsAvailable(false)
                        setIsButtonsVisible(false)
                        setIsSignedIn(true)
                        setIsNewUser(false)
                        setUserName('') // Reset username when user saves
                        setUserAvailability(schedule)
                      })
                    }
                  }}
                >
                  {isNewUser ? 'Add Availability' : 'Save'}
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
    </div>
  )
}

const ViewEventWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ViewEvent />
  </Suspense>
)

export default ViewEventWrapper
