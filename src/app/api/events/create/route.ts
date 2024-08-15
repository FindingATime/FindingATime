import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { modeOptions, days } from '@/utils/dateUtils'

export const runtime = 'edge'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  const body = await request.json()

  // input validation
  // UUID, title, description, starttime, endtime, location, timezone, mode, config, creator
  if (!body.title) {
    return NextResponse.json({ message: 'Title is required' }, { status: 400 })
  } else if (!body.starttime) {
    return NextResponse.json(
      { message: 'Start Time is required' },
      { status: 400 },
    )
  } else if (!body.endtime) {
    return NextResponse.json(
      { message: 'End Time is required' },
      { status: 400 },
    )
  } else if (!body.location) {
    return NextResponse.json(
      { message: 'Location is required' },
      { status: 400 },
    )
  } else if (!body.timezone) {
    return NextResponse.json(
      { message: 'Timezone is required' },
      { status: 400 },
    )
  } else if (!body.mode) {
    return NextResponse.json({ message: 'Mode is required' }, { status: 400 })
  } else if (!body.config) {
    return NextResponse.json({ message: 'Config is required' }, { status: 400 })
  } else if (!body.creator) {
    return NextResponse.json(
      { message: 'Creator is required' },
      { status: 400 },
    )
  }

  if (body.title.length > 120) {
    return NextResponse.json(
      { message: 'Title must be less than or equal to 120 characters' },
      { status: 400 },
    )
  } else if (body.description && body.description.length > 500) {
    // description is optional
    return NextResponse.json(
      { message: 'Description must be less than or equal to 500 characters' },
      { status: 400 },
    )
  } else if (body.location.length > 120) {
    return NextResponse.json(
      { message: 'Location must be less than or equal to 120 characters' },
      { status: 400 },
    )
  } else if (!modeOptions.includes(body.mode)) {
    return NextResponse.json(
      {
        message: `Mode must be ${
          modeOptions.slice(0, -1).join(', ') +
          ' or ' +
          modeOptions.slice(-1)[0]
        }`,
      },
      { status: 400 },
    )
  }

  if (new Date(body.starttime).getTime() > new Date(body.endtime).getTime()) {
    return NextResponse.json(
      { message: 'Start Time must be before End Time' },
      { status: 400 },
    )
  }

  // if mode is weekly, check if each day is a true/false boolean
  if (body.mode === 'weekly') {
    for (let i = 0; i < days.length; i++) {
      if (typeof body.config[days[i]] !== 'boolean') {
        return NextResponse.json(
          { message: days[i] + ' must be a boolean' },
          { status: 400 },
        )
      }
    }
  }

  // if mode is specific, check if dates in config are valid dates in format (YYYY-MM-DD)
  if (body.mode === 'specific') {
    for (let i = 0; i < body.config.days.length; i++) {
      if (isNaN(new Date(body.config.days[i]).getTime())) {
        return NextResponse.json(
          { message: body.config.days[i] + ' is not a valid date' },
          { status: 400 },
        )
      }
    }
  }

  const { data, error } = await supabase.from('events').insert([body]).select()

  if (error) {
    return NextResponse.json(
      { message: 'Error inserting event: ' + error.message },
      { status: 400 },
    )
  }

  return NextResponse.json(data)
}
