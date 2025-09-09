const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const LENGTHS = {
  EMAIL: {
    MINIMUM: 3,
    MAXIMUM: 254,
  },
  PASSWORD: {
    MINIMUM: 16,
    MAXIMUM: 64,
  },
}
function passesEmailStructureChecks(emailRaw: string): boolean {
  const email = emailRaw.toLowerCase()
  // Must contain exactly one '@'
  const at = email.indexOf("@")
  if (at === -1 || at !== email.lastIndexOf("@")) {
    return false
  }

  const local = email.slice(0, at)
  const domain = email.slice(at + 1)
  if (!local || !domain) {
    return false
  }

  // Local/domain length limits (per RFC 5321)
  if (local.length > 64 || domain.length > 255) {
    return false
  }

  // No consecutive dots; no leading/trailing dot in local
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) {
    return false
  }
  if (domain.includes("..")) {
    return false
  }

  // Domain label rules
  const labels = domain.split(".")
  for (const label of labels) {
    if (label.length === 0 || label.length > 63) {
      return false
    }
    if (label.startsWith("-") || label.endsWith("-")) {
      return false
    }
    // ASCII-only labels (since your regex is ASCII); adjust if you later allow IDNs
    if (!/^[A-Za-z0-9-]+$/.test(label)) {
      return false
    }
  }

  return true
}

export { EMAIL_REGEX, LENGTHS, passesEmailStructureChecks }
