import { UUID } from 'crypto'

export interface TimeSegment {
  beginning: string
  end: string
  type: string
}

export interface Schedule {
  [date: string]: TimeSegment[]
}

export interface Attendee {
  users: { name: string }
  attendee: UUID
  timesegments: {
    [key: string]: TimeSegment[]
  }
}

// const schedule: Schedule = {
//   "Aug 10": [],
//   "Aug 11": [
//     {
//       beginning: "9:00 AM",
//       end: "10:00 AM",
//       type: "Preferred"
//     },
//     {
//       beginning: "11:00 AM",
//       end: "12:00 PM",
//       type: "Regular"
//     }
//   ],
//   "Aug 12": [],
//   "Aug 15": []
// };

export async function getAttendees(eventid: UUID) {
  return fetch(`/api/attendees?eventid=${eventid}`, {
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
      console.log('Attendees:', data)
      return data
    })
    .catch((error) => {
      console.error('Error:', error.message)
    })
}

export async function addAttendee(
  eventid: UUID,
  attendee: UUID,
  timesegments: Schedule,
) {
  fetch('/api/attendees/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      eventid: eventid,
      attendee: attendee,
      timesegments: timesegments,
    }),
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
      console.log('Success, attendee added:', data)
    })
    .catch((error) => {
      console.error('Error:', error.message)
    })
}

export async function editAttendee(
  eventId: UUID,
  attendee: UUID,
  timesegments: Schedule,
) {
  return await fetch('/api/attendees/edit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      eventid: eventId,
      attendee: attendee,
      timesegments: timesegments,
    }),
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
      console.log('Success, attendee edited:', data)
      return data
    })
    .catch((error) => {
      console.error('Error:', error.message)
      return error
    })
}

export async function getNumRespondents(eventids: UUID[]) {
  const encodedEventIds = encodeURIComponent(
    eventids.map((id) => encodeURIComponent(id)).join(','),
  )
  console.log('Encoded event ids:', encodedEventIds)
  return fetch(`/api/attendees/count?eventids=${encodedEventIds}`, {
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
      console.log('Number of respondents:', data)
      return data
    })
    .catch((error) => {
      console.error('Error:', error.message)
      return error
    })
}
