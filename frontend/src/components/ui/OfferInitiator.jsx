import { useState } from "react";

const DESCRIPTION_LIMIT = 500;

function OfferInitiator({ onSendOffer, currentOffer, disabled }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);

  if (currentOffer && currentOffer.status === "PENDING") return null;

  const handleSend = () => {
    if (amount && description.trim()) {
      onSendOffer(Number(amount), description.trim());
      setAmount("");
      setDescription("");
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setAmount("");
    setDescription("");
    setOpen(false);
  };

  return (
    <div className="px-4 pb-2">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-sm hover:underline"
        >
          + Zaproponuj ofertę (zakres i cena)
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value.slice(0, DESCRIPTION_LIMIT))
            }
            maxLength={DESCRIPTION_LIMIT}
            placeholder="Czego dotyczy oferta? (np. Montaż kabiny prysznicowej)"
            className="w-full bg-neutral-800/30 border border-neutral-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
          />

          <p className="text-xs text-neutral-400 text-right">
            Pozostało: {DESCRIPTION_LIMIT - description.length}
          </p>

          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Kwota w zł"
              className="w-1/3 bg-neutral-800/30 border border-neutral-600 rounded-full px-3 py-1 text-sm outline-none focus:border-brand"
            />
            <button
              onClick={handleSend}
              disabled={!amount || !description.trim()}
              className="bg-brand rounded-full px-4 py-1 text-sm hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Wyślij
            </button>
            <button
              onClick={handleCancel}
              className="text-neutral-400 hover:text-white text-sm transition-colors"
            >
              Anuluj
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OfferInitiator;
