import ms from "ms";

export const s = (value: Parameters<typeof ms>[0]) => ms(value) / 1000;
export const ttlSToMs = (ttl: number): number => ms(`${ttl}s`);
export const ttlToExpiresAt = (ttl: number, buffer?: number): number =>
  Date.now() + ttlSToMs(ttl) - (buffer ?? ms("0s"));
export const checkIfExpired = (expiresAt: number): boolean =>
  Date.now() >= expiresAt;
