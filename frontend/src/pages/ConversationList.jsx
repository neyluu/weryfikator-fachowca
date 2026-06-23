import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/ui/Button.jsx";

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
  const { user } = useAuth();

  useEffect(() => {
    const fetchConversations = () => {
      loadConversations();
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);

    return () => clearInterval(interval);
  }, []);

  function loadConversations() {
    apiFetch("/api/chat/conversations")
      .then((res) => res.json())
      .then(setConversations)
      .catch(() => setError("Nie udało się załadować konwersacji."))
      .finally(() => setLoading(false));
  }

  // POPRAWKA: Rozbudowana obsługa wszystkich wiadomości systemowych (JSON)
  function formatLastMessage(message, currentUserId) {
    if (!message) return "Brak wiadomości";
    try {
      const parsed = JSON.parse(message.content);

      if (parsed.type === "OFFER") {
        return message.senderId === currentUserId
          ? `Twoja oferta: ${parsed.amount} zł`
          : `Oferta: ${parsed.amount} zł`;
      }

      if (parsed.type === "CONTRACT_DATA_SUBMIT") {
        return message.senderId === currentUserId
          ? "Ty: Uzupełniono dane do umowy"
          : "Uzupełniono dane do umowy";
      }

      if (parsed.type === "CONTRACT_FINAL") {
        return "📄 Wygenerowano oficjalną umowę PDF";
      }

      if (parsed.type === "IMAGE") {
        return message.senderId === currentUserId
          ? `Ty: Wysłano ${parsed.images.length} zdjęć`
          : `Otrzymano ${parsed.images.length} zdjęcia`;
      }
    } catch {}

    // Normalna wiadomość tekstowa
    return message.senderId === currentUserId
      ? `Ty: ${message.content}`
      : message.content;
  }

  if (loading) return <p className="text-neutral-400 p-4">Ładowanie...</p>;
  if (error) return <p className="text-red-400 p-4">{error}</p>;

  return (
    <div className="flex flex-col gap-5 text-neutral-100">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Wiadomości</h2>
        <Button className="h-8" onClick={loadConversations}>
          Odśwież
        </Button>
      </div>

      {conversations.length === 0 && (
        <p className="text-neutral-400 italic">Brak konwersacji.</p>
      )}

      <div className="flex flex-col gap-3">
        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/dashboard/chat/${c.otherUserId}`)}
            className="cursor-pointer flex gap-4 p-4 border-neutral-700 hover:border-brand/60 bg-neutral-900/40 border rounded-3xl transition-all"
          >
            <img
              src={c.profilePicture?.url ?? "/icons/profileIcon.svg"}
              alt="Profile picture"
              className="w-20 h-20 border border-neutral-600 rounded-2xl object-cover shrink-0"
              draggable="false"
            />

            <div className="flex flex-col gap-3 flex-1 min-w-0">
              <div className="flex gap-3 items-center justify-between">
                <div className="flex gap-3 items-center min-w-0">
                  {/* POPRAWKA: Zmieniono font-semiboldbold na font-semibold */}
                  <p className="text-lg font-semibold truncate">{c.fullName}</p>
                  {c.specialization && c.specialization !== "Brak danych" && (
                    <span className="text-xs text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-md truncate">
                      {c.specialization}
                    </span>
                  )}
                </div>
                {/* POPRAWKA: Zabezpieczono c.localization operatorem ?. */}
                {c.localization?.n &&
                  c.localization?.n !== "Brak" &&
                  c.localization?.p !== "danych" && (
                    <p className="text-xs text-neutral-400 shrink-0">
                      {c.localization.n}, {c.localization.p}
                    </p>
                  )}
              </div>

              <div className="text-xs flex flex-col gap-1.5">
                <p className="text-neutral-400">Ostatnia wiadomość:</p>

                {/* POPRAWKA: Warunek chroniący przed błędem, gdy c.lastMessage jest nullem */}
                {c.lastMessage ? (
                  <div className="bg-neutral-800/40 px-4 py-2 rounded-xl border border-neutral-700/60 flex justify-between items-center gap-2">
                    <p className="truncate text-neutral-200 flex-1">
                      {formatLastMessage(c.lastMessage, user?.userId)}
                    </p>
                    <p className="text-[11px] text-neutral-500 shrink-0">
                      {new Date(c.lastMessage.sentAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 italic">
                    Brak wiadomości w tej konwersacji
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
