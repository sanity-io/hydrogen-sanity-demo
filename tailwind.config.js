module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    borderRadius: {
      DEFAULT: '8px',
      md: '15px',
      lg: '20px',
      full: '9999px',
    },
    fontFamily: {
      sans: '"DM Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    boxShadow: {
      DEFAULT: '0px 0px 4px rgba(0, 0, 0, 0.1)',
    },
    fontSize: {
      // 12px
      xs: [
        '0.75rem',
        {
          letterSpacing: '-0.03em',
          lineHeight: '1.1',
        },
      ],
      // 14px
      sm: [
        '0.875rem',
        {
          letterSpacing: '-0.03em',
          lineHeight: '1.1',
        },
      ],
      // 16px
      base: [
        '1rem',
        {
          letterSpacing: '-0.03em',
          lineHeight: '1.1',
        },
      ],
      //18px
      lg: [
        '1.125rem',
        {
          letterSpacing: '-0.03em',
          lineHeight: '1.1',
        },
      ],
      // 24px
      xl: [
        '1.5rem',
        {
          letterSpacing: '-0.03em',
          lineHeight: '1.1',
        },
      ],
      // 36px
      '2xl': [
        '2.25rem',
        {
          letterSpacing: '-0.03em',
          lineHeight: '1.1',
        },
      ],
      // 54px
      '3xl': [
        '3.375rem',
        {
          letterSpacing: '-0.03em',
          lineHeight: '1',
        },
      ],
      // 74px
      '4xl': [
        '4.625rem',
        {
          letterSpacing: '-0.03em',
          lineHeight: '1',
        },
      ],
      // 110px
      '5xl': [
        '6.875rem',
        {
          letterSpacing: '-0.03em',
          lineHeight: '1',
        },
      ],
    },
    fontWeight: {
      bold: 700,
      medium: 500,
      regular: 400,
    },
    letterSpacing: {
      normal: '-0.03em',
    },
    extend: {
      colors: {
        black: '#2B2E2E',
        gray: '#757575',
        lightGray: '#E7E7E7',
        peach: '#FFE1D1',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
        9: '36px',
        10: '40px',
        11: '44px',
        12: '48px',
        13: '52px',
        14: '56px',
        15: '60px',
        16: '64px',
        17: '68px',
        18: '72px',
        19: '76px',
        20: '80px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            hr: {
              borderColor: theme('colors.gray.200'),
              borderTopWidth: '1px',
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            'ol > li::before': {
              color: theme('colors.gray.900'),
            },
            'ul > li::before': {
              backgroundColor: theme('colors.gray.900'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
