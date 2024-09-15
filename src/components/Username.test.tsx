import { fireEvent, render } from '@/test/test-utils'
import Username from './Username'

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

const userNameTooLong =
  'dbeast86dbeast86dbeast86dbeast86dbeast86dbeast86dbeast86dbeast86dbeast86dbeast86'

describe('Username component', () => {
  it('should present an error when username is longer than 40 characters', () => {
    // Arrange
    const userName = render(<Username username={null} setUsername={() => {}} />)

    // Act
    const editUserNameButton =
      userName.container.querySelector('#editUsernameBtn')
    fireEvent.click(editUserNameButton as Element)
    const input = userName.container.querySelector('#usernameInput')
    fireEvent.change(input as Element, { target: { value: userNameTooLong } })

    // Assert
    expect(
      userName.getByText('Username must be between 1 and 40 characters long!'),
    ).toBeInTheDocument()
  })
})
