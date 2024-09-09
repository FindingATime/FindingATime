import { GetStaticPropsContext } from 'next'
import { UUID } from 'crypto'
import { Event, getEvent } from '@/utils/eventsUtils'

export async function generateMetadata({ params }: GetStaticPropsContext) {
  const { eventId } = params as { eventId: string }

  const event = getEvent(eventId as UUID).then(async (data) => {
    const newEvent: Event = {
      id: eventId as UUID,
      viewTime: new Date(),
      title: data[0].title,
      description: data[0].description,
      starttime: data[0].starttime,
      endtime: data[0].endtime,
      timezone: data[0].timezone,
      location: data[0].location,
      config: data[0].config || {},
      mode: data[0].mode || 'weekly', // TODO: need to modify to include both weekly & specific dates
    }
    return {
      title: newEvent.title,
      description: newEvent.description,
    }
  })
}
