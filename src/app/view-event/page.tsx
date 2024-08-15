'use client'
import { UUID } from 'crypto'
import EventView from '@/components/EventView'
import { Suspense, useEffect, useState } from 'react'
import EventCard from '@/components/EventCard'
import { useSearchParams } from 'next/navigation'

const ViewEvent = () => {
  const searchParams = useSearchParams()

  const eventId = searchParams.get('eventId')

  const [events, setEvents] = useState<any[]>([])

  const [error, setError] = useState<string | null>(null)

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
    <div>
      <EventView />
      {events.map((event) => (
        <EventCard
          title={event.title}
          starttime={event.starttime}
          endtime={event.endtime}
          key={event.id}
        />
      ))}
    </div>
  )
}

const ViewEventWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ViewEvent />
  </Suspense>
)

export default ViewEventWrapper
