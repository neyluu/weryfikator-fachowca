import { useAuth } from "../context/AuthContext";
import usePageTitle from "../util/pageTitle";
import { User, Mail, Shield, Clock } from "lucide-react";

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

function Account() {
  usePageTitle("Weryfikator Fachowca - Konto");

  const { user, loading } = useAuth();

  if (loading || !user) return null;

  return (
    <>
      <div className="flex items-center gap-4 p-6 bg-neutral-800/25 border border-neutral-800 rounded-3xl">
        <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-neutral-700 flex items-center justify-center">
          <User className="w-7 h-7 text-neutral-300" />
        </div>

        <div className="flex flex-col">
          <h1 className="text-xl font-medium text-neutral-100">{user.sub}</h1>
          <span className="text-xs text-neutral-400">{user.role}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-6 bg-neutral-800/25 border border-neutral-800 rounded-3xl">
        {Object.entries(user).map(([key, value]) => {
          const config = FIELD_CONFIG[key];
          if (!config) return null;

          const Icon = config.icon;
          const display = config.format ? config.format(value) : String(value);

          return (
            <div key={key} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-neutral-500 text-sm">
                <Icon className="w-4 h-4" />
                <span>{config.label}</span>
              </div>

              <span className="text-sm text-neutral-300">{display}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Account;
