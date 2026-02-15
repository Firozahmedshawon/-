module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",   // Indigo
        secondary: "#8B5CF6", // Purple
        accent: "#EC4899",    // Pink
        success: "#10B981",   // Green
        error: "#EF4444",     // Red
        background: "#F9FAFB"
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'main-gradient': 'linear-gradient(to right, #6366F1, #8B5CF6)',
      }
    },
  },
  plugins: [],
};