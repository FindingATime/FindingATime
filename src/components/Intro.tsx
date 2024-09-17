import Link from 'next/link'
import React, { useState, useEffect } from 'react'

export default function Intro() {
  const words = [
    'connect',
    'meet',
    'gather',
    'chat',
    'talk',
    'collaborate',
    'sync',
    'catch up',
    'keep in touch',
    'build',
    'huddle',
    'discuss',
    'plan',
    'exercise',
    'learn',
    'celebrate',
    'strategize',
  ]
  const colors = [
    'bg-green-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-emerald-500',
    'bg-orange-500',
    'bg-purple-500',
    'bg-teal-500',
    'bg-sky-500',
  ]
  const [wordIndex, setWordIndex] = useState(0)
  const [colorIndex, setColorIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prevWordIndex) => (prevWordIndex + 1) % words.length)
      setColorIndex((prevColorIndex) => (prevColorIndex + 1) % colors.length)
    }, 1800) // Change every 1.8 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div id="Intro">
      <div className="text-4xl font-bold">
        Finding a time to{' '}
        <span
          className={`${colors[colorIndex]} inline-block rounded-full px-4 py-2 text-white transition-all duration-500`}
        >
          {words[wordIndex]}
        </span>{' '}
        made easy!
      </div>
      <div className="container mx-auto flex items-center justify-between">
        <div className="mb-10">
          <p className="mt-4 text-lg">
            We are the simplest, fastest and free way to schedule meetings with
            your team, friends or clients.
          </p>
          <p className="mt-4 text-lg">
            Their is no login required or account signup. Just create a new
            event and share the link to find out when everyone can meet.
          </p>
        </div>
      </div>
    </div>
  )
}
