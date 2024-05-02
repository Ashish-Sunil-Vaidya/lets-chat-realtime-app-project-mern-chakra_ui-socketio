import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const useSignup = () => {

    const [loading, setLoading] = useState(false);
    const toast = useToast();


    const signup = async (username, email, password, confirmPassword,avatarUrl) => {
        setLoading(true);
        try {
            const response = await axios.post("/api/user/signup", { username, email, password, confirmPassword,avatarUrl });
            setLoading(false);
            return response.data;
        } catch (error) {
            setLoading(false);
            toast({
                title: "Signup failed",
                description: error.response.data.message,
                status: "error",
            });
        }
    };

    return { loading, signup };
}

export default useSignup;   