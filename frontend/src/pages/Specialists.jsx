import Button from "../components/ui/Button";
import usePageTitle from "../util/pageTitle";
import Card from "../components/ui/Card";
import Section from "../components/ui/Section";
import Avatar from "../components/ui/Avatar";
import Stars from "../components/ui/Stars";
import { Briefcase, CalendarCheck, ShieldCheck } from "lucide-react";

export default function SpecialistsLanding() {
  usePageTitle("Weryfikator Fachowca - Dla fachowców");

  return (
    <div className="flex flex-col gap-20">
      {/* HERO */}
      <div className="flex flex-col items-start justify-center py-20 gap-2">
        <h1 className="text-3xl font-medium">
          Zdobywaj klientów jako sprawdzony specjalista
        </h1>
        <h2 className="text-lg font-medium text-neutral-500">
          Dołącz do platformy i rozwijaj swoją firmę
        </h2>

        <Button
          href="/auth/register?role=specialist"
          className="place-self-end"
        >
          Załóż profil specjalisty
        </Button>
      </div>

      {/* BENEFITY */}
      <div className="flex flex-row gap-3 flex-wrap bg-brand p-6 rounded-2xl">
        <div className="flex flex-col gap-3 flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 stroke-2 stroke-neutral-100" />
            <h3 className="text-neutral-100 font-medium">Nowi klienci</h3>
          </div>
          <p className="text-neutral-400 text-sm">
            Otrzymuj zapytania od osób szukających Twoich usług w Twojej
            okolicy.
          </p>
        </div>

        <div className="flex flex-col gap-3 flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 stroke-2 stroke-neutral-100" />
            <h3 className="text-neutral-100 font-medium">Rezerwacje online</h3>
          </div>
          <p className="text-neutral-400 text-sm">
            Klienci mogą umawiać terminy bez telefonów i wiadomości.
          </p>
        </div>

        <div className="flex flex-col gap-3 flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 stroke-2 stroke-neutral-100" />
            <h3 className="text-neutral-100 font-medium">Wiarygodność</h3>
          </div>
          <p className="text-neutral-400 text-sm">
            Buduj reputację dzięki opiniom i weryfikacji profilu.
          </p>
        </div>
      </div>

      {/* JAK TO DZIAŁA */}
      <Section title="Jak to działa">
        <div className="flex flex-col gap-6 relative pl-5.5">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-neutral-800" />

          <div className="relative flex flex-col gap-1">
            <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-brand flex items-center justify-center text-xs font-medium text-black">
              1
            </div>
            <h3 className="text-neutral-200 font-medium">Załóż profil</h3>
            <p className="text-neutral-400 text-sm">
              Dodaj opis usług, zdjęcia i lokalizację.
            </p>
          </div>

          <div className="relative flex flex-col gap-1">
            <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-brand flex items-center justify-center text-xs font-medium text-black">
              2
            </div>
            <h3 className="text-neutral-200 font-medium">Odbieraj zapytania</h3>
            <p className="text-neutral-400 text-sm">
              Klienci kontaktują się bezpośrednio przez platformę.
            </p>
          </div>

          <div className="relative flex flex-col gap-1">
            <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-brand flex items-center justify-center text-xs font-medium text-black">
              3
            </div>
            <h3 className="text-neutral-200 font-medium">Realizuj zlecenia</h3>
            <p className="text-neutral-400 text-sm">
              Umawiaj terminy i rozwijaj swoją bazę klientów.
            </p>
          </div>
        </div>
      </Section>

      {/* OPINIE FACHOWCÓW */}
      <Section title="Opinie specjalistów">
        <div className="flex flex-col gap-3">
          <Card className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar name="JK" />
                <span className="text-neutral-200 font-medium">
                  Jan Kowalski
                </span>
              </div>
              <Stars value={5} interactive={false} />
            </div>

            <p className="text-neutral-400 text-sm">
              Dzięki platformie mam stały dopływ klientów. Nie muszę już szukać
              zleceń samodzielnie.
            </p>
          </Card>

          <Card className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar name="AM" />
                <span className="text-neutral-200 font-medium">
                  Anna Malinowska
                </span>
              </div>
              <Stars value={4} interactive={false} />
            </div>

            <p className="text-neutral-400 text-sm">
              Klienci trafiają do mnie regularnie, a opinie pomagają budować
              zaufanie.
            </p>
          </Card>
        </div>
      </Section>

      {/* CTA KOŃCOWE (WYŚRODKOWANE) */}
      <div className="flex flex-col items-center justify-center text-center gap-2 py-10">
        <h2 className="text-xl font-medium">
          Zacznij zdobywać klientów już dziś
        </h2>
        <p className="text-neutral-500 text-sm max-w-md">
          Załóż profil i dołącz do zweryfikowanych specjalistów.
        </p>

        <Button href="/register" className="mt-4">
          Dołącz jako specjalista
        </Button>
      </div>
    </div>
  );
}
