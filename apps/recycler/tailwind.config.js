/** @type {import('tailwindcss').Config} */
import { kabadiwalaTailwindPreset } from '../../packages/ui/src/tokens/tailwindConfig';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  presets: [kabadiwalaTailwindPreset],
  plugins: [],
}
