'use client'

import { Toaster, toast } from 'react-hot-toast'
import React from 'react'
import { UUID } from 'crypto'
import { Attendee, Schedule, TimeSegment } from '../utils/attendeesUtils'

interface EventViewProps {
  isCreator: boolean
  isAvailable: boolean
  setIsAvailable: (isAvailable: boolean) => void
  isButtonsVisible: boolean
  setIsButtonsVisible: (isButtonsVisible: boolean) => void
  responders: Attendee[]
  setSchedule: (schedule: Schedule) => void
  isSelectingMeetingTime: boolean
  setIsSelectingMeetingTime: (isSelectingMeetingTime: boolean) => void
  meetingTimeSegment: { date: string; timesegment: TimeSegment }
}

export default function EventView({
  isCreator,
  isAvailable,
  setIsAvailable,
  isButtonsVisible,
  setIsButtonsVisible,
  responders,
  setSchedule,
  isSelectingMeetingTime,
  setIsSelectingMeetingTime,
  meetingTimeSegment,
}: EventViewProps) {
  const copyToClipboard = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Copied Link!')
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  const selectTimeslot = async () => {
    setIsSelectingMeetingTime(true)
    setIsAvailable(true)
    setIsButtonsVisible(true) // Show buttons when user signs in
    const user = responders.find(
      (responder) =>
        responder.attendee === (localStorage.getItem('username') as UUID),
    )
    const userSchedule = user?.timesegments
    if (userSchedule != null) {
      setSchedule(userSchedule)
    } else {
      setSchedule({})
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button
        className="btn btn-outline btn-primary border-[1.5px]"
        onClick={copyToClipboard}
      >
        Copy Link
      </button>
      <Toaster />
      {isCreator && !meetingTimeSegment.date && (
        <button
          className="btn btn-outline btn-primary mt-3 border-[1.5px]"
          onClick={selectTimeslot}
        >
          Create Google Calendar Invite
        </button>
      )}
    </div>
  )
}
