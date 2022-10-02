import { extendTheme } from '@chakra-ui/react';

const theme = {
    config: {
        initialColorMode: "dark",
        useSystemColorMode: true,
    },
    fonts: {
        heading: `'Open Sans', sans-serif`,
        body: `'Raleway', sans-serif`,
    },
};

export default extendTheme(theme);