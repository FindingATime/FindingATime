import { UUID } from 'crypto'

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
      const attendeesData = data.map((attendee: any) => {
        return attendee.users.name
      })
      console.log(attendeesData)
      return attendeesData
    })
    .catch((error) => {
      console.error('Error:', error.message)
    })
}
