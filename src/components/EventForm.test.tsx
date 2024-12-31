import { fireEvent, render } from '@/test/test-utils'
import EventForm from '@/components/EventForm'
import { Schedule } from '@/utils/attendeesUtils'
import { assert } from 'console'
import exp from 'constants'
import { useRouter } from 'next/router'

// What do we test?
// happy paths
// do things work the way they are supposed to
// do the work for different input
// validation
// edge cases
// positive and negative scenarios
// error handling

// Test structure
// in-situ
// separate test folder

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/create-event'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))

describe('Event Form Component', () => {
  it('should present an error when title is empty', () => {
    // Arrange
    const username = 'Test User'
    const setUsername = jest.fn()
    const setTitle = jest.fn()
    const description = 'Test Description'
    const setDescription = jest.fn()
    const location = 'Test Location'
    const setLocation = jest.fn()
    const earliestTime = '9:00 AM'
    const setEarliestTime = jest.fn()
    const latestTime = '5:00 PM'
    const setLatestTime = jest.fn()
    const mode = 'weekly'
    const setMode = jest.fn()
    const config = ['Mon']
    const setConfig = jest.fn()
    const timezone = 'Test Timezone'
    const setTimezone = jest.fn()
    const isAvailable = true
    const setIsAvailable = jest.fn()
    const schedule = {} as Schedule

    const mockRouter = {
      push: jest.fn(),
      pathname: '/create-event',
    }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

    const eventForm = render(
      <EventForm
        username={username}
        setUsername={setUsername}
        title=""
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        location={location}
        setLocation={setLocation}
        earliestTime={earliestTime}
        setEarliestTime={setEarliestTime}
        latestTime={latestTime}
        setLatestTime={setLatestTime}
        mode={mode}
        setMode={setMode}
        config={config}
        setConfig={setConfig}
        timezone={timezone}
        setTimezone={setTimezone}
        isAvailable={isAvailable}
        setIsAvailable={setIsAvailable}
        schedule={schedule}
      />,
    )

    // Act
    const titleInput = eventForm.container.querySelector('#titleInput')
    fireEvent.change(titleInput as Element, { target: { value: '' } })

    // Assert
    expect(eventForm.getByText('Title is required.')).toBeInTheDocument()
  })
})
