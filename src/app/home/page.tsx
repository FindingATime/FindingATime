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
      {' '}
      {/*main container with max width auto center and padding 4*/}
      <div className="flex">
        {' '}
        {/*flex container to arrange child elements in a row*/}
        <div className="w-2/3 p-4">
          {' '}
          {/*container for left side 2/3 of the width and has padding 4*/}
          <div className="mb-4 flex items-center justify-start">
            {' '}
            {/*flex container to align heading and button horizontally to have them closer together*/}
            <h1 className="text-2xl font-black font-extrabold">My Events</h1>{' '}
            {/*heading for MY Events*/}
            <Link href="/create-event">
              <button className="btn btn-primary ml-6">+ New Event</button>{' '}
            </Link>
            {/*button to add new event with primary styling and margin left 6*/}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {' '}
            {/*grid container with 2 columns and gap between the items*/}
            {events.length > 0 &&
              events.map((event) => (
                <EventCard
                  eventId={event.id}
                  title={event.title}
                  starttime={event.starttime}
                  endtime={event.endtime}
                  key={event.id}
                  date={null}
                  days={null}
                />
              ))}{' '}
          </div>{' '}
          {/*div to close grid container*/}
        </div>{' '}
        {/*div to close left side container*/}
        <div className="w-1/3 bg-white p-4">
          {/*container for right side 1/3 of the width and has padding 4 background white and is left blank on prupose (will add later)*/}
        </div>
      </div>{' '}
      {/*div to close flex container*/}
    </div>
  )
}
