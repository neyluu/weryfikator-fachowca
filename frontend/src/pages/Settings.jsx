import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../util/pageTitle";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const fullNameRegex =
  /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]+([- ][A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]+)+$/;

function Settings() {
  usePageTitle("Weryfikator Fachowca - Ustawienia konta");
  const { user, updateAccount } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {};
    const anyFilled =
      form.fullName || form.email || form.newPassword || form.currentPassword;

    if (!anyFilled) {
      setError("Wypełnij co najmniej jedno pole");
      return;
    }

    if (form.fullName) {
      if (
        form.fullName.trim().length < 3 ||
        form.fullName.trim().length > 100
      ) {
        setError("Imię i nazwisko musi mieć od 3 do 100 znaków");
        return;
      }
      if (!fullNameRegex.test(form.fullName.trim())) {
        setError("Podaj imię i nazwisko (tylko litery, spacje i myślniki)");
        return;
      }
      payload.fullName = form.fullName.trim();
    }

    if (form.email) {
      payload.email = form.email;
    }

    if (form.newPassword) {
      if (form.newPassword.length < 8) {
        setError("Nowe hasło musi zawierać co najmniej 8 znaków");
        return;
      }
      if (form.newPassword !== form.confirmNewPassword) {
        setError("Nowe hasła nie są zgodne");
        return;
      }
      payload.newPassword = form.newPassword;
      payload.currentPassword = form.currentPassword;
    }

    setLoading(true);
    try {
      await updateAccount(payload);
      setSuccess("Dane zostały zaktualizowane");
      setForm({
        fullName: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 bg-neutral-800/25 border border-neutral-800 rounded-3xl w-full max-w-sm"
    >
      <h2 className="text-lg font-medium text-neutral-100">Ustawienia konta</h2>
      <Input
        type="text"
        name="fullName"
        placeholder="Nowe imię i nazwisko"
        value={form.fullName}
        onChange={handleChange}
      />
      <Input
        type="email"
        name="email"
        placeholder="Nowy email"
        value={form.email}
        onChange={handleChange}
      />
      <div className="w-full h-px bg-neutral-800" />
      <Input
        type="password"
        name="currentPassword"
        placeholder="Aktualne hasło"
        value={form.currentPassword}
        onChange={handleChange}
      />
      <Input
        type="password"
        name="newPassword"
        placeholder="Nowe hasło"
        value={form.newPassword}
        onChange={handleChange}
      />
      <Input
        type="password"
        name="confirmNewPassword"
        placeholder="Potwierdź nowe hasło"
        value={form.confirmNewPassword}
        onChange={handleChange}
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Zapisywanie..." : "Zapisz zmiany"}
      </Button>
      {error && (
        <p className="text-sm text-center text-neutral-400 border-t border-t-neutral-800/75 pt-2">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-center text-green-400 border-t border-t-neutral-800/75 pt-2">
          {success}
        </p>
      )}
    </form>
  );
}

export default Settings;
