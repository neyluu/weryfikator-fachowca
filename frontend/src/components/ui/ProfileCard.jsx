function ProfileCard({ data }) {
  console.log(data);

  return (
    <div className="border border-neutral-700 p-3 rounded-3xl flex flex-col gap-3">
      <div className="flex justify-between ">
        <img
          src="/icons/profileIcon.png"
          alt="Weryfikator Fachowca"
          className="w-20 h-20 border rounded-2xl p-1"
          draggable="false"
        />

        <div>
          <p>Jan Kowalski</p>
          <p>{data.specialization}</p>
        </div>

        <div>
          <p>Email: {data.email}</p>
          <p>Telefon: {data.phoneNumber}</p>
          <p>Lokalizacja: {data.localization}</p>
        </div>
      </div>

      <div>
        <p>Opis</p>
        <p>{data.description}</p>
      </div>

      <div>
        <p>Doświadczenie</p>
        <p>{data.experience}</p>
      </div>

      <div>
        <p>Kategorie</p>
        <div className="flex flex-wrap gap-3">
          <p>Kategoria 1</p>
          <p>Kategoria 2</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
