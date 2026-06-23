import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/ui/Button.jsx";
import OfferInitiator from "../components/ui/OfferInitiator.jsx";
import OfferBubble from "../components/ui/OfferBubble.jsx";
import ProfileCard from "../components/ui/ProfileCard.jsx";
import AuthImage from "../components/ui/AuthImage.jsx";
import ImageLightbox from "../components/ui/ImageLightbox.jsx";

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
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);
  const [conversationId, setConversationId] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProfilePreviewModalOpen, setIsProfilePreviewModalOpen] =
    useState(false);
  const [profileData, setProfileData] = useState({});
  const [lightbox, setLightbox] = useState(null);

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isGeneratingContract, setIsGeneratingContract] = useState(false);
  const [isDownloadingContract, setIsDownloadingContract] = useState(false);

  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const isSpecialist = conversation
    ? conversation.specialistUserId === user?.userId
    : false;
  const currentOffer = extractCurrentOffer(messages, user?.userId);

  // ZMIANA: Przekazujemy currentOffer do analizatora stanu umowy
  const contractState = extractContractState(messages, currentOffer);

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
    return { ...parsed, senderId: last.senderId, messageId: last.id };
  }

  // ZMIANA: Funkcja analizuje stan danych do umowy WYŁĄCZNIE dla aktualnego cyklu (od momentu akceptacji oferty)
  function extractContractState(messages, currentOffer) {
    let contractType = "UMOWA_ZLECENIE";
    let ordererType = "PERSON";
    let ordererData = null;
    let specialistData = null;
    let finalContract = null;

    // Jeśli nie ma oferty lub nie została zaakceptowana, nie ma aktywnego procesu generowania umowy
    if (!currentOffer || currentOffer.status !== "ACCEPTED") {
      return {
        contractType,
        ordererType,
        ordererData,
        specialistData,
        finalContract,
      };
    }

    // Znajdujemy pozycję wiadomości z zaakceptowaną ofertą
    const offerIndex = messages.findIndex(
      (m) => m.id === currentOffer.messageId,
    );
    if (offerIndex === -1)
      return {
        contractType,
        ordererType,
        ordererData,
        specialistData,
        finalContract,
      };

    // Bierzemy pod uwagę tylko wiadomości, które pojawiły się PO zaakceptowaniu tej konkretnej oferty
    const relevantMessages = messages.slice(offerIndex + 1);

    relevantMessages.forEach((m) => {
      try {
        const parsed = JSON.parse(m.content);
        if (parsed.type === "CONTRACT_DATA_SUBMIT") {
          if (parsed.role === "SPECIALIST") {
            specialistData = parsed.data;
            if (parsed.contractType) contractType = parsed.contractType;
          }
          if (parsed.role === "CLIENT") {
            ordererData = parsed.data;
            if (parsed.ordererType) ordererType = parsed.ordererType;
          }
        }
        if (parsed.type === "CONTRACT_FINAL") {
          finalContract = parsed;
        }
      } catch {}
    });

    return {
      contractType,
      ordererType,
      ordererData,
      specialistData,
      finalContract,
    };
  }

  useEffect(() => {
    loadConversation();
  }, [professionalId]);

  async function loadConversation() {
    setLoading(true);
    try {
      const [convRes, profileRes] = await Promise.all([
        apiFetch("/api/chat/conversations"),
        apiFetch(`/api/profile/${professionalId}`),
      ]);
      const conversations = await convRes.json();
      const profileJson = await profileRes.json();
      setProfileData(profileJson);

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

  async function sendOffer(amount, description) {
    await sendSpecialMessage({
      type: "OFFER",
      amount,
      description,
      status: "PENDING",
    });
  }

  async function acceptOffer() {
    await sendSpecialMessage({
      type: "OFFER",
      amount: currentOffer.amount,
      description: currentOffer.description,
      status: "ACCEPTED",
    });
  }

  async function counterOffer(amount, description) {
    await sendSpecialMessage({
      type: "OFFER",
      amount,
      description,
      status: "PENDING",
    });
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
      setError("Nie udało się przetworzyć akcji.");
    }
  }

  async function handleSendContractData(roleFields) {
    await sendSpecialMessage({
      type: "CONTRACT_DATA_SUBMIT",
      role: isSpecialist ? "SPECIALIST" : "CLIENT",
      contractType: roleFields.contractType,
      ordererType: roleFields.ordererType,
      data: roleFields,
    });
    setIsContractModalOpen(false);
  }

  async function handleGenerateFinalContract() {
    setIsGeneratingContract(true);
    try {
      const token = localStorage.getItem("token");

      const fullFormPayload = {
        conversationId,
        contractType: contractState.contractType,
        ordererType: contractState.ordererType,

        ordererFullName: contractState.ordererData?.ordererFullName,
        ordererPesel: contractState.ordererData?.ordererPesel,
        ordererIdNumber: contractState.ordererData?.ordererIdNumber,
        ordererAddress: contractState.ordererData?.ordererAddress,
        ordererCity: contractState.ordererData?.ordererCity,
        ordererPostalCode: contractState.ordererData?.ordererPostalCode,

        ordererCompanyName: contractState.ordererData?.ordererCompanyName,
        ordererNip: contractState.ordererData?.ordererNip,
        ordererRegon: contractState.ordererData?.ordererRegon,
        ordererKrs: contractState.ordererData?.ordererKrs,
        ordererRepresentativeName:
          contractState.ordererData?.ordererRepresentativeName,
        ordererRepresentativeTitle:
          contractState.ordererData?.ordererRepresentativeTitle,

        specialistFullName: contractState.specialistData?.specialistFullName,
        specialistPesel: contractState.specialistData?.specialistPesel,
        specialistIdNumber: contractState.specialistData?.specialistIdNumber,
        specialistAddress: contractState.specialistData?.specialistAddress,
        specialistCity: contractState.specialistData?.specialistCity,
        specialistPostalCode:
          contractState.specialistData?.specialistPostalCode,
        specialistEmail: contractState.specialistData?.specialistEmail,
        specialistPhone: contractState.specialistData?.specialistPhone,

        subjectDescription: currentOffer?.description || "",
        remunerationAmount: String(currentOffer?.amount || ""),
        remunerationCurrency: "PLN",
      };

      const response = await fetch("/api/contracts/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fullFormPayload),
      });

      if (!response.ok) throw new Error();

      const data = await response.json();

      await sendSpecialMessage({
        type: "CONTRACT_FINAL",
        contractId: data.id,
        contractType: contractState.contractType,
      });
    } catch {
      setError("Błąd podczas generowania pliku PDF umowy.");
    } finally {
      setIsGeneratingContract(false);
    }
  }

  async function handleDownloadContract(contractId) {
    setIsDownloadingContract(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/contracts/${contractId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return;

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `umowa_zlecenia_${contractId}.pdf`;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(objectUrl);
      document.body.removeChild(link);
    } catch {
      setError("Nie udało się pobrać pliku.");
    } finally {
      setIsDownloadingContract(false);
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

  function handleShowProfile() {
    setIsProfilePreviewModalOpen(true);
  }

  function handleImageSelect(e) {
    const files = Array.from(e.target.files);

    setSelectedImages((prev) => {
      const merged = [...prev, ...files];

      if (merged.length > 4) {
        setError("Maksymalnie 4 zdjęcia");
        return prev;
      }

      return merged;
    });
  }

  async function sendImages() {
    if (!selectedImages.length) return;

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      selectedImages.forEach((file) => {
        formData.append("images", file);
      });

      const uploadRes = await fetch("/api/chat/images", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadRes.ok) throw new Error();

      const uploaded = await uploadRes.json();

      await sendSpecialMessage({
        type: "IMAGE",
        images: uploaded,
      });

      setSelectedImages([]);
    } catch {
      setError("Nie udało się wysłać zdjęć.");
    }
  }

  const isMine = (msg) => msg.senderId === user.userId;

  return (
    <div className="flex flex-col h-full text-neutral-100">
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
            src={
              conversation?.profilePicture?.url ??
              profileData?.profilePicture?.url ??
              "/icons/profileIcon.svg"
            }
            alt="Profile picture"
            className="w-12 h-12 rounded-2xl object-cover border border-neutral-600"
            draggable="false"
          />

          <div>
            <p className="text-lg font-semibold">
              {conversation?.fullName ??
                profileData?.fullName ??
                `Użytkownik #${professionalId}`}
            </p>
            <p className="text-sm text-neutral-400">
              {conversation?.specialization &&
              conversation.specialization !== "Brak danych"
                ? conversation.specialization
                : (profileData?.specialization ?? "")}
            </p>{" "}
          </div>
        </div>

        {(conversation?.specialization !== "Brak danych" ||
          profileData?.specialization) && (
          <div>
            <Button onClick={handleShowProfile}>Pokaż profil</Button>
          </div>
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
          let isDataSubmitMsg = false;
          let contractFinalData = null;

          try {
            const parsed = JSON.parse(msg.content);

            if (parsed?.type === "IMAGE") {
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1 ${isMine(msg) ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`grid gap-1.5 max-w-[70%] p-1.5 rounded-3xl
                      ${isMine(msg) ? "bg-brand rounded-br-sm" : "bg-neutral-800 rounded-bl-sm"}
                      ${parsed.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}
                    `}
                  >
                    {parsed.images.map((img, imgIndex) => (
                      <div
                        key={img.id}
                        className="relative group cursor-zoom-in"
                        onClick={() =>
                          setLightbox({
                            images: parsed.images,
                            index: imgIndex,
                          })
                        }
                      >
                        <AuthImage
                          url={`/api${img.url}`}
                          className={`rounded-2xl object-cover w-full h-48 ${
                            parsed.images.length === 1
                              ? isMine(msg)
                                ? "rounded-br-sm"
                                : "rounded-bl-sm"
                              : ""
                          }`}
                        />
                        <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-end p-2">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zm0 0l2 2"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 11h6M11 8v6"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <small className="text-neutral-500 text-xs px-1">
                    {new Date(msg.sentAt).toLocaleTimeString()}
                  </small>
                </div>
              );
            }
            if (parsed.type === "OFFER") offer = parsed;
            if (parsed.type === "CONTRACT_DATA_SUBMIT") isDataSubmitMsg = true;

            // ZMIANA: Wyciągamy dane finalnej umowy z wiadomości systemowej
            if (parsed.type === "CONTRACT_FINAL") contractFinalData = parsed;
          } catch {}

          // Ukrywamy wyłącznie cząstkowe struktury wpisywania danych osobowych
          if (isDataSubmitMsg) return null;

          // ZMIANA: Renderowanie wygenerowanej umowy w strumieniu czatu jako normalny bubble
          if (contractFinalData) {
            return (
              <div
                key={msg.id}
                className="flex justify-center my-3 animate-fadeIn"
              >
                <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-2xl flex flex-col gap-2 max-w-md w-full shadow-md">
                  <div className="flex items-center gap-2 text-green-500">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="font-semibold text-sm text-neutral-100">
                      Oficjalna umowa PDF została wygenerowana!
                    </p>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Typ dokumentu:{" "}
                    {contractFinalData.contractType === "UMOWA_O_DZIELO"
                      ? "Umowa o dzieło"
                      : "Umowa zlecenie"}
                  </p>
                  <Button
                    onClick={() =>
                      handleDownloadContract(contractFinalData.contractId)
                    }
                    disabled={isDownloadingContract}
                  >
                    {isDownloadingContract
                      ? "Pobieranie..."
                      : "Pobierz umowę PDF"}
                  </Button>
                </div>
              </div>
            );
          }

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
                className={`max-w-[70%] px-4 py-2 rounded-3xl text-sm text-neutral-100 ${
                  isMine(msg)
                    ? "bg-brand rounded-br-sm"
                    : "bg-neutral-800 rounded-bl-sm"
                }`}
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

      {/* DEDYKOWANY PANEL MANAGERA UMOWY */}
      {/* ZMIANA: Dodano warunek !contractState.finalContract – panel znika z dołu ekranu po wygenerowaniu pliku */}
      {currentOffer?.status === "ACCEPTED" && !contractState.finalContract && (
        <div className="mx-4 mb-2 p-4 bg-neutral-50 border border-neutral-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <p className="font-semibold text-sm text-neutral-800">
                Oferta zaakceptowana ({currentOffer.amount} PLN)
              </p>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Uzupełnijcie dane, aby wygenerować oficjalną umowę PDF.
            </p>

            <div className="flex gap-4 mt-2 text-xs">
              <span
                className={
                  contractState.specialistData
                    ? "text-green-600"
                    : "text-neutral-400"
                }
              >
                ● Fachowiec:{" "}
                {contractState.specialistData ? "Dane wpisane" : "Oczekiwanie"}
              </span>
              <span
                className={
                  contractState.ordererData
                    ? "text-green-600"
                    : "text-neutral-400"
                }
              >
                ● Zleceniodawca:{" "}
                {contractState.ordererData ? "Dane wpisane" : "Oczekiwanie"}
              </span>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <Button
              look="secondary"
              onClick={() => setIsContractModalOpen(true)}
            >
              {(
                isSpecialist
                  ? contractState.specialistData
                  : contractState.ordererData
              )
                ? "Edytuj swoje dane"
                : "Wpisz dane do umowy"}
            </Button>

            {isSpecialist &&
              contractState.specialistData &&
              contractState.ordererData && (
                <Button
                  onClick={handleGenerateFinalContract}
                  disabled={isGeneratingContract}
                >
                  {isGeneratingContract ? "Generowanie..." : "Generuj umowę"}
                </Button>
              )}
          </div>
        </div>
      )}

      {/* Aktywne bloki wpisywania wiadomości / inicjowania ofert */}
      {/* ZMIANA: Komponent propozycji nowej oferty pojawia się ponownie, jeśli obecna oferta ma już wygenerowaną umowę PDF */}
      {(currentOffer?.status !== "ACCEPTED" || contractState.finalContract) && (
        <OfferInitiator onSendOffer={sendOffer} currentOffer={currentOffer} />
      )}

      {selectedImages.length > 0 && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto items-center">
          {selectedImages.map((file, idx) => (
            <div key={idx} className="relative shrink-0 group">
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="w-20 h-20 rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  setSelectedImages((prev) => prev.filter((_, i) => i !== idx))
                }
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-neutral-900 border
                border-neutral-600 text-neutral-300 hover:text-white hover:bg-red-500 hover:border-red-500 flex items-center
                justify-center text-xs leading-none transition-colors opacity-0 group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}

          <Button onClick={sendImages}>Wyślij ({selectedImages.length})</Button>
        </div>
      )}
      <div className="p-4 border-t border-neutral-700 flex gap-3 items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageSelect}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-10 h-10 rounded-full bg-neutral-800/30 flex items-center justify-center border border-neutral-600 hover:bg-neutral-800/80"
        >
          +
        </button>

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

      {/* MODAL FORMULARZA DANYCH UMOWY */}
      {isContractModalOpen && (
        <ContractFormModal
          isSpecialist={isSpecialist}
          currentOffer={currentOffer}
          savedState={contractState}
          onClose={() => setIsContractModalOpen(false)}
          onSubmit={handleSendContractData}
        />
      )}

      {/* Profil Preview Modal */}
      {isProfilePreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div
            className="absolute inset-0"
            onClick={() => setIsProfilePreviewModalOpen(false)}
          />
          <div className="relative bg-neutral-900 border border-neutral-700 rounded-2xl p-4 w-[75vw] max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
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
                  fullName: conversation?.fullName ?? profileData?.fullName,
                  email: conversation?.email ?? profileData?.email,
                },
              }}
            />
          </div>
        </div>
      )}

      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}

function ContractFormModal({
  isSpecialist,
  currentOffer,
  savedState,
  onClose,
  onSubmit,
}) {
  const [contractType, setContractType] = useState(savedState.contractType);
  const [ordererType, setOrdererType] = useState(savedState.ordererType);

  const [fields, setFields] = useState({
    contractType: savedState.contractType,
    ordererType: savedState.ordererType,
    ordererFullName: savedState.ordererData?.ordererFullName ?? "",
    ordererPesel: savedState.ordererData?.ordererPesel ?? "",
    ordererIdNumber: savedState.ordererData?.ordererIdNumber ?? "",
    ordererAddress: savedState.ordererData?.ordererAddress ?? "",
    ordererCity: savedState.ordererData?.ordererCity ?? "",
    ordererPostalCode: savedState.ordererData?.ordererPostalCode ?? "",
    ordererCompanyName: savedState.ordererData?.ordererCompanyName ?? "",
    ordererNip: savedState.ordererData?.ordererNip ?? "",
    ordererRegon: savedState.ordererData?.ordererRegon ?? "",
    ordererKrs: savedState.ordererData?.ordererKrs ?? "",
    ordererRepresentativeName:
      savedState.ordererData?.ordererRepresentativeName ?? "",
    ordererRepresentativeTitle:
      savedState.ordererData?.ordererRepresentativeTitle ?? "",
    specialistFullName: savedState.specialistData?.specialistFullName ?? "",
    specialistPesel: savedState.specialistData?.specialistPesel ?? "",
    specialistIdNumber: savedState.specialistData?.specialistIdNumber ?? "",
    specialistAddress: savedState.specialistData?.specialistAddress ?? "",
    specialistCity: savedState.specialistData?.specialistCity ?? "",
    specialistPostalCode: savedState.specialistData?.specialistPostalCode ?? "",
    specialistEmail: savedState.specialistData?.specialistEmail ?? "",
    specialistPhone: savedState.specialistData?.specialistPhone ?? "",
    completionDeadline: savedState.specialistData?.completionDeadline ?? "",
    paymentDeadline: savedState.specialistData?.paymentDeadline ?? "",
    contractPlace: savedState.specialistData?.contractPlace ?? "",
    contractDate: savedState.specialistData?.contractDate ?? "",
  });

  const handleChange = (key, val) => {
    setFields((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...fields, contractType, ordererType });
  };

  const inputClass =
    "w-full bg-neutral-800/30 border border-neutral-600 rounded-xl px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-brand transition-colors";
  const labelClass = "text-xs font-medium text-neutral-400 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col"
      >
        <div className="p-4 border-b border-neutral-700 flex justify-between items-center sticky top-0 bg-neutral-900 z-10">
          <div>
            <h3 className="font-semibold text-base text-neutral-100">
              Uzupełnij swoje dane do umowy
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Dane zakresu i ceny zostaną pobrane z oferty.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-100 text-sm"
          >
            Anuluj
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5 overflow-y-auto">
          <div className="p-3 bg-neutral-800/50 border border-neutral-700 rounded-xl grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-neutral-400 block">
                Wynagrodzenie (z oferty):
              </span>
              <span className="font-bold text-neutral-300 text-sm">
                {currentOffer?.amount} PLN
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block">Zakres zlecenia:</span>
              <span className="text-neutral-300 line-clamp-2 italic">
                "{currentOffer?.description || "Brak opisu zlecenia"}"
              </span>
            </div>
          </div>

          {isSpecialist ? (
            <div className="flex flex-col gap-4">
              <div className="border-b border-neutral-700 pb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-neutral-600">
                  Ustawienia Umowy i Twoje dane
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setContractType("UMOWA_ZLECENIE")}
                  className={`p-3 rounded-xl border text-sm font-medium text-left ${contractType === "UMOWA_ZLECENIE" ? "bg-brand/20 border-brand text-neutral-100" : "bg-neutral-800 border-neutral-600 text-neutral-400"}`}
                >
                  Umowa zlecenie
                </button>
                <button
                  type="button"
                  onClick={() => setContractType("UMOWA_O_DZIELO")}
                  className={`p-3 rounded-xl border text-sm font-medium text-left ${contractType === "UMOWA_O_DZIELO" ? "bg-brand/20 border-brand text-neutral-100" : "bg-neutral-800 border-neutral-600 text-neutral-400"}`}
                >
                  Umowa o dzieło
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col col-span-2">
                  <label className={labelClass}>
                    Imię i nazwisko / Nazwa firmy *
                  </label>
                  <input
                    required
                    className={inputClass}
                    value={fields.specialistFullName}
                    onChange={(e) =>
                      handleChange("specialistFullName", e.target.value)
                    }
                    placeholder="Jan Kowalski"
                  />
                </div>
                <div className="flex flex-col">
                  <label className={labelClass}>PESEL</label>
                  <input
                    className={inputClass}
                    value={fields.specialistPesel}
                    onChange={(e) =>
                      handleChange("specialistPesel", e.target.value)
                    }
                    placeholder="00000000000"
                  />
                </div>
                <div className="flex flex-col">
                  <label className={labelClass}>Nr dowodu osobistego</label>
                  <input
                    className={inputClass}
                    value={fields.specialistIdNumber}
                    onChange={(e) =>
                      handleChange("specialistIdNumber", e.target.value)
                    }
                    placeholder="ABC 123456"
                  />
                </div>
                <div className="flex flex-col col-span-2">
                  <label className={labelClass}>
                    Adres zamieszkania / Siedziby *
                  </label>
                  <input
                    required
                    className={inputClass}
                    value={fields.specialistAddress}
                    onChange={(e) =>
                      handleChange("specialistAddress", e.target.value)
                    }
                    placeholder="Kwiatowa 12/3"
                  />
                </div>
                <div className="flex flex-col">
                  <label className={labelClass}>Kod pocztowy</label>
                  <input
                    className={inputClass}
                    value={fields.specialistPostalCode}
                    onChange={(e) =>
                      handleChange("specialistPostalCode", e.target.value)
                    }
                    placeholder="00-000"
                  />
                </div>
                <div className="flex flex-col">
                  <label className={labelClass}>Miasto</label>
                  <input
                    className={inputClass}
                    value={fields.specialistCity}
                    onChange={(e) =>
                      handleChange("specialistCity", e.target.value)
                    }
                    placeholder="Warszawa"
                  />
                </div>
                <div className="flex flex-col">
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    className={inputClass}
                    value={fields.specialistEmail}
                    onChange={(e) =>
                      handleChange("specialistEmail", e.target.value)
                    }
                    placeholder="kontakt@fachowiec.pl"
                  />
                </div>
                <div className="flex flex-col">
                  <label className={labelClass}>Telefon</label>
                  <input
                    className={inputClass}
                    value={fields.specialistPhone}
                    onChange={(e) =>
                      handleChange("specialistPhone", e.target.value)
                    }
                    placeholder="500 600 700"
                  />
                </div>
              </div>

              <div className="border-t border-neutral-700 pt-3 grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label className={labelClass}>Termin zakończenia prac</label>
                  <input
                    className={inputClass}
                    value={fields.completionDeadline}
                    onChange={(e) =>
                      handleChange("completionDeadline", e.target.value)
                    }
                    placeholder="np. 30.09.2026"
                  />
                </div>
                <div className="flex flex-col">
                  <label className={labelClass}>Termin płatności</label>
                  <input
                    className={inputClass}
                    value={fields.paymentDeadline}
                    onChange={(e) =>
                      handleChange("paymentDeadline", e.target.value)
                    }
                    placeholder="np. 14 dni od odbioru"
                  />
                </div>
                <div className="flex flex-col">
                  <label className={labelClass}>Miejsce zawarcia umowy</label>
                  <input
                    className={inputClass}
                    value={fields.contractPlace}
                    onChange={(e) =>
                      handleChange("contractPlace", e.target.value)
                    }
                    placeholder="np. Łódź"
                  />
                </div>
                <div className="flex flex-col">
                  <label className={labelClass}>Data zawarcia</label>
                  <input
                    type="date"
                    className={inputClass}
                    value={fields.contractDate}
                    onChange={(e) =>
                      handleChange("contractDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="border-b border-neutral-700 pb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-neutral-600">
                  Twoje dane jako Zleceniodawcy
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOrdererType("PERSON")}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium ${ordererType === "PERSON" ? "bg-brand text-white border-brand" : "bg-neutral-800 border-neutral-600 text-neutral-400"}`}
                >
                  Osoba prywatna
                </button>
                <button
                  type="button"
                  onClick={() => setOrdererType("COMPANY")}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium ${ordererType === "COMPANY" ? "bg-brand text-white border-brand" : "bg-neutral-800 border-neutral-600 text-neutral-400"}`}
                >
                  Firma / Spółka
                </button>
              </div>

              {ordererType === "PERSON" ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col col-span-2">
                    <label className={labelClass}>Imię i nazwisko *</label>
                    <input
                      required
                      className={inputClass}
                      value={fields.ordererFullName}
                      onChange={(e) =>
                        handleChange("ordererFullName", e.target.value)
                      }
                      placeholder="Jan Kowalski"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelClass}>PESEL *</label>
                    <input
                      required
                      className={inputClass}
                      value={fields.ordererPesel}
                      onChange={(e) =>
                        handleChange("ordererPesel", e.target.value)
                      }
                      placeholder="00000000000"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelClass}>Seria i nr dowodu</label>
                    <input
                      className={inputClass}
                      value={fields.ordererIdNumber}
                      onChange={(e) =>
                        handleChange("ordererIdNumber", e.target.value)
                      }
                      placeholder="ABC 123456"
                    />
                  </div>
                  <div className="flex flex-col col-span-2">
                    <label className={labelClass}>Adres zamieszkania *</label>
                    <input
                      required
                      className={inputClass}
                      value={fields.ordererAddress}
                      onChange={(e) =>
                        handleChange("ordererAddress", e.target.value)
                      }
                      placeholder="Prosta 5"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelClass}>Kod pocztowy *</label>
                    <input
                      required
                      className={inputClass}
                      value={fields.ordererPostalCode}
                      onChange={(e) =>
                        handleChange("ordererPostalCode", e.target.value)
                      }
                      placeholder="00-000"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelClass}>Miasto *</label>
                    <input
                      required
                      className={inputClass}
                      value={fields.ordererCity}
                      onChange={(e) =>
                        handleChange("ordererCity", e.target.value)
                      }
                      placeholder="Gdańsk"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col col-span-2">
                    <label className={labelClass}>Pełna nazwa firmy *</label>
                    <input
                      required
                      className={inputClass}
                      value={fields.ordererCompanyName}
                      onChange={(e) =>
                        handleChange("ordererCompanyName", e.target.value)
                      }
                      placeholder="Moja Firma Sp. z o.o."
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelClass}>NIP *</label>
                    <input
                      required
                      className={inputClass}
                      value={fields.ordererNip}
                      onChange={(e) =>
                        handleChange("ordererNip", e.target.value)
                      }
                      placeholder="1234567890"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelClass}>KRS / REGON</label>
                    <input
                      className={inputClass}
                      value={fields.ordererKrs}
                      onChange={(e) =>
                        handleChange("ordererKrs", e.target.value)
                      }
                      placeholder="KRS lub REGON"
                    />
                  </div>
                  <div className="flex flex-col col-span-2">
                    <label className={labelClass}>Adres siedziby firmy *</label>
                    <input
                      required
                      className={inputClass}
                      value={fields.ordererAddress}
                      onChange={(e) =>
                        handleChange("ordererAddress", e.target.value)
                      }
                      placeholder="Al. Jerozolimskie 44"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelClass}>Kod pocztowy *</label>
                    <input
                      required
                      className={inputClass}
                      value={fields.ordererPostalCode}
                      onChange={(e) =>
                        handleChange("ordererPostalCode", e.target.value)
                      }
                      placeholder="00-000"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelClass}>Miasto *</label>
                    <input
                      required
                      className={inputClass}
                      value={fields.ordererCity}
                      onChange={(e) =>
                        handleChange("ordererCity", e.target.value)
                      }
                      placeholder="Warszawa"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelClass}>Reprezentant firmy *</label>
                    <input
                      required
                      className={inputClass}
                      value={fields.ordererRepresentativeName}
                      onChange={(e) =>
                        handleChange(
                          "ordererRepresentativeName",
                          e.target.value,
                        )
                      }
                      placeholder="Marek Nowak"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelClass}>
                      Stanowisko reprezentanta
                    </label>
                    <input
                      className={inputClass}
                      value={fields.ordererRepresentativeTitle}
                      onChange={(e) =>
                        handleChange(
                          "ordererRepresentativeTitle",
                          e.target.value,
                        )
                      }
                      placeholder="Prezes Zarządu"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-neutral-700 bg-white sticky bottom-0 z-10 flex gap-2">
          <Button className="flex-1" type="submit">
            Zatwierdź i wyślij do umowy
          </Button>
          <Button look="secondary" type="button" onClick={onClose}>
            Anuluj
          </Button>
        </div>
      </form>
    </div>
  );
}
