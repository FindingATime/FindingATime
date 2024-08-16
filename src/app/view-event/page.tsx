'use client'
import { UUID } from 'crypto'
import EventView from '@/components/EventView'
import { Suspense, useEffect, useState } from 'react'
import EventCard from '@/components/EventCard'
import { useSearchParams } from 'next/navigation'
import { getEvent } from '@/utils/eventsUtils'
import { Event } from '@/utils/eventsUtils'
import Header from '@/components/Header'

const ViewEvent = () => {
  const searchParams = useSearchParams()
  const eventId = searchParams.get('eventId')
  const [event, setEvent] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [recentlyViewedEvents, setRecentlyViewedEvents] = useState<Event[]>([])

  useEffect(() => {
    getEvent(eventId as UUID)
      .then((data) => {
        const newEvent: Event = {
          id: eventId as UUID,
          viewTime: new Date(),
          title: data[0].title,
          starttime: data[0].starttime,
          endtime: data[0].endtime,
        }
        setEvent(newEvent)
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
  }, [eventId])

  return (
    <div className="w-full">
      <Header />
      <div>
        <EventView />
        {event && (
          <EventCard
            eventId={event.id}
            title={event.title}
            starttime={event.starttime}
            endtime={event.endtime}
            days={null}
            date={null}
            key={event.id}
          />
        )}
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
