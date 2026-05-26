import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./ui/Button";

const Layout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  const specialRoutes = ["/dashboard", "/auth/login", "/auth/register"];

  const isFooterHidden = specialRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full flex flex-row items-center justify-center">
        <nav className="w-full max-w-5xl flex flex-row items-center justify-between px-4 py-2">
          <a
            href={`${location.pathname === "/dashboard" ? "/dashboard" : "/"}`}
          >
            <img
              src="/WeryfikatorFachowca_Logo.svg"
              alt="Weryfikator Fachowca"
              className="w-10 h-10"
              draggable="false"
            />
          </a>

          <div className="flex items-center gap-5">
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
          className={`w-full max-w-5xl flex px-4 ${isFooterHidden ? "items-center justify-center" : ""}`}
        >
          {children}
        </main>
      </div>

      {!isFooterHidden && (
        <div className="w-full flex flex-row justify-center">
          <footer className="w-full max-w-5xl flex items-center px-4">
            PK 2026
          </footer>
        </div>
      )}
    </div>
  );
};

export default Layout;
