import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "../components/ui/ProfileCard";
import Section from "../components/ui/Section";
import Card from "../components/ui/Card";
import Avatar from "../components/ui/Avatar";
import Stars from "../components/ui/Stars";
import Button from "../components/ui/Button";
import TextArea from "../components/ui/TextArea";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../util/pageTitle";
import { Star } from "lucide-react";

const formatDate = (dateInput) => {
  if (!dateInput) return "";
  try {
    if (Array.isArray(dateInput)) {
      const [year, month, day] = dateInput;
      return new Date(year, month - 1, day).toLocaleDateString("pl-PL");
    }
    return new Date(dateInput).toLocaleDateString("pl-PL");
  } catch {
    return "";
  }
};

const MAX_IMAGES = 8;

export default function SpecialistProfile() {
  usePageTitle("Profil fachowca - Weryfikator Fachowca");
  const { id } = useParams();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scores, setScores] = useState({ quality: 0, price: 0, timeliness: 0 });
  const [hovers, setHovers] = useState({ quality: 0, price: 0, timeliness: 0 });
  const [newComment, setNewComment] = useState("");
  const [reviewImages, setReviewImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fetchRatings = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`/api/ratings/specialist/${id}`, {
        method: "GET",
        headers,
      });
      if (res.ok) {
        const data = await res.json();
        const ratingsArray = data.ratings || data || [];
        setRatings(Array.isArray(ratingsArray) ? ratingsArray : []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const token = localStorage.getItem("token");
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const profileRes = await fetch(`/api/profile/${id}`, {
          method: "GET",
          headers,
        });
        if (!profileRes.ok) {
          if (profileRes.status === 404)
            throw new Error("Nie znaleziono profilu fachowca.");
          throw new Error("Wystąpił błąd podczas pobierania profilu.");
        }
        const fetchedProfile = await profileRes.json();
        setProfileData(fetchedProfile);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfileData();
    fetchRatings();
  }, [id]);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!scores.quality || !scores.price || !scores.timeliness) {
      setSubmitError(
        "Musisz ocenić wszystkie trzy kategorie (Jakość, Cena, Terminowość).",
      );
      return;
    }
    if (reviewImages.length > MAX_IMAGES) {
      setSubmitError(
        `Możesz dodać maksymalnie ${MAX_IMAGES} zdjęć. Usuń ${reviewImages.length - MAX_IMAGES} ${reviewImages.length - MAX_IMAGES === 1 ? "zdjęcie" : reviewImages.length - MAX_IMAGES < 5 ? "zdjęcia" : "zdjęć"} przed publikacją.`,
      );
      return;
    }
    setSubmitting(true);
    setSubmitError("");

    try {
      const token = localStorage.getItem("token");
      const processedImages = await Promise.all(
        reviewImages.map(async (img) => {
          if (img.file instanceof File) {
            return await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(img.file);
              reader.onload = () => resolve(reader.result);
              reader.onerror = (err) => reject(err);
            });
          }
          return img.url;
        }),
      );

      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          specialistId: parseInt(id),
          quality: scores.quality,
          price: scores.price,
          timeliness: scores.timeliness,
          comment: newComment,
          images: processedImages,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Nie udało się dodać opinii. Spróbuj ponownie.",
        );
      }

      setScores({ quality: 0, price: 0, timeliness: 0 });
      setNewComment("");
      setReviewImages([]);
      await fetchRatings();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
    }));
    setReviewImages((prev) => [...prev, ...newImgs]);
  };

  const renderStarsInput = (key, label) => (
    <div className="flex items-center justify-between sm:justify-start sm:gap-8">
      <span className="text-sm text-neutral-400 w-24">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setScores((prev) => ({ ...prev, [key]: star }))}
            onMouseEnter={() => setHovers((prev) => ({ ...prev, [key]: star }))}
            onMouseLeave={() => setHovers((prev) => ({ ...prev, [key]: 0 }))}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`w-7 h-7 sm:w-8 sm:h-8 ${
                star <= (hovers[key] || scores[key])
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-neutral-700"
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-400">
        Ładowanie profilu...
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="flex items-center justify-center py-20 text-red-500 bg-red-500/10 rounded-2xl border border-red-500/20 p-6 mt-10">
        {error}
      </div>
    );
  }

  const imageCount = reviewImages.length;
  const isOverLimit = imageCount > MAX_IMAGES;

  return (
    <div className="w-full flex flex-col gap-10 py-10">
      <ProfileCard
        data={{
          profile: profileData.profile || profileData,
          user: profileData.user || profileData,
        }}
        contactButton={!user || String(user.userId) !== id}
        id={id}
      />
      <Section title="Opinie użytkowników">
        {ratings.length > 0 ? (
          <div className="flex flex-col gap-3">
            {ratings.map((ratingItem) => {
              const avgScore =
                ratingItem.quality && ratingItem.price && ratingItem.timeliness
                  ? Math.round(
                      (ratingItem.quality +
                        ratingItem.price +
                        ratingItem.timeliness) /
                        3,
                    )
                  : ratingItem.score || 0;
              return (
                <Card key={ratingItem.id} className="flex flex-col gap-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar
                        name={
                          ratingItem.authorName
                            ? ratingItem.authorName.charAt(0).toUpperCase()
                            : "U"
                        }
                      />
                      <span className="text-neutral-200 font-medium">
                        {ratingItem.authorName || `Użytkownik`}
                      </span>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1">
                      <Stars value={avgScore} interactive={false} />
                      {(ratingItem.quality ||
                        ratingItem.price ||
                        ratingItem.timeliness) && (
                        <div className="flex gap-3 text-[10px] text-neutral-500 font-medium mt-1">
                          {ratingItem.quality && (
                            <span>Jakość: {ratingItem.quality}</span>
                          )}
                          {ratingItem.price && (
                            <span>Cena: {ratingItem.price}</span>
                          )}
                          {ratingItem.timeliness && (
                            <span>Terminowość: {ratingItem.timeliness}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="text-neutral-400 leading-relaxed">
                      {ratingItem.comment || "Brak komentarza."}
                    </p>
                    {ratingItem.images && ratingItem.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {ratingItem.images.map((img, idx) => (
                          <img
                            key={img.id || idx}
                            src={typeof img === "string" ? img : img.url}
                            alt="Załącznik do opinii"
                            className="w-24 h-24 object-cover rounded-xl border border-neutral-700"
                          />
                        ))}
                      </div>
                    )}

                    <p className="text-neutral-500 text-xs">
                      {formatDate(ratingItem.createdAt)}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center border border-neutral-800 rounded-3xl bg-neutral-900/50">
            <p className="text-neutral-500">
              Ten fachowiec nie ma jeszcze żadnych opinii.
            </p>
          </div>
        )}
        {user && Number(user.userId) !== Number(id) ? (
          <Card className="mt-6 flex flex-col gap-4 border-dashed border-2 border-neutral-700/50 bg-neutral-900/20">
            <h3 className="text-lg font-medium text-neutral-100">
              Dodaj opinię
            </h3>
            <form onSubmit={handleRatingSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                {renderStarsInput("quality", "Jakość usługi")}
                {renderStarsInput("price", "Cena")}
                {renderStarsInput("timeliness", "Terminowość")}
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-neutral-400">Twój komentarz</span>
                <TextArea
                  placeholder="Opisz swoje wrażenia ze współpracy..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="p-3 min-h-[100px] rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-400">
                    Zdjęcia wykonanej pracy (opcjonalnie)
                  </span>
                  <span
                    className={`text-sm transition-colors ${
                      isOverLimit ? "text-red-500" : "text-neutral-500"
                    }`}
                  >
                    ({imageCount}/{MAX_IMAGES})
                  </span>
                </div>
                <label className="cursor-pointer border-2 border-dashed border-neutral-700 hover:border-neutral-400 transition rounded-xl p-4 flex flex-col items-center justify-center text-neutral-500 hover:text-neutral-300">
                  <span className="text-sm">Kliknij, aby wybrać pliki</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
                {isOverLimit && (
                  <p className="text-red-500 text-sm font-medium">
                    Możesz dodać maksymalnie {MAX_IMAGES} zdjęć. Usuń{" "}
                    {imageCount - MAX_IMAGES}{" "}
                    {imageCount - MAX_IMAGES === 1
                      ? "zdjęcie"
                      : imageCount - MAX_IMAGES < 5
                        ? "zdjęcia"
                        : "zdjęć"}
                    , aby kontynuować.
                  </p>
                )}
                {imageCount > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {reviewImages.map((img, idx) => (
                      <div
                        key={img.id}
                        className={`relative group aspect-square ${
                          idx >= MAX_IMAGES
                            ? "ring-2 ring-red-500 rounded-lg"
                            : ""
                        }`}
                      >
                        <img
                          src={img.url}
                          alt="Podgląd"
                          className="w-full h-full object-cover rounded-lg border border-neutral-800"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setReviewImages((prev) =>
                              prev.filter((i) => i.id !== img.id),
                            )
                          }
                          className="absolute top-1 right-1 bg-black/70 hover:bg-red-500 text-white text-xs w-5 h-5 rounded-md flex items-center justify-center transition"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {submitError && (
                <p className="text-red-500 text-sm font-medium">
                  {submitError}
                </p>
              )}
              <div className="flex justify-end mt-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Dodawanie..." : "Opublikuj opinię"}
                </Button>
              </div>
            </form>
          </Card>
        ) : user && Number(user.userId) === Number(id) ? (
          <div className="mt-6 p-6 text-center border border-neutral-800 rounded-3xl bg-neutral-900/50 flex flex-col items-center gap-3">
            <p className="text-neutral-400">Nie możesz wystawić oceny sobie.</p>
          </div>
        ) : (
          <div className="mt-6 p-6 text-center border border-neutral-800 rounded-3xl bg-neutral-900/50 flex flex-col items-center gap-3">
            <p className="text-neutral-400">
              Zaloguj się, aby podzielić się swoją opinią o tym fachowcu.
            </p>
            <Button href="/auth/login" look="secondary">
              Zaloguj się
            </Button>
          </div>
        )}
      </Section>
    </div>
  );
}
