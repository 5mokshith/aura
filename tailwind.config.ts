import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        md: "2rem",
        lg: "2.5rem",
        xl: "3rem",
        "2xl": "4rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        xs: "320px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        // Neon accent colors for glassmorphism
        neon: {
          cyan: {
            DEFAULT: "#00f0ff",
            50: "#e6fcff",
            100: "#ccf9ff",
            200: "#99f3ff",
            300: "#66edff",
            400: "#33e7ff",
            500: "#00f0ff",
            600: "#00c0cc",
            700: "#009099",
            800: "#006066",
            900: "#003033",
          },
          purple: {
            DEFAULT: "#a855f7",
            50: "#faf5ff",
            100: "#f3e8ff",
            200: "#e9d5ff",
            300: "#d8b4fe",
            400: "#c084fc",
            500: "#a855f7",
            600: "#9333ea",
            700: "#7e22ce",
            800: "#6b21a8",
            900: "#581c87",
          },
          pink: {
            DEFAULT: "#ec4899",
            50: "#fdf2f8",
            100: "#fce7f3",
            200: "#fbcfe8",
            300: "#f9a8d4",
            400: "#f472b6",
            500: "#ec4899",
            600: "#db2777",
            700: "#be185d",
            800: "#9f1239",
            900: "#831843",
          },
          blue: {
            DEFAULT: "#3b82f6",
            50: "#eff6ff",
            100: "#dbeafe",
            200: "#bfdbfe",
            300: "#93c5fd",
            400: "#60a5fa",
            500: "#3b82f6",
            600: "#2563eb",
            700: "#1d4ed8",
            800: "#1e40af",
            900: "#1e3a8a",
          },
        },
        // Glass background colors
        glass: {
          light: "rgba(255, 255, 255, 0.1)",
          medium: "rgba(255, 255, 255, 0.15)",
          strong: "rgba(255, 255, 255, 0.2)",
          dark: "rgba(0, 0, 0, 0.2)",
          darker: "rgba(0, 0, 0, 0.3)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius)-2px)",
        sm: "calc(var(--radius)-4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "Space Grotesk", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        glass: '20px',
        'glass-md': '24px',
        'glass-lg': '32px',
        'glass-strong': '40px',
        'glass-xl': '48px',
      },
      backdropSaturate: {
        glass: '180%',
      },
      backdropBrightness: {
        glass: '110%',
      },
      boxShadow: {
        // Glass shadows
        glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'glass-md': '0 12px 40px rgba(0, 0, 0, 0.12)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.15)',
        'glass-strong': '0 8px 32px rgba(0, 0, 0, 0.2)',
        'glass-xl': '0 20px 60px rgba(0, 0, 0, 0.25)',
        // Neon glow shadows
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.5)',
        'neon-cyan-sm': '0 0 10px rgba(0, 240, 255, 0.4)',
        'neon-cyan-lg': '0 0 30px rgba(0, 240, 255, 0.6)',
        'neon-cyan-xl': '0 0 40px rgba(0, 240, 255, 0.7)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.5)',
        'neon-purple-sm': '0 0 10px rgba(168, 85, 247, 0.4)',
        'neon-purple-lg': '0 0 30px rgba(168, 85, 247, 0.6)',
        'neon-purple-xl': '0 0 40px rgba(168, 85, 247, 0.7)',
        'neon-pink': '0 0 20px rgba(236, 72, 153, 0.5)',
        'neon-pink-sm': '0 0 10px rgba(236, 72, 153, 0.4)',
        'neon-pink-lg': '0 0 30px rgba(236, 72, 153, 0.6)',
        'neon-pink-xl': '0 0 40px rgba(236, 72, 153, 0.7)',
        'neon-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
        'neon-blue-sm': '0 0 10px rgba(59, 130, 246, 0.4)',
        'neon-blue-lg': '0 0 30px rgba(59, 130, 246, 0.6)',
        'neon-blue-xl': '0 0 40px rgba(59, 130, 246, 0.7)',
        // Combined glass + glow
        'glass-glow-cyan': '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 240, 255, 0.3)',
        'glass-glow-purple': '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 20px rgba(168, 85, 247, 0.3)',
        'glass-glow-pink': '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 20px rgba(236, 72, 153, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-in-fast': 'fadeIn 0.2s ease-in-out',
        'fade-in-slow': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-up-fast': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'slide-left': 'slideLeft 0.4s ease-out',
        'slide-right': 'slideRight 0.4s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'glow-pulse-cyan': 'glowPulseCyan 2s ease-in-out infinite',
        'glow-pulse-purple': 'glowPulsePurple 2s ease-in-out infinite',
        'glow-pulse-pink': 'glowPulsePink 2s ease-in-out infinite',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
        'shimmer': 'shimmer 2s linear infinite',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 240, 255, 0.6)' },
        },
        glowPulseCyan: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 240, 255, 0.6), 0 8px 32px rgba(0, 0, 0, 0.1)' },
        },
        glowPulsePurple: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.3), 0 8px 32px rgba(0, 0, 0, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(168, 85, 247, 0.6), 0 8px 32px rgba(0, 0, 0, 0.1)' },
        },
        glowPulsePink: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(236, 72, 153, 0.3), 0 8px 32px rgba(0, 0, 0, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(236, 72, 153, 0.6), 0 8px 32px rgba(0, 0, 0, 0.1)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      transitionDuration: {
        '400': '400ms',
      },
      transitionTimingFunction: {
        'glass': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'glass-gradient-strong': 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
      },
    },
  },
  plugins: [],
};

export default config;
