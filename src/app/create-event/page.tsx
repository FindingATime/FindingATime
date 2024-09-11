'use client'
import { useState, useRef, useEffect } from 'react'
import { randomUUID, UUID } from 'crypto'
import { addUserCreateEvent, getUser } from '@/utils/userUtils'
import { insertEvent } from '@/utils/eventsUtils'
import { addAttendee, Schedule } from '@/utils/attendeesUtils'
import { useRouter } from 'next/navigation'

import EventForm from '@/components/EventForm'
import Grid from '@/components/AvailabilityGrid'
import Responses from '@/components/Responses'
import Header from '@/components/Header'
import Username from '@/components/Username'

export default function CreateEvent() {
  const [title, setTitle] = useState<string | null>('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState<string | null>('')
  const [earliestTime, setEarliestTime] = useState('9:00 AM')
  const [latestTime, setLatestTime] = useState('5:00 PM')
  const [mode, setMode] = useState('weekly')
  const [config, setConfig] = useState<string[] | null>([])
  const [timezone, setTimezone] = useState<string | null>('')
  const [schedule, setSchedule] = useState<Schedule>({})

  const [isAvailable, setIsAvailable] = useState(false) // set to true when name is entered at sign in, Determines if the grid is selectable (selection mode)
  const [userName, setUserName] = useState<string | null>(null) // set to name entered at sign in
  const dialogRef = useRef<HTMLDialogElement>(null) // modal

  const [isButtonsVisible, setIsButtonsVisible] = useState(false) // New state to control visibility of buttons
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is signed in
    const promises = []
    if (localStorage.getItem('username')) {
      setUserName(localStorage.getItem('username') as string)
      const promise = getUser(localStorage.getItem('username') as UUID)
        .then((data) => {
          if (data) {
            setUserName(data[0].name)
          }
        })
        .catch((error) => {
          console.error('Error:', error.message)
        })
      promises.push(promise)
    }
    Promise.all(promises).then(() => {
      setLoading(false)
    })
  }, [])

  //added router to redirect to view-event page after creating event
  const router = useRouter()

  // TODO: append local to remote api call for selecting all responder usernames
  /*
  const handleSaveResponse = () => {
    if (userName) {
      setResponders((prevResponders) => {
        const updatedResponders = [...prevResponders, userName]
        return updatedResponders
      })
      if (dialogRef.current) {
        dialogRef.current.close()
      }
    }
  }
  */

  // Create Event Button function
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
    if (title?.length === 0) {
      setTitle(null)
    }
    if (location?.length === 0) {
      setLocation(null)
    }
    if (timezone?.length === 0) {
      setTimezone(null)
    }
    if (config?.length === 0) {
      setConfig(null)
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
        userName ? userName : 'Guest',
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
    setIsButtonsVisible(false) // Hide buttons after user creates event
  }

  // Function to open modal for after clicking "Sign In"
  const openModal = () => {
    if (dialogRef.current && !userName) {
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
          className="h-full w-full rounded-lg px-6 pb-16 shadow-lg md:w-[30%]"
        >
          <div className="mb-6">
            {userName != null && isAvailable && (
              <Username username={userName} setUsername={setUserName} />
            )}
          </div>
          <EventForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            location={location}
            setLocation={setLocation}
            earliestTime={earliestTime}
            setEarliestTime={setEarliestTime}
            latestTime={latestTime}
            setLatestTime={setLatestTime}
            mode={mode}
            setMode={setMode}
            config={config}
            setConfig={setConfig}
            timezone={timezone}
            setTimezone={setTimezone}
          />

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

            <dialog ref={dialogRef} id="username_modal" className="modal">
              <div className="modal-box focus:outline-white ">
                <h3 className="py-4 text-lg font-bold">Sign In</h3>

                <input
                  type="text"
                  placeholder="Enter Your Name"
                  className="input input-bordered w-full max-w-xs py-4"
                  value={userName ? userName : ''}
                  onChange={(e) => {
                    setUserName(e.target.value)
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
        </section>

        <section //Middle side container (Availability Grid)
          className="w-full gap-8 md:w-[57%]"
        >
          <Grid
            earliestTime={earliestTime}
            latestTime={latestTime}
            isAvailable={isAvailable}
            mode={mode}
            config={config}
            schedule={schedule}
            setSchedule={setSchedule}
          />

          {isButtonsVisible && ( // Conditionally render buttons section
            <div //button container for positioning "Create Event" button
              className="flex flex-row justify-center gap-4 pt-8 "
            >
              <button
                className="btn btn-primary rounded-full px-4 py-2"
                onClick={handleSubmit}
              >
                Create Event
              </button>
            </div>
          )}
        </section>

        <section //Right side container (Responses)
          className="w-full py-8 md:w-[13%]"
        >
          <Responses responders={[]} />
        </section>
      </div>
    </div>
  )
}
