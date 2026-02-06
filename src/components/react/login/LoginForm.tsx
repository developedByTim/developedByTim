import { useState } from "react";
import Input from "../UI/Input";
import SubmitButton from "../UI/SubmitButton";
interface Props{
  onLogin: ()=>void
}
export default function AdminLoginForm({onLogin}:Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("https://localhost:7115/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
  if (onLogin) onLogin()
  // store JWT in cookie for 1 day
  // Cookies.set("adminToken", data.token, { expires: 1 });
    } else {
      const data = await res.json();
      setError(data.message || "Login failed");
    }
  };

  return (
    <div className="p-8 shadow-md rounded bg-white w-[320px]">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <Input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <Input
      password
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <SubmitButton onClick={handleSubmit}>Login</SubmitButton>
    </div>
  );
}
