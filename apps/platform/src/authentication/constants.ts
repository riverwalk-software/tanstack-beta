const TEST_USER = {
  firstName: "Test",
  lastName: "User",
  name: "Test User",
  email: "testuser@gmail.com",
  password: "body impaired relive litter egotistic freestyle",
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
