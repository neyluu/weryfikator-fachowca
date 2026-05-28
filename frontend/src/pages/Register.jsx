import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../util/pageTitle";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { User, HardHat } from "lucide-react";

const ROLES = [
  {
    value: "USER",
    label: "Użytkownik",
    description: "Chcę znaleźć sprawdzonego specjalistę",
    icon: User,
  },
  {
    value: "SPECIALIST",
    label: "Specjalista",
    description: "Chcę budować reputację w oparciu o moje kompetencje",
    icon: HardHat,
  },
];

const fullNameRegex =
  /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]+([- ][A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]+)+$/;

function Register() {
  usePageTitle("Weryfikator Fachowca - Rejestracja");
  const { register } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = params.get("role");
    if (role === "specialist") {
      setForm((prev) => ({ ...prev, role: "SPECIALIST" }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.fullName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Wszystkie pola są wymagane");
      return;
    }
    if (form.fullName.trim().length < 3 || form.fullName.trim().length > 100) {
      setError("Imię i nazwisko musi mieć od 3 do 100 znaków");
      return;
    }
    if (!fullNameRegex.test(form.fullName.trim())) {
      setError("Podaj imię i nazwisko (tylko litery, spacje i myślniki)");
      return;
    }
    if (form.password.length < 8) {
      setError("Hasło musi zawierać co najmniej 8 znaków");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Hasła nie są zgodne");
      return;
    }

    setLoading(true);
    try {
      await register(form.fullName, form.email, form.password, form.role);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-4 flex flex-col gap-4 bg-neutral-800/25 rounded-3xl"
      >
        <h1 className="text-xl font-medium text-center">Rejestracja</h1>
        <Input
          type="text"
          name="fullName"
          placeholder="Imię i nazwisko"
          value={form.fullName}
          onChange={handleChange}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="password"
          placeholder="Hasło"
          value={form.password}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Potwierdź hasło"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        <div className="flex flex-row gap-2">
          {ROLES.map(({ value, label, description, icon: Icon }) => {
            const selected = form.role === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setForm({ ...form, role: value })}
                className={[
                  "flex-1 flex flex-col items-center gap-1 p-3 rounded-2xl border border-neutral-300 transition-all duration-150 ease-out cursor-pointer text-center",
                  selected
                    ? "bg-brand text-neutral-100"
                    : "bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-300",
                ].join(" ")}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium">{label}</span>
                <span className="text-xs leading-tight">{description}</span>
              </button>
            );
          })}
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Tworzenie konta..." : "Utwórz konto"}
        </Button>
        {error && (
          <p className="text-sm text-center text-neutral-400 border-t border-t-neutral-800/75 pt-2">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

export default Register;
