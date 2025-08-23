import fc from "fast-check";
import { describe, it } from "vitest";
import { toggleTheme } from "../../src/logic/themeLogic";
import type { Theme } from "../../src/types/Theme";

const themeArbitrary = fc.constantFrom<Theme>("dark", "light");

describe("toggleTheme", () => {
  it("involution", () => {
    fc.assert(
      fc.property(
        themeArbitrary,
        (theme) => toggleTheme(toggleTheme(theme)) === theme,
      ),
    );
  });

  it("not fixed point", () => {
    fc.assert(
      fc.property(themeArbitrary, (theme) => toggleTheme(theme) !== theme),
    );
  });
});
