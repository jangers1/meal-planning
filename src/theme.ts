import {extendTheme} from '@mui/joy/styles';

export const customTheme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    50: '#f5f3f7',
                    100: '#e8e1ef', // Your lavender-web
                    200: '#d1c2df',
                    300: '#b89fcf',
                    400: '#9f7cbf',
                    500: '#8659af',
                    600: '#6d469f',
                    700: '#54338f',
                    800: '#3a2f47', // Your lavender-web-dark
                    900: '#2a1f35',
                },
                neutral: {
                    50: '#f8faf8',
                    100: '#f0f4f0',
                    200: '#e1e8e1',
                    300: '#c4d4c4',
                    400: '#9bb291', // Your cambridge-blue
                    500: '#7a9a7a',
                    600: '#5a7a5a',
                    700: '#4a5a41', // Your cambridge-blue-dark
                    800: '#3a4a31',
                    900: '#2a3a21',
                },
                success: {
                    50: '#f0fff4',
                    100: '#c7ffda', // Your tea-green
                    200: '#9effc1',
                    300: '#75ffa8',
                    400: '#4cff8f',
                    500: '#23ff76',
                    600: '#1fcc5e',
                    700: '#1f4d2e', // Your tea-green-dark
                    800: '#143321',
                    900: '#0a1914',
                },
                warning: {
                    50: '#fffef7',
                    100: '#d9fff8', // Your mint-green
                    200: '#b3ffed',
                    300: '#8dffe2',
                    400: '#67ffd7',
                    500: '#41ffcc',
                    600: '#34cca3',
                    700: '#1a4d45', // Your mint-green-dark
                    800: '#113d37',
                    900: '#081a16',
                },
            },
        },
        dark: {
            palette: {
                primary: {
                    50: '#2a1f35',
                    100: '#3a2f47', // Your lavender-web-dark
                    200: '#4a3f57',
                    300: '#5a4f67',
                    400: '#6a5f77',
                    500: '#7a6f87',
                    600: '#8a7f97',
                    700: '#9a8fa7',
                    800: '#e8e1ef', // Your lavender-web
                    900: '#f5f3f7',
                },
                neutral: {
                    50: '#2a3a21',
                    100: '#4a5a41', // Your cambridge-blue-dark
                    200: '#5a7a5a',
                    300: '#7a9a7a',
                    400: '#9bb291', // Your cambridge-blue
                    500: '#abbaa1',
                    600: '#bbc4b1',
                    700: '#cbcec1',
                    800: '#dbd8d1',
                    900: '#ebe2e1',
                },
            },
        },
    },
    components: {
        JoyButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                },
            },
        },
        JoyCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
            },
        },
    },
});
