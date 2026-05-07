import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const brandConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          beige: { value: "#F9F7F2" },
          sage: { value: "#4A6741" },
          forest: { value: "#2C3A27" },
          clay: { value: "#D97757" },
          sand: { value: "#E5E0D4" },
        },
      },
      fonts: {
        heading: { value: "Instrument Serif, serif" },
        body: { value: "Inter, sans-serif" },
      },
      radii: {
        brand: { value: "1.25rem" },
      },
    },
  },
})

export const system = createSystem(defaultConfig, brandConfig)
