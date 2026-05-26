import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import usePageTitle from "../util/pageTitle";
import Card from "../components/ui/Card";
import Section from "../components/ui/Section";
import Avatar from "../components/ui/Avatar";
import Stars from "../components/ui/Stars";
import { Search, CalendarCheck, FileText } from "lucide-react";

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
    <div className="flex flex-col gap-20">
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

      <div className="flex flex-row gap-3 mt-6 bg-brand p-6 rounded-2xl">
        <div className="flex flex-col gap-3 flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 stroke-2 stroke-neutral-100" />
            <h3 className="text-neutral-100 font-medium">Znajdź specjalistę</h3>
          </div>

          <p className="text-neutral-400 text-sm">
            Wybierz spośród tysięcy zweryfikowanych fachowców i sprawdź ich
            opinie przed podjęciem decyzji.
          </p>
        </div>

        <div className="flex flex-col gap-3 flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 stroke-2 stroke-neutral-100" />
            <h3 className="text-neutral-100 font-medium">Umów się online</h3>
          </div>

          <p className="text-neutral-400 text-sm">
            Wybierz dogodny termin i zarezerwuj wizytę bez telefonów i zbędnych
            formalności.
          </p>
        </div>

        <div className="flex flex-col gap-3 flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 stroke-2 stroke-neutral-100" />
            <h3 className="text-neutral-100 font-medium">Wygeneruj umowę</h3>
          </div>

          <p className="text-neutral-400 text-sm">
            System automatycznie przygotuje gotową umowę współpracy do
            podpisania online.
          </p>
        </div>
      </div>

      {/* NAJNOWSZE OPINIE */}
      <Section title="Najnowsze opinie">
        <div className="flex flex-col gap-3">
          <Card className="flex flex-col gap-5">
            <div className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar name="M" />
                <span className="text-neutral-200 font-medium">
                  Krzysztof Majewski
                </span>
              </div>

              <Stars value={5} interactive={false} />
            </div>

            <div className="flex flex-col">
              <p className="mt-2 text-neutral-400">
                Ekipa Pana Krzysztofa robiła u mnie remont łazienki. Wszystko
                wykonane bardzo starannie, bez opóźnień i bałaganu. Widać, że
                znają się na swojej pracy.
              </p>

              <p className="mt-2 text-neutral-500 text-xs">Michał Nowak</p>
            </div>
          </Card>

          <Card className="flex flex-col gap-5">
            <div className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar name="A" />
                <span className="text-neutral-200 font-medium">
                  Tomasz Zieliński
                </span>
              </div>

              <Stars value={3} interactive={false} />
            </div>

            <div className="flex flex-col">
              <p className="mt-2 text-neutral-400">
                Zleciłam konfigurację sieci i zabezpieczenie routera. Usługa
                wykonana poprawnie, ale komunikacja mogłaby być lepsza — czasami
                trudno było uzyskać szybkie odpowiedzi.
              </p>

              <p className="mt-2 text-neutral-500 text-xs">Anna Wiśniewska</p>
            </div>
          </Card>

          <Card className="flex flex-col gap-5">
            <div className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar name="K" />
                <span className="text-neutral-200 font-medium">
                  Paweł Krawczyk
                </span>
              </div>

              <Stars value={4} interactive={false} />
            </div>

            <div className="flex flex-col">
              <p className="mt-2 text-neutral-400">
                Korzystałam z pomocy przy sporządzeniu umowy najmu. Wszystko
                wyjaśnione jasno i konkretnie, dostałam też dodatkowe wskazówki
                na przyszłość.
              </p>

              <p className="mt-2 text-neutral-500 text-xs">
                Katarzyna Lewandowska
              </p>
            </div>
          </Card>
        </div>
      </Section>

      {/* NOWI FACHOWCY */}
      <Section title="Nowi fachowcy">
        <div className="flex flex-row gap-3 flex-wrap">
          <Card className="flex-1 min-w-[250px] flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Avatar name="JK" />
              <div className="flex flex-col">
                <span className="text-neutral-200 font-medium">
                  Jan Kowalski
                </span>
                <span className="text-neutral-500 text-xs">Elektryk</span>
              </div>
            </div>

            <p className="text-neutral-400 text-sm">
              Specjalizuję się w instalacjach elektrycznych w domach i
              mieszkaniach. 8 lat doświadczenia.
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">Warszawa</span>
              <span className="text-xs text-neutral-500">
                8 lat doświadczenia
              </span>
            </div>
          </Card>

          <Card className="flex-1 min-w-[250px] flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Avatar name="AM" />
              <div className="flex flex-col">
                <span className="text-neutral-200 font-medium">
                  Anna Malinowska
                </span>
                <span className="text-neutral-500 text-xs">
                  Projektantka wnętrz
                </span>
              </div>
            </div>

            <p className="text-neutral-400 text-sm">
              Tworzę funkcjonalne i estetyczne projekty mieszkań oraz lokali
              usługowych.
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">Kraków</span>
              <span className="text-xs text-neutral-500">
                5 lat doświadczenia
              </span>
            </div>
          </Card>

          <Card className="flex-1 min-w-[250px] flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Avatar name="PS" />
              <div className="flex flex-col">
                <span className="text-neutral-200 font-medium">
                  Piotr Szymański
                </span>
                <span className="text-neutral-500 text-xs">Hydraulik</span>
              </div>
            </div>

            <p className="text-neutral-400 text-sm">
              Szybkie naprawy i instalacje wodno-kanalizacyjne. Dostępność 24/7.
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">Łódź</span>
              <span className="text-xs text-neutral-500">
                12 lat doświadczenia
              </span>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}
