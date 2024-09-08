'use client'
import { use, useEffect, useState } from 'react'
import { getUser, editUser } from '@/utils/userUtils'
import { UUID } from 'crypto'

interface UsernameProps {
  username: string | null
  setUsername: React.Dispatch<React.SetStateAction<string | null>>
}

export default function Username({ username, setUsername }: UsernameProps) {
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [usernameLengthError, setUsernameLengthError] = useState(false)

  useEffect(() => {
    if (!username) {
      setUsername('Guest')
    }
  }, [])

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-l pb-4 pt-4">Username: </h1>
        {isEditingUsername ? (
          <div className="flex items-center">
            <input
              className="text-l input input-sm mr-2 border-gray-300 font-normal focus-visible:ring-0"
              type="text"
              value={username ? username : ''}
              size={20}
              onChange={(e) => {
                // must be less than or equal to 40 characters
                setUsername(e.target.value)
                if (e.target.value.length > 40 || e.target.value.length === 0) {
                  setUsernameLengthError(true)
                } else {
                  setUsernameLengthError(false)
                }
              }}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                if (username && username.length <= 40 && username.length > 0) {
                  // only save if username is less than or equal to 40 characters
                  setIsEditingUsername(false)
                  editUser(localStorage.getItem('username') as UUID, username)
                }
              }}
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex">
            <h1 className="text-l ml-4 mr-2">{username}</h1>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={() => {
                  setIsEditingUsername(true)
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 20h9"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16.5 3.5a2.121 2.121 0 113 3L7 19.5 3 21l1.5-4L16.5 3.5z"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      {usernameLengthError ? (
        <p className="text-red-500">
          Username must be between 1 and 40 characters long!
        </p>
      ) : (
        <div className="mb-6"></div>
      )}
    </>
  )
}
