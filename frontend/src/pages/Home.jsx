import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import usePageTitle from "../util/pageTitle";
import { Hammer, Monitor, Scale } from "lucide-react";

export const CITIES = [
  { value: "warszawa", label: "Warszawa" },
  { value: "lodz", label: "Łódź" },
  { value: "krakow", label: "Kraków" },
  { value: "wroclaw", label: "Wrocław" },
  { value: "poznan", label: "Poznań" },
  { value: "gdansk", label: "Gdańsk" },
  { value: "szczecin", label: "Szczecin" },
  { value: "bydgoszcz", label: "Bydgoszcz" },
  { value: "lublin", label: "Lublin" },
  { value: "katowice", label: "Katowice" },
];

const POPULAR_SERVICES = [
  { label: "Remont mieszkania", link: "/search?service=remont-mieszkan" },
  { label: "Tynkowanie ścian", link: "/search?service=tynkowanie-scian" },
  { label: "Układanie płytek", link: "/search?service=ukladanie-plytek" },
  {
    label: "Instalacja elektryczna",
    link: "/search?service=instalacja-elektryczna",
  },
  { label: "Malowanie ścian", link: "/search?service=malowanie-scian" },
  { label: "Naprawa komputera", link: "/search?service=naprawa-komputera" },
  { label: "Odzyskiwanie danych", link: "/search?service=odzyskiwanie-danych" },
  { label: "Konfiguracja sieci", link: "/search?service=konfiguracja-sieci" },
  { label: "Porada prawna", link: "/search?service=porada-prawna" },
  { label: "Rejestracja spółki", link: "/search?service=rejestracja-spolki" },
  { label: "Sporządzenie umowy", link: "/search?service=sporzadzenie-umowy" },
  {
    label: "Reprezentacja w sądzie",
    link: "/search?service=reprezentacja-w-sadzie",
  },
];

function sanitize(value) {
  return encodeURIComponent(value.trim().replace(/[<>"'`]/g, ""));
}

export default function Home() {
  usePageTitle("Weryfikator Fachowca");
  const [city, setCity] = useState("");
  const [service, setService] = useState("");

  const searchHref =
    city || service
      ? `/search?city=${sanitize(city)}&service=${sanitize(service)}`
      : "/search";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-start justify-center py-30 gap-2">
        <h1 className="text-3xl font-medium">
          Znajdź sprawdzonego specjalistę
        </h1>
        <h2 className="text-lg font-medium text-neutral-500">
          Szukaj wśród specjalistów z całej Polski
        </h2>
        <div className="flex flex-col gap-2 mt-4 bg-neutral-800/25 p-4 rounded-3xl">
          <div className="flex flex-row gap-2">
            <Input
              placeholder="Usługa"
              value={service}
              onChange={(e) => setService(e.target.value)}
            />
            <Select
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Miasto"
              options={CITIES}
            />
          </div>
          <Button href={searchHref}>Szukaj</Button>
        </div>
      </div>

      <div className="flex flex-row flex-wrap gap-2 bg-neutral-800/25 p-4 rounded-3xl">
        {POPULAR_SERVICES.map(({ label, link }) => (
          <a
            key={label}
            href={link}
            className="flex items-center gap-2 px-2 py-1 rounded-full border border-neutral-700 text-neutral-400 text-sm hover:border-neutral-500 hover:text-neutral-100 transition-all duration-150 ease-out"
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
