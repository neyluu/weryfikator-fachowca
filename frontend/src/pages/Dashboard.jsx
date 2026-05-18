import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
      return;
    }
    const payload = parseJwt(token);
    if (!payload) {
      navigate("/auth/login");
      return;
    }
    setUser(payload);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="w-full max-w-sm p-8 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">Dashboard</h1>
        <div className="flex flex-col gap-2 p-4">
          {Object.entries(user).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="font-semibold">{key}</span>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="bg-black text-white py-2 hover:opacity-90 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
