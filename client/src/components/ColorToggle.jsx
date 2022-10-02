import { Button } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/color-mode";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const ColorToggle = () => {
    const {colorMode, toggleColorMode} = useColorMode();
    return (
        <Button onClick={() => toggleColorMode()} pos="absolute" top="0" right="0" m="1rem">{colorMode === "dark" ? <SunIcon/> : <MoonIcon/>}</Button>
    )
}

export default ColorToggle;