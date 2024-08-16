import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'

export const runtime = 'edge'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  const body = await request.json()

  const { data, error } = await supabase.from('attendees').insert([body])

  if (error) {
    return NextResponse.json(
      { message: 'Error inserting attendee: ' + error.message },
      { status: 400 },
    )
  }
  return NextResponse.json(data)
}
