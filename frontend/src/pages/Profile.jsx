import usePageTitle from "../util/pageTitle";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import TextArea from "../components/ui/TextArea.jsx";

function Activity() {
  usePageTitle("Weryfikator Fachowca - Profil fachowca");

  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isSpecialist = user?.role === "SPECIALIST";

  const [profileCreation, setProfileCreation] = useState(false);

  const days = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];
  const [selectedDays, setSelectedDays] = useState([]);
  const [photos, setPhotos] = useState([]);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleAddPhotos = (e) => {
    const files = Array.from(e.target.files);

    const mapped = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: crypto.randomUUID(),
    }));

    setPhotos((prev) => [...prev, ...mapped]);
  };

  const removePhoto = (id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    if (!loading && user && !isSpecialist) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, user, isSpecialist, navigate]);

  if (loading || !user || !isSpecialist) return null;

  return (
    <div className="w-full">
      {!profileCreation && (
        <div className="flex-col flex gap-6">
          <div className="p-6 bg-neutral-800/25 border border-neutral-800 rounded-3xl">
            Widzę, że jesteś nowym fachowcem, utwórz profil, by inni mogli cię
            wyszukać
          </div>
          <Button onClick={() => setProfileCreation(true)}>
            Utwórz profil
          </Button>
        </div>
      )}

      {profileCreation && (
        <div className="flex-col flex gap-6">
          <div className="p-6 bg-neutral-800/25 border border-neutral-800 rounded-3xl mb-5">
            Wpisz dane poniżej aby utworzyć profil
          </div>

          <form className="flex flex-col gap-3">
            <Input type="text" placeholder="Specjalizacja" />

            <TextArea
              placeholder="Opis działalności"
              className="p-3 rounded-xl bg-neutral-900 border border-neutral-700"
            />

            <Input type="text" placeholder="Doświadczenie" />
            <Input type="text" placeholder="Lokalizacja" />
            <Input type="number" placeholder="Numer telefonu" />
            <Input type="email" placeholder="Email" />

            <Input type="text" placeholder="Przedział cenowy" />

            <div className="flex flex-col gap-3">
              <p className="text-gray-600">Portfolio</p>

              <label
                className="cursor-pointer border-2 border-dashed
                          border-neutral-700 hover:border-neutral-300 transition
                          rounded-xl p-6
                          flex flex-col items-center
                          justify-center text-neutral-700 hover:text-neutral-300"
              >
                <span className="text-sm">Kliknij aby wybrać zdjęcie</span>
                <span className="text-xs opacity-70 mt-1">
                  PNG, JPG (możesz dodać wiele)
                </span>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAddPhotos}
                  className="hidden"
                />
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.url}
                      alt="portfolio"
                      className="w-full h-32 object-cover rounded-md border border-neutral-800"
                    />

                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-2 right-2 bg-black/70 hover:bg-red-500 text-white w-6 h-6 rounded-md opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-[minmax(120px,1fr)_2fr] items-center gap-4">
              <label className="text-gray-600">
                <span>Godziny dostępności</span>
              </label>

              <div className="flex gap-3 w-full">
                <Input type="time" className="w-full" />
                <div className="flex items-center justify-center">-</div>
                <Input type="time" className="w-full" />
              </div>
            </div>

            <div className="grid grid-cols-[minmax(120px,1fr)_2fr] items-start gap-4">
              <label className="text-gray-600 pt-2">
                <span>Dni dostępności</span>
              </label>

              <div className="flex flex-wrap gap-2 w-full">
                {days.map((day) => {
                  const active = selectedDays.includes(day);

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`
                        flex-1 
                        px-4 py-2 rounded-xl border transition-all text-sm
                        ${
                          active
                            ? "bg-brand text-neutral-100 border-brand"
                            : "bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-500"
                        }
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-6 pt-5">
              <Button className="flex-1" look="secondary">
                Podgląd
              </Button>
              <Button className="flex-1">Zapisz profil</Button>
              <Button className="flex-1" look="secondary">
                Anuluj
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Activity;
