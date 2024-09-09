import ViewEventWrapper from './ViewEvent'
import { UUID } from 'crypto'
import { Event, getEvent } from '@/utils/eventsUtils'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Extract eventId from searchParams
  const eventId = searchParams?.eventId

  if (!eventId || Array.isArray(eventId)) {
    return {
      title: 'Event Not Found',
      description: 'Invalid event ID',
    }
  }

  try {
    const res = await fetch(
      `http://localhost:3000/api/events?eventId=${eventId}`,
    )
    const data = await res.json()

    if (data && data.length > 0) {
      const event: Event = {
        id: eventId as UUID,
        viewTime: new Date(),
        title: data[0].title,
        description: data[0].description,
        starttime: data[0].starttime,
        endtime: data[0].endtime,
        timezone: data[0].timezone,
        location: data[0].location,
        config: data[0].config || {},
        mode: data[0].mode || 'weekly', // Modify to include both weekly & specific dates if needed
      }

      // Return the metadata based on the event data
      return {
        title: event.title,
        description: event.description,
      }
    } else {
      return {
        title: 'Event Not Found',
        description: 'No event data available for this event',
      }
    }
  } catch (error) {
    return {
      title: 'Error',
      description: 'Failed to fetch event data',
    }
  }
}

export default function Page() {
  return <ViewEventWrapper />
}
