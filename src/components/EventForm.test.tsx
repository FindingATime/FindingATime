import { fireEvent, render } from '@/test/test-utils'
import EventForm from '@/components/EventForm'
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

const userName = 'test title'
const setUserName = () => {}
const title = ''
const setTitle = () => {}
const description = ''
const setDescription = () => {}
const location = ''
const setLocation = () => {}
const earliestTime = ''
const setEarliestTime = () => {}
const latestTime = ''
const setLatestTime = () => {}
const mode = ''
const setMode = () => {}
const config: string[] = []
const setConfig = () => {}
const timezone = ''
const setTimezone = () => {}
const isAvailable = false
const setIsAvailable = () => {}
const schedule = {}

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/create-event'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))

describe('EventForm component', () => {
  it('should render an event form with correct inputs', () => {
    // Arrange
    const mockRouter = {
      push: jest.fn(),
      pathname: '/create-event',
    }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    const eventForm = render(
      <EventForm
        username={userName}
        setUsername={setUserName}
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
        isAvailable={isAvailable}
        setIsAvailable={setIsAvailable}
        schedule={schedule}
      />,
    )

    // Act
    const titleInput = eventForm.container.querySelector('#titleInput')
    const descriptionInput =
      eventForm.container.querySelector('#descriptionInput')
    const locationInput = eventForm.container.querySelector('#locationInput')
    const earliestTimeDropdown = eventForm.container.querySelector(
      '#earliestTimeDropdown',
    )
    const latestTimeDropdown = eventForm.container.querySelector(
      '#latestTimeDropdown',
    )
    const weeklyBtn = eventForm.container.querySelector('#weeklyBtn')
    const sundayBtn = eventForm.container.querySelector('#Sun')
    const mondayBtn = eventForm.container.querySelector('#Mon')
    const timezoneDropdown =
      eventForm.container.querySelector('#timezoneDropdown')

    fireEvent.change(titleInput as Element, { target: { value: 'test title' } })
    fireEvent.change(descriptionInput as Element, {
      target: { value: 'test description' },
    })
    fireEvent.change(locationInput as Element, {
      target: { value: 'test location' },
    })

    fireEvent.change(earliestTimeDropdown as HTMLSelectElement, {
      target: { value: '10:00 AM' },
    })
    fireEvent.change(latestTimeDropdown as HTMLSelectElement, {
      target: { value: '6:00 PM' },
    })
    fireEvent.change(timezoneDropdown as HTMLSelectElement, {
      target: { value: 'PST' },
    })

    fireEvent.click(weeklyBtn as Element)
    fireEvent.click(sundayBtn as Element)
    fireEvent.click(mondayBtn as Element)
    console.log('titleInput:', titleInput)

    // Assert
    expect((titleInput as HTMLInputElement).value).toBe('test title')
    expect((descriptionInput as HTMLInputElement).value).toBe(
      'test description',
    )
    expect((locationInput as HTMLInputElement).value).toBe('test location')
    expect((earliestTimeDropdown as HTMLSelectElement).value).toBe('10:00 AM')
    expect((latestTimeDropdown as HTMLSelectElement).value).toBe('6:00 PM')
    expect((timezoneDropdown as HTMLSelectElement).value).toBe('PST')
  })
})

// import { fireEvent, render } from '@/test/test-utils'
// import EventForm from '@/components/EventForm'
// import { useRouter } from 'next/router'

// // What do we test?
// // happy paths
// // do things work the way they are supposed to
// // do the work for different input
// // validation
// // edge cases
// // positive and negative scenarios
// // error handling

// // Test structure
// // in-situ
// // separate test folder

// const userName = "test title"
// const setUserName = () => {}
// const title = ''
// const setTitle = () => {}
// const description = ''
// const setDescription = () => {}
// const location = ''
// const setLocation = () => {}
// const earliestTime = ''
// const setEarliestTime = () => {}
// const latestTime = ''
// const setLatestTime = () => {}
// const mode = ''
// const setMode = () => {}
// const config: string[] = []
// const setConfig = () => {}
// const timezone = ''
// const setTimezone = () => {}
// const isAvailable = false
// const setIsAvailable = () => {}
// const schedule = {}

// jest.mock('next/router', () => ({
//     useRouter: jest.fn(),
// }))

// jest.mock('next/navigation', () => ({
//   useRouter: jest.fn(),
//   usePathname: jest.fn(() => '/create-event'),
//   useSearchParams: jest.fn(() => new URLSearchParams()),
// }));

//   describe('EventForm component', () => {
//     it('should render an event form with correct inputs', () => {
//     // Arrange
//     const mockRouter = {
//         push: jest.fn(),
//         pathname: '/create-event'
//     };
//     (useRouter as jest.Mock).mockReturnValue(mockRouter)
//     const eventForm = render(
//         <EventForm
//         username={userName}
//         setUsername={setUserName}
//         title={title}
//         setTitle={setTitle}
//         description={description}
//         setDescription={setDescription}
//         location={location}
//         setLocation={setLocation}
//         earliestTime={earliestTime}
//         setEarliestTime={setEarliestTime}
//         latestTime={latestTime}
//         setLatestTime={setLatestTime}
//         mode={mode}
//         setMode={setMode}
//         config={config}
//         setConfig={setConfig}
//         timezone={timezone}
//         setTimezone={setTimezone}
//         isAvailable={isAvailable}
//         setIsAvailable={setIsAvailable}
//         schedule={schedule}
//       />)

//     // Act
//     const titleInput = eventForm.container.querySelector('#titleInput')
//     const descriptionInput = eventForm.container.querySelector('#descriptionInput')
//     const locationInput = eventForm.container.querySelector('#locationInput')
//     const earliestTimeDropdown = eventForm.container.querySelector('#earliestTimeDropdown')
//     const latestTimeDropdown = eventForm.container.querySelector('#latestTimeDropdown')
//     const weeklyBtn = eventForm.container.querySelector('#weeklyBtn')
//     const sundayBtn = eventForm.container.querySelector('#Sun')
//     const mondayBtn = eventForm.container.querySelector('#Mon')
//     const timezoneDropdown = eventForm.container.querySelector('#timezoneDropdown')

//     fireEvent.change(titleInput as Element, { target: { value: 'test title' } })
//     fireEvent.change(descriptionInput as Element, { target: { value: 'test description' } })
//     fireEvent.change(locationInput as Element, { target: { value: 'test location' } })

//     fireEvent.change(earliestTimeDropdown as HTMLSelectElement, { target: { value: '10:00 AM' } })
//     fireEvent.change(latestTimeDropdown as HTMLSelectElement, { target: { value: '6:00 PM' } })
//     fireEvent.change(timezoneDropdown as HTMLSelectElement, { target: { value: 'PST' } })

//     fireEvent.click(weeklyBtn as Element)
//     fireEvent.click(sundayBtn as Element)
//     fireEvent.click(mondayBtn as Element)
//     console.log("titleInput:", titleInput)

//     // Assert
//     expect((titleInput as HTMLInputElement).value).toBe("test title")
//     expect((descriptionInput as HTMLInputElement).value).toBe('test description')
//     expect((locationInput as HTMLInputElement).value).toBe('test location')
//     expect((earliestTimeDropdown as HTMLSelectElement).value).toBe('10:00 AM')
//     expect((latestTimeDropdown as HTMLSelectElement).value).toBe('6:00 PM')
//     expect((timezoneDropdown as HTMLSelectElement).value).toBe('PST')

//   })
// })
