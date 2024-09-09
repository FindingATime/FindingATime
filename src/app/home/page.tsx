'use client'

import AuthButton from '@/components/AuthButton'
import ConnectSupabaseSteps from '@/components/ConnectSupabaseSteps'
import SignUpUserSteps from '@/components/SignUpUserSteps'
import Header from '@/components/Header'
import { createServerClient, createBrowserClient } from '@/utils/supabase'
import EventCard from '@/components/EventCard'
import Username from '@/components/Username'
import ThemeToggle from '@/components/ThemeToggle'
import { Suspense, useEffect, useState } from 'react'
import { UUID } from 'crypto'
import Link from 'next/link'
import { Event, getMyEvents } from '@/utils/eventsUtils'
import { getNumRespondents } from '@/utils/attendeesUtils'
import { getUser, editUser } from '@/utils/userUtils'

export default function Index() {
  const [myEvents, setMyEvents] = useState<Event[]>([])
  const [myEventIds, setMyEventIds] = useState<UUID[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [upcomingEventIds, setUpcomingEventIds] = useState<UUID[]>([])
  const [eventRespondentsCountDict, setEventRespondentsCountDict] = useState<{
    [key: string]: number
  }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [eventIds, setEventIds] = useState<Set<UUID>>(new Set())
  const [username, setUsername] = useState<string | null>(null)
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [usernameTooLongError, setUsernameTooLongError] = useState(false)

  useEffect(() => {
    const eventIdSet = new Set<UUID>()
    const promises = []
    if (localStorage.getItem('username')) {
      const getEventPromise = getMyEvents(
        localStorage.getItem('username') as UUID,
      )
        .then((data) => {
          setMyEvents(data)
          data.forEach((event: Event) => {
            eventIdSet.add(event.id)
          })
          promises.push(getEventPromise)
        })
        .catch((error) => {
          console.error('Error:', error.message)
        })
      const getUserPromise = getUser(
        localStorage.getItem('username') as UUID,
      ).then((data) => {
        setUsername(data[0].name)
        promises.push(getUserPromise)
      })
    } else {
      setIsLoading(false)
    }

    if (localStorage.getItem('FindingATimeRecentlyViewed')) {
      const recentlyViewedEventsArray = JSON.parse(
        localStorage.getItem('FindingATimeRecentlyViewed') as string,
      ) as Event[]
      setUpcomingEvents(recentlyViewedEventsArray)
      recentlyViewedEventsArray.forEach((event: Event) => {
        eventIdSet.add(event.id)
      })
      const upcomingEventIdsArray = recentlyViewedEventsArray.map(
        (event: Event) => event.id,
      )
      setUpcomingEventIds(upcomingEventIdsArray)
    }
    setEventIds(eventIdSet)

    // get number of respondents for each event 10 at a time to avoid hitting the API limit
    // if there is less than 10, then get the remaining
    const eventIdsArray = Array.from(eventIdSet)
    let newObj: { [key: string]: number } = {}
    for (let i = 0; i < eventIdsArray.length; i += 10) {
      // slice through 10 events at a time, unless there is less than 10 then just get remaining
      const promise = getNumRespondents(
        eventIdsArray.slice(
          i,
          i + 10 < eventIdsArray.length ? i + 10 : i + eventIdsArray.length - i,
        ),
      ).then((numRespondentsArray) => {
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
        setEventRespondentsCountDict((prev) => ({ ...prev, ...newObj }))
      })
      promises.push(promise)
    }
    // waits until all fetches for event respondents are done
    Promise.all(promises).then(() => {
      setIsLoading(false)
    })
  }, [])

  return (
    <div className="w-full">
      <Header />
      <div className="container mx-auto p-4">
        <div className="flex">
          <div className="w-3/4 p-4">
            <div className="mb-10 flex items-center justify-start">
              <h1 className="mr-6 text-2xl font-black font-extrabold">
                My Events
              </h1>
              <Link href="/create-event">
                <button className="btn btn-primary">Create Event</button>
              </Link>
              <div className="ml-4"></div> {/* spacing */}
              {username != null && !isLoading && (
                <Username username={username} setUsername={setUsername} />
              )}
            </div>
            {!isLoading &&
              (myEvents.length === 0 ? (
                <p>
                  No events found. Press &apos;Create Event&apos; to get
                  started!
                </p>
              ) : (
                !isLoading && (
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
                )
              ))}
          </div>
          {isLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-opacity-75">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          )}
          <div className="w-1/4 border-l border-gray-300 p-4 pl-8">
            <h1 className="mb-4 text-xl font-bold">Recently Viewed Events</h1>
            {!isLoading && upcomingEvents.length === 0 ? (
              <p>No recently viewed events.</p>
            ) : (
              !isLoading &&
              upcomingEvents.map((event) => (
                <div key={event.id}>
                  <EventCard
                    eventId={event.id}
                    title={event.title}
                    starttime={event.starttime}
                    endtime={event.endtime}
                    location={event.location}
                    timezone={event.timezone}
                    numRespondents={
                      eventRespondentsCountDict[event.id as string]
                    }
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
