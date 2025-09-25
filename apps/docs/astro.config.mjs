// @ts-check

import starlight from "@astrojs/starlight"
// oxlint-disable-next-line extensions
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  server: {
    port: 5000,
  },
  integrations: [
    starlight({
      title: "My Docs",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/withastro/starlight",
        },
      ],
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", slug: "guides/example" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
})
