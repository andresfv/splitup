export const useTheme = () => {
    const colorMode = useColorMode()

    const toggle = () => {
        colorMode.preference =
            colorMode.value === 'dark' ? 'light' : 'dark'
    }

    return {
        theme: computed(() => colorMode.value),
        toggle
    }
}
