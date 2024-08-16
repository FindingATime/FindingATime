'use client'

import AuthButton from '@/components/AuthButton'
import ConnectSupabaseSteps from '@/components/ConnectSupabaseSteps'
import SignUpUserSteps from '@/components/SignUpUserSteps'
import Header from '@/components/Header'
import { createServerClient, createBrowserClient } from '@/utils/supabase'
import EventCard from '@/components/EventCard'
import ThemeToggle from '@/components/ThemeToggle'
import { Suspense, useEffect, useState } from 'react'
import { UUID } from 'crypto'
import Link from 'next/link'
import { Event } from '@/utils/eventsUtils'

export default function Index() {
  const [myEvents, setMyEvents] = useState<any[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getMyEvents = async (creatorId: UUID) => {
      fetch(`/api/events?creatorId=${creatorId}`, {
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
          setMyEvents(data)
          console.log('Success:', data)
        })
        .catch((error) => {
          console.error('Error:', error.message)
        })
    }

    if (localStorage.getItem('username')) {
      getMyEvents(localStorage.getItem('username') as UUID)
    }
    if (localStorage.getItem('FindingATimeRecentlyViewed')) {
      setUpcomingEvents(
        JSON.parse(
          localStorage.getItem('FindingATimeRecentlyViewed') as string,
        ) as Event[],
      )
    }
    setIsLoading(false)
  }, [])

  return (
    <div className="w-full">
      <Header />
      <div className="container mx-auto p-4">
        <div className="flex">
          <div className="w-3/4 p-4">
            <div className="mb-4 flex items-center justify-start">
              <h1 className="text-2xl font-black font-extrabold">My Events</h1>
              <Link href="/create-event">
                <button className="btn btn-primary ml-6">+ New Event</button>
              </Link>
            </div>
            {myEvents.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {myEvents.map((event) => (
                  <EventCard
                    eventId={event.id}
                    title={event.title}
                    starttime={event.starttime}
                    endtime={event.endtime}
                    date={null}
                    days={null}
                    key={event.id}
                  />
                ))}
              </div>
            ) : (
              <p>No events found. Press &apos;New Event&apos; to create one!</p>
            )}
          </div>
          <div className="w-1/4 border-l border-gray-300 bg-white p-4 pl-8">
            <h1 className="mb-4 text-xl font-bold">Recently Viewed Events</h1>
            <Suspense fallback={<p>Loading...</p>}>
              {!isLoading && upcomingEvents.length === 0 ? (
                <p>No recently viewed events.</p>
              ) : (
                upcomingEvents.map((event) => (
                  <div key={event.id}>
                    <EventCard
                      eventId={event.id}
                      title={event.title}
                      starttime={event.starttime}
                      endtime={event.endtime}
                      date={null}
                      days={null}
                      key={event.id}
                    />
                    <div className="mb-4"></div>
                  </div>
                ))
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
