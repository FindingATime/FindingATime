'use client'
import { useState, useRef, useEffect } from 'react'
import { randomUUID, UUID } from 'crypto'
import { addUserCreateEvent, getUser } from '@/utils/userUtils'
import { insertEvent } from '@/utils/eventsUtils'
import { useRouter } from 'next/navigation'

import EventForm from '@/components/EventForm'
import Grid from '@/components/AvailabilityGrid'
import Responses from '@/components/Responses'
import Header from '@/components/Header'

export default function CreateEvent() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [earliestTime, setEarliestTime] = useState('9:00 AM')
  const [latestTime, setLatestTime] = useState('5:00 PM')
  const [mode, setMode] = useState('weekly')
  const [config, setConfig] = useState<string[]>([])
  const [timezone, setTimezone] = useState('')

  const [isAvailable, setIsAvailable] = useState(false) // set to true when name is entered at sign in, Determines if the grid is selectable (selection mode)
  const [userName, setUserName] = useState('') // set to name entered at sign in
  const dialogRef = useRef<HTMLDialogElement>(null) // modal

  const [isButtonsVisible, setIsButtonsVisible] = useState(false) // New state to control visibility of buttons

  useEffect(() => {
    // Check if user is signed in
    getUser(localStorage.getItem('username') as UUID)
      .then((data) => {
        if (data) {
          setUserName(data[0].name)
        }
      })
      .catch((error) => {
        console.error('Error:', error.message)
      })

    if (localStorage.getItem('username')) {
      setUserName(localStorage.getItem('username') as string)
    }
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
    console.log('Username: ', userName)
    const daysOfWeekJSON: { [key: string]: boolean } = {
      Mon: false,
      Tue: false,
      Wed: false,
      Thu: false,
      Fri: false,
      Sat: false,
      Sun: false,
    }

    const configJSON: { [key: string]: string[] } = {
      days: [],
    }

    if (mode === 'weekly') {
      config.forEach((day) => {
        if (daysOfWeekJSON.hasOwnProperty(day)) {
          daysOfWeekJSON[day] = true
        }
      })
    } else {
      config.forEach((day) => {
        configJSON.days.push(day)
      })
    }

    try {
      const data = await addUserCreateEvent(
        userName,
        title,
        description,
        earliestTime,
        latestTime,
        location,
        timezone,
        mode,
        mode === 'weekly'
          ? daysOfWeekJSON // for days of the week {Mon: true, Tue: false, ...}
          : JSON.parse(JSON.stringify({ days: configJSON.days })), // for specific days {days: [1, 2, 3, ...]}, days are numbers
      )
      router.push(`/view-event?eventId=${data[0].id}`) // Redirects to the event view page using the eventId
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
    if (dialogRef.current && userName === '') {
      console.log('Opening modal')
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
                className="btn btn-primary ml-4 rounded-full px-4 py-2 text-white"
                onClick={openModal}
              >
                Add Availability
              </button>
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
            setConfig={setConfig}
          />

          {isButtonsVisible && ( // Conditionally render buttons section
            <div //button container for positioning "Create Event" button
              className="flex flex-row justify-center gap-4 pt-8 "
            >
              <button
                className="btn btn-primary rounded-full px-4 py-2 text-white"
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
