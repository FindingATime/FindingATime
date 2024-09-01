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
import { Event, getMyEvents } from '@/utils/eventsUtils'
import { getNumRespondents } from '@/utils/attendeesUtils'

export default function Index() {
  const [myEvents, setMyEvents] = useState<Event[]>([])
  const [myEventIds, setMyEventIds] = useState<UUID[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [upcomingEventIds, setUpcomingEventIds] = useState<UUID[]>([])
  const [eventRespondentsCountDict, setEventRespondentsCountDict] = useState<{
    [key: string]: number
  }>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (localStorage.getItem('username')) {
      getMyEvents(localStorage.getItem('username') as UUID)
        .then((data) => {
          setMyEvents(data)
          // set up event ids array using data returned
          const myEventIdsArray = data.map((event: Event) => event.id)
          setMyEventIds(myEventIdsArray)
          getNumRespondents(myEventIdsArray).then((numRespondentsArray) => {
            let newObj: { [key: string]: number } = {}
            numRespondentsArray.forEach(
              (numRespondents: { [key: string]: UUID }, index: any) => {
                if (numRespondents.eventid in newObj) {
                  newObj[numRespondents.eventid as string] =
                    newObj[numRespondents.eventid as string] + 1
                } else {
                  newObj[numRespondents.eventid as string] = 1
                }
              },
            )
            setEventRespondentsCountDict(newObj)
            setIsLoading(false)
          })
        })
        .catch((error) => {
          console.error('Error:', error.message)
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }

    if (localStorage.getItem('FindingATimeRecentlyViewed')) {
      const recentlyViewedEventsArray = JSON.parse(
        localStorage.getItem('FindingATimeRecentlyViewed') as string,
      ) as Event[]
      setUpcomingEvents(recentlyViewedEventsArray)

      const upcomingEventIdsArray = recentlyViewedEventsArray.map(
        (event: Event) => event.id,
      )
      setUpcomingEventIds(upcomingEventIdsArray)
    }
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
                <button className="btn btn-primary ml-6">Create Event</button>
              </Link>
            </div>
            {!isLoading &&
              (myEvents.length === 0 ? (
                <p>
                  No events found. Press &apos;Create Event&apos; to get
                  started!
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {myEvents.map((event) => (
                    <EventCard
                      eventId={event.id}
                      title={event.title}
                      starttime={event.starttime}
                      endtime={event.endtime}
                      timezone={event.timezone}
                      location={event.location}
                      numRespondents={
                        eventRespondentsCountDict[event.id as string]
                      }
                      key={event.id}
                    />
                  ))}
                </div>
              ))}
          </div>
          {isLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          )}
          <div className="w-1/4 border-l border-gray-300 bg-white p-4 pl-8">
            <h1 className="mb-4 text-xl font-bold">Recently Viewed Events</h1>
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
                    location={event.location}
                    timezone={event.timezone}
                    key={event.id}
                  />
                  <div className="mb-4"></div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
