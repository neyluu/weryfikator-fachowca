import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../util/pageTitle";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function Login() {
  usePageTitle("Weryfikator Fachowca - Logowanie");
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Wszystkie pola są wymagane");
      return;
    }
    if (form.password.length < 8) {
      setError("Hasło musi zawierać co najmniej 8 znaków");
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
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
        <h1 className="text-xl font-medium text-center">Logowanie</h1>
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
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Logowanie..." : "Zaloguj się"}
        </Button>
        {error && (
          <p className="text-sm text-center text-neutral-400 max-w-fit border-t border-t-neutral-800/75 pt-2">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;
