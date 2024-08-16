import Link from 'next/link'
import { UUID } from 'crypto'

interface EventCardProps {
  eventId: UUID
  title: string
  starttime: string
  endtime: string
  date: string | null
  days: string[] | null
}

export default function EventCard({
  eventId,
  title,
  starttime,
  endtime,
  date,
  days,
}: EventCardProps) {
  return (
    <Link href={`/view-event?eventId=${eventId}`}>
      <div className="flex h-48 flex-col justify-between rounded-md bg-white p-4 shadow-lg">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          {date ? <p>Date: {date}</p> : <p>Days: {days?.join(', ')}</p>}
          <p>Start Time: {starttime}</p>
          <p>End Time: {endtime}</p>
        </div>
      </div>
    </Link>
  )
}
