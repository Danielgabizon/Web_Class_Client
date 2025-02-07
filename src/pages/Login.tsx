import LoginForm from "../components/LoginForm";
import React from "react";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
