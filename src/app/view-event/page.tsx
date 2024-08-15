'use client'
import { UUID } from 'crypto'
import EventView from '@/components/EventView'
import { Suspense, useEffect, useState } from 'react'
import EventCard from '@/components/EventCard'
import { useSearchParams } from 'next/navigation'
import { getEvent } from '@/utils/eventsUtils'
import { Event } from '@/utils/eventsUtils'

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
        setEvent(newEvent)
        if (!localStorage.getItem('FindingATimeRecentlyViewed')) {
          localStorage.setItem(
            'FindingATimeRecentlyViewed',
            JSON.stringify([newEvent]),
          )
          setRecentlyViewedEvents([newEvent])
          console.log(
            'Recently viewed events first: ',
            JSON.parse(
              localStorage.getItem('FindingATimeRecentlyViewed') as string,
            ),
          )
        } else {
          console.log(
            'Recently viewed events before: ',
            JSON.parse(
              localStorage.getItem('FindingATimeRecentlyViewed') as string,
            ),
          )
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
          console.log('Recently viewed events after: ', newRecentlyViewedEvents)
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
    console.log('eventid:', eventid)
  }, [eventid])

  return (
    <div>
      <EventView />
      {event && (
        <EventCard
          eventid={event.id}
          title={event.title}
          starttime={event.starttime}
          endtime={event.endtime}
          days={null}
          date={null}
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
