import { type Bijection, conjugate } from "@prelude";
import { match } from "ts-pattern";
import type { Theme } from "../types/Theme";

const themeBooleanBijection: Bijection<Theme, boolean> = {
  to: (theme) =>
    match(theme)
      .returnType<boolean>()
      .with("dark", () => false)
      .with("light", () => true)
      .exhaustive(),
  from: (p) =>
    match(p)
      .returnType<Theme>()
      .with(false, () => "dark")
      .with(true, () => "light")
      .exhaustive(),
};

export const conjugateThemeBoolean = conjugate(themeBooleanBijection);
