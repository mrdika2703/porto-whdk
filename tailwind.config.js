/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Wajib untuk toggle dark/light mode
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.tsx",
        "./resources/**/*.jsx",
        "./resources/**/*.js",
    ],
    theme: {
        extend: {
            colors: {
                aesthetic: {
                    brown: '#8B5A2B',
                    light: '#FAFAFA',
                    dark: '#121212',
                    natural: '#F5F5DC', // Aksen teks
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Rekomendasi font clean & modern
            }
        },
    },
    plugins: [],
}