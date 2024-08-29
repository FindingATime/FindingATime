import Link from 'next/link'
import { UUID } from 'crypto'

interface EventCardProps {
  eventId: UUID
  title: string
  starttime: string
  endtime: string
  location: string
  timezone: string
}

export default function EventCard({
  eventId,
  title,
  starttime,
  endtime,
  location,
  timezone,
}: EventCardProps) {
  return (
    <Link href={`/view-event?eventId=${eventId}`}>
      <div className="flex h-48 flex-col justify-between rounded-md bg-white p-4 shadow-lg">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p>Location: {location}</p>
        </div>
      </div>
    </Link>
  )
}
