import Button from "../components/ui/Button";
import usePageTitle from "../util/pageTitle";
import { SearchX } from "lucide-react";

export default function NotFound() {
  usePageTitle("Weryfikator Fachowca - Nie znaleziono strony");

  return (
    <div className="flex flex-col items-center justify-center text-center gap-5 mt-10 w-full">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-800/40 border border-neutral-800">
        <SearchX className="w-8 h-8 stroke-neutral-300" />
      </div>

      <h1 className="text-3xl font-medium text-neutral-100">404</h1>

      <h2 className="text-lg font-medium text-neutral-400">
        Nie znaleziono strony
      </h2>

      <p className="text-sm text-neutral-500 max-w-md">
        Strona, której szukasz, nie istnieje lub została przeniesiona.
      </p>

      <div className="flex gap-2 mt-4">
        <Button href="/">Wróć na stronę główną</Button>

        <Button href="/search" look="secondary">
          Znajdź specjalistę
        </Button>
      </div>
    </div>
  );
}
