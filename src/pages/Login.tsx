import LoginForm from "../components/LoginForm";
import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
const LoginPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (user) {
    navigate("/");
  }
  console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
