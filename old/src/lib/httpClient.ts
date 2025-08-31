import ky from "ky"

export const httpClient = ky.create({
  retry: 0,
})
