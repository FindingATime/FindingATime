'use client'
import { useState, useEffect } from 'react'
import { UUID } from 'crypto'
import { getUser } from '@/utils/userUtils'
import { Schedule } from '@/utils/attendeesUtils'

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
  const [config, setConfig] = useState<string[]>([])
  const [timezone, setTimezone] = useState<string>('')
  const [schedule, setSchedule] = useState<Schedule>({})

  const [isAvailable, setIsAvailable] = useState(false) // set to true when name is entered at sign in, Determines if the grid is selectable (selection mode)
  const [userName, setUserName] = useState<string | null>('Guest') // set to name entered at sign in

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
            schedule={schedule}
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
