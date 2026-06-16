import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  return fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

export default function ConversationList() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch("/api/chat/conversations")
      .then((res) => res.json())
      .then(setConversations)
      .catch(() => setError("Nie udało się załadować konwersacji."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Wiadomości</h2>

      {conversations.length === 0 && <p>Brak konwersacji.</p>}

      <div className="flex flex-col gap-2">
        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/dashboard/chat/${c.otherUserId}`)}
            className="cursor-pointer bg-red-100"
          >
            <p>Użytkownik #{c.otherUserId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
