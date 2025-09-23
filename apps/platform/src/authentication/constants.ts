const TEST_USER = {
  firstName: "Test",
  lastName: "User",
  name: "Test User",
  email: "testuser@gmail.com",
  password: "testuser@gmail.com",
} as const
const NAME_LENGTH = {
  FIRST: { MINIMUM: 2, MAXIMUM: 50 },
  LAST: { MINIMUM: 2, MAXIMUM: 50 },
} as const
const PASSWORD_LENGTH = {
  MINIMUM: 16,
  MAXIMUM: 256,
} as const

export { TEST_USER, NAME_LENGTH, PASSWORD_LENGTH }
