import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import usePageTitle from "../util/pageTitle";

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
    <div className="flex flex-col">
      <div className="flex flex-col items-start justify-center py-20 gap-2">
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
    </div>
  );
}
