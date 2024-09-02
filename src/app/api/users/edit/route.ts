import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { UUID } from 'crypto'

export const runtime = 'edge'

export async function PUT(request: Request) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  const body = await request.json()

  const { data, error } = await supabase
    .from('users')
    .update({ username: body.username })
    .eq('id', body.id)

  if (error) {
    return NextResponse.json({
      status: 400,
      message: 'Error editing user: ' + error,
    })
  }
  return NextResponse.json(data)
}
