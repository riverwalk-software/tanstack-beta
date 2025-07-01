import ms from "ms";

export const s = (value: Parameters<typeof ms>[0]) => ms(value) / 1000;
