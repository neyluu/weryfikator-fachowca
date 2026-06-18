import { useState } from "react";
import Button from "./Button.jsx";

function OfferBubble({ offer, isMine, userRole, onAccept, onCounter }) {
  const [counterAmount, setCounterAmount] = useState("");
  const [showCounter, setShowCounter] = useState(false);

  const canRespond = !isMine && offer.status === "PENDING";

  if (offer.status === "ACCEPTED") {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-green-800 text-green-200 px-4 py-2 rounded-2xl text-sm flex justify-between gap-3 items-center">
          <p>
            ✓ Zaakceptowano cenę: <strong>{offer.amount} zł</strong>
          </p>
          <Button className="h-5">
            Stwórz umowę
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} my-1`}>
      <div className="border border-brand rounded-3xl px-4 py-3 max-w-[70%] flex flex-col gap-2">
        <p className="text-sm text-neutral-400">
          {isMine ? "Twoja propozycja" : "Propozycja ceny"}
        </p>
        <p className="text-2xl font-semibold">{offer.amount} zł</p>

        {canRespond && (
          <div className="flex flex-col gap-2 mt-1">
            <button
              onClick={onAccept}
              className="bg-green-700 hover:bg-green-600 text-white rounded-full px-4 py-1 text-sm transition-colors"
            >
              Akceptuj
            </button>
            <button
              onClick={() => setShowCounter(!showCounter)}
              className="border border-neutral-500 hover:border-neutral-300 text-neutral-300 rounded-full px-4 py-1 text-sm transition-colors"
            >
              Zaproponuj inną
            </button>
            {showCounter && (
              <div className="flex gap-2">
                <input
                  type="number"
                  value={counterAmount}
                  onChange={(e) => setCounterAmount(e.target.value)}
                  placeholder="Kwota w zł"
                  className="flex-1 bg-neutral-800/30 border border-neutral-600 rounded-full px-3 py-1 text-sm outline-none focus:border-brand"
                />
                <button
                  onClick={() => {
                    if (counterAmount) onCounter(Number(counterAmount));
                  }}
                  className="bg-brand  rounded-full px-3 py-1 text-sm hover:brightness-90"
                >
                  Wyślij
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OfferBubble;
