module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',  // Extra small devices
        'sm': '640px',  // Small devices
        'md': '768px',  // Medium devices
        'lg': '1024px', // Large devices
        'xl': '1280px', // Extra large devices
        '2xl': '1536px' // 2X large devices
      },
      gridTemplateColumns: {
        // Custom grid layouts for different screen sizes
        'mobile-inventory': 'repeat(3, 1fr)',
        'tablet-inventory': 'repeat(4, 1fr)',
        'desktop-inventory': 'repeat(5, 1fr)',
        
        'mobile-quickslots': 'repeat(2, 1fr)',
        'tablet-quickslots': 'repeat(2, 1fr)',
        'desktop-quickslots': 'repeat(2, 1fr)'
      },
      spacing: {
        // Custom spacing for different screen sizes
        'inventory-gap-mobile': '0.25rem',
        'inventory-gap-tablet': '0.5rem',
        'inventory-gap-desktop': '0.75rem'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}