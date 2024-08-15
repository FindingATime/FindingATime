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

export default function Index() {
  const [events, setEvents] = useState<any[]>([])

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
          console.log(data)
          setEvents(data)
        })
        .catch((error) => {
          console.error('Error:', error.message)
        })
    }

    if (localStorage.getItem('username')) {
      getMyEvents(localStorage.getItem('username') as UUID)
    }
  }, [])

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        <div className="w-2/3 p-4">
          <div className="mb-4 flex items-center justify-start">
            <h1 className="text-2xl font-black font-extrabold">My Events</h1>{' '}
            <Link href="/create-event">
              <button className="btn btn-primary ml-6">+ New Event</button>{' '}
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {events.length > 0 &&
              events.map((event) => (
                <EventCard
                  title={event.title}
                  starttime={event.starttime}
                  endtime={event.endtime}
                  key={event.id}
                />
              ))}
          </div>
        </div>
        <div className="w-1/3 bg-white p-4"></div>
      </div>
    </div>
  )
}
