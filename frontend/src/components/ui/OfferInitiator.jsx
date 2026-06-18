import { useState } from "react";

function OfferInitiator({ onSendOffer, currentOffer }) {
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);

  if (currentOffer && currentOffer.status === "PENDING") return null;
  if (currentOffer && currentOffer.status === "ACCEPTED") return null;

  return (
    <div className="px-4 pb-2">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-sm hover:underline"
        >
          + Zaproponuj cenę
        </button>
      ) : (
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Kwota w zł"
            className="flex-1 bg-neutral-800/30 border border-neutral-600 rounded-full px-3 py-1 text-sm outline-none focus:border-brand"
          />
          <button
            onClick={() => {
              if (amount) {
                onSendOffer(Number(amount));
                setAmount("");
                setOpen(false);
              }
            }}
            className="bg-brand  rounded-full px-4 py-1 text-sm hover:brightness-90"
          >
            Wyślij ofertę
          </button>
          <button
            onClick={() => setOpen(false)}
            className="text-neutral-400 hover:text-black text-sm"
          >
            Anuluj
          </button>
        </div>
      )}
    </div>
  );
}

export default OfferInitiator;
