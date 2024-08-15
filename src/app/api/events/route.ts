import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { UUID } from 'crypto'

export const runtime = 'edge'

export async function GET(request: Request) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const url = new URL(request.url)
  const creatorid = url.searchParams.get('creatorid')
  const eventid = url.searchParams.get('eventid')

  if (creatorid !== null) {
    const { data, error } = await supabase
      .from('events')
      .select()
      .eq('creator', creatorid)

    if (error) {
      return NextResponse.json({
        status: 400,
        message: 'Error fetching events',
      })
    }
    return NextResponse.json(data)
  } else if (eventid !== null) {
    const { data, error } = await supabase
      .from('events')
      .select()
      .eq('id', eventid)

    if (error) {
      return NextResponse.json({
        status: 400,
        message: 'Error fetching events',
      })
    }
    return NextResponse.json(data)
  }
}
