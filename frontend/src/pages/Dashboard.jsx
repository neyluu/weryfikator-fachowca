import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { AlertModal } from "../components/ui/AlertModal";

export default function Dashboard() {
  const { user, loading, saveToken } = useAuth();
  const [open, setOpen] = useState(false);

  const isSpecialist = user?.role === "SPECIALIST";

  const handleConfirm = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/me/role/specialist", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data);
      return;
    }

    saveToken(data.token);

    setOpen(false);
  };

  if (loading || !user) return null;

  return (
    <div className="flex py-5 w-full">
      {/* SIDEBAR */}
      <div className="border-r border-neutral-800/25 bg-neutral-900/40 pr-5 flex flex-col gap-5">
        <div className="flex flex-col gap-1 mt-4">
          <div className="text-xs text-neutral-500">Konto</div>

          {isSpecialist && (
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `text-sm text-left px-2 py-1 rounded-lg ${
                  isActive
                    ? "bg-neutral-800 text-neutral-200"
                    : "text-neutral-400 hover:bg-neutral-800"
                }`
              }
            >
              Profil publiczny
            </NavLink>
          )}

          <NavLink
            to="/dashboard/account"
            className={({ isActive }) =>
              `text-sm text-left px-2 py-1 rounded-lg ${
                isActive
                  ? "bg-neutral-800 text-neutral-200"
                  : "text-neutral-400 hover:bg-neutral-800"
              }`
            }
          >
            Dane użytkownika
          </NavLink>

          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `text-sm text-left px-2 py-1 rounded-lg ${
                isActive
                  ? "bg-neutral-800 text-neutral-200"
                  : "text-neutral-400 hover:bg-neutral-800"
              }`
            }
          >
            Ustawienia
          </NavLink>

          <NavLink
            to="/dashboard/chat"
            className={({ isActive }) =>
              `text-sm text-left px-2 py-1 rounded-lg ${
                isActive
                  ? "bg-neutral-800 text-neutral-200"
                  : "text-neutral-400 hover:bg-neutral-800"
              }`
            }
          >
            Wiadomości
          </NavLink>
        </div>

        <div className="flex flex-col mt-auto gap-2">
          {!isSpecialist && (
            <Button
              look="primary"
              className="w-full"
              onClick={() => setOpen(true)}
            >
              Zostań specjalistą
            </Button>
          )}

          <Button look="secondary" href="/dashboard/account" className="w-full">
            Konto
          </Button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-10 flex justify-center">
        <div className="w-full max-w-2xl flex flex-col gap-6">
          <Outlet />
        </div>
      </div>

      {/* ALERT */}
      <AlertModal
        open={open}
        title="Zmiana konta"
        description="Twoje konto zostanie zmienione na konto specjalisty. Czy chcesz kontynuować?"
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
