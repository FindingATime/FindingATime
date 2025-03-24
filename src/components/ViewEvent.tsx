'use client'
import { UUID } from 'crypto'
import {
  addAttendee,
  Attendee,
  getAttendees,
  editAttendee,
  TimeSegment,
  Schedule,
} from '@/utils/attendeesUtils'

import { Suspense, useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { getEvent, Event } from '@/utils/eventsUtils'
import { createUser, getUser } from '@/utils/userUtils'
import {
  convertDateAndTimeToGoogleFormat,
  days,
  months,
} from '@/utils/dateUtils'

import Header from '@/components/Header'
import EventView from '@/components/EventView'
import EventFormView from '@/components/EventFormView'
import Grid from '@/components/AvailabilityGrid'
import Responses from '@/components/Responses'
import Username from '@/components/Username'
import PreferredTimes from '@/components/PreferredTimes'
import { get } from 'http'
import { getTimeZoneIdentifier } from '@/utils/timeUtils'

const ViewEvent = () => {
  const searchParams = useSearchParams()
  const eventId = searchParams.get('eventId')
  const [event, setEvent] = useState<Event>()
  const [error, setError] = useState<string | null>(null)
  const [recentlyViewedEvents, setRecentlyViewedEvents] = useState<Event[]>([])
  const [schedule, setSchedule] = useState<Schedule>({})
  const [beforeEditSchedule, setBeforeEditSchedule] = useState<Schedule>({})
  const [userName, setUserName] = useState<string | null>(null) // set to name entered when adding availability
  const [creatorID, setCreatorID] = useState<UUID | null>(null)

  const [isAvailable, setIsAvailable] = useState(false)
  const [isButtonsVisible, setIsButtonsVisible] = useState(false) // New state to control visibility of buttons
  const [isNewUser, setIsNewUser] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newSchedule, setNewSchedule] = useState<Schedule>({})
  const [attendeeTimeSegments, setAttendeeTimeSegments] = useState<Schedule>({})
  const [isSelectingMeetingTime, setIsSelectingMeetingTime] = useState(false)
  const [meetingTimeSegment, setMeetingTimeSegment] = useState<{
    date: string
    timesegment: TimeSegment
  }>({ date: '', timesegment: { beginning: '', end: '', type: '' } })

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
              months[new Date(date).getUTCMonth()] +
              ' ' +
              new Date(date).getUTCDate() +
              ' ' +
              new Date(date).getUTCFullYear(),
          )
      : Object.keys(config)
          .filter((day) => config[day])
          .sort((a, b) => days.indexOf(a) - days.indexOf(b)) // weekly
  }

  // gets attendee data from the API and formats it
  const formatAttendeeData = (attendees: Attendee[]): Attendee[] => {
    return attendees.map((attendee) => ({
      users: attendee.users,
      attendee: attendee.attendee,
      timesegments: attendee.timesegments,
    }))
  }

  useEffect(() => {
    const promises: Promise<any>[] = []
    if (localStorage.getItem('username')) {
      const promise = getUser(localStorage.getItem('username') as UUID).then(
        (data) => {
          if (data) {
            setUserName(data[0].name)
          }
          promises.push(promise)
        },
      )
    }
    const promise = getEvent(eventId as UUID)
      .then(async (data) => {
        const newEvent: Event = {
          id: eventId as UUID,
          viewTime: new Date(),
          title: data[0].title,
          description: data[0].description,
          starttime: data[0].starttime,
          endtime: data[0].endtime,
          timezone: data[0].timezone,
          location: data[0].location,
          config: data[0].config || {},
          mode: data[0].mode,
          creator: data[0].creator,
        }
        setCreatorID(
          localStorage.getItem('username')
            ? (localStorage.getItem('username') as UUID)
            : null,
        )

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
        promises.push(promise)
      })
      .catch((error) => {
        setError('No event found')
      })

    // Fetch attendees data
    getAttendees(eventId as UUID)
      .then((data) => {
        if (data) {
          //format attendee data
          setAttendeeTimeSegments(
            data.map((attendee: Attendee) => attendee.timesegments),
          )
          const formattedData = formatAttendeeData(data)
          setResponders(formattedData) // Set the responders state with the fetched data

          // set schedule to be the availabilities for the event submitted by users
          // currently only users in the responders list can see the events colored
          if (eventId && formattedData) {
            const user = formattedData.find(
              (responder) =>
                responder.attendee ===
                (localStorage.getItem('username') as UUID),
            )
            const isMeetingTimeSet = formattedData.some((responder) =>
              Object.values(responder.timesegments).some((timeSegmentsArray) =>
                timeSegmentsArray.some(
                  (timesegment) => timesegment.type === 'Meeting',
                ),
              ),
            )
            if (isMeetingTimeSet) {
              setIsSelectingMeetingTime(false)
              const foundMeetingTime = formattedData
                .flatMap((responder) =>
                  Object.entries(responder.timesegments).flatMap(
                    ([date, timeSegmentsArray]) =>
                      timeSegmentsArray
                        .filter((timesegment) => timesegment.type === 'Meeting')
                        .map((timesegment) => ({ date, timesegment })),
                  ),
                )
                .find(() => true)
              if (foundMeetingTime) {
                setMeetingTimeSegment(foundMeetingTime)
              }
            }

            const userSchedule = user?.timesegments
            if (userSchedule) {
              setSchedule(userSchedule)
            }
          }
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
        }
      })
      .catch((error) => {
        setError('Failed to load attendees')
      })
    setIsAvailable(false)
    Promise.all(promises).then(() => {
      setIsLoading(false)
    })
  }, [eventId, newSchedule])

  const openModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal()
    } else {
      setIsAvailable(true)
      setIsButtonsVisible(true)
    }
  }

  const createGoogleCalendarInvite = async () => {
    // Create Google Calendar Invite
    if (event) {
      const title = encodeURIComponent(event.title as string)
      const description = encodeURIComponent(event.description as string)
      const mylocation = encodeURIComponent(event.location as string)
      const startDateTime = encodeURIComponent(
        convertDateAndTimeToGoogleFormat(
          meetingTimeSegment.date,
          meetingTimeSegment.timesegment.beginning,
          event.mode,
        ),
      )
      const endDateTime = encodeURIComponent(
        convertDateAndTimeToGoogleFormat(
          meetingTimeSegment.date,
          meetingTimeSegment.timesegment.end,
          event.mode,
        ),
      )
      const timeZone = encodeURIComponent(
        getTimeZoneIdentifier(event.timezone as string),
      )
      let url = ''
      if (event.mode === 'weekly') {
        const days = event.config

        let daysArray = []
        for (const day in days) {
          if (days[day]) {
            daysArray.push(day)
          }
        }
        // change the days to the format that google calendar accepts
        daysArray = daysArray.map((day) => {
          return day.substring(0, 2).toUpperCase()
        })
        const daysArrayString = daysArray.join(',')
        url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTime}/${endDateTime}&details=${description}&location=${mylocation}&ctz=${timeZone}&recur=RRULE:FREQ=WEEKLY;BYDAY=${daysArrayString}`
      } else if (event?.mode === 'specific') {
        url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTime}/${endDateTime}&details=${description}&location=${mylocation}&ctz=${timeZone}`
      }
      window.open(url, '_blank')
    }
  }

  return (
    <>
      <div className="w-full">
        <Header />
        <div //main screen
          className="flex min-h-screen w-full flex-col gap-8 p-8 md:flex-row"
        >
          <section //Left side container (Event form)
            className="sticky top-0 h-full w-full rounded-lg px-6 py-16 shadow-lg md:w-[30%]"
          >
            <div className="mb-6">
              {userName != null && isSignedIn && (
                <Username username={userName} setUsername={setUserName} />
              )}
            </div>
            {event && (
              <EventFormView // EventFormView to display Event Details
                title={event.title}
                description={event.description}
                location={event.location}
                mode={event.mode as 'weekly' | 'specific'}
                config={event.config}
                timezone={event.timezone}
              />
            )}

            <div //button container for positioning button
              className="mx-4 flex justify-center pt-8"
            >
              <EventView // Event View which has Copy Link button
                isCreator={event ? event.creator === creatorID : false}
                isAvailable={isAvailable}
                setIsAvailable={setIsAvailable}
                isButtonsVisible={isButtonsVisible}
                setIsButtonsVisible={setIsButtonsVisible}
                responders={responders}
                setSchedule={setSchedule}
                isSelectingMeetingTime={isSelectingMeetingTime}
                setIsSelectingMeetingTime={setIsSelectingMeetingTime}
                meetingTimeSegment={meetingTimeSegment}
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
                schedule={schedule}
                setSchedule={setSchedule}
                onCellHover={handleCellHover}
                isSelectingMeetingTime={isSelectingMeetingTime}
                meetingTimeSegment={meetingTimeSegment}
                setMeetingTimeSegment={setMeetingTimeSegment}
              />
            )}
            <div //button container for positioning "Save" and "Cancel" buttons
              className="flex flex-row justify-center gap-4"
            >
              {isNewUser &&
              !isSignedIn &&
              !isButtonsVisible &&
              meetingTimeSegment.timesegment.beginning === '' ? (
                <div>
                  <button
                    className="btn btn-primary ml-4 rounded-full px-4 py-2 text-white"
                    onClick={() => {
                      if (!localStorage.getItem('username')) {
                        openModal()
                      } else {
                        setIsAvailable(true) // Update isAvailable to true when name is entered
                        setIsButtonsVisible(true) // Show buttons when user signs in
                      }
                    }}
                  >
                    Add Availability
                  </button>
                </div>
              ) : (
                !isNewUser &&
                isSignedIn &&
                !isButtonsVisible &&
                meetingTimeSegment.timesegment.beginning === '' && (
                  <div>
                    <button
                      className="btn btn-primary ml-4 rounded-full px-4 py-2 text-white"
                      onClick={() => {
                        setIsAvailable(true)
                        setIsButtonsVisible(true) // Show buttons when user signs in
                        const user = responders.find(
                          (responder) =>
                            responder.attendee ===
                            (localStorage.getItem('username') as UUID),
                        )
                        const userSchedule = user?.timesegments
                        if (userSchedule != null) {
                          try {
                            const userScheduleCopy = JSON.parse(
                              JSON.stringify(userSchedule),
                            )
                            setBeforeEditSchedule(userScheduleCopy)
                            setSchedule(userScheduleCopy)
                          } catch (error) {
                            console.error('Error parsing user schedule:', error)
                          }
                        } else {
                          setSchedule({})
                          setBeforeEditSchedule({})
                        }
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
                    value={userName ? userName : ''}
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
                      setSchedule(beforeEditSchedule)
                      setIsButtonsVisible(false)
                      setIsAvailable(false)
                      setIsSelectingMeetingTime(false)
                      setUserName('') // Reset username when user cancels
                      setMeetingTimeSegment({
                        date: '',
                        timesegment: { beginning: '', end: '', type: '' },
                      })
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
                      if (isSelectingMeetingTime) {
                        createGoogleCalendarInvite()
                      }
                      if (isNewUser && userName) {
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
                            setSchedule(schedule)
                            setNewSchedule(schedule)
                            getAttendees(eventId as UUID).then((data) => {
                              if (data) {
                                //format attendee data
                                const formattedData = formatAttendeeData(data)
                                setResponders(formattedData) // Set the responders state with the fetched data
                              }
                            })
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
                          setSchedule(schedule)
                          setNewSchedule(schedule)
                          getAttendees(eventId as UUID).then((data) => {
                            if (data) {
                              //format attendee data
                              const formattedData = formatAttendeeData(data)
                              setResponders(formattedData) // Set the responders state with the fetched data
                            }
                          })
                        })
                      }

                      if (isSelectingMeetingTime) {
                        setIsSelectingMeetingTime(false)
                      }
                    }}
                  >
                    {isNewUser
                      ? 'Add Availability'
                      : isSelectingMeetingTime
                        ? 'Create'
                        : 'Save'}
                  </button>
                </>
              )}
            </div>
          </section>

          <section //Right side container (Responses)
            className="sticky top-0 h-1 w-full py-8 md:w-[13%]"
          >
            <Responses responders={responders} hoveredCell={hoveredCell} />
            <PreferredTimes
              attendeeTimeSegments={attendeeTimeSegments}
              mode={'weekly'}
            />
          </section>
        </div>
      </div>
    </>
  )
}

const ViewEventWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ViewEvent />
  </Suspense>
)

export default ViewEventWrapper
