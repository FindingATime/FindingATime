import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  const body = await request.json()

  if (!body.name) {
    return NextResponse.json({ message: 'Name is required' }, { status: 400 })
  } else if (body.name.length == 0) {
    return NextResponse.json(
      { message: 'Name must not be empty' },
      { status: 400 },
    )
  } else if (body.name.length > 40) {
    return NextResponse.json(
      { message: 'Name must be less than 40 characters' },
      { status: 400 },
    )
  } else if (typeof body.name != 'string') {
    return NextResponse.json(
      { message: 'Name must be a string' },
      { status: 400 },
    )
  }

  const { data, error } = await supabase.from('Users').insert([body]).select()

  if (error) {
    return NextResponse.json({ message: 'Error inserting user' })
  }
  return NextResponse.json(data)
}
