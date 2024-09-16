import { fireEvent, render } from '@/test/test-utils'
import EventForm from '@/components/EventForm'
import { assert } from 'console'
import exp from 'constants'

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

describe('Event Form Component', () => {
  it('should present an error when title is empty', () => {
    // Arrange
    const title = 'Test Title'
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

    const eventForm = render(
      <EventForm
        title={title}
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
      />,
    )

    // Act
    const titleInput = eventForm.container.querySelector('#titleInput')
    fireEvent.change(titleInput as Element, { target: { value: '' } })

    // Assert
    expect(eventForm.getByText('Title is required.')).toBeInTheDocument()
  })
})
