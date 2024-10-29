import type { Config } from "tailwindcss";
import tailwindCSSAnimate from "tailwindcss-animate";


const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: '#16346a',
  			foreground: 'white',
  			neutral: '#f7f8fa'
  		},
  		fontFamily: {
  			montserrat: ["var(--font-montserrat)"]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [tailwindCSSAnimate],
};
export default config;
