import ViewEventWrapper from '@/components/ViewEvent'

export const runtime = 'edge'

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
      `${process.env.HOST_URL}/api/events?eventId=${eventId}`,
    )
    const data = await res.json()

    if (data && data.length > 0) {
      // data[0] will contain the event data
      return {
        title: data[0].title,
        description: data[0].description,
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
