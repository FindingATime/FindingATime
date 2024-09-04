import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { UUID } from 'crypto'

export const runtime = 'edge'

export async function GET(request: Request) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const url = new URL(request.url)
  const eventids = url.searchParams.get('eventids')

  if (eventids) {
    const decodedEventIds: UUID[] = decodeURIComponent(
      eventids as string,
    ).split(',') as UUID[]
    const { data, count, error } = await supabase
      .from('attendees')
      .select('eventid')
      .in('eventid', decodedEventIds)

    if (error) {
      return NextResponse.json({
        status: 400,
        message: 'Error fetching respondents count: ' + error,
      })
    }
    return NextResponse.json(data)
  } else {
    return NextResponse.json({
      status: 400,
      message: 'Missing eventids query parameter',
    })
  }
}
