import { UUID } from 'crypto'
import { insertEvent } from './eventsUtils'
import { create } from 'domain'

export function createUser(name: string) {
  fetch('/api/users/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.message)
        })
      }
      return response.json()
    })
    .then((data) => {
      if (!localStorage.getItem('username')) {
        localStorage.setItem('username', data[0].id)
      }
      console.log('Success:', data)
    })
    .catch((error) => {
      console.error('Error:', error.message)
    })
}

export async function getUser(userId: UUID) {
  return fetch(`/api/users?userId=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.message)
        })
      }
      return response.json()
    })
    .then((data) => {
      console.log(data)
      return data
    })
    .catch((error) => {
      console.error('Error:', error.message)
    })
}

export async function addUserCreateEvent(
  title: string,
  description: string,
  starttime: string,
  endtime: string,
  location: string,
  timezone: string,
  mode: string,
  config: JSON,
) {
  if (!localStorage.getItem('username')) {
    await fetch('/api/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: localStorage.getItem('username')
          ? localStorage.getItem('username')
          : 'Guest',
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message)
          })
        }
        return response.json()
      })
      .then((data) => {
        if (!localStorage.getItem('username')) {
          localStorage.setItem('username', data[0].id)
        }
        console.log('Success:', data)
      })
      .catch((error) => {
        console.error('Error:', error.message)
      })
  }

  const data = await insertEvent(
    title,
    description,
    starttime,
    endtime,
    location,
    timezone,
    mode,
    config,
    localStorage.getItem('username') as UUID,
  )
  return data
}
