import { useState } from "react";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token);

      setMessage("Account created successfully!");
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
        <h1 className="text-2xl font-bold text-center">Register</h1>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="border border-black px-4 py-2 outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
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
          Register
        </button>

        {message && (
          <p className="text-sm text-center border border-black p-2">
            {message}
          </p>
        )}

        {error && (
          <p className="text-sm text-center border border-black p-2">{error}</p>
        )}
      </form>
    </div>
  );
}

export default Register;
