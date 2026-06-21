import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/ui/Button.jsx";
import OfferInitiator from "../components/ui/OfferInitiator.jsx";
import OfferBubble from "../components/ui/OfferBubble.jsx";
import ProfileCard from "../components/ui/ProfileCard.jsx";

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

export default function Chat() {
  const { professionalId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProfilePreviewModalOpen, setIsProfilePreviewModalOpen] =
    useState(false);
  const [profileData, setProfileData] = useState({});
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const isSpecialist = user?.role === "SPECIALIST";
  const currentOffer = extractCurrentOffer(messages, user?.userId);

  function extractCurrentOffer(messages, userId) {
    const offerMessages = messages.filter((m) => {
      try {
        const parsed = JSON.parse(m.content);
        return parsed.type === "OFFER";
      } catch {
        return false;
      }
    });

    if (offerMessages.length === 0) return null;

    const last = offerMessages[offerMessages.length - 1];
    const parsed = JSON.parse(last.content);
    return {
      ...parsed,
      senderId: last.senderId,
      messageId: last.id,
    };
  }

  useEffect(() => {
    loadConversation();
  }, [professionalId]);

  async function loadConversation() {
    setLoading(true);
    try {
      const res = await apiFetch("/api/chat/conversations");
      const conversations = await res.json();

      const existing = conversations.find(
        (c) => c.otherUserId === Number(professionalId),
      );

      if (existing) {
        setConversationId(existing.id);
        setConversation(existing);
        await loadMessages(existing.id);
      }
    } catch (e) {
      setError("Nie udało się załadować konwersacji.");
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages(convId) {
    const res = await apiFetch(
      `/api/chat/conversations/${convId}/messages?page=0&size=50`,
    );
    const data = await res.json();
    setMessages(data.messages.reverse());
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await apiFetch("/api/chat/messages", {
        method: "POST",
        body: JSON.stringify({
          receiverId: Number(professionalId),
          content: content.trim(),
        }),
      });

      const newMessage = await res.json();

      if (!conversationId) {
        setConversationId(newMessage.conversationId);
      }

      setMessages((prev) => [...prev, newMessage]);
      setContent("");
    } catch (e) {
      setError("Nie udało się wysłać wiadomości.");
    }
  }

  async function sendOffer(amount) {
    await sendSpecialMessage({ type: "OFFER", amount, status: "PENDING" });
  }

  async function acceptOffer() {
    await sendSpecialMessage({
      type: "OFFER",
      amount: currentOffer.amount,
      status: "ACCEPTED",
    });
  }

  async function counterOffer(amount) {
    await sendSpecialMessage({ type: "OFFER", amount, status: "PENDING" });
  }

  async function sendSpecialMessage(payload) {
    try {
      const res = await apiFetch("/api/chat/messages", {
        method: "POST",
        body: JSON.stringify({
          receiverId: Number(professionalId),
          content: JSON.stringify(payload),
        }),
      });
      const newMessage = await res.json();
      if (!conversationId) setConversationId(newMessage.conversationId);
      setMessages((prev) => [...prev, newMessage]);
    } catch {
      setError("Nie udało się wysłać oferty.");
    }
  }

  useEffect(() => {
    if (!conversationId) return;

    const interval = setInterval(() => {
      loadMessages(conversationId);
    }, 1000);

    return () => clearInterval(interval);
  }, [conversationId]);

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>{error}</p>;

  async function handleShowProfile() {
    const res = await apiFetch(`/api/profile/${professionalId}`);
    const data = await res.json();
    setProfileData(data);
    setIsProfilePreviewModalOpen(true);
  }
  const isMine = (msg) => msg.senderId === user.userId;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-neutral-700">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard/chat")}
            className="text-neutral-400 hover:text-brand transition-colors p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <img
            src={conversation?.profilePicture?.url ?? "/icons/profileIcon.svg"}
            alt="Profile picture"
            className="w-12 h-12 rounded-2xl object-cover border border-neutral-600"
            draggable="false"
          />

          <div>
            <p className="text-lg font-semibold">
              {conversation?.fullName ?? `Użytkownik #${professionalId}`}
            </p>
            <p className="text-sm text-neutral-400">
              {conversation?.specialization !== "Brak danych"
                ? conversation?.specialization
                : ""}
            </p>
          </div>
        </div>

        {conversation?.specialization !== "Brak danych" ? (
          <div className="">
            <Button onClick={handleShowProfile}>Pokaż profil</Button>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 p-4 max-h-140">
        {messages.length === 0 && (
          <p className="text-neutral-400 text-center mt-10">
            Brak wiadomości. Napisz coś!
          </p>
        )}

        {messages.map((msg, index) => {
          let offer = null;
          try {
            const parsed = JSON.parse(msg.content);
            if (parsed.type === "OFFER") offer = parsed;
          } catch {}

          if (offer) {
            const lastOfferIndex = messages.reduce((last, m, i) => {
              try {
                const p = JSON.parse(m.content);
                return p.type === "OFFER" ? i : last;
              } catch {
                return last;
              }
            }, -1);

            return (
              <OfferBubble
                key={msg.id}
                offer={offer}
                isMine={msg.senderId === user?.userId}
                userRole={user?.role}
                onAccept={acceptOffer}
                onCounter={counterOffer}
                isLatest={index === lastOfferIndex}
              />
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 ${isMine(msg) ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-3xl text-sm ${isMine(msg) ? "bg-brand  rounded-br-sm" : "bg-neutral-800 text-neutral-100 rounded-bl-sm"}`}
              >
                {msg.content}
              </div>
              <small className="text-neutral-500 text-xs px-1">
                {new Date(msg.sentAt).toLocaleTimeString()}
              </small>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      {isSpecialist && (
        <OfferInitiator onSendOffer={sendOffer} currentOffer={currentOffer} />
      )}
      <div className="p-4 border-t border-neutral-700 flex gap-3 items-center">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(e)}
          placeholder="Napisz wiadomość..."
          className="flex-1 bg-neutral-800/30 border border-neutral-600 rounded-full px-4 py-2 text-sm outline-none focus:border-brand transition-colors"
        />
        <Button onClick={sendMessage} disabled={!content.trim()}>
          Wyślij
        </Button>
      </div>

      {isProfilePreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div
            className="absolute inset-0"
            onClick={() => setIsProfilePreviewModalOpen(false)}
          />

          <div className="relative bg-neutral-900 border border-neutral-700 rounded-2xl p-3 w-[75vw] shadow-xl flex flex-col gap-6 max-h-[90vh] overflow-y-scroll">
            <div className="flex justify-between items-center">
              <h2 className="text-lg text-black">Podgląd profilu</h2>

              <button
                className="px-5 py-2 rounded-3xl bg-brand"
                onClick={() => setIsProfilePreviewModalOpen(false)}
              >
                Zamknij
              </button>
            </div>

            <ProfileCard
              data={{
                profile: profileData,
                user: {
                  fullName: conversation?.fullName,
                  email: conversation?.email,
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
