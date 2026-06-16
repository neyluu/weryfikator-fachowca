import { useNavigate } from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";
import Button from "./Button.jsx";

export default function ContactMeCard({ professionalId }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    navigate(`/dashboard/chat/${professionalId}`);
  };

  return (
    <div className="border-neutral-700 border rounded-3xl p-6 flex items-center justify-between">
      <p className="text-xl">Skontaktuj się ze mną!</p>
      <Button onClick={handleClick}>Wyślij wiadomość</Button>
    </div>
  );
}
