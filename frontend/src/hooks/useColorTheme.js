import { useContext } from "react"
import { ThemeContext } from "../context/ThemeProvider"

const useColorTheme = () => {
    const context = useContext(ThemeContext)
    if(!context){
        throw new Error("useColorTheme must be used within a ThemeProvider")
    }

    return context
}

export default useColorTheme