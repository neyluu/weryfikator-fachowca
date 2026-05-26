import usePageTitle from "../util/pageTitle";
import { Activity as ActivityIcon } from "lucide-react";

function Activity() {
  usePageTitle("Weryfikator Fachowca - Aktywność");

  return (
    <div className="p-6 bg-neutral-800/25 border border-neutral-800 rounded-3xl">
      <div className="flex items-center gap-2 text-neutral-500 text-sm mb-4">
        <ActivityIcon className="w-4 h-4" />
        <span>Aktywność użytkownika</span>
      </div>

      <ul className="text-sm text-neutral-300 space-y-2">
        <li>• Ostatnie logowanie: dzisiaj</li>
        <li>• Zmiana hasła: 7 dni temu</li>
        <li>• Dodanie profilu: 14 dni temu</li>
      </ul>
    </div>
  );
}

export default Activity;
