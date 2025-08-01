/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#024638",
                    dark: "#035040",
                },
                success: "#10B981",
                accent: "#BD9B60",
                error: "#EF4444",
                text: {
                    DEFAULT: "#2E3130",
                    secondary: "#6C6D6D",
                },
                border: {
                    DEFAULT: "#CFD2D1",
                    light: "#F5F8F7",
                },
                scroll: "rgba(160,160,160,0.7)",
            },
            animation: {
                "slide-in": "slideIn 0.3s ease-out",
                "fade-out": "fadeOut 0.3s ease-in",
            },
            keyframes: {
                slideIn: {
                    "0%": { transform: "translateX(100%)", opacity: "0" },
                    "100%": { transform: "translateX(0)", opacity: "1" },
                },
                fadeOut: {
                    "0%": { opacity: "1" },
                    "100%": { opacity: "0" },
                },
            },
        },
    },
    plugins: [],
};
