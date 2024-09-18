'use client'
import { useState, useEffect } from 'react'
import { UUID } from 'crypto'
import { addUserCreateEvent, getUser } from '@/utils/userUtils'
import { addAttendee, Schedule } from '@/utils/attendeesUtils'
import { useRouter } from 'next/navigation'

import EventForm from '@/components/EventForm'
import Grid from '@/components/AvailabilityGrid'
import Header from '@/components/Header'

export default function CreateEvent() {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [earliestTime, setEarliestTime] = useState('9:00 AM')
  const [latestTime, setLatestTime] = useState('5:00 PM')
  const [mode, setMode] = useState('weekly')
  const [config, setConfig] = useState<string[] | null>([])
  const [timezone, setTimezone] = useState<string | null>('')
  const [schedule, setSchedule] = useState<Schedule>({})

  const [isAvailable, setIsAvailable] = useState(false) // set to true when name is entered at sign in, Determines if the grid is selectable (selection mode)
  const [userName, setUserName] = useState<string | null>(null) // set to name entered at sign in

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is signed in
    const promises = []
    if (localStorage.getItem('username')) {
      const promise = getUser(localStorage.getItem('username') as UUID)
        .then((data) => {
          if (data) {
            setUserName(data[0].name)
          } else {
            setUserName('Guest')
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
  }

  return (
    <div className="w-full">
      <Header />
      <div //main screen
        className="flex min-h-screen w-full flex-col gap-8 p-8 md:flex-row"
      >
        <section //Left side container (Event form)
          className="sticky top-0 h-full w-full rounded-lg px-6 pb-16 shadow-lg md:w-[30%]"
        >
          <EventForm
            username={userName}
            setUsername={setUserName}
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
            isAvailable={isAvailable}
            setIsAvailable={setIsAvailable}
          />
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
        </section>
      </div>
    </div>
  )
}
