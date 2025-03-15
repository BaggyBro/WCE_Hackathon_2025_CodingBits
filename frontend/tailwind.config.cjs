/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",  // Ensure the index.html file is included
    "./src/**/*.{js,jsx,ts,tsx}",  // Scan all JS/TS/JSX/TSX files in the src folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
