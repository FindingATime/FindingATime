import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'

export const runtime = 'edge'

export async function GET(request: Request) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const url = new URL(request.url)
  const userId = url.searchParams.get('userId')

  const { data, error } = await supabase
    .from('users')
    .select('name')
    .eq('id', userId)

  if (error) {
    return NextResponse.json(
      { message: 'Error fetching users: ' + error.message },
      { status: 400 },
    )
  }
  return NextResponse.json(data)
}
