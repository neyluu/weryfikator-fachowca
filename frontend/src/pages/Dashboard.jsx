import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../util/pageTitle";
import Button from "../components/ui/Button";
import { User, Mail, Shield, Clock, Activity } from "lucide-react";

const FIELD_CONFIG = {
  sub: { label: "Email", icon: Mail },
  role: { label: "Rola", icon: Shield },
  iat: {
    label: "Zalogowano",
    icon: Clock,
    format: (v) => new Date(v * 1000).toLocaleString("pl-PL"),
  },
  exp: {
    label: "Wygasa",
    icon: Clock,
    format: (v) => new Date(v * 1000).toLocaleString("pl-PL"),
  },
};

export default function Dashboard() {
  usePageTitle("Weryfikator Fachowca - Konto");
  const { user, loading } = useAuth();

  const [activeTab, setActiveTab] = useState("account");

  if (loading || !user) return null;

  return (
    <div className="flex py-5">
      {/* SIDEBAR */}
      <div className="border-r border-neutral-800/25 bg-neutral-900/40 pr-5 flex flex-col gap-5">
        <div className="flex flex-col gap-1 mt-4">
          <div className="text-xs text-neutral-500">Konto</div>

          <button
            onClick={() => setActiveTab("account")}
            className={`text-sm text-left px-2 py-1 rounded-lg ${
              activeTab === "account"
                ? "bg-neutral-800 text-neutral-200"
                : "text-neutral-400 hover:bg-neutral-800"
            }`}
          >
            Dane użytkownika
          </button>

          <button
            onClick={() => setActiveTab("activity")}
            className={`text-sm text-left px-2 py-1 rounded-lg ${
              activeTab === "activity"
                ? "bg-neutral-800 text-neutral-200"
                : "text-neutral-400 hover:bg-neutral-800"
            }`}
          >
            Aktywność
          </button>
        </div>

        <div className="mt-auto">
          <Button look="secondary" href="/dashboard/account" className="w-full">
            Konto
          </Button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-10 flex justify-center">
        <div className="w-full max-w-2xl flex flex-col gap-6">
          {/* TAB: ACCOUNT */}
          {activeTab === "account" && (
            <>
              <div className="flex items-center gap-4 p-6 bg-neutral-800/25 border border-neutral-800 rounded-3xl">
                <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-neutral-700 flex items-center justify-center">
                  <User className="w-7 h-7 text-neutral-300" />
                </div>

                <div className="flex flex-col">
                  <h1 className="text-xl font-medium text-neutral-100">
                    {user.sub}
                  </h1>
                  <span className="text-xs text-neutral-400">{user.role}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 p-6 bg-neutral-800/25 border border-neutral-800 rounded-3xl">
                {Object.entries(user).map(([key, value]) => {
                  const config = FIELD_CONFIG[key];
                  if (!config) return null;

                  const Icon = config.icon;
                  const display = config.format
                    ? config.format(value)
                    : String(value);

                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-2 text-neutral-500 text-sm">
                        <Icon className="w-4 h-4" />
                        <span>{config.label}</span>
                      </div>

                      <span className="text-sm text-neutral-300">
                        {display}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* TAB: ACTIVITY */}
          {activeTab === "activity" && (
            <div className="p-6 bg-neutral-800/25 border border-neutral-800 rounded-3xl">
              <div className="flex items-center gap-2 text-neutral-500 text-sm mb-4">
                <Activity className="w-4 h-4" />
                <span>Aktywność użytkownika</span>
              </div>

              <ul className="text-sm text-neutral-300 space-y-2">
                <li>• Ostatnie logowanie: dzisiaj</li>
                <li>• Zmiana hasła: 7 dni temu</li>
                <li>• Dodanie profilu: 14 dni temu</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
