'use client'

import { useEffect, useState } from 'react'
import { getAttendees } from '@/utils/attendeesUtils'
import { UUID } from 'crypto'

export default function Test() {
  const [attendees, setAttendees] = useState<string[]>([])

  useEffect(() => {
    // Use the utility function to fetch attendees
    console.log('Fetching attendees')
    getAttendees('3301bfc2-43f3-43cc-8e25-856eee164012').then((data) => {
      setAttendees(data)
    })
  }, [])

  return (
    <div>
      <h1>Attendees</h1>
      <ul>
        {attendees.map((attendee, index) => (
          <li key={index}>{attendee}</li>
        ))}
      </ul>
    </div>
  )
}
