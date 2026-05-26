import { NavLink, Outlet } from "react-router-dom";
import Button from "../components/ui/Button";

export default function DashboardLayout() {
  return (
    <div className="flex py-5">
      {/* SIDEBAR */}
      <div className="border-r border-neutral-800/25 bg-neutral-900/40 pr-5 flex flex-col gap-5">
        <div className="flex flex-col gap-1 mt-4">
          <div className="text-xs text-neutral-500">Konto</div>

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
            to="/dashboard/activity"
            className={({ isActive }) =>
              `text-sm text-left px-2 py-1 rounded-lg ${
                isActive
                  ? "bg-neutral-800 text-neutral-200"
                  : "text-neutral-400 hover:bg-neutral-800"
              }`
            }
          >
            Aktywność
          </NavLink>
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
          <Outlet />
        </div>
      </div>
    </div>
  );
}
