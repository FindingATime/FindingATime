'use client'
import { UUID } from 'crypto'
import EventView from '@/components/EventView'
import { Suspense, useEffect, useState } from 'react'
import EventCard from '@/components/EventCard'
import { useSearchParams } from 'next/navigation'
import { getEvent } from '@/utils/eventsUtils'

interface Event {
  id: UUID
  viewTime: Date
  title: string
  starttime: string
  endtime: string
}

const ViewEvent = () => {
  const searchParams = useSearchParams()
  const eventid = searchParams.get('eventid')
  const [event, setEvent] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [recentlyViewedEvents, setRecentlyViewedEvents] = useState<Event[]>([])

  useEffect(() => {
    getEvent(eventid as UUID)
      .then((data) => {
        const newEvent: Event = {
          id: eventid as UUID,
          viewTime: new Date(),
          title: data[0].title,
          starttime: data[0].starttime,
          endtime: data[0].endtime,
        }
        if (!localStorage.getItem('FindingATimeRecentlyViewed')) {
          localStorage.setItem(
            'FindingATimeRecentlyViewed',
            JSON.stringify([newEvent]),
          )
          setRecentlyViewedEvents([newEvent])
        } else {
          const recentlyViewedEventsData: Event[] = JSON.parse(
            localStorage.getItem('FindingATimeRecentlyViewed') as string,
          )
          console.log(
            'Recently viewed events before: ',
            recentlyViewedEventsData,
          )
          recentlyViewedEventsData.push(newEvent)
          recentlyViewedEventsData.filter((event) => event.id !== newEvent.id)
          recentlyViewedEventsData.sort((a, b) => {
            return (
              new Date(b.viewTime).getTime() - new Date(a.viewTime).getTime()
            )
          })
          console.log(
            'Recently viewed events after: ',
            recentlyViewedEventsData,
          )
        }
        setEvent(newEvent)
      })
      .catch((error) => {
        setError('No event found')
      })
    console.log('eventId:', eventid)
  }, [])

  return (
    <div>
      <EventView />
      {event && (
        <EventCard
          title={event.title}
          starttime={event.starttime}
          endtime={event.endtime}
          key={event.id}
        />
      )}
    </div>
  )
}

const ViewEventWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ViewEvent />
  </Suspense>
)

export default ViewEventWrapper
