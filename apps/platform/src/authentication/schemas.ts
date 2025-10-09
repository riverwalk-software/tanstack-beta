// import { Schema } from "effect"
// import { PASSWORD_LENGTH } from "#authentication/constants.js"

// const isNFC = (s: string): boolean => s === s.normalize("NFC")

// const FirstName = Schema.String.pipe(
//   Schema.trimmed({
//     message: () => "First name must not have leading or trailing spaces",
//   }),
//   Schema.filter(isNFC, {
//     message: () => "First name must be in Unicode Normalization Form C (NFC)",
//   }),
//   Schema.pattern(/^[\p{L}\p{M}](?:[\p{L}\p{M}\p{Pd}’'\s.]{1,99})$/u, {
//     description:
//       "Unicode letters, marks, spaces, hyphens, apostrophes, and periods only",
//   }),
// )
// type FirstName = typeof FirstName.Type

// const LastName = Schema.String.pipe(
//   Schema.trimmed({
//     message: () => "Last name must not have leading or trailing spaces",
//   }),
//   Schema.filter(isNFC, {
//     message: () => "Last name must be in Unicode Normalization Form C (NFC)",
//   }),
//   Schema.pattern(/^[\p{L}\p{M}](?:[\p{L}\p{M}\p{Pd}’'\s.]{1,99})$/u, {
//     description:
//       "Unicode letters, marks, spaces, hyphens, apostrophes, and periods only",
//   }),
// )
// type LastName = typeof LastName.Type

// const Email = Schema.String.pipe(
//   Schema.trimmed({
//     message: () => "Email must not have leading or trailing spaces",
//   }),
//   Schema.lowercased({
//     message: () => "Email must be lowercase",
//   }),
//   Schema.pattern(
//     /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_{|}~-]+)*@(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,63}$/,
//     { description: "Practical ASCII email" },
//   ),
//   // Schema.brand("Email"),
// )
// type Email = typeof Email.Type

// const Password = Schema.NonEmptyString.pipe(
//   Schema.minLength(PASSWORD_LENGTH.MINIMUM),
//   Schema.maxLength(PASSWORD_LENGTH.MAXIMUM),
// )
// type Password = typeof Password.Type

// const RememberMe = Schema.Boolean
// type RememberMe = typeof RememberMe.Type

// export { FirstName, LastName, Email, Password, RememberMe }
