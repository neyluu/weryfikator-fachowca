import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  console.log(user);

  useEffect(() => {
    loadConversation();
  }, [professionalId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div>
        {messages.length === 0 && <p>Brak wiadomości. Napisz coś!</p>}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              textAlign: msg.senderId === user.userId ? "right" : "left",
            }}
          >
            <span>{msg.content}</span>
            <small>{new Date(msg.sentAt).toLocaleTimeString()}</small>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(e)}
          placeholder="Napisz wiadomość..."
        />
        <button onClick={sendMessage}>Wyślij</button>
      </div>
    </div>
  );
}
