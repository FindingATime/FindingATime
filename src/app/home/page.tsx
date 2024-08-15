'use client'

import AuthButton from '@/components/AuthButton'
import ConnectSupabaseSteps from '@/components/ConnectSupabaseSteps'
import SignUpUserSteps from '@/components/SignUpUserSteps'
import Header from '@/components/Header'
import { createServerClient, createBrowserClient } from '@/utils/supabase'
import EventCard from '@/components/EventCard'
import ThemeToggle from '@/components/ThemeToggle'
import { useEffect, useState } from 'react'
import { UUID } from 'crypto'
import Link from 'next/link'
import { Event } from '@/utils/eventsUtils'

export default function Index() {
  const [myEvents, setMyEvents] = useState<any[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])

  useEffect(() => {
    const getMyEvents = async (creatorId: UUID) => {
      fetch(`/api/events?creatorid=${creatorId}`, {
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
          console.log(data)
          setMyEvents(data)
        })
        .catch((error) => {
          console.error('Error:', error.message)
        })
    }

    if (localStorage.getItem('username')) {
      getMyEvents(localStorage.getItem('username') as UUID)
    }
    setUpcomingEvents(
      JSON.parse(
        localStorage.getItem('FindingATimeRecentlyViewed') as string,
      ) as Event[],
    )
  }, [])

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        <div className="w-3/4 p-4">
          <div className="mb-4 flex items-center justify-start">
            <h1 className="text-2xl font-black font-extrabold">My Events</h1>
            <Link href="/create-event">
              <button className="btn btn-primary ml-6">+ New Event</button>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {myEvents.length > 0 &&
              myEvents.map((event) => (
                <EventCard
                  eventid={event.id}
                  title={event.title}
                  starttime={event.starttime}
                  endtime={event.endtime}
                  date={null}
                  days={null}
                  key={event.id}
                />
              ))}
          </div>
        </div>
        <div className="w-1/4 border-l border-gray-300 bg-white p-4 pl-8">
          <h1 className="mb-4 text-xl font-bold">Upcoming Events</h1>
          {upcomingEvents.length > 0 &&
            upcomingEvents.map((event) => (
              <div key={event.id}>
                <EventCard
                  eventid={event.id}
                  title={event.title}
                  starttime={event.starttime}
                  endtime={event.endtime}
                  date={null}
                  days={null}
                  key={event.id}
                />
                <div className="mb-4"></div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
