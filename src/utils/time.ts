import ms from "ms";

export const s = (value: Parameters<typeof ms>[0]) =>
  Math.floor(ms(value) / 1000);
export const ttlSToMs = (ttl: number): number => ms(`${ttl}s`);
export const ttlToExpiresAt = (ttl: number): number => {
  const currentTime = s(`${Date.now()}ms`);
  return currentTime + ttl;
};
export const checkIfExpiredMs = (expiresAt: number): boolean =>
  Date.now() >= expiresAt;
