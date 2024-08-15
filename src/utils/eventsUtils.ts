import { UUID } from 'crypto'

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
