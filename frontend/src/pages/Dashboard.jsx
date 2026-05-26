import { useAuth } from "../context/AuthContext";
import usePageTitle from "../util/pageTitle";
import Button from "../components/ui/Button";
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

export default function Dashboard() {
  usePageTitle("Weryfikator Fachowca - Konto");
  const { user, logout, loading } = useAuth();

  console.log(user);

  if (loading || !user) return null;

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2 p-6 bg-neutral-800/25 rounded-3xl">
          <div className="w-16 h-16 rounded-full bg-brand/10 border border-neutral-700 flex items-center justify-center">
            <User className="w-8 h-8 text-neutral-700" />
          </div>
          <h1 className="text-xl font-medium">{user.sub}</h1>
          <span className="text-xs text-neutral-500 bg-neutral-800 px-3 py-1 rounded-full">
            {user.role}
          </span>
        </div>

        <div className="flex flex-col gap-2 p-4 bg-neutral-800/25 rounded-3xl">
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
                className="flex items-center justify-between gap-4 py-1"
              >
                <div className="flex items-center gap-2 text-neutral-500 text-sm">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{config.label}</span>
                </div>
                <span className="text-sm text-neutral-300">{display}</span>
              </div>
            );
          })}
        </div>

        <Button look="secondary" onClick={logout} className="w-full">
          Wyloguj się
        </Button>
      </div>
    </div>
  );
}
