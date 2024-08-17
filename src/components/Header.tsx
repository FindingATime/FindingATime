import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import CalendarIcon from '../app/CalendarIcon.png'

export default function Header() {
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname)
    }
  }, [])

  return (
    <header className="w-full bg-base-200 p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex text-xl font-bold">
          <Image
            src={CalendarIcon}
            alt="calendar"
            className="inline-block h-8 w-8"
          />
          <Link className="pl-4" href="/">
            <p className="text-primary">Finding A Time</p>
          </Link>
        </div>
        <div>
          {currentPath !== '/home' && (
            <Link href="/home">
              <button className="btn btn-primary ml-3">Dashboard</button>
            </Link>
          )}
          {currentPath !== '/create-event' && (
            <Link href="/create-event">
              <button className="btn btn-primary ml-3">Create Event</button>
            </Link>
          )}
          <Link href="/#FAQ">
            <button className="btn btn-primary ml-3">FAQ</button>
          </Link>
        </div>
      </div>
    </header>
  )
}
