import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      setError("Server error");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-8 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="border border-black px-4 py-2 outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border border-black px-4 py-2 outline-none"
        />
        <button
          type="submit"
          className="bg-black text-white py-2 hover:opacity-90 transition"
        >
          Login
        </button>
        {error && (
          <p className="text-sm text-center border border-black p-2">{error}</p>
        )}
      </form>
    </div>
  );
}

export default Login;
