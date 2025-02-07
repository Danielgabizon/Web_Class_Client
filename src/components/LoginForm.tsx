import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
      console.log("Logged in successfully");
      navigate("/profile");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-150">
      <h2 className="text-xl text-center font-semibold text-center mb-4">
        Login
      </h2>
      {error && (
        <p className="text-red-500 text-center text-sm mb-4">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-3 bg-[#F5F6F7] border border-gray-300 rounded-lg focus:ring-[#4267B2]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 bg-[#F5F6F7] border border-gray-300 rounded-lg focus:ring-[#4267B2]"
        />
        <button
          type="submit"
          className="w-full bg-[#1877F2] text-white py-2 rounded-lg font-bold hover:bg-[#165DB6] transition"
        >
          Login
        </button>
        <p className="text-center text-gray-600">
          Dont have an account?{" "}
          <Link
            to="/register"
            className="text-[#1877F2] font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
