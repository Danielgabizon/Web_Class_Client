import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Spinner from "./Spinner";

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  console.log("LoginForm rendered");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData);
      console.log("Logged in successfully");
      navigate("/feed");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes dynamically
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-xl w-full">
      <h2 className="text-xl text-center font-semibold mb-4">Login</h2>

      {error && (
        <p className="text-red-500 text-center text-sm mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#F5F6F7] border border-gray-300 rounded-lg focus:ring-[#4267B2]"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#F5F6F7] border border-gray-300 rounded-lg focus:ring-[#4267B2]"
        />

        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <button
            type="submit"
            className="w-full bg-[#1877F2] text-white py-2 rounded-lg font-bold hover:bg-[#165DB6] transition"
          >
            Submit
          </button>
        )}
      </form>

      <hr className="border-gray-300 mt-8" />
      <p className="text-center mt-4 text-gray-600">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-[#1877F2] font-semibold hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
