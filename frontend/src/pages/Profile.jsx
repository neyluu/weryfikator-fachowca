import usePageTitle from "../util/pageTitle";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import TextArea from "../components/ui/TextArea.jsx";
import ProfileCard from "../components/ui/ProfileCard.jsx";

function Profile() {
  usePageTitle("Weryfikator Fachowca - Profil fachowca");

  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [userData, setUserData] = useState({});
  const isSpecialist = user?.role === "SPECIALIST";
  const [profileCreation, setProfileCreation] = useState(() => {
    const saved = localStorage.getItem("profileCreation");
    return saved ? JSON.parse(saved) : false;
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [profileCreatedMessage, setProfileCreatedMessage] = useState("");
  const [isProfilePreviewModalOpen, setIsProfilePreviewModalOpen] =
    useState(false);
  const [savedHours, setSavedHours] = useState({});

  const [formData, setFormData] = useState({
    specialization: "",
    description: "",
    experience: "",
    localization: "",
    phoneNumber: "",
    email: "",
    prices: {
      consultation: {
        enabled: false,
        value: { min: 0, max: 0 },
      },
      hourly: {
        enabled: false,
        value: { min: 0, max: 0 },
      },
      project: {
        enabled: false,
        value: { min: 0, max: 0 },
      },
    },
    images: [],
    availability: [
      /*
      {
        day: "Pon",
        startTime: "00:00",
        endTime: "09:00"
      },
    */
    ],
    categories: [],
  });

  const DAYS = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];

  const PRICE_LIMITS = {
    consultation: { min: 0, max: 10000 },
    hourly: { min: 0, max: 25000 },
    project: { min: 0, max: 100000 },
  };

  const CATEGORIES = [
    "Murarstwo",
    "Tynkowanie",
    "Glazurnictwo",
    "Dekarstwo",
    "Elektryka",
    "Hydraulika",
    "Stolarstwo",
    "Mechanika",
    "Lakiernictwo",
    "Wulkanizacja",
    "Informatyka",
    "Grafika",
    "Fotografia",
    "Księgowość",
    "Prawo",
    "Medycyna",
    "Fizjoterapia",
    "Kosmetologia",
    "Fryzjerstwo",
    "Dietetyka",
    "Gastronomia",
    "Ogrodnictwo",
  ];

  const toggleDay = (day) => {
    setFormData((prev) => {
      const existing = prev.availability.find((item) => item.day === day);

      if (existing) {
        setSavedHours((prevHours) => ({
          ...prevHours,
          [day]: {
            startTime: existing.startTime,
            endTime: existing.endTime,
          },
        }));

        return {
          ...prev,
          availability: prev.availability.filter((item) => item.day !== day),
        };
      }

      return {
        ...prev,
        availability: [
          ...prev.availability,
          {
            day,
            startTime: savedHours[day]?.startTime ?? "00:00",
            endTime: savedHours[day]?.endTime ?? "23:59",
          },
        ],
      };
    });
  };

  const updateHour = (day, value, type) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map((item) =>
        item.day === day
          ? {
              ...item,
              [type]: value,
            }
          : item,
      ),
    }));
  };

  const toggleCategory = (category) => {
    setFormData((prev) => {
      return {
        ...prev,
        categories: prev.categories.includes(category)
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category],
      };
    });
  };

  const togglePrice = (key) => {
    setFormData((prev) => ({
      ...prev,
      prices: {
        ...prev.prices,
        [key]: {
          ...prev.prices[key],
          enabled: !prev.prices[key].enabled,
        },
      },
    }));
  };

  const handleAddPhotos = (e) => {
    const chosenFiles = Array.from(e.target.files);

    const newPhotos = chosenFiles.map((file) => ({
      id: crypto.randomUUID(),
      file: file,
      url: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newPhotos],
    }));
  };

  const removePhoto = (idToRemove) => {
    setFormData((prev) => {
      return {
        ...prev,
        images: prev.images.filter((photo) => photo.id !== idToRemove),
      };
    });
  };

  const updatePrice = (key, field, value) => {
    const num = Number(value);

    setFormData((prev) => {
      const current = prev.prices[key];

      let min = current.value.min;
      let max = current.value.max;

      if (field === "min") min = num;
      if (field === "max") max = num;

      if (min > max) {
        if (field === "min") max = min;
        else min = max;
      }

      return {
        ...prev,
        prices: {
          ...prev.prices,
          [key]: {
            ...current,
            value: {
              min,
              max,
            },
          },
        },
      };
    });
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setProfileCreatedMessage("")

    console.log("FORM DATA", formData);

    const validationResult = validateForm();
    if (!validationResult.success) {
      setErrorMessage(validationResult.message);
      return;
    }

    const token = localStorage.getItem("token");

    const processedImages = await Promise.all(
      formData.images.map(async (img) => {
        if (img.file instanceof File) {
          const base64String = await convertToBase64(img.file);
          return {
            id: img.id,
            file: {},
            url: base64String,
          };
        }
        return img;
      }),
    );

    const res = await fetch("/api/profile/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
        images: processedImages,
      }),
    });

    if (!res.ok) {
      setErrorMessage("Internal server error");
      return;
    }

    const data = await res.json();
    console.log("Created profile:", data);
    setProfileCreatedMessage("Utworzono profil!");
  };

  const validateForm = () => {
    if (!formData.specialization.trim()) {
      return {
        success: false,
        message: "Specjalizacja jest wymagana.",
      };
    }

    if (!formData.description.trim()) {
      return {
        success: false,
        message: "Opis jest wymagany.",
      };
    }

    if (!formData.experience.trim()) {
      return {
        success: false,
        message: "Doświadczenie jest wymagane.",
      };
    }

    if (!formData.localization.trim()) {
      return {
        success: false,
        message: "Lokalizacja jest wymagana.",
      };
    }

    if (!formData.phoneNumber.trim()) {
      return {
        success: false,
        message: "Numer telefonu jest wymagany.",
      };
    }

    if (!formData.email.trim()) {
      return {
        success: false,
        message: "Adres e-mail jest wymagany.",
      };
    }

    const phoneRegex = /^(\+48)?[\s-]?(\d{3}[\s-]?\d{3}[\s-]?\d{3})$/;

    if (!phoneRegex.test(formData.phoneNumber)) {
      return {
        success: false,
        message: "Numer telefonu ma nieprawidłowy format.",
      };
    }

    const hasEnabledPrice = Object.values(formData.prices).some(
      (price) => price.enabled,
    );

    if (!hasEnabledPrice) {
      return {
        success: false,
        message: "Musisz wybrać przynajmniej jeden rodzaj wyceny.",
      };
    }

    if (formData.images.length < 1 || formData.images.length > 8) {
      return {
        success: false,
        message: "Liczba zdjęć musi być między 1 a 8.",
      };
    }

    if (!formData.availability.length) {
      return {
        success: false,
        message: "Musisz wybrać przynajmniej jeden dzień.",
      };
    }

    for (const item of formData.availability) {
      if (item.startTime >= item.endTime) {
        return {
          success: false,
          message:
            "Godzina rozpoczęcia musi być wcześniejsza niż godzina zakończenia.",
        };
      }
    }

    if (formData.categories.length < 1 || formData.categories.length > 5) {
      return {
        success: false,
        message: "Liczba kategorii musi być między 1 a 5.",
      };
    }

    return {
      success: true,
    };
  };

  useEffect(() => {
    localStorage.setItem("profileCreation", JSON.stringify(profileCreation));
  }, [profileCreation]);

  useEffect(() => {
    if (!loading && user && !isSpecialist) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, user, isSpecialist, navigate]);

  useEffect(() => {
    async function fetchUserData() {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/me/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        // TODO - probably should display some error or sth
        console.log("Failed to load user data");
        return;
      }

      const data = await res.json();
      setUserData(data);
    }

    fetchUserData();
  }, []);

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

          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Specjalizacja"
              value={formData.specialization}
              onChange={(e) =>
                setFormData({ ...formData, specialization: e.target.value })
              }
            />

            <TextArea
              placeholder="Opis działalności"
              className="p-3 rounded-xl bg-neutral-900 border border-neutral-700"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <div className="text-gray-600 flex flex-col gap-3">
              <p>Kategorie</p>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2 pb-3">
                {CATEGORIES.map((category) => {
                  const active = formData.categories.includes(category);

                  return (
                    <button
                      type="button"
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`
                        flex-1 px-4 py-2 rounded-xl border transition-all text-sm ${
                          active
                            ? "bg-brand text-neutral-100 border-brand"
                            : "bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-500"
                        }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <Input
              type="text"
              placeholder="Doświadczenie"
              value={formData.experience}
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value })
              }
            />

            <Input
              type="text"
              placeholder="Lokalizacja"
              value={formData.localization}
              onChange={(e) =>
                setFormData({ ...formData, localization: e.target.value })
              }
            />

            <Input
              type="number"
              placeholder="Numer telefonu"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
            />

            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <div className="flex flex-col gap-3">
              <p className="text-gray-600">Przedział cenowy</p>

              {[
                { key: "consultation", label: "Konsultacja" },
                { key: "hourly", label: "Stawka godzinowa" },
                { key: "project", label: "Projekt" },
              ].map(({ key, label }) => {
                const item = formData.prices[key];
                const disabled = !item.enabled;
                const limits = PRICE_LIMITS[key];

                return (
                  <div
                    key={key}
                    className={`p-4 rounded-xl border flex flex-col gap-3 transition ${
                      disabled
                        ? "bg-neutral-900 border-neutral-800 opacity-50"
                        : "bg-neutral-900 border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => togglePrice(key)}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          item.enabled
                            ? "bg-yellow-400 border-yellow-400"
                            : "border-neutral-500"
                        }`}
                      >
                        {item.enabled && (
                          <div className="w-2 h-2 bg-black rounded-full" />
                        )}
                      </button>

                      <span className="text-sm text-neutral-300">{label}</span>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2 items-center justify-center">
                        <p className="text-xs text-neutral-400">Min</p>

                        <input
                          type="range"
                          min={limits.min}
                          max={limits.max}
                          value={item.value.min}
                          disabled={!item.enabled}
                          onChange={(e) =>
                            updatePrice(key, "min", e.target.value)
                          }
                          className="w-full accent-yellow-400"
                        />

                        <input
                          type="number"
                          min={limits.min}
                          max={limits.max}
                          value={item.value.min}
                          disabled={disabled}
                          onChange={(e) =>
                            updatePrice(key, "min", e.target.value)
                          }
                          className="w-1/3 bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-sm text-neutral-200"
                        />
                      </div>

                      <div className="flex gap-2 items-center justify-center">
                        <p className="text-xs text-neutral-400">Max</p>

                        <input
                          type="range"
                          min={limits.min}
                          max={limits.max}
                          value={item.value.max}
                          disabled={!item.enabled}
                          onChange={(e) =>
                            updatePrice(key, "max", e.target.value)
                          }
                          className="w-full accent-yellow-400"
                        />

                        <input
                          type="number"
                          min={limits.min}
                          max={limits.max}
                          value={item.value.max}
                          disabled={disabled}
                          onChange={(e) =>
                            updatePrice(key, "max", e.target.value)
                          }
                          className="w-1/3 bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-sm text-neutral-200"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

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
                {formData.images.map((photo) => (
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

            <div className="flex flex-col gap-2">
              <p className="text-gray-600">Dostępność</p>

              {DAYS.map((day) => {
                const active = formData.availability.some(
                  (item) => item.day === day,
                );

                return (
                  <div className="flex gap-10 w-1/2" key={day}>
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`
                        flex-1 px-4 py-2 rounded-xl border transition-all text-sm min-w-15 max-w-15 ${
                          active
                            ? "bg-brand text-neutral-100 border-brand"
                            : "bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-500"
                        }`}
                    >
                      {day}
                    </button>

                    <div className="flex gap-3">
                      <Input
                        type="time"
                        className="w-full"
                        disabled={!active}
                        onChange={(e) =>
                          updateHour(day, e.target.value, "startTime")
                        }
                      />

                      <div className="flex items-center justify-center">-</div>

                      <Input
                        type="time"
                        className="w-full"
                        disabled={!active}
                        onChange={(e) => updateHour(day, e.target.value, "endTime")}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-6 pt-5">
              <Button
                className="flex-1"
                look="secondary"
                type="button"
                onClick={() => setIsProfilePreviewModalOpen(true)}
              >
                Podgląd
              </Button>
              <Button className="flex-1" type="submit">
                Zapisz profil
              </Button>
              <Button className="flex-1" look="secondary" type="button">
                Anuluj
              </Button>
            </div>
          </form>

          {errorMessage && (
            <p className="flex justify-center text-red-600 border-red-300 border-2 rounded-3xl p-2 bg-red-100">
              {errorMessage}
            </p>
          )}

          {profileCreatedMessage && (
            <p className="flex justify-center text-green-600 border-green-300 border-2 rounded-3xl p-2 bg-green-100">
              {profileCreatedMessage}
            </p>
          )}
        </div>
      )}

      {isProfilePreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          {/* overlay click to close */}
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
                profile: formData,
                user: userData,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
