import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

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
  const { user, _ } = useAuth();

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
      <h2 className="text-2xl mb-5">Wiadomości</h2>

      {conversations.length === 0 && <p>Brak konwersacji.</p>}

      <div className="flex flex-col gap-3">
        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/dashboard/chat/${c.otherUserId}`)}
            className="cursor-pointer flex gap-3 p-3 border-brand border-1 rounded-4xl"
          >
            <img
              src={
                c.profilePicture
                  ? c.profilePicture.url
                  : "/icons/profileIcon.svg"
              }
              alt="Profile picture"
              className="w-24 h-24 border border-neutral-600 rounded-2xl object-cover"
              draggable="false"
            />

            <div className="flex flex-col gap-5 flex-1">
              <div className="flex gap-3 items-center justify-between">
                <div className="flex gap-5 items-center">
                  <p className="text-xl font-semiboldbold">{c.fullName}</p>
                  <p className="">
                    {c.specialization !== "Brak danych" ? c.specialization : ""}
                  </p>
                </div>
                {
                  c.localization.n !== "Brak" && c.localization.p !== "danych"
                    ? (<p className="">{c.localization.n}, {c.localization.p}</p>)
                    : ("")
                }
              </div>

              <div className="text-sm flex flex-col gap-1.5">
                <p>Ostatnia wiadomość:</p>
                <div className="bg-gray-200 px-4 py-2 rounded-2xl border border-gray-300 flex justify-between">
                  <p>
                    {c.lastMessage.senderId === user.userId ? "Ty: " : ""}
                    {c.lastMessage.content}
                  </p>
                  <p>{new Date(c.lastMessage.sentAt).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
