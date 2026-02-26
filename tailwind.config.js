/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                bg: "#0f0524",
                primary: "#8b5cf6",
                secondary: "#06b6d4",
                accent: "#d946ef",
            },
            fontFamily: {
                heading: ['Outfit', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'glass-gradient': 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
            },
        },
    },
    plugins: [],
}
