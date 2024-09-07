'use client'
import { useEffect, useState } from 'react'
import { getUser, editUser } from '@/utils/userUtils'
import { UUID } from 'crypto'

export default function Username() {
  const [username, setUsername] = useState('')
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [usernameTooLongError, setUsernameTooLongError] = useState(false)

  useEffect(() => {
    getUser(localStorage.getItem('username') as UUID).then((data) => {
      setUsername(data[0].name)
    })
  }, [])

  return (
    <>
      <div className="flex items-center">
        <h1 className="pb-4 pt-4 text-xl">Username: </h1>
        {isEditingUsername ? (
          <div className="ml-4 flex items-center">
            <input
              className="text-l input input-sm mr-4 border-gray-300 font-normal focus-visible:ring-0"
              type="text"
              value={username}
              size={60}
              onChange={(e) => {
                // must be less than or equal to 40 characters
                setUsername(e.target.value)
                if (e.target.value.length <= 40) {
                  setUsernameTooLongError(false)
                } else {
                  setUsernameTooLongError(true)
                }
              }}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                if (username.length <= 40) {
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
            <h1 className="ml-4 mr-2 text-xl">{username}</h1>
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
      {usernameTooLongError ? (
        <p className="text-red-500">
          Username cannot be more than 40 characters!
        </p>
      ) : (
        <div className="mb-6"></div>
      )}
    </>
  )
}
