import usePageTitle from "../util/pageTitle";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import LocationInput from "../components/ui/LocationInput";
import TextArea from "../components/ui/TextArea.jsx";
import ProfileCard from "../components/ui/ProfileCard.jsx";
import { useProfileForm } from "../features/profileCreator/Handlers.jsx";
import { convertToBase64 } from "../features/profileCreator/Utils.jsx";
import { validateForm } from "../features/profileCreator/Validation.jsx";
import {
  DAYS,
  PRICE_LIMITS,
  CATEGORIES,
  LIMITS,
} from "../features/profileCreator/Constants.jsx";
import { LabeledCheckbox } from "../components/ui/LabeledCheckbox.jsx";
import { ExperienceSection } from "../features/profileCreator/ExperienceSection.jsx";

function Profile() {
  usePageTitle("Weryfikator Fachowca - Profil fachowca");

  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const { user, loading } = useAuth();
  const isSpecialist = user?.role === "SPECIALIST";

  const [profileCreation, setProfileCreation] = useState(false);
  const [profileCreated, setProfileCreated] = useState(false);
  const [profileEditing, setProfileEditing] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [profileCreatedMessage, setProfileCreatedMessage] = useState("");
  const [errors, setErrors] = useState({
    consultation: "",
    hourly: "",
    project: "",
  });

  const [isProfilePreviewModalOpen, setIsProfilePreviewModalOpen] =
    useState(false);

  const {
    formData,
    setFormData,
    toggleDay,
    updateHour,
    toggleCategory,
    togglePrice,
    handleAddPhotos,
    handleAddProfilePicture,
    removePhoto,
    removeProfilePicture,
    updatePrice,
    updateExperienceEntries,
  } = useProfileForm();

  const handleSubmit = async (event, mode = "create") => {
    event.preventDefault();
    setErrorMessage("");

    const dataToSubmit = {
      ...formData,
      profilePicture: formData.profilePicture || null,
    };

    const validationResult = validateForm(dataToSubmit);
    if (!validationResult.success) {
      setErrorMessage(validationResult.message);
      return;
    }

    const token = localStorage.getItem("token");

    const processedImages = await Promise.all(
      dataToSubmit.images.map(async (img) => {
        if (img.file instanceof File) {
          const base64 = await convertToBase64(img.file);
          return { id: img.id, file: {}, url: base64 };
        }
        return img;
      }),
    );

    const res = await fetch(
      mode === "edit" ? "/api/profile/update" : "/api/profile/create",
      {
        method: mode === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...dataToSubmit,
          images: processedImages,
        }),
      },
    );

    if (!res.ok) {
      setErrorMessage("Internal server error");
      return;
    }

    setProfileCreation(false);
    setProfileEditing(false);
    setProfileCreated(true);
  };

  const validatePriceRange = (key) => {
    const { min, max } = formData.prices[key].value;

    const minNum = Number(min);
    const maxNum = Number(max);

    setErrors((previous) => ({
      ...previous,
      [key]:
        minNum > maxNum
          ? "Wartość minimalna nie może być większa od maksymalnej"
          : "",
    }));
  };

  useEffect(() => {
    if (!loading && user && !isSpecialist) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, user, isSpecialist, navigate]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/profile/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch profile");
          return;
        }

        const data = await res.json();
        setProfileCreated(true);
        setFormData(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }

    fetchProfile();
  }, []);

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
      {profileCreated && !profileEditing && (
        <div>
          <div className="flex-col flex gap-6 mb-6">
            <div className="p-6 bg-neutral-800/25 border border-neutral-800 rounded-3xl">
              Posiadasz już profil fachowca
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1"
                look={"secondary"}
                type="button"
                onClick={() => setIsProfilePreviewModalOpen(true)}
              >
                Podgląd
              </Button>
              <Button
                className="flex-1"
                type="button"
                onClick={() => {
                  setProfileEditing(true);
                }}
              >
                Edytuj
              </Button>
            </div>
          </div>
        </div>
      )}

      {!profileCreation && !profileCreated && (
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

      {(profileCreation || profileEditing) && (
        <div className="flex-col flex gap-6">
          <div className="p-6 bg-neutral-800/25 border border-neutral-800 rounded-3xl mb-5">
            {profileEditing
              ? "Edytuj dane poniżej aby edytować profil"
              : "Wpisz dane poniżej aby utworzyć profil"}
          </div>

          <form
            className="flex flex-col gap-3"
            onSubmit={(event) =>
              handleSubmit(event, profileEditing ? "edit" : "create")
            }
          >
            <div className="flex gap-3 text-gray-600">
              <p>Specjalizacja</p>
              <p
                className={`${
                  formData.specialization.length < LIMITS.specialization.min ||
                  formData.specialization.length > LIMITS.specialization.max
                    ? "text-red-500"
                    : ""
                }`}
              >
                ({formData.specialization.length}/{LIMITS.specialization.max})
              </p>
            </div>
            <Input
              type="text"
              placeholder=""
              value={formData.specialization}
              onChange={(event) =>
                setFormData({ ...formData, specialization: event.target.value })
              }
            />

            <div className="flex gap-3 text-gray-600">
              <p>Opis działalności</p>
              <p
                className={`${
                  formData.description.length < LIMITS.description.min ||
                  formData.description.length > LIMITS.description.max
                    ? "text-red-500"
                    : ""
                }`}
              >
                ({formData.description.length}/{LIMITS.description.max})
              </p>
            </div>
            <TextArea
              placeholder=""
              className="p-3 rounded-xl bg-neutral-900 border border-neutral-700"
              value={formData.description}
              onChange={(event) =>
                setFormData({ ...formData, description: event.target.value })
              }
            />

            <div className="text-gray-600 flex flex-col gap-3">
              <p>Zdjęcie profilowe</p>

              <div className="flex gap-3">
                <label
                  className="w-2/3 cursor-pointer border-2 border-dashed
                          border-neutral-700 hover:border-neutral-300 transition
                          rounded-xl p-6
                          flex flex-col items-center
                          justify-center text-neutral-700 hover:text-neutral-300"
                >
                  <span className="text-sm">Kliknij aby wybrać zdjęcie</span>
                  <span className="text-xs opacity-70 mt-1">PNG, JPG</span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAddProfilePicture}
                    className="hidden"
                  />
                </label>
                <div className="w-1/3">
                  <div className="relative w-full aspect-square rounded-md border border-neutral-800 overflow-hidden group">
                    {formData.profilePicture ? (
                      <>
                        <img
                          src={formData.profilePicture.url}
                          alt="profile picture"
                          className="w-full h-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={removeProfilePicture}
                          className="absolute top-2 right-2 bg-black/70 hover:bg-red-500 text-white w-6 h-6 rounded-md opacity-0 group-hover:opacity-100 transition"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <img
                        src="/icons/profileIcon.svg"
                        alt="default profile"
                        className="w-full h-full object-contain p-6 opacity-70"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-gray-600 flex flex-col gap-3">
              <p>Kategorie</p>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2">
                {CATEGORIES.map((category) => {
                  const active = formData.categories.includes(category);

                  return (
                    <button
                      type="button"
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`
                        flex-1 px-4 py-2 rounded-xl border transition-all text-sm ${active ? "bg-brand text-neutral-100 border-brand" : "bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-500"}`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
              <p className="mb-3">
                Jeśli brakuje Ci jakiejś kategorii, skontaktuj się z nami!
              </p>
            </div>

            <p className="text-gray-600">Lokalizacja</p>
            <LocationInput
              value={formData.localization}
              onChange={(city) =>
                setFormData({ ...formData, localization: city })
              }
            />

            <p className="text-gray-600">Numer telefonu</p>
            <Input
              type="number"
              placeholder=""
              value={formData.phoneNumber}
              onChange={(event) =>
                setFormData({ ...formData, phoneNumber: event.target.value })
              }
            />

            <p className="text-gray-600">Email</p>
            <Input
              type="email"
              placeholder=""
              value={formData.email}
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
            />

            <div className="flex flex-col gap-3">
              <p className="text-gray-600">Przedział cenowy</p>

              <LabeledCheckbox
                id="remote-consultations"
                label="Konsultacje zdalne"
                checked={formData.remoteConsultations}
                onChange={(checked) =>
                  setFormData({
                    ...formData,
                    remoteConsultations: checked,
                  })
                }
              />

              <LabeledCheckbox
                id="paid-travel"
                label="Dojazd płatny dodatkowo"
                checked={formData.paidTravel}
                onChange={(checked) =>
                  setFormData({
                    ...formData,
                    paidTravel: checked,
                  })
                }
              />

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
                    className={`p-4 rounded-xl border flex flex-col gap-3 transition ${disabled ? "bg-neutral-900 border-neutral-800 opacity-50" : "bg-neutral-900 border-neutral-700"}`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => togglePrice(key)}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${item.enabled ? "bg-yellow-400 border-yellow-400" : "border-neutral-500"}`}
                      >
                        {item.enabled && (
                          <div className="w-2 h-2 bg-black rounded-full" />
                        )}
                      </button>

                      <span className="text-sm text-neutral-300">{label}</span>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-3 items-center">
                          <p className="text-xs text-neutral-400">Min</p>

                          <input
                            type="number"
                            min={limits.min}
                            max={limits.max}
                            value={item.value.min}
                            disabled={disabled}
                            onChange={(event) =>
                              updatePrice(key, "min", event.target.value)
                            }
                            onBlur={() => validatePriceRange(key)}
                            className="w-1/3 bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-sm text-neutral-200"
                          />

                          <p className="text-xs text-neutral-400">Max</p>
                          <input
                            type="number"
                            min={limits.min}
                            max={limits.max}
                            value={item.value.max}
                            disabled={disabled}
                            onChange={(event) =>
                              updatePrice(key, "max", event.target.value)
                            }
                            onBlur={() => validatePriceRange(key)}
                            className="w-1/3 bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-sm text-neutral-200"
                          />
                        </div>

                        <p className="text-red-500">{errors[key]}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 py-2">
              <p className="text-gray-600">Doświadczenie</p>
              <ExperienceSection
                entries={formData.experienceEntries ?? []}
                onChange={updateExperienceEntries}
              />
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
                        flex-1 px-4 py-2 rounded-xl border transition-all text-sm min-w-15 max-w-15 ${active ? "bg-brand text-neutral-100 border-brand" : "bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-500"}`}
                    >
                      {day}
                    </button>

                    <div className="flex gap-3">
                      <Input
                        type="time"
                        className="w-full"
                        disabled={!active}
                        defaultValue={
                          formData.availability
                            .find((dayEntry) => dayEntry.day === day)
                            ?.startTime?.slice(0, 5) ?? "00:00"
                        }
                        onChange={(event) =>
                          updateHour(day, event.target.value, "startTime")
                        }
                      />

                      <div className="flex items-center justify-center">-</div>

                      <Input
                        type="time"
                        className="w-full"
                        disabled={!active}
                        defaultValue={
                          formData.availability
                            .find((dayEntry) => dayEntry.day === day)
                            ?.endTime?.slice(0, 5) ?? "23:59"
                        }
                        onChange={(event) =>
                          updateHour(day, event.target.value, "endTime")
                        }
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
              <Button
                className="flex-1"
                look="secondary"
                type="button"
                onClick={() => {
                  setProfileCreation(false);
                  setProfileEditing(false);
                }}
              >
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
