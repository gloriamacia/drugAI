import { FC } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export const SubscribeButton: FC = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const handleClick = () => {
    if (isSignedIn) {
      navigate("/subscribe");
    } else {
      // push to your embedded Sign‑In page and tell it where to go after auth
      navigate("/sign-in?redirect_url=/subscribe");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="mt-6 block w-full py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
    >
      Subscribe Now
    </button>
  );
};
