import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ username, password, email, fname, lname });
      console.log("Registered successfully");
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-150">
      <h2 className="text-xl text-center font-semibold text-center mb-4">
        Register
      </h2>
      {error && (
        <p className="text-red-500 text-center text-sm mb-4">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 submitForm">
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
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 bg-[#F5F6F7] border border-gray-300 rounded-lg focus:ring-[#4267B2]"
        />
        <input
          type="text"
          placeholder="First Name"
          value={fname}
          onChange={(e) => setFname(e.target.value)}
          required
          className="w-full p-3 bg-[#F5F6F7] border border-gray-300 rounded-lg focus:ring-[#4267B2]"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lname}
          onChange={(e) => setLname(e.target.value)}
          required
          className="w-full p-3 bg-[#F5F6F7] border border-gray-300 rounded-lg focus:ring-[#4267B2]"
        />
        <button
          type="submit"
          className="w-full bg-[#1877F2] text-white py-2 rounded-lg font-bold hover:bg-[#165DB6] transition"
        >
          Submit
        </button>
      </form>

      <p className="text-center mt-4 text-gray-600 ">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-[#1877F2] font-semibold hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
