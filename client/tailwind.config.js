/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // جوهرِ شب — پس‌زمینهٔ اصلی تیره
        ink: {
          DEFAULT: '#10160F',
          light: '#1A2118',
          lighter: '#232B20',
        },
        // کاغذِ پوستی
        paper: {
          DEFAULT: '#F6F1E6',
          dark: '#ECE4D2',
        },
        // طلای زعفرانی
        saffron: {
          DEFAULT: '#C8A24B',
          dark: '#A9843A',
          light: '#DFC07E',
        },
        // گل محمدی
        rosewood: {
          DEFAULT: '#A34F4B',
          dark: '#863E3A',
          // متن خطا — کنتراست ≥ ۴٫۵:۱ روی زمینه‌های تیره و کاغذ
          bright: '#D98A86',
        },
        // مهتاب (متن روی زمینه تیره)
        mist: {
          DEFAULT: '#E9E4D6',
          dark: '#A9A291',
        },
        // تهداب (متن روی زمینه روشن)
        soil: {
          DEFAULT: '#2C2A22',
          light: '#5C5748',
        },
      },
      fontFamily: {
        display: ['Gulzar', 'Vazirmatn', 'serif'],
        body: ['Vazirmatn', 'Tahoma', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.35em',
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(200, 162, 75, 0.35)',
        card: '0 8px 40px -12px rgba(16, 22, 15, 0.18)',
      },
      backgroundImage: {
        'grain':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 50%' },
          '100%': { backgroundPosition: '-200% 50%' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.5s ease both',
        'scale-in': 'scale-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        shimmer: 'shimmer 2.5s linear infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 24s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
