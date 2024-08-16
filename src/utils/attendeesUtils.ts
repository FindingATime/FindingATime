import { UUID } from 'crypto'

export interface Attendee {
  users: { name: string }
  timesegments: {
    [key: string]: {
      beginning: string
      end: string
      type: string
    }[]
  }
}

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
      console.log('Data: ', data)
      return data
    })
    .catch((error) => {
      console.error('Error:', error.message)
    })
}

export async function addAttendee(
  userId: UUID,
  eventid: UUID,
  preferredTimes: JSON,
) {
  fetch('/api/attendees/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      eventid: eventid,
      userid: userId,
      preferredTimes: preferredTimes,
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
      console.log('Success:', data)
    })
    .catch((error) => {
      console.error('Error:', error.message)
    })
}
