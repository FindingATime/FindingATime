import { UUID } from 'crypto'

export interface Event {
  id: UUID
  viewTime: Date
  title: string
  starttime: string
  endtime: string
}

export async function insertEvent(
  title: string,
  description: string,
  starttime: string,
  endtime: string,
  location: string,
  timezone: string,
  mode: string,
  config: JSON,
  creator: UUID,
) {
  const response = await fetch('/api/events/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
      description: description,
      starttime: starttime,
      endtime: endtime,
      location: location,
      timezone: timezone,
      mode: mode,
      config: config,
      creator: creator,
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message)
  }

  return response.json() // Returns the JSON response including the eventId
}

export async function getEvent(eventid: UUID) {
  return fetch(`/api/events?eventid=${eventid}`, {
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
      return data
    })
    .catch((error) => {
      return error
    })
}
