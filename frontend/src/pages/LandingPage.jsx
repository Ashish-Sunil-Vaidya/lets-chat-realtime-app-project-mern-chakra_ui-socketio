import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useChatContext from "../hooks/useChatContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useChatContext();

  useEffect(() => {
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);
  return <>This is LandingPage Component</>;
};

export default LandingPage;
