const MONTHS = [
  { value: 1, label: "Styczeń" },
  { value: 2, label: "Luty" },
  { value: 3, label: "Marzec" },
  { value: 4, label: "Kwiecień" },
  { value: 5, label: "Maj" },
  { value: 6, label: "Czerwiec" },
  { value: 7, label: "Lipiec" },
  { value: 8, label: "Sierpień" },
  { value: 9, label: "Wrzesień" },
  { value: 10, label: "Październik" },
  { value: 11, label: "Listopad" },
  { value: 12, label: "Grudzień" },
];

const EXPERIENCE_TYPES = [
  { value: "maly_projekt", label: "Mały projekt" },
  { value: "duzy_projekt", label: "Duży projekt" },
  { value: "zatrudnienie", label: "Zatrudnienie" },
  { value: "wolontariat", label: "Wolontariat" },
];

function monthLabel(monthNumber) {
  return MONTHS.find((month) => month.value === monthNumber)?.label ?? "";
}

function typeLabel(typeValue) {
  return (
    EXPERIENCE_TYPES.find((type) => type.value === typeValue)?.label ??
    typeValue
  );
}

function ProfileCard({ data }) {
  const profile = data.profile;
  const user = data.user;

  const weekdayOrder = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];
  profile.availability.sort(
    (firstDay, secondDay) =>
      weekdayOrder.indexOf(firstDay.day) - weekdayOrder.indexOf(secondDay.day),
  );

  const enabledPrices = Object.entries(profile.prices || {}).filter(
    ([, item]) => item.enabled,
  );

  const formatPriceLabel = {
    consultation: "Konsultacja",
    hourly: "Stawka godzinowa",
    project: "Projekt",
  };

  const experienceEntries = profile.experienceEntries ?? [];

  return (
    <div className="w-full border border-neutral-700 bg-neutral-900 rounded-3xl p-6 flex flex-col gap-3">
      <div className="flex flex-col justify-between gap-3">
        <div className="flex gap-4 justify-between">
          <div className="flex gap-4 items-start">
            <img
              src={
                profile.profilePicture
                  ? profile.profilePicture.url
                  : "/icons/profileIcon.svg"
              }
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
              <p>
                {profile.localization?.n ?? "Nie podano"}{" "}
                <span className="text-neutral-500">
                  {profile.localization?.p
                    ? `(${profile.localization?.p})`
                    : ""}
                </span>
              </p>
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

        <p className="text-neutral-300 leading-relaxed wrap-break-word">
          {profile.description || "Brak opisu"}
        </p>
      </div>

      {experienceEntries.length !== 0 ? (
        <div className="py-2 flex flex-col gap-3 border-t border-neutral-800">
          <h3 className="text-lg font-semibold">Doświadczenie</h3>
          <div className="flex flex-col gap-3">
            {experienceEntries.map((entry, index) => {
              const startLabel = `${monthLabel(entry.startMonth)} ${entry.startYear}`;
              const endLabel =
                entry.isCurrent || (!entry.endMonth && !entry.endYear)
                  ? "obecnie"
                  : `${monthLabel(entry.endMonth)} ${entry.endYear}`;

              return (
                <div
                  key={index}
                  className="flex flex-col gap-1 p-4 bg-neutral-800/25 border border-neutral-800 rounded-2xl"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-neutral-100">
                      {entry.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-brand border border-brand text-xs">
                      {typeLabel(entry.type)}
                    </span>
                  </div>

                  <span className="text-xs text-neutral-400">
                    {startLabel} – {endLabel}
                  </span>

                  {entry.description && (
                    <p className="text-sm text-neutral-300 mt-1 leading-relaxed">
                      {entry.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <></>
      )}

      <div className="py-2 flex flex-col gap-2 border-t border-neutral-800">
        <h3 className="text-lg font-semibold">Godziny pracy</h3>

        <div className="flex flex-col gap-2">
          {profile.availability?.map((item) => (
            <div className="flex flex-wrap gap-5 items-center" key={item.day}>
              <span className="px-3 py-1 rounded-xl bg-brand border border-brand min-w-15">
                {item.day}
              </span>

              {item.startTime.startsWith("00:00") &&
              item.endTime.startsWith("23:59") ? (
                <p className="text-neutral-300 text-lg"> Cały dzień </p>
              ) : (
                <p className="text-neutral-300 text-lg">
                  {item.startTime.length === 5
                    ? item.startTime
                    : item.startTime.substring(0, item.startTime.length - 3)}
                  -
                  {item.endTime.length === 5
                    ? item.endTime
                    : item.endTime.substring(0, item.endTime.length - 3)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="py-2 flex flex-col gap-2 border-t border-neutral-800">
        <h3 className="text-lg font-semibold">Cennik</h3>
        <div className="flex gap-3">
          {profile.paidTravel && (
            <p className="bg-brand px-3 py-2 rounded-2xl">
              Dojazd płatny dodatkowo
            </p>
          )}
          {profile.remoteConsultations && (
            <p className="bg-brand px-3 py-2 rounded-2xl">Konsultacje zdalne</p>
          )}
        </div>

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
                  {item.value.min} zł - {item.value.max} zł
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
