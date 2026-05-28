import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./ui/Button";

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const specialRoutes = ["/dashboard", "/auth/login", "/auth/register"];

  const isFooterHidden =
    specialRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/dashboard");
  const isAuthRoute = location.pathname.startsWith("/auth");

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full flex flex-row items-center justify-center">
        <nav className="w-full max-w-5xl flex flex-row items-center justify-between px-4 py-2">
          <a
            href={`${location.pathname.startsWith("/dashboard") ? "/dashboard" : "/"}`}
            className="flex items-center gap-3"
          >
            <img
              src="/WeryfikatorFachowca_Logo.svg"
              alt="Weryfikator Fachowca"
              className="w-10 h-10"
              draggable="false"
            />
            <span className="text-neutral-100 font-medium">
              Weryfikator Fachowca
            </span>
          </a>

          <div className="flex items-center gap-5">
            {user && !location.pathname.startsWith("/dashboard") && (
              <a href="/dashboard">Dashboard</a>
            )}
            {user && (
              <Button look="secondary" onClick={logout}>
                Wyloguj się
              </Button>
            )}
            {!user && (
              <>
                <a href="/auth/register">Zarejestruj się za darmo</a>
                <a href="/auth/login">Zaloguj się</a>
                <Button href="/specialists">Dla fachowców</Button>
              </>
            )}
          </div>
        </nav>
      </div>

      <div className="flex-1 w-full flex flex-row justify-center">
        <main
          className={`w-full max-w-5xl flex px-4 ${isAuthRoute ? "items-center justify-center" : ""}`}
        >
          {children}
        </main>
      </div>

      {!isFooterHidden && (
        <div className="w-full flex flex-row justify-center mt-30 bg-brand">
          <footer className="w-full max-w-5xl px-4 py-10 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              {/* LOGO + OPIS */}
              <div className="flex flex-col gap-2 max-w-sm">
                <div className="flex items-center gap-2">
                  <img
                    src="/WeryfikatorFachowca_Logo.svg"
                    alt="Weryfikator Fachowca"
                    className="w-8 h-8"
                    draggable="false"
                  />
                  <span className="text-neutral-100 font-medium">
                    Weryfikator Fachowca
                  </span>
                </div>

                <p className="text-neutral-400 text-sm">
                  Znajdź sprawdzonych specjalistów w swojej okolicy i umawiaj
                  wizyty online bez zbędnych formalności.
                </p>
              </div>

              {/* KONTA */}
              <div className="flex flex-col gap-2 text-sm text-right">
                <span className="text-neutral-200 font-medium">Konto</span>
                <a
                  href="/auth/login"
                  className="text-neutral-400 hover:text-neutral-200 transition"
                >
                  Logowanie
                </a>
                <a
                  href="/auth/register"
                  className="text-neutral-400 hover:text-neutral-200 transition"
                >
                  Rejestracja
                </a>
              </div>

              {/* NAWIGACJA */}
              <div className="flex flex-col gap-2 text-sm text-right">
                <span className="text-neutral-200 font-medium">Platforma</span>
                <a
                  href="/"
                  className="text-neutral-400 hover:text-neutral-200 transition"
                >
                  Strona główna
                </a>
                <a
                  href="/search"
                  className="text-neutral-400 hover:text-neutral-200 transition"
                >
                  Szukaj fachowców
                </a>
                <a
                  href="/specialists"
                  className="text-neutral-400 hover:text-neutral-200 transition"
                >
                  Dla fachowców
                </a>
              </div>
            </div>

            {/* dolny pasek */}
            <div className="flex flex-col md:flex-row justify-between gap-2 border-t border-neutral-500/25 pt-6 text-xs text-neutral-400">
              <span>© {new Date().getFullYear()} Weryfikator Fachowca</span>
              <span>Wszystkie prawa zastrzeżone</span>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Layout;
