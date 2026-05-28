function ProfileCard({ data }) {
  const profile = data.profile;
  const user = data.user;

  console.log(profile, user);

  const weekdayOrder = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];
  profile.days.sort(
    (a, b) => weekdayOrder.indexOf(a) - weekdayOrder.indexOf(b),
  );

  const enabledPrices = Object.entries(profile.prices || {}).filter(
    ([, item]) => item.enabled,
  );

  const formatPriceLabel = {
    consultation: "Konsultacja",
    hourly: "Stawka godzinowa",
    project: "Projekt",
  };

  return (
    <div className="w-full border border-neutral-700 bg-neutral-900 rounded-3xl p-6 flex flex-col gap-3">
      <div className="flex flex-col justify-between gap-3">
        <div className="flex gap-4 justify-between">
          <div className="flex gap-4 items-start">
            <img
              src="/icons/profileIcon.svg"
              alt="Profil"
              className="w-32 h-32 border border-neutral-600 rounded-2xl bg-neutral-900 object-cover"
              draggable="false"
            />

            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-bold">{user.fullName}</h2>

              <p className="text-neutral-300 text-lg">
                {profile.specialization || "Brak specjalizacji"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <div className="flex gap-2">
              <span className="text-neutral-400">Email:</span>
              <p>{profile.email || user.email}</p>
            </div>

            <div className="flex gap-2">
              <span className="text-neutral-400">Telefon:</span>
              <p>{profile.phoneNumber || "Brak numeru"}</p>
            </div>

            <div className="flex gap-2">
              <span className="text-neutral-400">Lokalizacja:</span>
              <p>{profile.localization || "Nie podano"}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {profile.categories?.map((category, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-brand border border-brand text-sm"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      <div className="py-2 flex flex-col gap-2 border-t border-neutral-800">
        <h3 className="text-lg font-semibold">Opis</h3>

        <p className="text-neutral-300 leading-relaxed">
          {profile.description || "Brak opisu"}
        </p>
      </div>

      <div className="py-2 flex flex-col gap-2 border-t border-neutral-800">
        <h3 className="text-lg font-semibold">Doświadczenie</h3>

        <p className="text-neutral-300">
          {profile.experience || "Brak informacji"}
        </p>
      </div>

      <div className="py-2 flex flex-col gap-2 border-t border-neutral-800">
        <h3 className="text-lg font-semibold">Godziny pracy</h3>

        <div className="flex flex-wrap gap-2">
          {profile.days?.map((day, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-xl bg-brand border border-brand"
            >
              {day}
            </span>
          ))}
        </div>

        <p className="text-neutral-300 text-lg">
          {profile.hourStart} - {profile.hourEnd}
        </p>
      </div>

      <div className="py-2 flex flex-col gap-2 border-t border-neutral-800">
        <h3 className="text-lg font-semibold">Cennik</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {enabledPrices.length > 0 ? (
            enabledPrices.map(([key, item]) => (
              <div
                key={key}
                className="bg-brand border border-brand rounded-2xl p-4"
              >
                <p className="text-neutral-400 text-sm mb-1">
                  {formatPriceLabel[key]}
                </p>

                <p className="text-xl font-bold">
                  {item.min} zł - {item.max} zł
                </p>
              </div>
            ))
          ) : (
            <p className="text-neutral-400">Brak podanych cen</p>
          )}
        </div>
      </div>

      {profile.images?.length > 0 && (
        <div className="py-2 flex flex-col gap-2 border-t border-neutral-800">
          <h3 className="text-lg font-semibold">Galeria</h3>

          <div className="grid grid-cols-4 gap-4">
            {profile.images.map((image, index) => (
              <img
                key={image.id || index}
                src={image.url}
                alt={`Zdjęcie ${index + 1}`}
                className="w-full aspect-square object-cover rounded-2xl border border-neutral-700"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileCard;
